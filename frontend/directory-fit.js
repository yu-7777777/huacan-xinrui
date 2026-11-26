(()=>{'use strict';
const header=document.querySelector('body>header');
function measure(){document.documentElement.style.setProperty('--directory-header-height',header.getBoundingClientRect().height+'px');}
function currentPage(){document.body.dataset.page=document.querySelector('.page:not([hidden])')?.id||'home';measure();}
const observer=new MutationObserver(currentPage);document.querySelectorAll('.page').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['hidden']}));
new ResizeObserver(measure).observe(header);window.addEventListener('resize',measure);currentPage();
})();
