window.addEventListener('load',()=>{
 const tabs=document.querySelector('#festivalTabs'),chapter=document.querySelector('#culture');
 if(!tabs||!chapter)return;
 const layer=document.createElement('div');layer.className='festival-landscape';layer.setAttribute('aria-hidden','true');chapter.prepend(layer);
 const scenes={
 '春节':['full-spring','petal',.84,.06],'元宵':['full-lantern','glow',.84,.41],
 '清明':['full-qingming','rain',.78,.22],'端午':['full-dragon','wave',.73,.69],
 '七夕':['full-qixi','stars',.60,.16],'中元':['full-ghost','wave',.28,.86],
 '中秋':['festival-moon-clean','glow',.64,.15],'重阳':['festival-autumn-clean','maple',.82,.15],
 '冬至':['full-winter','snow',.78,.13]};
 const ns='http://www.w3.org/2000/svg';
 function node(tag,attrs){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n}
 const heading=chapter.querySelector('.page-heading');
 const motifs={
 maple:'<path d="M0 11L-12 1l5-1-4-8 8 4L0-14 4-4l9-6-4 9 5 1L2 9l-2 6" fill="#b95123" stroke="#874222"/>',
 petal:'<path d="M0 7C-15 3-10-12-2-10L0-7l3-3C11-8 12 1 0 7" fill="#dc8488" stroke="#974e59"/>',
 stars:'<path d="M0-9L2-2 9 0 2 2 0 9-2 2-9 0-2-2Z" fill="#ffe8a8" stroke="#b8975e"/>',
 rain:'<path d="M4-10L-4 10" stroke="#567e85" stroke-width="2" stroke-linecap="round"/>',
 snow:'<path d="M0-8V8M-7-4L7 4M7-4L-7 4" stroke="#fff" stroke-width="2" style="filter:drop-shadow(0 1px 1px #637b89)"/>',
 lantern:'<path d="M-9-9Q0-13 9-9L6 7Q0 10-6 7Z" fill="#f6ab49" stroke="#9b4925"/><path d="M-5 8H5M0 9v5" stroke="#a54224" stroke-width="2"/>',
 boat:'<path d="M-17 0Q0 6 17-3L12 6Q0 11-11 7Z" fill="#a65531" stroke="#693e2d"/><path d="M-14 12q8 3 15 0t15 0" fill="none" stroke="#638789"/>',
 waterlamp:'<path d="M-10 2Q0 13 10 2L4 3 0-3-4 3Z" fill="#e99660" stroke="#995233"/><path d="M0 2q-3-3 1-8 3 6-1 8" fill="#ffe7a0"/>'
 };
 function accent(name,kind){
 const shape=kind==='glow'?'lantern':kind==='wave'?(name==='端午'?'boat':'waterlamp'):kind;
 const art=node('svg',{class:'festival-motion',viewBox:'0 0 220 118','aria-hidden':'true','data-motion':kind});
 const def=node('defs',{}),glyph=node('g',{id:'festival-accent-glyph'});glyph.innerHTML=motifs[shape];def.append(glyph);art.append(def);
 const count=kind==='snow'||kind==='rain'?10:4;
 for(let i=0;i<count;i++){const holder=node('g',{transform:'translate('+(22+(i*53)%175)+' '+(25+(i*31)%65)+') scale('+(i%2?.74:1)+')'}),u=node('use',{href:'#festival-accent-glyph'});u.style.animationDelay=(-i*.83)+'s';holder.append(u);art.append(holder)}
 heading.querySelector('.festival-motion')?.remove();heading.append(art);
 }
 let ticket=0,previous='';
 async function render(){
 const name=tabs.querySelector('.selected')?.textContent.trim();if(!name||name===previous)return;
 previous=name;const id=++ticket;
 const [file,kind,px,py]=scenes[name]||scenes['中秋'];
 accent(name,kind);
 const src='assets/'+file+'.jpg',img=new Image();img.src=src;
 try{await img.decode()}catch{return}if(id!==ticket)return;
 const w=img.naturalWidth,h=img.naturalHeight;
 const svg=node('svg',{viewBox:'0 0 '+w+' '+h,preserveAspectRatio:'xMidYMin slice'});
 const painting=node('image',{href:src,width:w,height:h});
 if(name==='七夕')painting.style.filter='saturate(.46) contrast(.94) brightness(.98)';
 svg.append(painting);
 const count=kind==='glow'?1:kind==='wave'?3:kind==='maple'?4:kind==='rain'?18:10;
 for(let i=0;i<count;i++){
 const x=w*(px+(i?((i*.38197)%1-.5)*.34:0)),y=h*(py+(i?((i*.61803)%1-.5)*.13:0));
 const g=node('g',{transform:'translate('+x+' '+y+')'}),item=node('g',{});let shape,cls;
 if(kind==='wave'){shape=node('ellipse',{rx:35+i*5,ry:4,fill:'none',stroke:'#fff2c8','stroke-width':2});cls='wave'}
 else if(kind==='rain'){shape=node('path',{d:'M0 0l-4 13',stroke:'#c8d9d7','stroke-width':1.6});cls='rain'}
 else if(kind==='glow'){const defs=node('defs',{}),grad=node('radialGradient',{id:'scene-halo'});for(const [offset,alpha] of [['0%',.75],['100%',0]])grad.append(node('stop',{offset,'stop-color':'#ffe4a0','stop-opacity':alpha}));defs.append(grad);svg.append(defs);shape=node('circle',{r:w*(file==='full-lantern'?.055:.13),fill:'url(#scene-halo)'});cls='glow'}
 else if(kind==='stars'){shape=node('path',{d:'M0 -4L1 -1L4 0L1 1L0 4L-1 1L-4 0L-1 -1Z',fill:'#ffedbe'});cls='glow'}
 else if(kind==='maple'){shape=node('path',{d:'M0 8L-8 2L-5 1L-8 -4L-2 -2L0 -9L3 -3L8 -5L6 0L9 1L2 6L1 10Z',fill:'#bc581f'});cls='fall'}
 else{shape=kind==='snow'?node('circle',{r:2+i%3,fill:'#fffaf2'}):node('ellipse',{rx:4,ry:2.4,fill:'#df9188',transform:'rotate(-25)'});cls='fall'}
 item.setAttribute('class','scene-'+cls);item.style.animationDelay=(-i*1.37)+'s';item.append(shape);g.append(item);svg.append(g);
 }
 layer.replaceChildren(svg);
 }
 new MutationObserver(render).observe(tabs,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});render();
});

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
});