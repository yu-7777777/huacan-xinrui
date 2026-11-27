window.addEventListener('load',()=>{
 const section=document.getElementById('createSection');
 function merge(){
 const fields=section.querySelector('.coedit-fields'),note=section.querySelector('.card-downloads p'),options=section.querySelector('.coedit-options'),join=section.querySelector('.join-box'),tools=section.querySelector('.coedit-toolbar');
 if(!fields||!note||!options||!join||!tools)return false;
 const panel=document.createElement('div');panel.className='writing-panel';fields.before(panel);
 note.classList.add('writing-note');panel.append(note,fields,section.querySelector('#approve').closest('label'),tools,options);
 const voices=section.querySelector('.live-card .voices');
 const downloads=section.querySelector('.card-downloads');
 const surround=document.createElement('div');surround.className='paired-scroll-panel';
 voices.before(surround);surround.append(voices,downloads);
 const status=section.querySelector('#saveResult');if(status)panel.append(status);panel.append(join);
 return true;
 }
 if(!merge()){const observer=new MutationObserver(()=>{if(merge())observer.disconnect()});observer.observe(section,{childList:true,subtree:true})}
});window.addEventListener('load', () => {
  const chapter = document.querySelector('#culture');
  const modules = [
    ['#festivalTabs', '岁时择节', 'M5 7h22v20H5z M5 13h22 M10 4v6m12-6v6 M10 18h3m5 0h3m-11 4h3'],
    ['.festival-discovery', '寻访节俗', 'M21 20l7 8 M23 13a9 9 0 1 1-18 0 9 9 0 1 1 18 0 M9 14q4-7 9-5-1 6-7 7'],
    ['.festival-story', '节日小读', 'M3 7q7-3 13 1 6-4 13-1v18q-7-3-13 1-6-4-13-1z M16 8v18 M7 12l5 1m8 0 5-1'],
    ['#createSection', '两地共笺', 'M3 15l9-8 9 8-9 9z M4 15l8 1 1-8 M17 22l7-12 4 3-8 11-5 3z M23 12l4 3']
  ];
  for (const [selector, label, path] of modules) {
    const module = chapter.querySelector(selector);
    if (!module) continue;
    const heading = document.createElement('h2');
    heading.className = 'festival-module-title';
    heading.innerHTML = '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="' + path + '"/></svg>';
    heading.append(label);
    module.before(heading);
  }
});
