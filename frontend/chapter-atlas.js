document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('body > header nav');
  const directory = document.createElement('button');
  directory.type = 'button';
  directory.className = 'atlas-directory';
  directory.textContent = '篇章目录';
  directory.onclick = () => window.TongpinNavigate('chapters');
  nav.querySelector('[data-page=home]').after(directory);
});
