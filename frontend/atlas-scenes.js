document.addEventListener('DOMContentLoaded', () => {
  const pages = ['culture','words','storm'];
  const names = ['节日共叙','同物异名','同一场风'];
  const scene = document.createElement('section');
  scene.id = 'atlasScene';
  document.body.append(scene);
  let current;
  function showControl(selector, action) {
    scene.hidden = true;
    action?.();
    requestAnimationFrame(() => {
      const target = document.querySelector(selector);
      target?.scrollIntoView({block:'center'});
      if (target?.matches('input,select,textarea')) target.focus({preventScroll:true});
    });
  }
  function render() {
    const page = document.body.dataset.page;
    if (current === page) return;
    current = page;
    scene.hidden = true;
    scene.replaceChildren();
    if (!pages.includes(page)) return;
    const image = new Image();
    image.alt = names[pages.indexOf(page)];
    image.onload = () => { if (image.parentElement === scene) scene.hidden = false; };
    scene.append(image);
    image.src = 'assets/atlas-' + page + '.webp';
    function hit(label,x,y,w,h,run) {
      const b = document.createElement('button');
      b.textContent = label;
      Object.assign(b.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
      b.onclick = run;
      scene.append(b);
    }
    ['首页','篇章目录',...names,'同频向导','资料来源'].forEach((label,i) => {
      hit(label,0,17+i*8,16.8,8,() => {
        if(i<5) window.TongpinNavigate(['home','chapters',...pages][i]);
        else showControl(null,()=>document.querySelector(i===5?'#guideNav':'#sourcesBtn').click());
      });
    });
    if(page==='culture'){
      const festivals=['春节','元宵','清明','端午','七夕','中元','中秋','重阳','冬至'];
      festivals.forEach((name,i)=>hit(name,27.4+i*7,28,7,8,()=>showControl('#festName',()=>Array.from(document.querySelectorAll('#festivalTabs button')).find(b=>b.textContent.trim()===name)?.click())));
      hit('共写一笺',18,37,61,61,()=>showControl('#createSection'));
      hit('寻访节俗',80,36,19,7,()=>showControl('#festivalQuery'));
      hit('节日小读',80,43,19,53,()=>showControl('.festival-story'));
    } else if(page==='words'){
      hit('四地词签',18,19,81,63,()=>showControl('.words-workspace'));
      ['自行车','出租车','地铁'].forEach((word,i)=>hit(word,25+i*17,84,16,14,()=>showControl('#wordQuery',()=>{
        const input=document.querySelector('#wordQuery');input.value=word;input.form.requestSubmit();
      })));
      hit('搜索一个词',77,84,22,14,()=>showControl('#wordQuery'));
    } else {
      hit('选择历史案例',18,18,62,9,()=>showControl('#stormSelect'));
      hit('探索历史路径',18,28,63,67,()=>showControl('#map'));
      hit('四地信号',82,20,17,56,()=>showControl('#signalContent'));
      hit('寄一声平安',80,78,20,21,()=>showControl('#stormCard',()=>document.querySelector('#stormCard').click()));
    }
  }
  new MutationObserver(render).observe(document.body,{attributes:true,attributeFilter:['data-page']});
  render();
});
