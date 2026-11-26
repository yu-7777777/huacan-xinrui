(()=>{'use strict';
const W=900,H=500,rad=Math.PI/180;
let land=null,points=[],index=0,view=null,initial=null,signature='',drag=null;
const merc=lat=>Math.log(Math.tan(Math.PI/4+Math.max(-75,Math.min(75,lat))*rad/2))/rad;
function fit(p){let minX=Math.min(...p.map(x=>x.lon))-4,maxX=Math.max(...p.map(x=>x.lon))+4,minY=merc(Math.min(...p.map(x=>x.lat))-4),maxY=merc(Math.max(...p.map(x=>x.lat))+4);let cx=(minX+maxX)/2,cy=(minY+maxY)/2,sx=Math.max(28,maxX-minX),sy=Math.max(18,maxY-minY);if(sx/sy<W/H)sx=sy*W/H;else sy=sx*H/W;return {cx,cy,sx,sy};}
const xy=p=>[(p[0]-view.cx)/view.sx*W+W/2,H/2-(merc(p[1])-view.cy)/view.sy*H];
const finitePoint=p=>Number.isFinite(p[0])&&Number.isFinite(p[1]);
function ring(coords){return coords.filter(finitePoint).map((p,n)=>{let v=xy(p);return (n?'L':'M')+v[0].toFixed(1)+','+v[1].toFixed(1);}).join('')+'Z';}
const tileCache=new Map();
function terrain(){
 if(typeof Image==='undefined')return '';
 const z=Math.min(6,Math.max(2,Math.round(Math.log2(360/view.sx*900/256)))),n=2**z,step=360/n;
 const left=view.cx-view.sx/2,right=view.cx+view.sx/2,top=view.cy+view.sy/2,bottom=view.cy-view.sy/2;
 let out='';for(let x=Math.floor((left+180)/step);x<=Math.floor((right+180)/step);x++)for(let y=Math.max(0,Math.floor((180-top)/step));y<=Math.min(n-1,Math.floor((180-bottom)/step));y++){
  const url='https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+((x%n+n)%n);
  let tile=tileCache.get(url);if(!tile){tile=new Image();tileCache.set(url,tile);tile.onload=()=>requestAnimationFrame(draw);tile.src=url;}
  if(!tile.complete||!tile.naturalWidth)continue;
  const px=((x*step-180)-view.cx)/view.sx*W+W/2,py=H/2-((180-y*step)-view.cy)/view.sy*H;
  out+='<image href="'+url+'" x="'+px+'" y="'+py+'" width="'+(step/view.sx*W+.3)+'" height="'+(step/view.sy*H+.3)+'" preserveAspectRatio="none"/>';
 }return out;
}
function draw(){const svg=document.getElementById('fallback');if(!svg||!view||!points.length)return;
 const width=document.getElementById('map')?.getBoundingClientRect().width||W,textScale=Math.min(2.8,Math.max(1,W/width));
 let out='<defs><clipPath id="mapClip"><rect x="0" y="0" width="900" height="500" rx="16"/></clipPath><linearGradient id="seaTint" x2="0" y2="1"><stop stop-color="#b1d0dd"/><stop offset="1" stop-color="#c4dce3"/></linearGradient></defs><g clip-path="url(#mapClip)"><rect width="900" height="500" fill="url(#seaTint)"/>';
 if(land){for(const feature of land.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const polygon of polygons){const d=polygon.map(ring).join('');out+='<path d="'+d+'" fill="#a2b795" fill-rule="evenodd" stroke="#637f71" stroke-width="1.1"/>';}}}
 out+=terrain();
 for(let lon=80;lon<=180;lon+=10){const x=xy([lon,0])[0];if(x>10&&x<W-10)out+='<path d="M'+x+' 0V500" stroke="#779fad" opacity=".32"/><text x="'+(x+4)+'" y="466" class="map-graticule-label">'+lon+'°E</text>';}
 for(let lat=-10;lat<=60;lat+=10){const y=xy([0,lat])[1];if(y>25&&y<H-35)out+='<path d="M0 '+y+'H900" stroke="#779fad" opacity=".32"/><text x="8" y="'+(y-4)+'" class="map-graticule-label">'+Math.abs(lat)+'°'+(lat<0?'S':'N')+'</text>';}
 const labels=[['大陆',109,31,19],['台湾地区',122.7,23,15],['日本',139,37,17],['菲律宾',122.5,11,15],['朝鲜半岛',127,39,14],['越南',105.5,17,14],['南海',115,14,15],['西北太平洋',148,23,16]];
 for(const [name,lon,lat,size] of labels){const [x,y]=xy([lon,lat]);if(x>25&&x<W-65&&y>40&&y<H-45)out+='<text x="'+x+'" y="'+y+'" font-size="'+size*textScale+'" class="map-geography-label">'+name+'</text>';}
 const cities=[['香港',114.17,22.3,17,-12],['澳门',113.55,22.2,-45,23],['广州',113.26,23.13,-44,-15],['福州',119.3,26.08,-37,-12],['上海',121.47,31.23,-35,-12],['台北',121.56,25.04,13,-12]];
 for(const [name,lon,lat,dx,dy] of cities){if(width<450&&!['香港','澳门'].includes(name))continue;const [x,y]=xy([lon,lat]),ox=dx*textScale,oy=dy*textScale;if(x>40&&x<W-45&&y>55&&y<H-55)out+='<circle cx="'+x+'" cy="'+y+'" r="'+2.6*textScale+'" fill="#315b53"/><path d="M'+x+' '+y+'l'+ox+' '+oy+'" stroke="#637f71" stroke-width=".7"/><text x="'+(x+ox)+'" y="'+(y+oy-3)+'" font-size="'+12*textScale+'" class="map-geography-label">'+name+'</text>';}
 const path=p=>p.map(x=>xy([x.lon,x.lat]).map(v=>v.toFixed(1)).join(',')).join(' '),q=xy([points[index].lon,points[index].lat]);
 out+='<polyline points="'+path(points)+'" fill="none" stroke="#58a36b" stroke-width="3.5" stroke-linejoin="round"/><polyline points="'+path(points.slice(0,index+1))+'" fill="none" stroke="#165f5d" stroke-width="4" stroke-linejoin="round"/><circle cx="'+q[0]+'" cy="'+q[1]+'" r="8" fill="#c4513d" stroke="#fffdf0" stroke-width="3"/></g>';
 const sampled=points.filter((p,n)=>n%Math.max(1,Math.floor(points.length/16))===0||n===points.length-1);
 const dots=sampled.map(p=>{const [x,y]=xy([p.lon,p.lat]);return '<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff5c9" stroke="#338755" stroke-width="2.2"/>';}).join('');
 out=out.replace('</g>',dots+'<circle cx="'+q[0]+'" cy="'+q[1]+'" r="9" fill="#c43c27" stroke="#fff9d9" stroke-width="3"/></g>');
 const credit=document.getElementById('map')?.querySelector('.map-credit>span:last-child');if(credit)credit.innerHTML='<a href="https://www.esri.com/" target="_blank" rel="noopener">Esri · Maxar · Earthstar Geographics</a> / Natural Earth · NOAA';
 svg.setAttribute('viewBox','0 0 900 500');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.removeAttribute('hidden');svg.setAttribute('aria-label','台风历史路径地图，包含陆地、海岸线和地区标注');svg.innerHTML=out;
}
function controls(){const map=document.getElementById('map');if(!map||map.dataset.geography)return;map.dataset.geography='true';map.classList.add('bundled-map');map.querySelectorAll('.maplibregl-map,.maplibregl-control-container').forEach(el=>el.remove());
 map.insertAdjacentHTML('beforeend','<div class="map-legend"><span><i></i>已回放路径</span><span><i class="remaining"></i>完整轨迹</span><span><i class="current"></i>台风位置</span></div><div class="map-top-tools"><button type="button" aria-label="放大地图" data-map-zoom="in">＋</button><button type="button" aria-label="缩小地图" data-map-zoom="out">−</button><button type="button" class="map-fit" aria-label="查看完整台风路线" data-map-fit>完整路线</button></div><div class="map-credit"><span>地理底图 · 海岸线与位置标注</span><span><a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener">Natural Earth</a> · NOAA IBTrACS</span></div>');
 map.querySelectorAll('[data-map-zoom]').forEach(b=>b.onclick=()=>{if(!view)return;const f=b.dataset.mapZoom==='in'?.75:1.33;view.sx=Math.min(150,Math.max(4,view.sx*f));view.sy=view.sx*H/W;draw();});map.querySelector('[data-map-fit]').onclick=()=>{view={...initial};draw();};
 map.addEventListener('pointerdown',e=>{if(e.target.closest('button,a')||!view)return;drag={x:e.clientX,y:e.clientY,cx:view.cx,cy:view.cy};map.setPointerCapture(e.pointerId);});
 map.addEventListener('pointermove',e=>{if(!drag)return;const rect=map.getBoundingClientRect(),scale=Math.min(rect.width/W,rect.height/H);view.cx=drag.cx-(e.clientX-drag.x)/(scale*W)*view.sx;view.cy=drag.cy+(e.clientY-drag.y)/(scale*H)*view.sy;draw();});
 map.addEventListener('pointerup',()=>drag=null);map.addEventListener('pointercancel',()=>drag=null);
 // Keep the geographic position under the cursor fixed while zooming.
 map.addEventListener('wheel',e=>{if(!view||e.target.closest('button,a'))return;e.preventDefault();const rect=map.getBoundingClientRect(),scale=Math.min(rect.width/W,rect.height/H);if(!scale)return;const x=(e.clientX-rect.left-(rect.width-W*scale)/2)/scale,y=(e.clientY-rect.top-(rect.height-H*scale)/2)/scale;const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?rect.height:1),f=Math.exp(Math.max(-.35,Math.min(.35,delta*.0015))),sx=Math.min(150,Math.max(4,view.sx*f)),sy=sx*H/W;view.cx+=(x/W-.5)*(view.sx-sx);view.cy+=(.5-y/H)*(view.sy-sy);view.sx=sx;view.sy=sy;draw();},{passive:false});
}
window.TongpinMap={fit,render(p,i){if(!p?.length)return;points=p;index=Math.min(i,p.length-1);const key=[p.length,p[0].lon,p[0].lat,p.at(-1).lon,p.at(-1).lat].join('|');if(key!==signature){signature=key;view=fit(p);initial={...view};}controls();draw();},getReady:()=>!!land};
window.addEventListener?.('resize',draw);
fetch('land.json').then(r=>{if(!r.ok)throw Error('coastline');return r.json();}).then(data=>{land=data;draw();const notice=document.getElementById('mapNotice');if(notice)notice.textContent='地理底图与历史最佳路径 · 非实时预报';}).catch(()=>{const map=document.getElementById('map');if(map)map.insertAdjacentHTML('beforeend','<p class="map-status-error">海岸线资料暂未加载，请刷新重试。</p>');});
})();
