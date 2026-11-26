(()=>{'use strict';
const $=id=>document.getElementById(id);
const scenery=document.createElement('div');scenery.id='functionBackdrop';scenery.setAttribute('aria-hidden','true');for(const page of ['culture','words','storm']){const img=document.createElement('img');img.src='assets/function-'+page+'.jpg';img.className='scenery-'+page;img.alt='';img.decoding='async';scenery.append(img);}document.body.prepend(scenery);
window.TongpinScrollArt={};for(const key of ['green','ochre']){const img=new Image();img.src='assets/story-scroll-'+key+'.webp';window.TongpinScrollArt[key]=img;}
async function arrange(){
 while(!$('exampleSources')||!$('downloadCulturePNG')||!document.querySelector('.family-care'))await new Promise(r=>setTimeout(r,80));
 const workspace=document.createElement('div');workspace.className='words-workspace';const words=$('words'),heading=words.querySelector('.page-heading');for(const child of [...words.children])if(child!==heading)workspace.append(child);words.append(workspace);
 const section=$('createSection'),fields=section.querySelector('.coedit-fields'),partner=fields.querySelector('.partner');
 const tools=document.createElement('div');tools.className='coedit-toolbar';const invite=partner?.querySelector('button');tools.append($('createRoom'));if(invite){invite.textContent='邀请朋友';tools.append(invite);}tools.append($('saveVoice'));
 fields.after(tools);const more=document.createElement('details');more.className='coedit-options';more.innerHTML='<summary>共创状态与更多选项</summary>';more.append($('localMode'),$('roomStatus'));if(partner)more.append(partner);tools.after(more);
 const confirm=$('approve')?.closest('label');if(confirm)tools.before(confirm);
 section.querySelectorAll(':scope>.room-controls').forEach(row=>{if(!row.children.length)row.remove();else row.classList.add('coedit-secondary-tools');});
 const form=$('festivalSearch');form.querySelector('label').classList.add('sr-only');form.querySelector('small').hidden=true;$('festivalQuery').placeholder='探索更多节日';$('festivalSearchButton').textContent='AI探索';
 const care=document.querySelector('.family-care');if(care){care.querySelector('.note')?.classList.add('care-footnote');}
}
arrange().catch(console.error);
})();
