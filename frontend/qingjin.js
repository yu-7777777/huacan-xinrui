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

// Keep the painting as tall as the content, independently of the scrollport.
const chapterMain = document.querySelector('body > main');
new ResizeObserver(() => {
  const body = document.body;
  const bottom = chapterMain.getBoundingClientRect().bottom - body.getBoundingClientRect().top + body.scrollTop;
  body.style.setProperty('--function-scene-height', Math.ceil(bottom) + 'px');
}).observe(chapterMain);

{
  const harborCover = document.querySelector('.harbor-cover');
  const harborMotion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0;

  harborCover.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !harborMotion.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = harborCover.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width * 2 - 1) * Math.min(19, bounds.width * .019);
      const y = ((event.clientY - bounds.top) / bounds.height * 2 - 1) * Math.min(12, bounds.height * .02);
      harborCover.style.setProperty('--harbor-x', x.toFixed(1) + 'px');
      harborCover.style.setProperty('--harbor-y', y.toFixed(1) + 'px');
    });
  });

  function recenterHarbor() {
    cancelAnimationFrame(frame);
    harborCover.style.removeProperty('--harbor-x');
    harborCover.style.removeProperty('--harbor-y');
  }

  harborCover.addEventListener('pointerleave', recenterHarbor);
  harborMotion.addEventListener('change', recenterHarbor);
}
