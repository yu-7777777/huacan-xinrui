(()=>{'use strict';
const $=id=>document.getElementById(id),E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const festivals={'春节':'spring','元宵':'lantern','清明':'qingming','端午':'dragon','七夕':'qixi','中元':'ghost','中秋':'mid','重阳':'double','冬至':'winter'};
const illustration=document.querySelector('.festival-illustration');
const image=document.createElement('img');image.className='festival-complete-image';image.width=1536;image.height=1024;image.decoding='async';illustration.querySelectorAll('span,small').forEach(n=>n.hidden=true);illustration.append(image);illustration.removeAttribute('aria-hidden');
function updateFestival(){const selected=window.TongpinFestivals?.current();const name=selected?.name||$('festName').textContent,key=selected?.id||festivals[name]||'mid';const src=document.body.dataset.customFestival==='true'?'assets/book-reference.webp':'assets/festival-'+key+'.webp';if(image.getAttribute('src')!==src)image.src=src;image.alt=name+'主题插画 · 完整层叠宣纸画框';document.querySelector('#culture>.page-heading').style.setProperty('--festival-image','url("'+src+'")');}
new MutationObserver(updateFestival).observe($('festName'),{childList:true,subtree:true});updateFestival();
function corners(el){if(el.querySelector(':scope>.frame-corner'))return;el.classList.add('ornate-frame');for(const c of ['tl','tr','bl','br']){const n=document.createElement('span');n.className='frame-corner '+c;n.setAttribute('aria-hidden','true');el.append(n);}}
const home=document.querySelector('[data-enter="words"]');home.classList.add('jade-word-entry');home.innerHTML='<div class="chapter-heading"><small>02</small><h2>同物异名</h2></div><p class="entry-context">出行 · 词语示例</p><div class="entry-word-pair"><span>自行车</span><i></i><span>腳踏車</span></div><p class="entry-note">同一事物，各有表达。</p><span class="chapter-action">寻一个词 <i aria-hidden="true">→</i></span>';home.querySelectorAll('.entry-word-pair>span').forEach(corners);
const regionLabels=['大陆','香港','澳门','台湾地区'],codes=['cn','hk','mo','tw'];let dictionary=[],filter='全部',expanded=false,serial=0;
const exhibitArt = {
 '自行车':'words-bicycle-exhibit.webp','出租车':'words-taxi.jpg',
 '鼠标':'words-mouse.jpg','打印机':'words-printer.jpg'
};
let exhibitPicker;

function createExhibitPicker() {
 const picker = document.createElement('div');
 picker.className = 'exhibit-picker';
 picker.setAttribute('role','group');
 picker.setAttribute('aria-label','四地词签示例');
 for (const label of Object.keys(exhibitArt)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-pressed','false');
  button.addEventListener('click', () => {
   const entry = find(label);
   if (!entry) return;
   ++serial;
   $('wordSubmit').disabled = false;
   $('wordAnswer').hidden = true;
   $('wordQuery').value = label;
   const result = sample(entry);
   renderResult(result.query,result.terms,result.note);
   button.focus({preventScroll:true});
  });
  picker.append(button);
 }
 return picker;
}

function showExhibit(result, query) {
 const art = exhibitArt[find(query)?.left];
 for (const button of exhibitPicker.children) {
  button.setAttribute('aria-pressed',String(art === exhibitArt[button.textContent]));
 }
 if (!art) {
  result.before(exhibitPicker);
  return;
 }
 const heading = document.createElement('h3');
 heading.className = 'exhibit-heading';
 heading.textContent = '四地词签';
 const exhibit = document.createElement('figure');
 exhibit.className = 'bike-exhibit';
 const frame = document.createElement('div');
 frame.className = 'exhibit-image';
 if (art !== exhibitArt['自行车']) {
  frame.classList.add('panorama');
  frame.style.setProperty('--exhibit-photo', 'url("assets/' + art + '")');
  if (art === exhibitArt['鼠标']) frame.style.setProperty('--photo-height', '68cqw');
  if (art === exhibitArt['打印机']) frame.style.setProperty('--photo-height', '55cqw');
 }
 const image = document.createElement('img');
 image.src = 'assets/' + art;
 image.alt = find(query).left;
 frame.append(image);
 exhibit.append(frame,exhibitPicker);
 result.querySelector('.regional-result-grid').before(exhibit,heading);
}

function renderResult(query,terms,note,notes=[],origin='词语示例'){
 const result=$('regionalResults');result.hidden=false;result.innerHTML='<h2 class="word-section-title">查询结果：<span>'+E(query)+'</span></h2><div class="regional-result-grid">'+regionLabels.map((label,n)=>'<article class="regional-result-card"><small>'+label+'</small><div class="result-divider"></div><strong>'+E(terms[n]||'结合语境确认')+'</strong>'+(notes[n]?'<p>'+E(notes[n])+'</p>':'')+'</article>').join('')+'</div><p class="regional-result-note">'+E(note||'使用习惯因语境和个人而异。')+'</p><small class="result-origin">'+E(origin)+'</small>';result.querySelectorAll('.regional-result-card').forEach(corners);compactContexts(result);
 showExhibit(result,query);
}
function compactContexts(result){const rows=[...result.querySelectorAll('.regional-result-card>p')];if(!rows.length)return;const details=document.createElement('details');details.className='regional-context';const summary=document.createElement('summary');summary.textContent='\u56db\u5730\u7528\u6cd5\u4e0e\u8bed\u5883';details.append(summary);for(const p of rows){const label=p.closest('.regional-result-card').querySelector('small').textContent;const b=document.createElement('b');b.textContent=label+' \u00b7 ';p.prepend(b);details.append(p);}result.append(details);}
function sample(w){return {query:w.left,terms:w.regions||[w.left,w.left,w.left,w.right],note:w.note||'使用习惯因语境和个人而异。'};}
function find(q){return dictionary.find(w=>[w.left,w.right,...(w.regions||[])].includes(q.trim()));}
function examples(){
 const all=dictionary.filter(w=>filter==='全部'||(w.context==='交流'?'日常':w.context)===filter),preferred=filter==='全部'?all.filter(w=>['软件','打印机'].includes(w.left)):all;
 const rows=expanded?all:preferred.slice(0,filter==='全部'?2:4);
 $('wordCards').innerHTML=rows.map(w=>'<article class="word-card quad-word example-strip"><h3>'+E(w.left)+'</h3><div class="quad-grid">'+regionLabels.map((label,n)=>'<div><small>'+label+'</small><strong>'+E(w.regions?.[n]||w.left)+'</strong></div>').join('')+'</div><details><summary>资料与语境</summary><p>'+E(w.note||'以下为词语或字形示例，不代表某一地区的唯一用法。')+'</p><a target="_blank" rel="noopener" href="'+E(w.source)+'">词语与字形来源</a>'+(w.hkSource?' · <a target="_blank" rel="noopener" href="'+E(w.hkSource)+'">香港用例</a>':'')+(w.moSource?' · <a target="_blank" rel="noopener" href="'+E(w.moSource)+'">澳门用例</a>':'')+'</details></article>').join('');
 if(!rows.length){$('wordCards').innerHTML='<div class="category-search"><p>想知道这个生活情境里的说法？可以从一个词开始。</p><button type="button" class="secondary" data-sample="'+(filter==='饮食'?'面包':'手机')+'">查询'+(filter==='饮食'?'面包':'手机')+'的四地表达</button></div>';$('wordCards').querySelector('button').onclick=e=>{$('wordQuery').value=e.target.dataset.sample;$('wordSearch').requestSubmit();};}
 $('moreWordExamples').hidden=expanded||all.length<=rows.length;
 $('wordFilters').querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.textContent===filter));
 $('wordCards').querySelectorAll('.word-card').forEach(corners);
}
async function search(){
 const q=$('wordQuery').value.trim();if(!q)return;const requestId=++serial,known=find(q),out=$('wordAnswer');
 if(known){const d=sample(known);renderResult(q,d.terms,d.note,[],'已有词语示例 · AI正在补充语境');}
 else renderResult(q,['整理中…','整理中…','整理中…','整理中…'],'正在整理四地表达，请稍候。',[],'DeepSeek 查询中');
 out.hidden=true;$('wordSubmit').disabled=true;
 const results = $('regionalResults');
 results.style.scrollMarginTop = $('wordSearch').offsetHeight + 12 + 'px';
 results.scrollIntoView({block:'start'});
 try{const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'words',structured:true,question:q,webSearch:false}),signal:AbortSignal.timeout(90000)}),data=await response.json();if(requestId!==serial)return;
 let result=data.regionalExpressions;
 if(!result&&data.answer){try{const parsed=JSON.parse(data.answer.replace(/^```(?:json)?\s*|\s*```$/g,''));if(codes.every(c=>typeof parsed.regions?.[c]?.term==='string'))result=parsed;}catch{}}
 if(result){renderResult(q,codes.map(c=>result.regions[c].term),result.note,codes.map(c=>result.regions[c].note),'DeepSeek语言解释 · 请结合语境使用');}
 else if(known){const d=sample(known);renderResult(q,d.terms,d.note,[],'已有词语示例');out.hidden=false;out.textContent=data.answer||data.error||'已有四地词语示例仍可阅读，请稍后再试AI解释。';}
 else{out.hidden=false;out.textContent=data.answer||data.error||'这次请求未完成，可重新查询或先浏览下方示例。';$('regionalResults').hidden=true;}
 }catch{if(requestId!==serial)return;out.hidden=false;out.textContent='这次连接未完成，请稍后重试。下方词语示例仍可阅读。';if(!known)$('regionalResults').hidden=true;}
 finally{if(requestId===serial)$('wordSubmit').disabled=false;}
}
async function init(){
 while(!$('catalogDetails'))await new Promise(r=>setTimeout(r,100));dictionary=await fetch('words.json').then(r=>r.json());
 const note='此例主要展示简繁字形或通用词语；四地可以采用同一说法，使用习惯仍因语境和个人而异。';
 const source='https://github.com/BYVoid/OpenCC';
 dictionary.push({left:'面包',right:'麵包',context:'饮食',regions:['面包','麵包','麵包','麵包'],note,source},{left:'牛奶',right:'牛奶',context:'饮食',regions:['牛奶','牛奶','牛奶','牛奶'],note,source},{left:'手机',right:'手機',context:'日常',regions:['手机','手機','手機','手機'],note,source});
 const result=document.createElement('section');result.id='regionalResults';result.setAttribute('aria-live','polite');$('wordFilters').after(result);
 exhibitPicker = createExhibitPicker();
 const examplesHeading=document.createElement('h2');examplesHeading.className='word-section-title example-heading';examplesHeading.textContent='更多词语示例';$('wordCards').before(examplesHeading);
 const more=document.createElement('button');more.id='moreWordExamples';more.type='button';more.className='secondary';more.textContent='展开更多词语示例';more.onclick=()=>{expanded=true;examples();};$('wordCards').after(more);
 const notePanel=document.querySelector('.word-note');if(notePanel){const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='词语说明与来源';details.append(summary,...notePanel.childNodes);notePanel.append(details);}
 $('wordFilters').innerHTML=['全部','科技','出行','饮食','日常'].map(x=>'<button type="button">'+x+'</button>').join('');$('wordFilters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.textContent;expanded=false;examples();});
 $('wordSearch').onsubmit=e=>{e.preventDefault();search();};$('wordQuery').placeholder='输入你想了解的词语，例如：自行车';
 $('wordSuggestions').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('wordQuery').value=b.textContent;$('wordSearch').requestSubmit();});
 const first=sample(find('自行车')||dictionary[0]);renderResult(first.query,first.terms,first.note);examples();
}
init().catch(console.error);
})();
