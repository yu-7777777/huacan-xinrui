(()=>{'use strict';
const $=id=>document.getElementById(id);
async function refine(){
 while(!document.querySelector('.words-workspace')||!$('catalogDetails'))await new Promise(r=>setTimeout(r,80));
 const wood=document.querySelector('#words .wooden-type');if(wood){wood.src='assets/wooden-blossom.webp';wood.alt='同与懂木纹字块与白色花枝';}
 const festivalArt=document.querySelector('.festival-complete-image');
 function midArt(){const mid=window.TongpinFestivals?.current()?.id==='mid';festivalArt.classList.toggle('mid-scene',mid);if(mid&&festivalArt.getAttribute('src')!=='assets/festival-mid-scene.webp')festivalArt.src='assets/festival-mid-scene.webp';}
 new MutationObserver(midArt).observe($('festName'),{childList:true,subtree:true});midArt();
 const signals=document.querySelector('#storm .signals');
 // Scope and source details remain accessible, while the featured record stays compact.
 const note=signals.querySelector(':scope>.note');
 const placeNote=()=>{const details=$('catalogDetails').querySelector('.archive-history');if(details&&note&&!details.contains(note))details.append(note);};
 new MutationObserver(placeNote).observe($('catalogDetails'),{childList:true});placeNote();
 function nameArchiveLink(){const link=$('catalogDetails').querySelector('.archive-featured a');if(link)link.textContent='查看官方档案 ↗';}
 new MutationObserver(nameArchiveLink).observe($('catalogDetails'),{childList:true});nameArchiveLink();
 const controls=document.querySelector('.coedit-options');
 document.querySelectorAll('#createSection>.coedit-secondary-tools').forEach(row=>controls?.append(row));
 document.querySelectorAll('#createSection>.invite-join').forEach(row=>controls?.append(row));
 const desc=document.querySelector('#storm>.storm-heading p');if(desc)desc.textContent='你窗外的风，也许正经过远方家人的城市。';
 const input=$('latestStormQuery');if(input)input.placeholder='查询台风、风暴或家人所在城市';
}
refine().catch(console.error);
})();
