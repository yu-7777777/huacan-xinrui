(()=>{'use strict';
const $=id=>document.getElementById(id);
// The chapter selection is a real route; the existing entry buttons keep their handlers.
const chapters=document.createElement('section');chapters.id='chapters';chapters.className='page';chapters.hidden=true;chapters.setAttribute('aria-label','选择同频篇章');
const heading=document.querySelector('.scroll-chapters');heading.querySelector('h2').outerHTML='<h1>一卷三章，循声而行。</h1>';
chapters.append(heading,$('entrances'));
const back=document.createElement('button');back.type='button';back.className='secondary chapter-back';back.textContent='← 返回首页';back.onclick=()=>window.TongpinNavigate('home');chapters.append(back);$('home').after(chapters);
$('start').onclick=()=>window.TongpinNavigate('chapters');
document.querySelector('#home .hero-routes')?.remove();
// Initialization fetches data asynchronously and may resolve after the new route is built.
if(location.hash==='#chapters')window.TongpinNavigate('chapters',false);
const wordsHeading=document.querySelector('#words .page-heading');wordsHeading.querySelector('.wooden-type')?.remove();
wordsHeading.querySelector('h1').textContent='说法不同，也能相互理解。';
const seal=document.createElement('span');seal.className='words-heading-seal';seal.textContent='同\n频';seal.setAttribute('aria-hidden','true');wordsHeading.querySelector('h1').prepend(seal);
const reeds=document.createElement('img');reeds.src='assets/words-reeds.svg';reeds.alt='';reeds.className='words-reeds';reeds.setAttribute('aria-hidden','true');wordsHeading.append(reeds);
const sources=document.createElement('details');sources.id='exampleSources';sources.innerHTML='<summary>示例词语的资料与语境</summary><div></div>';$('wordCards').after(sources);
function arrangeExamples(){const target=sources.querySelector('div');target.replaceChildren();for(const row of $('wordCards').querySelectorAll('.example-strip')){const details=row.querySelector(':scope>details');if(!details)continue;details.querySelector('summary').textContent=row.querySelector('h3').textContent+' · 资料与语境';target.append(details);}sources.hidden=!target.childElementCount;}
new MutationObserver(arrangeExamples).observe($('wordCards'),{childList:true});arrangeExamples();
})();
