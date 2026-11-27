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