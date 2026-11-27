document.addEventListener('DOMContentLoaded', () => {
  const culture = document.querySelector('#culture');
  const tabs = culture.querySelector('#festivalTabs');
  const desk = document.createElement('section');
  desk.className = 'season-desk';
  desk.setAttribute('aria-label','节日书桌');
  desk.innerHTML = '<button data-open="#createSection"><small>我的一笺</small><strong></strong><span>写下我的节日记忆 ›</span></button><button data-open="#createSection"><small>远方的一笺</small><strong>同一个节日，你那里怎样过？</strong><span>与朋友共写 ›</span></button><button data-open=".festival-story"><small>节日小读</small><strong></strong><span>翻开小册 ›</span></button>';
  tabs.after(desk);
  const prompts = {spring:'年夜饭上，哪道菜一定会出现？',lantern:'你提过一盏什么样的灯？',qingming:'春雨里，你和家人走过哪条路？',dragon:'记忆里，谁最会包粽子？',qixi:'你听过哪个关于七夕的故事？',ghost:'家乡在这一天怎样寄托思念？',mid:'那年中秋，你和谁分了一块月饼？',double:'重阳登高，你想邀谁同行？',winter:'冬至那天，桌上端来了什么？'};
  function sync() {
    const entry = window.TongpinFestivals?.current();
    const id = culture.dataset.festival;
    const name = tabs.querySelector('.selected')?.textContent.trim() || entry?.name || '节日';
    desk.querySelector('strong').textContent = prompts[id] || '写一件你记得的过节小事。';
    desk.lastElementChild.querySelector('strong').textContent = name + '习俗';
  }
  desk.addEventListener('click', event => {
    const button = event.target.closest('[data-open]');
    if(button) culture.querySelector(button.dataset.open)?.scrollIntoView({block:'start'});
  });
  new MutationObserver(sync).observe(tabs,{childList:true,subtree:true,attributes:true});
  sync();
});
