(()=>{'use strict';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const regionNames={cn:'大陆',hk:'香港',mo:'澳门',tw:'台湾地区'};
const sourced=r=>(r?.warnings||[]).filter(w=>w.signal&&/^https:\/\//.test(w.source||''));
const eligible=storms=>Object.keys(storms).filter(key=>Object.values(storms[key].regions).some(r=>sourced(r).length));
const date=s=>{if(!s)return '原始资料未列完整时刻';const d=new Date(s);return isNaN(d)?s:new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',dateStyle:'medium',timeStyle:'short',hour12:false}).format(d);};
function contextHTML(c){
 if(!c)return '';
 const warnings=(c.warnings||[]).filter(w=>w.signal&&/^https:\/\//.test(w.source||''));
 return '<div class="archive-evidence"><h4>已核验的当地资料</h4><p>'+esc(c.internationalName)+' / '+esc(c.year)+' · '+esc(c.region)+'采用名称：<b>'+esc(c.name)+'</b></p>'+(warnings.length?'<ul>'+warnings.map(w=>'<li>'+esc(w.signal)+' · '+esc(w.start?date(w.start)+' 至 '+date(w.end):date(w.time)+' '+(w.action||''))+' <a target="_blank" rel="noopener" href="'+esc(w.source)+'">原始记录</a></li>').join('')+'</ul>':'<p class="region-fact-scope">当前可核验内容为当地名称及档案入口；具体预警时段需以原始公报确认。</p>')+(c.nameSource?'<a href="'+esc(c.nameSource)+'" target="_blank" rel="noopener">名称依据</a>':'')+(c.source?' · <a href="'+esc(c.source)+'" target="_blank" rel="noopener">官方档案入口</a>':'')+'</div>';
}
function renderResult(value){
 const c=value.archiveContext, citations=(value.citations||[]).filter(x=>/^https:\/\//.test(x.url||''));
 const limited=!citations.length||/未查到|未找到|没有查到|尚未检索到|无法查证/.test(value.answer||'');
 let html=contextHTML(c);
 if(value.error)return html+'<div class="archive-lookup-note">'+esc(value.error)+'。本页已核验资料仍可阅读，也可通过官方入口继续核对。</div>';
 const report='<div class="archive-answer">'+esc(value.answer||'本次联网未返回完整说明，以上方官方资料为准。')+'</div>';
 html+='<p class="note">联网整理 · '+(value.cached?'最近检索缓存':'本次检索')+' · '+esc(value.checkedAt||'')+'。补充内容需结合原文核对。</p>';
 html+=limited?'<p class="archive-lookup-note">已整理可核验资料和原文入口；尚待确认的发布时刻不作推定。</p><details class="archive-report"><summary>展开本次检索说明</summary>'+report+'</details>':report;
 if(citations.length)html+='<details class="archive-source-list" open><summary>检索引用来源</summary>'+citations.map(x=>'<p><a target="_blank" rel="noopener" href="'+esc(x.url)+'">'+esc(x.title||x.url)+'</a></p>').join('')+'</details>';
 return html;
}
window.TongpinArchive={sourced,eligible,renderResult};
const journeys=[['home','culture','山海相望 · 从这里开始','从一个节日，走近彼此。','在共同的节日里，发现各自珍藏的生活记忆。','开启文化回声'],['culture','words','文化回声 · 下一站','说法不同，也能相互理解。','带着节日里的相通，认识同一事物在四地的不同表达。','下一站：同物异名'],['words','storm','同物异名 · 下一站','让理解，成为风雨中的关心。','看同一场台风经过不同地方，读懂远方家人的预警消息。','下一站：同一场风'],['storm','home','风雨共济 · 旅程相续','把这份理解，带回日常。','回到首页，重新选择一段文化、语言与关怀的旅程。','返回首页']];
for(const [id,next,kicker,title,text,label] of journeys){
 const section=$(id);if(!section)continue;
 const nav=document.createElement('nav');nav.className='journey-nav';nav.setAttribute('aria-label',label);nav.innerHTML='<div><small>'+kicker+'</small><h2>'+title+'</h2><p>'+text+'</p></div><button class="primary" data-next-page="'+next+'">'+label+'</button>';
 nav.querySelector('button').onclick=()=>{document.querySelector('[data-page="'+next+'"]').click();const heading=$(next).querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}};
 section.append(nav);
}
async function init(){
 while(!$('catalogDetails'))await new Promise(r=>setTimeout(r,100));
 const catalog=await fetch('storm-catalog.json').then(r=>r.json()),storms=catalog.storms,picker=$('stormSelect'),keys=new Set(eligible(storms));
 const current=picker.value,groups=[document.createElement('optgroup'),document.createElement('optgroup')];let full=0;
 const options=[...picker.options].filter(o=>keys.has(o.value));
 for(const option of options){const complete=Object.values(storms[option.value].regions).every(r=>sourced(r).length);groups[complete?0:1].append(option);if(complete)full++;}
 groups[0].label='四地均有预警档案 · '+full+'场';groups[1].label='部分地区有预警档案 · '+(keys.size-full)+'场';picker.replaceChildren(...groups.filter(g=>g.children.length));picker.value=keys.has(current)?current:'KOINU';
 const note=document.createElement('p');note.className='case-library-note';note.id='caseLibraryNote';note.innerHTML='<b>'+keys.size+' 场有据可查的台风案例</b> · '+full+' 场四地均有预警档案。仅展示至少一个地区具有预警原始出处的案例；切换台风后优先打开有档案的地区。';picker.closest('.storm-grid')?.before(note);
 if(!note.isConnected)document.querySelector('.storm-grid')?.before(note);
 if(!note.isConnected)$('storm').querySelector('.storm-heading')?.after(note);
 if(!note.isConnected)picker.parentElement.before(note);
 document.querySelector('[data-enter="storm"] p').textContent='读懂各地预警，把关心送给远方的家人。';
 const code=()=>{const r=document.querySelector('[data-region].selected')?.dataset.region||'hk';return r==='gd'?'cn':r;};
 function update(){
  const c=storms[picker.value];if(!c)return;
  document.querySelectorAll('[data-region]').forEach(b=>{const region=b.dataset.region==='gd'?'cn':b.dataset.region;const count=sourced(c.regions[region]).length;b.dataset.hasRecords=count?'yes':'no';b.title=count?regionNames[region]+'：'+count+'条有来源的预警记录':regionNames[region]+'：查看当地名称、收录情况与官方档案入口';});
  const r=c.regions[code()],details=$('catalogDetails');
  if(sourced(r).length||details.querySelector('.region-reference'))return;
  const bounded=r.warningStatus?.startsWith('not_listed');
  const others=Object.keys(regionNames).filter(k=>sourced(c.regions[k]).length);
  details.innerHTML='<section class="region-reference"><h3>'+regionNames[code()]+' · 名称与官方档案</h3><dl><dt>当地采用名称</dt><dd><b>'+esc(r.name||c.internationalName)+'</b> · '+esc(c.internationalName)+' / '+c.year+'</dd><dt>'+ (bounded?'官方目录收录情况':'可核验资料')+'</dt><dd>'+esc(bounded?r.warningSummary:'当地名称具有来源；具体预警发布与解除时段仍需核验。')+'</dd><dt>核对范围</dt><dd>'+esc(r.searchScope)+'</dd></dl>'+(r.nameSource?'<p><a href="'+esc(r.nameSource)+'" target="_blank" rel="noopener">查看名称依据</a></p>':'')+(r.source?'<p><a href="'+esc(r.source)+'" target="_blank" rel="noopener">查看官方目录</a></p>':'')+'<p class="region-fact-scope">目录未列出不等于所有机构均未发布。已知来源与联网补充分别呈现。</p><div class="archive-actions">'+others.map(k=>'<button class="secondary" data-show-archive="'+k+'">阅读'+regionNames[k]+'预警档案</button>').join('')+'</div></section>';
 }
 function openSourcedRegion(){const c=storms[picker.value];if(c&&!sourced(c.regions[code()]).length){const preferred=['hk','tw','cn','mo'].find(k=>sourced(c.regions[k]).length);document.querySelector('[data-region="'+(preferred==='cn'?'gd':preferred)+'"]')?.click();}update();}
 picker.addEventListener('change',()=>setTimeout(openSourcedRegion,60));
 document.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>setTimeout(update,35)));
 $('catalogDetails').addEventListener('click',e=>{const button=e.target.closest('[data-show-archive]');if(button)document.querySelector('[data-region="'+(button.dataset.showArchive==='cn'?'gd':button.dataset.showArchive)+'"]')?.click();});
 new MutationObserver(update).observe($('catalogDetails'),{childList:true});
 picker.dispatchEvent(new Event('change'));
}
init().catch(console.error);
})();
