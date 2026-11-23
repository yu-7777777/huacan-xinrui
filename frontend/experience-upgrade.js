(()=>{'use strict';
function scrollTop(){let frame=window;for(let n=0;n<4;n++){try{frame.document.querySelectorAll('html,body,[data-testid="stMain"]').forEach(el=>{el.scrollTop=0;el.scrollLeft=0;});frame.scrollTo({top:0,left:0,behavior:'instant'});if(frame===frame.parent)break;frame=frame.parent;}catch{break;}}}
window.TongpinUX={scrollTop(){scrollTop();requestAnimationFrame(scrollTop);setTimeout(scrollTop,80);}};
const $=id=>document.getElementById(id);
async function init(){
 while(!$('storm')?.querySelector('.journey-nav'))await new Promise(r=>setTimeout(r,100));
 const panel=document.createElement('article');panel.className='family-care panel';panel.innerHTML='<div><small>风雨相望 · 牵挂有回声</small><h2>同一场风，也牵挂着远方的人。</h2><p>读懂各地预警，是为了把关心说得更清楚。一句问候，一声平安，让家人少一点担心。</p></div><div class="family-messages"><section><b>给远方家人的一句问候</b><p id="familyConcern">你那边风雨怎么样？请留意当地最新预警，方便时给家里报个平安。</p><button class="primary" data-copy-family="familyConcern">复制关心的话</button></section><section><b>给牵挂你的人一个回应</b><p id="familyReply">我会留意本地气象部门的最新消息，及时调整安排，有情况会告诉你们。</p><button class="secondary" data-copy-family="familyReply">复制平安回应</button></section></div><p class="note">以上为通用关怀话语，不代表当前台风预警。具体信号请以家人所在地的最新官方发布为准。</p><p id="familyCopyStatus" role="status"></p>';
 $('storm').querySelector('.journey-nav').before(panel);
 panel.querySelectorAll('[data-copy-family]').forEach(button=>button.onclick=async()=>{try{await navigator.clipboard.writeText($(button.dataset.copyFamily).textContent);$('familyCopyStatus').textContent='已复制，可以发送给家人。';}catch{$('familyCopyStatus').textContent='请长按上方文字，选择复制。';}});
 const intro=document.querySelector('#createSection .create-intro');
 if(intro)intro.dataset.fresh='true';
}
init().catch(console.error);
})();
