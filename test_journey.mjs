import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
const sections=Object.fromEntries(['home','culture','words','storm'].map(k=>[k,{nodes:[],append(n){this.nodes.push(n)},querySelector(){return {focus(){},tabIndex:0}}}]));
let destination='';
const document={getElementById:id=>sections[id]||null,createElement:()=>({setAttribute(){},querySelector(){return this.button||(this.button={})}}),querySelector:s=>({click(){destination=s.match(/data-page="([^"]+)"/)[1]}})};
const context={window:{},document,console,setTimeout(){},Date,Intl};
vm.runInNewContext(fs.readFileSync(new URL('./frontend/journey.js',import.meta.url),'utf8'),context);
for(const section of Object.values(sections))assert.equal(section.nodes.length,1);
for(const [from,to] of [['home','culture'],['culture','words'],['words','storm'],['storm','home']]){
 sections[from].nodes[0].button.onclick();assert.equal(destination,to);
}
const api=context.window.TongpinArchive;
const catalog=JSON.parse(gunzipSync(fs.readFileSync(new URL('./frontend/storm-catalog.json.bin',import.meta.url))));
const keys=api.eligible(catalog.storms);assert.equal(keys.length,54);
assert.equal(keys.filter(k=>Object.values(catalog.storms[k].regions).every(r=>api.sourced(r).length)).length,5);
const local=catalog.storms.KOINU.regions.hk;
const html=api.renderResult({answer:'未查到额外资料。<script>bad</script>',archiveContext:{internationalName:'KOINU',year:2023,region:'香港',name:local.name,source:local.source,warnings:local.warnings}});
assert.ok(html.includes('九号')||html.includes('9号'));
assert.ok(html.includes('table43.html'));
assert.ok(html.includes('<details class="archive-report">'));
assert.ok(!html.includes('<script>'));
assert.equal(api.sourced({warnings:[{signal:'test',source:''}]}).length,0);
console.log('PASS: four-page navigation, 54 sourced cases, 5 complete cases, factual fallback and escaping');
