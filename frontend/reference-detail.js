(()=>{'use strict';
const $=id=>document.getElementById(id);
function corners(el){if(el.querySelector(':scope > .frame-corner'))return;el.classList.add('ornate-frame');for(const pos of ['tl','tr','bl','br']){const s=document.createElement('span');s.className='frame-corner '+pos;s.setAttribute('aria-hidden','true');el.append(s);}}
function finish(){document.querySelectorAll('.word-search,.voices>div,.word-card,.festival-note,.export-card').forEach(corners);}
finish();new MutationObserver(finish).observe($('wordCards'),{childList:true});
const watch=new MutationObserver(()=>{finish();if(document.querySelector('.voices'))watch.disconnect();});watch.observe($('createSection'),{childList:true,subtree:true});
// Keep the heading ornament and field examples as decoration, never as screenshot text.
const heading=document.querySelector('#words .page-heading');heading.querySelector('.type-blocks')?.remove();
const cube=document.createElement('img');cube.className='wooden-type';cube.src='assets/wooden-type.svg';cube.alt='';cube.setAttribute('aria-hidden','true');heading.append(cube);
document.querySelector('.scroll-chapters i').textContent='';
const facets=[['culture','共写一笺'],['words','寻一个词'],['storm','看一场风']];
for(const [page,label] of facets){const b=document.querySelector('[data-enter="'+page+'"]');b.setAttribute('aria-label',label+'：'+b.querySelector('h2').textContent);}
const small=document.createElement('div');small.className='guide-welcome';small.innerHTML='<span class="guide-seal" aria-hidden="true">同频</span><p>你好，想从哪个问题开始？</p>';$('messages').before(small);
const messages=$('messages');
async function copyText(text,button){try{await navigator.clipboard.writeText(text);button.textContent='已复制';setTimeout(()=>button.textContent='复制这段话',1800);}catch{button.textContent='请选中文字复制';}}
function enrich(){document.querySelector('.guide-welcome').hidden=messages.children.length>0;
for(const message of messages.querySelectorAll('.msg:not(.user)')){
 const text=[...message.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
 if(!text||/^(正在|检索等待|连接中断)/.test(text)||message.querySelector('.answer-actions'))continue;
 const quote=text.match(/[“「]([^”」]{12,180})[”」]/);
 if(quote){const q=document.createElement('blockquote');q.className='guide-quote';q.textContent=quote[1];corners(q);message.append(q);}
 const bar=document.createElement('div');bar.className='answer-actions';const b=document.createElement('button');b.type='button';b.className='secondary copy-answer';b.textContent='复制这段话';b.onclick=()=>copyText(quote?quote[1]:text,b);bar.append(b);
 let route,label;if(/台风|风球|预警|风雨/.test(text)){route='storm';label='同一场风';}else if(/节日|中秋|端午|春节|共创卡/.test(text)){route='culture';label='节日共叙';}else if(/四地|词语|单车|自行车|腳踏車/.test(text)){route='words';label='同物异名';}
 if(route){const link=document.createElement('button');link.type='button';link.className='related-answer';link.textContent='查看相关内容：'+label+' →';link.onclick=()=>{$('closeGuide').click();document.querySelector('[data-page="'+route+'"]').click();};bar.append(link);}
 message.append(bar);
}}
new MutationObserver(enrich).observe(messages,{childList:true,subtree:true,characterData:true});enrich();
})();
