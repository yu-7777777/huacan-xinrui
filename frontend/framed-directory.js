document.addEventListener('DOMContentLoaded', () => {
  const panel = document.createElement('section');
  panel.id = 'framedDirectory';
  const content = document.createElement('div');
  content.className = 'directory-sheet';
  panel.append(content);
  content.innerHTML = '<div class="directory-heading"><button type="button" data-destination="home">‹ 返回首页</button><h1>篇章目录</h1></div>';
  for (const [page,label] of [['culture','节日共叙'],['words','同物异名'],['storm','同一场风']]) {
    const button = document.createElement('button');
    button.dataset.destination = page;
    button.type = 'button';
    const image = new Image();
    image.alt = label;
    image.src = 'assets/directory-row-' + page + '.webp';
    button.append(image);
    content.append(button);
  }
  panel.onclick = event => {
    const button = event.target.closest('[data-destination]');
    if (button) window.TongpinNavigate(button.dataset.destination);
  };
  document.body.append(panel);
});
