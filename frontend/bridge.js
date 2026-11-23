/* Streamlit component bridge: original UI, static data local, API Python-side. */
(()=>{'use strict';
 const nativeFetch=window.fetch.bind(window),queue=[];let active=null,ready=false,serial=0;
 const send=(type,data={})=>window.parent.postMessage({isStreamlitMessage:true,type,...data},'*');
 const flush=()=>{if(!ready||active||!queue.length)return;active=queue.shift();send('streamlit:setComponentValue',{value:active.request,dataType:'json'});};
 window.fetch=async(input,options={})=>{
  const url=new URL(typeof input==='string'?input:input.url,location.href),name=url.pathname.split('/').pop();
  if(!url.pathname.startsWith('/api/')){
   if(/^[a-z-]+\.json$/.test(name)){
    const response=await nativeFetch(new URL(name+'.bin',location.href),options);
    if(!response.ok)return response;
    return new Response(response.body.pipeThrough(new DecompressionStream('gzip')),{headers:{'Content-Type':'application/json; charset=utf-8'}});
   }
   return nativeFetch(input,options);
  }
  if(options.signal?.aborted)throw new DOMException('Aborted','AbortError');
  let body={};try{body=options.body?JSON.parse(options.body):{};}catch{return new Response(JSON.stringify({error:'请求格式无效'}),{status:400});}
  const headers=new Headers(options.headers||(input instanceof Request?input.headers:undefined));
  return new Promise((resolve,reject)=>{
   const item={request:{id:Date.now().toString(36)+'-'+(++serial),path:url.pathname,method:options.method||'GET',authorization:headers.get('Authorization')||'',body},resolve,reject};
   const abort=()=>{item.aborted=true;reject(new DOMException('Aborted','AbortError'));};
   options.signal?.addEventListener('abort',abort,{once:true});
   item.cleanup=()=>options.signal?.removeEventListener('abort',abort);
   queue.push(item);flush();
  });
 };
 window.addEventListener('message',event=>{
  if(event.source!==window.parent||event.data?.type!=='streamlit:render')return;
  const args=event.data.args||{};
  if(!ready){
   ready=true;
   let base=args.public_url||'';
   try{const u=new URL(document.referrer);if(/^https?:$/.test(u.protocol))base=u.origin+'/';}catch{}
   window.TONGPIN_PUBLIC_URL=base;
   if(/^[a-f0-9]{24}\.[a-f0-9]{64}$/.test(args.invite||'')&&sessionStorage.getItem('streamlit-invite-applied')!==args.invite){
    sessionStorage.setItem('streamlit-invite-applied',args.invite);
    sessionStorage.setItem('pending-invite','#invite='+args.invite);
    if(document.getElementById('joinText')){location.hash='#invite='+args.invite;location.reload();return;}
   }
  }
  if(active&&args.responses&&Object.hasOwn(args.responses,active.request.id)){
   const response=args.responses[active.request.id],current=active;active=null;current.cleanup();
   if(!current.aborted)current.resolve(new Response(JSON.stringify(response.body),{status:response.status,headers:{'Content-Type':'application/json'}}));
  }
  flush();
 });
 // Data assets are handled separately so initial Promise.all does not need reruns.
 window.addEventListener('DOMContentLoaded',()=>{
  const height=()=>send('streamlit:setFrameHeight',{height:Math.max(850,window.innerHeight)});
  height();window.addEventListener('resize',height);
 });
 send('streamlit:componentReady',{apiVersion:1});
})();
