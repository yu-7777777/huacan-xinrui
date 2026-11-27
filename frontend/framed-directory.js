document.addEventListener('DOMContentLoaded', () => {
  const panel = document.createElement('nav');
  panel.id = 'framedDirectory';
  panel.setAttribute('aria-label', '篇章目录');
  const poster = new Image();
  poster.alt = '';
  poster.src = 'assets/directory-framed.webp';
  poster.onload = () => panel.classList.add('ready');
  panel.append(poster);
  function link(label, action, left, top, width, height) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    Object.assign(button.style, {left:left+'%', top:top+'%', width:width+'%', height:height+'%'});
    button.onclick = action;
    panel.append(button);
  }
  const routes = [['首页','home'],['篇章目录','chapters'],['节日共叙','culture'],['同物异名','words'],['同一场风','storm']];
  routes.forEach(([label,page], i) => link(label, () => window.TongpinNavigate(page), 0, 17.5+i*8, 16.8, 8));
  link('同频向导', () => document.querySelector('#guideNav').click(), 0,57.5,16.8,8);
  link('资料来源', () => document.querySelector('#sourcesBtn').click(), 0,65.5,16.8,8);
  routes.slice(2).forEach(([label,page], i) => link(label, () => window.TongpinNavigate(page),16.8,19.1+i*25.55,83.2,25.55));
  document.body.append(panel);
});
