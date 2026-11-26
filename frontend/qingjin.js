document.querySelector('#qingjin').addEventListener('click', event => {
  const page = event.target.closest('[data-cover]')?.dataset.cover;
  if (page === 'guide') document.querySelector('#guideNav').click();
  else if (page) {
    window.TongpinNavigate(page);
    const control = event.target.closest('[data-cover]');
    if (control.dataset.festival) {
      Array.from(document.querySelectorAll('#festivalTabs [data-f]'))
        .find(tab => tab.textContent.trim() === control.dataset.festival)?.click();
    }
    if (control.dataset.focus) document.getElementById(control.dataset.focus)?.focus();
  }
});
const fixedSections = [
  [document.querySelector('body > header'), '--nav-height'],
  [document.querySelector('#culture > .page-heading'), '--festival-heading-height'],
  [document.querySelector('#festivalTabs'), '--festival-tabs-height'],
  [document.querySelector('#culture > .festival-discovery'), '--festival-search-height']
];
const sizes = new ResizeObserver(() => {
  const area = document.querySelector('#culture').getBoundingClientRect();
  if (area.width) {
    document.documentElement.style.setProperty('--festival-left', area.left + 'px');
    document.documentElement.style.setProperty('--festival-width', area.width + 'px');
  }
  for (const [element, property] of fixedSections) {
    const height = element.getBoundingClientRect().height;
    if (height) document.documentElement.style.setProperty(property, height + 'px');
  }
});
for (const [element] of fixedSections) sizes.observe(element);

document.querySelector('body > header').addEventListener('click', event => {
  if (event.target.closest('[data-page], .brand')?.closest('nav button, a.brand')) {
    document.getElementById('guide').hidden = true;
  }
}, true);
