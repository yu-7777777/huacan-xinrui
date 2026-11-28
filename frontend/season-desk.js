document.addEventListener('DOMContentLoaded', () => {
  const culture = document.querySelector('#culture');
  const tabs = culture.querySelector('#festivalTabs');
  const desk = document.createElement('section');
  desk.className = 'season-desk';
  desk.setAttribute('aria-label','节日书桌');
  desk.innerHTML = '<button type="button" class="desk-letter" data-open="#createSection"><small>我的一笺</small><strong></strong></button><button type="button" class="desk-letter" data-open="#createSection"><small>远方的一笺</small><strong></strong></button><button type="button" class="desk-book" aria-haspopup="dialog" aria-controls="festivalReading"><small>节日小读</small><strong></strong></button>';
  tabs.after(desk);
  const reader = document.createElement('dialog');
  reader.id = 'festivalReading';
  reader.setAttribute('aria-labelledby', 'festivalReadingTitle');
  reader.innerHTML = '<article><header class="reading-cover"><small>节日小读</small><h2 id="festivalReadingTitle"></h2></header><div class="reading-copy"><p class="reading-intro"></p><p class="reading-description"></p><a target="_blank" rel="noopener noreferrer">查阅资料出处 ↗</a></div><button type="button" class="reading-close" aria-label="关闭资料卡" autofocus>×</button></article>';
  document.body.append(reader);
  reader.querySelector('.reading-close').onclick = () => reader.close();
  reader.addEventListener('click', event => {
    if (event.target === reader) reader.close();
  });
  const cover = reader.querySelector('.reading-cover');
  const intro = reader.querySelector('.reading-intro');
  const description = reader.querySelector('.reading-description');
  const source = reader.querySelector('.reading-copy a');
  const book = desk.querySelector('.desk-book');
  book.onclick = () => {
    const festival = window.TongpinFestivals.current();
    if (!festival || reader.open) return;
    const illustration = document.querySelector('.festival-complete-image');
    cover.style.setProperty('--reading-art', `url("${illustration.src}")`);
    cover.querySelector('h2').textContent = festival.name + (festival.custom ? '' : ' · ' + festival.theme);
    intro.textContent = festival.intro;
    description.textContent = window.TongpinFestivals.description(festival);
    description.hidden = description.textContent === festival.intro;
    source.hidden = !/^https?:\/\//i.test(festival.source);
    if (source.hidden) source.removeAttribute('href');
    else source.href = festival.source;
    reader.showModal();
  };
  const prompts = {spring:'年夜饭上，哪道菜一定会出现？',lantern:'你提过一盏什么样的灯？',qingming:'春雨里，你和家人走过哪条路？',dragon:'记忆里，谁最会包粽子？',qixi:'你听过哪个关于七夕的故事？',ghost:'家乡在这一天怎样寄托思念？',mid:'那年中秋，你和谁分了一块月饼？',double:'重阳登高，你想邀谁同行？',winter:'冬至那天，桌上端来了什么？'};
  const letters = {
    spring: ['饭还没上齐，阿爸已经把椅子排好了。窗上的福字有点歪，是小妹踮着脚贴的。', '刚从花市回来，挑了一枝桃花。等你来拜年，我把靠窗的位置留给你。'],
    lantern: ['竹篾弯成一尾鱼，尾巴是我剪的。风一吹，它就在巷子里游起来。', '我们猜了半晚灯谜才回家。锅里的汤圆还热着，你爱吃的芝麻馅也有。'],
    qingming: ['上山前下过一场雨。我们沿着旧石阶慢慢走，听母亲讲外公年轻时的事。', '今年没赶回去，我翻出了那张全家福。下次见面，想请你认一认照片里的人。'],
    dragon: ['我跟阿婆学折粽叶。第一只漏了几粒米，她笑着又递给我一片叶子。', '河边的鼓声一响，大家都往岸边跑。我录了一小段，你听听是哪支船先到。'],
    qixi: ['外婆把彩线穿过针眼，教我绣一朵小花。我拆了两回，这片叶子终于像样。', '天暗下来，我们搬着矮凳到院里找星星。你那边今晚也看得见银河吗？'],
    ghost: ['晚饭前，父亲又做了奶奶拿手的那道菜。切葱的时候，他说起她从前的厨房。', '我把你讲的旧事记进了本子。哪天回家，我们坐下来，再把这一页补完。'],
    double: ['走到半山亭，我们停下来喝茶。今年爷爷走得慢，却最先认出了山下的老街。', '这边的菊花开了。我陪母亲散了会儿步，把一路拍的花传给你看。'],
    winter: ['厨房的玻璃起了雾。我们一边擀皮一边聊天，最后一只饺子包得格外大。', '我家今夜煮了姜汤圆。勺子碰着碗沿，窗外天早就黑了，屋里仍然很暖。']
  };
  // Percentages use each desk illustration as the coordinate space.
  const layouts = {
    spring: [27,59,11,13,81,30,48,89],
    lantern: [27.5,59,11,13,81.3,30,47.5,89],
    qingming: [27.3,59.3,13,16,81.8,31.5,48,89.5],
    dragon: [28,59.5,13,16.5,81.5,31,48.5,89.5],
    qixi: [28,58.5,14,16,81,30,47.5,89],
    ghost: [28.5,58.8,15,17,81.1,30.5,47,89],
    mid: [28,57,10,12,81.3,29,46,86],
    double: [27,59.3,10.5,13.5,81.4,29.5,47,87],
    winter: [27,58.3,10,13,81.3,29.5,45.5,87.5]
  };
  function sync() {
    const entry = window.TongpinFestivals?.current();
    const id = culture.dataset.festival;
    if(desk.dataset.selection!==id){delete culture.dataset.detail;desk.dataset.selection=id;}
    const name = tabs.querySelector('.selected')?.textContent.trim() || entry?.name || '节日';
    desk.children[1].querySelector('strong').textContent = letters[id]?.[1] || '同一个节日，你那里怎样过？';
    desk.querySelector('strong').textContent = letters[id]?.[0] || prompts[id] || '写一件你记得的过节小事。';
    book.querySelector('strong').textContent = name + '习俗';
    book.setAttribute('aria-label', '节日小读 · ' + name);
    book.disabled = !entry;
    const layout = layouts[id];
    desk.classList.toggle('has-desk-art', Boolean(layout));
    if (layout) {
      const [left, right, leftTitle, rightTitle, bookX, bookY, writeX, writeY] = layout;
      for (const [key, value] of Object.entries({left, right, 'left-title': leftTitle, 'right-title': rightTitle, 'book-x': bookX, 'book-y': bookY, 'write-x': writeX, 'write-y': writeY})) {
        desk.style.setProperty('--' + key, value + '%');
      }
    }
  }
  desk.addEventListener('click', event => {
    const button = event.target.closest('[data-open]');
    if(button){culture.dataset.detail=button.dataset.open;culture.querySelector(button.dataset.open)?.scrollIntoView({block:'start'});}
  });
  new MutationObserver(sync).observe(tabs,{childList:true,subtree:true,attributes:true});
  sync();
});
document.addEventListener('DOMContentLoaded', () => {
  const desk = document.querySelector('.season-desk');
  for (const [label,selector,cls] of [['共写一笺','#createSection','write'],['寻访节俗','.festival-discovery','search']]) {
    const b=document.createElement('button');b.textContent=label;b.dataset.open=selector;b.className='desk-'+cls;desk.append(b);
  }
  const header=document.querySelector('body>header');
  header.id='studioRail';
  header.querySelector('.brand').setAttribute('aria-label','同频首页');
  const rail=document.createElement('nav');
  rail.id='studioLinks';
  rail.setAttribute('aria-label','主导航');
  const entries = [
    ['首页','home','home'],['篇章目录','chapters','chapters'],['节日共叙','culture','festival'],
    ['同物异名','words','words'],['同一场风','storm','storm'],['同频向导','guideNav','guide'],['资料来源与出处','sourcesBtn','sources']
  ];
  for (const [label,route,iconName] of entries) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.route = route;
    const icon = document.createElement('i');
    icon.className = 'nav-icon ' + iconName;
    icon.setAttribute('aria-hidden','true');
    const title = document.createElement('span');
    title.textContent = label;
    button.append(icon,title);
    button.onclick = () => ['guideNav','sourcesBtn'].includes(route)
      ? document.getElementById(route).click()
      : window.TongpinNavigate(route);
    rail.append(button);
  }
  header.append(rail);
  const updateCurrent = () => {
    for (const button of rail.children) {
      if (button.dataset.route === document.body.dataset.page) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    }
  };
  new MutationObserver(updateCurrent).observe(document.body,{attributes:true,attributeFilter:['data-page']});
  updateCurrent();
});
