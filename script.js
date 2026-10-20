'use strict';
const menuButton=document.getElementById('menuButton');
const menu=document.getElementById('menu');
function toggleMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'✕  CLOSE':'☰  MENU';document.body.style.overflow=open?'hidden':'';}
menuButton.addEventListener('click',()=>toggleMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
const feedButton=document.getElementById('feedButton'),contactDetails=document.getElementById('contactDetails');
// Mobile: contact information is visible without feeding a cat.
const mobileContact=window.matchMedia('(max-width: 767px), (pointer: coarse)');
function syncContactMode(){if(mobileContact.matches){contactDetails.hidden=false;feedButton.hidden=true;feedButton.setAttribute('aria-expanded','true');}else{contactDetails.hidden=true;feedButton.hidden=false;feedButton.setAttribute('aria-expanded','false');feedButton.textContent='FEED CAT FOR CONTACT DETAILS ◌';}}
syncContactMode();
mobileContact.addEventListener('change',syncContactMode);
feedButton.addEventListener('click',()=>{const open=contactDetails.hidden;contactDetails.hidden=!open;feedButton.setAttribute('aria-expanded',String(open));feedButton.textContent=open?'CAT IS FED — CLOSE DETAILS':'FEED CAT FOR CONTACT DETAILS ◌';});
// Original Oneko sprite sheet, recreated with dependency-free JavaScript.
const cat=document.getElementById('oneko');
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !mobileContact.matches){
 let x=100,y=100,mx=100,my=100,tick=0,idle=0;
 const sprites={idle:[[-3,-3]],tired:[[-3,-2]],sleep:[[-2,0],[-2,-1]],N:[[-1,-2],[-1,-3]],NE:[[0,-2],[0,-3]],E:[[-3,0],[-3,-1]],SE:[[-5,-1],[-5,-2]],S:[[-6,-3],[-7,-2]],SW:[[-5,-3],[-6,-1]],W:[[-4,-2],[-4,-3]],NW:[[-1,0],[-1,-1]]};
 const sprite=(name,frame)=>{const frames=sprites[name]||sprites.idle;const [sx,sy]=frames[frame%frames.length];cat.style.backgroundPosition=`${sx*32}px ${sy*32}px`;};
 window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
 // The cat is a desktop-only interaction.
 // Start the cat in the visible viewport, including narrow mobile screens.
 x=Math.min(100,Math.max(16,innerWidth-16));
 y=Math.min(100,Math.max(16,innerHeight-16));
 cat.style.left=`${x-16}px`;cat.style.top=`${y-16}px`;
 window.setInterval(()=>{tick++;const dx=mx-x,dy=my-y,dist=Math.hypot(dx,dy);if(dist<48){idle++;if(idle>100){sprite(idle<108?'tired':'sleep',Math.floor(tick/4));}else sprite('idle',0);return;}idle=0;let direction='';if(dy< -dist*.5)direction='N';else if(dy>dist*.5)direction='S';if(dx>dist*.5)direction+='E';else if(dx< -dist*.5)direction+='W';sprite(direction||'idle',tick);const speed=Math.min(10,dist);x=Math.max(16,Math.min(innerWidth-16,x+dx/dist*speed));y=Math.max(16,Math.min(innerHeight-16,y+dy/dist*speed));cat.style.left=`${x-16}px`;cat.style.top=`${y-16}px`;},100);
}else{cat.hidden=true;}
mobileContact.addEventListener('change',()=>{cat.hidden=mobileContact.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches;});

// LineSidebar interaction, rewritten in plain JavaScript (no React dependency).
const sidebar=document.getElementById('lineSidebar');
if(sidebar){
 const items=[...sidebar.querySelectorAll('li')];
 const targets=items.map(()=>0),values=items.map(()=>0);
 let raf=null,last=0,active=-1;
 const smooth=p=>p*p*(3-2*p);
 function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;const k=1-Math.exp(-dt/.1);let moving=false;
  items.forEach((el,i)=>{const target=Math.max(targets[i],active===i?1:0);let v=values[i]+(target-values[i])*k;if(Math.abs(target-v)<.0015)v=target;else moving=true;values[i]=v;el.style.setProperty('--effect',v.toFixed(4));});
  raf=moving?requestAnimationFrame(frame):null;
 }
 function animate(){if(raf!==null)cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(frame);}
 sidebar.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;items.forEach((el,i)=>{const r=el.getBoundingClientRect();const d=Math.abs(e.clientY-(r.top+r.height/2));targets[i]=smooth(Math.max(0,1-d/100));});animate();});
 sidebar.addEventListener('pointerleave',()=>{targets.fill(0);animate();});
 items.forEach((el,i)=>el.querySelector('a').addEventListener('click',()=>{active=i;animate();}));
}
