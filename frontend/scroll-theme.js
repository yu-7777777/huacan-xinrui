(()=>{'use strict';
const $=id=>document.getElementById(id);
document.body.classList.add('scroll-edition');
const hero=document.querySelector('#home .hero');
hero.querySelector('.culture-art').innerHTML='<img src="assets/book-hero.webp" alt="展开的书卷上，街巷、石桥与亭台相连" width="1408" height="1024" fetchpriority="high">';
hero.querySelector('.eyebrow').textContent='山海相望 · 心意相通';
hero.querySelector('h1').innerHTML='从文化共鸣，<br>到风雨共济。';
hero.querySelector('p').innerHTML='<strong>共一脉文化，听万种回声。</strong><br>从节日里的共同记忆，到不同说法中的相互理解，<br class="desktop-break">再到同一场风里的彼此牵挂。';
$('start').textContent='展卷，开始同频 →';
hero.insertAdjacentHTML('beforeend','<svg class="red-thread" aria-hidden="true" viewBox="0 0 1200 100" preserveAspectRatio="none"><path d="M-20 97C110 80 160 8 280 31S443 91 534 45S721 15 800 38" fill="none" stroke="#ab422c" stroke-width="1.3"/></svg>');
document.querySelector('.access-versions')?.remove();
const intro=document.createElement('div');intro.className='scroll-chapters';intro.innerHTML='<span></span><h2>一卷三章，循声而行。</h2><span></span><i aria-hidden="true">❖</i>';$('entrances').before(intro);
const homeCards=[['culture','01','节日共叙','一个节日，写下你我不同的生活记忆。','共写一笺','<div class="chapter-festivals"><span>春节</span><span>端午</span><span class="current">中秋</span></div>'],['words','02','同物异名','同一事物，各有表达。','寻一个词','<div class="chapter-words">自行车 <i>/</i> 腳踏車</div>'],['storm','03','同一场风','读懂各地预警，把关心送给远方的家人。','看一场风','<small class="chapter-source">历史回放 · 来源可查</small>']];
for(const [key,n,title,copy,label,extra] of homeCards){const b=document.querySelector('[data-enter="'+key+'"]');b.innerHTML='<div class="chapter-heading"><small>'+n+'</small><h2>'+title+'</h2></div><p>'+copy+'</p>'+extra+'<span class="chapter-action">'+label+' <i aria-hidden="true">→</i></span>';}
document.querySelector('[data-page="culture"]').textContent='节日共叙';
$('guideNav').textContent='同频向导';
document.querySelector('header .status').textContent='文化相通 · 风雨同行';
const headings=[['culture','01 / 节日共叙','从共同的节日出发，写下你我不同的生活记忆。'],['words','02 / 同物异名','同一事物，各有表达。请结合生活情境阅读。']];
for(const [id,kicker,text] of headings){const h=$(id).querySelector('.page-heading');h.querySelector('.eyebrow').textContent=kicker;h.querySelector('p').textContent=text;}
document.querySelector('#storm .storm-heading .eyebrow').textContent='03 / 同一场风';
const story=document.querySelector('.festival-story');
if(story&&$('observation'))story.lastElementChild.append($('observation'));
const example=document.createElement('div');example.className='type-blocks';example.setAttribute('aria-hidden','true');example.innerHTML='<span>同</span><span>懂</span>';document.querySelector('#words .page-heading').append(example);
// All original handlers stay on their original elements; this layer changes presentation only.
function decorate(){
 let done=0;
 if(document.querySelector('.live-card')){const c=document.querySelector('.live-card');if(!c.querySelector('.joining-seal')){const s=document.createElement('span');s.className='joining-seal';s.setAttribute('aria-hidden','true');s.textContent='合';c.querySelector('.voices').append(s);}done++;}
 if($('wordSearch')){if(!$('wordSuggestions')){const row=document.createElement('div');row.id='wordSuggestions';row.className='word-suggestions';row.innerHTML='<span>推荐词语</span>'+['自行车','软件','早餐','出租车'].map(w=>'<button type="button">'+w+'</button>').join('');row.querySelectorAll('button').forEach(b=>b.onclick=()=>{$('wordQuery').value=b.textContent;$('wordQuery').focus();});$('wordSearch').append(row);}done++;}
 const names=document.querySelector('.storm-names');if(names){const grid=document.querySelector('.storm-grid');if(grid&&grid.nextElementSibling!==names)grid.after(names);done++;}
 if(document.querySelector('.latest-storm')){const storm=$('storm'),heading=storm.querySelector('.storm-heading'),latest=storm.querySelector('.latest-storm');if(heading.nextElementSibling!==latest)heading.after(latest);done++;}
 if(done===4)return true;return false;
}
const observer=new MutationObserver(()=>{if(decorate())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});decorate();setTimeout(()=>observer.disconnect(),30000);
const seasons={'春节':'spring','元宵':'lantern','清明':'qingming','端午':'dragon','七夕':'qixi','中元':'ghost','中秋':'mid','重阳':'double','冬至':'winter'};
const festivalState=()=>{document.body.dataset.festival=$('festName').textContent;document.body.dataset.season=seasons[$('festName').textContent]||'mid';};
new MutationObserver(festivalState).observe($('festName'),{childList:true,subtree:true});festivalState();
// The guide remains the original working chat, in a larger paper correspondence workspace.
const guide=$('guide'),body=guide.querySelector('.guide-body'),suggestions=guide.querySelector('.suggestions');
const layout=document.createElement('div');layout.className='guide-workspace';const side=document.createElement('div');side.className='guide-topics';side.innerHTML='<h3>从一个问题开始</h3>';side.append(suggestions);
const main=document.createElement('div');main.className='guide-conversation';
const caption=body.querySelector(':scope > p');caption.textContent='问词语，聊文化，也读懂风雨里的牵挂。';
const note=guide.querySelector(':scope > label.note'),form=$('chatForm'),foot=guide.querySelector(':scope > p.note');
main.append(body,note,form,foot);layout.append(side,main);guide.append(layout);
const prompts=[['自行车在四地分别怎么说？','自行车在大陆、香港、澳门和台湾地区分别怎么说？'],['如何读懂各地的预警？','八号风球可以换算成橙色预警吗？'],['怎样理解文化阅读数据？','这些浏览量代表各地区青年吗？']];
suggestions.querySelectorAll('button').forEach((b,i)=>{b.textContent=prompts[i][0];b.dataset.q=prompts[i][1];});
const extra=document.createElement('button');extra.type='button';extra.textContent='如何邀请朋友共写文化卡？';extra.onclick=()=>{$('question').value='如何邀请朋友共写文化卡？';form.requestSubmit();};suggestions.append(extra);
document.querySelector('#guide .guide-head b').textContent='纸上问答 · 同频向导';
document.querySelectorAll('.journey-nav').forEach(n=>{if(n.querySelector('[data-next-page="culture"]'))n.querySelector('button').textContent='开启节日共叙';});
})();
