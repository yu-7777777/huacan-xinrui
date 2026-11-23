from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import io
import json
from backend import Backend

class BackendTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.api=Backend(Path(__file__).parent/'frontend',Path(self.temp.name)/'test.sqlite')
    def tearDown(self):
        self.temp.cleanup()
    def call(self,path,method='GET',body=None,token=''):
        return self.api.handle({'path':path,'method':method,'body':body or {},'authorization':'Bearer '+token})
    def test_two_people_and_conflict(self):
        x=self.call('/api/cards','POST',{'festival':'mid'})
        self.assertEqual(x['status'],201)
        c=x['body'];path='/api/cards/'+c['id']
        self.assertEqual(self.call(path,token=c['token'])['body']['role'],'a')
        self.assertEqual(self.call(path,token=c['invite'])['body']['role'],'b')
        self.assertEqual(self.call(path,token='a'*64)['status'],403)
        a=self.call(path,'PATCH',{'voice':'月圆人团圆','title':'同一轮月','approved':True,'revision':0},c['token'])
        self.assertTrue(a['body']['approvedA'])
        self.assertEqual(self.call(path,'PATCH',{'revision':0},c['invite'])['status'],409)
        b=self.call(path,'PATCH',{'voice':'与家人相聚','title':'万里同心','approved':True,'revision':1},c['invite'])
        self.assertEqual(b['body']['voiceA'],'月圆人团圆')
        self.assertTrue(b['body']['approvedB'])
        self.assertEqual(self.call(path,'PATCH',{'voice':'字'*221,'revision':2},c['token'])['status'],400)
    def test_ai_without_key_and_generic(self):
        self.assertEqual(self.call('/api/chat','POST',{'question':'天空为什么蓝'})['status'],503)
        response={'choices':[{'message':{'content':'因为短波长光散射较强。'}}]}
        with patch('backend.urlopen',return_value=io.BytesIO(json.dumps(response).encode())) as mock:
            result=self.api.handle({'path':'/api/chat','method':'POST','body':{'question':'天空为什么蓝'}},'test-only')
            self.assertIn('散射',result['body']['answer'])
            payload=json.loads(mock.call_args.args[0].data)
            self.assertIn('平台之外',payload['messages'][0]['content'])
    def test_archive_cache_and_identity(self):
        storms=self.api.load('storm-catalog.json')['storms'];storm=next(iter(storms))
        query={'mode':'archive','stormKey':storm,'regionCode':'hk','question':'查询官方预警'}
        response={'choices':[{'message':{'content':'官方资料检索结果','annotations':[{'url_citation':{'url':'https://www.hko.gov.hk/','title':'香港天文台'}}]}}]}
        with patch('backend.urlopen',return_value=io.BytesIO(json.dumps(response).encode())) as mock:
            first=self.api.chat(query,'test-only','test-model')
            self.assertEqual(first['status'],200)
            self.assertIn('tools',json.loads(mock.call_args.args[0].data))
        with patch('backend.urlopen',side_effect=AssertionError('cache must skip fetch')):
            self.assertTrue(self.api.chat(query,'test-only','test-model')['body']['cached'])
        query['stormKey']='not-a-storm'
        self.assertEqual(self.api.chat(query,'test-only','test-model')['status'],400)
    def test_all_data_preserved(self):
        self.assertEqual(len(self.api.load('festivals.json')),9)
        self.assertEqual(len(self.api.load('storm-catalog.json')['storms']),116)

    def test_archive_returns_known_sources_when_search_adds_nothing(self):
        body={'mode':'archive','stormKey':'KOINU','regionCode':'hk','question':'核对小犬九号信号'}
        response={'choices':[{'message':{'content':'未查到额外资料。'}}]}
        with patch('backend.urlopen',return_value=io.BytesIO(json.dumps(response).encode())) as mock:
            result=self.api.handle({'path':'/api/chat','method':'POST','body':body},'test-only')
            context=result['body']['archiveContext']
            self.assertEqual(context['name'],'小犬')
            self.assertTrue(context['warnings'])
            self.assertTrue(all(w['source'].startswith('https://www.hko.gov.hk/') for w in context['warnings']))
            self.assertIn('table43.html',json.loads(mock.call_args.args[0].data)['messages'][0]['content'])
        without_key=self.api.handle({'path':'/api/chat','method':'POST','body':body})
        self.assertEqual(without_key['status'],503)
        self.assertTrue(without_key['body']['archiveContext']['warnings'])

if __name__=='__main__':
    unittest.main()
