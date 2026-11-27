document.addEventListener('DOMContentLoaded', () => {
  const directory = document.querySelector('#chapters');
  const cover = document.querySelector('#qingjin nav');
  if (!directory || !cover) return;
  const menu = document.createElement('section');
  menu.className = 'harbor-directory';
  menu.innerHTML = '<h1><img src="assets/directory-title.webp" alt="目录"></h1>';
  for (const source of cover.querySelectorAll('button[data-cover]')) {
    const entry = source.cloneNode(true);
    entry.addEventListener('click', () => window.TongpinNavigate(source.dataset.cover));
    menu.append(entry);
  }
  const back = document.createElement('button');
  back.className = 'harbor-back';
  back.textContent = '返回首页';
  back.onclick = () => window.TongpinNavigate('home');
  menu.append(back);
  directory.append(menu);
});
