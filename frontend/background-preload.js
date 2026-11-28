(() => {
  const festivalBackgrounds = {
    spring: 'full-spring-fast.webp',
    lantern: 'full-lantern-fast.webp',
    qingming: 'full-qingming-fast.webp',
    dragon: 'full-dragon-fast.webp',
    qixi: 'full-qixi-fast.webp',
    ghost: 'full-ghost-fast.webp',
    mid: 'festival-moon-clean-fast.webp',
    double: 'festival-autumn-clean-fast.webp',
    winter: 'full-winter-fast.webp'
  };
  const festivalArt = id => [
    festivalBackgrounds[id],
    id === 'mid' ? 'desk-mid-table-fast.webp' : 'desk-' + id + '-fast.webp'
  ];
  const pageArt = {
    culture: festivalArt('mid'),
    words: ['home-harbor-fusion-fast.webp', 'words-bicycle-exhibit-fast.webp'],
    storm: ['storm-rain-bridge-fast.webp']
  };
  const requests = new Map();

  function preload(name, priority) {
    const pending = requests.get(name);
    if (pending) {
      if (priority === 'high' && pending.image) pending.image.fetchPriority = 'high';
      return pending.done;
    }
    const image = new Image();
    image.fetchPriority = priority;
    const entry = {image, done: null};
    entry.done = new Promise(resolve => {
      image.onload = () => { entry.image = null; resolve(); };
      image.onerror = () => { requests.delete(name); resolve(); };
    });
    requests.set(name, entry);
    image.src = 'assets/' + name + (name.startsWith('desk-') && name !== 'desk-mid-table-fast.webp' ? '?v=letters1' : '');
    return entry.done;
  }

  function onIntent(event) {
    const festival = event.target.closest('#festivalTabs [data-f]');
    const route = event.target.closest('#studioLinks [data-route]');
    const id = festival?.dataset.f;
    const files = id && festivalBackgrounds[id] ? festivalArt(id) : pageArt[route?.dataset.route];
    files?.forEach(name => preload(name, 'high'));
  }
  document.addEventListener('pointerover', onIntent);
  document.addEventListener('focusin', onIntent);

  const queue = [];
  let working = false;
  const idle = window.requestIdleCallback || (callback => window.setTimeout(callback, 220));
  function schedule(files) {
    queue.push(...files);
    if (working) return;
    working = true;
    idle(async function next() {
      while (queue.length && requests.has(queue[0])) queue.shift();
      if (!queue.length) { working = false; return; }
      await preload(queue.shift(), 'low');
      idle(next);
    });
  }

  window.addEventListener('load', () => {
    if (navigator.connection?.saveData || /^(slow-)?2g$/.test(navigator.connection?.effectiveType || '')) return;
    schedule([...pageArt.culture, ...pageArt.words, ...pageArt.storm]);
    const warmFestivals = () => {
      if (document.body.dataset.page !== 'culture') return;
      schedule(Object.values(festivalBackgrounds));
      pageObserver.disconnect();
    };
    const pageObserver = new MutationObserver(warmFestivals);
    pageObserver.observe(document.body, {attributeFilter:['data-page']});
    warmFestivals();
  }, {once:true});
})();
