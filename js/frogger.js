const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const livesEl=document.getElementById('lives'),statusEl=document.getElementById('status');
const T=40,W=480,H=520,START=58,GOAL=1;
// Three campus districts with increasingly challenging obstacle patterns.
const rows={};
const specs=[];
function zone(top,bottom,types,speeds,counts){
  for(let r=top;r>=bottom;r--){
    const idx=top-r;
    const kind=types[idx%types.length];
    rows[r]=kind==='car'||kind==='bus'?'road':kind==='scooter'?'bike':kind==='person'?'walk':'safe';
    if(kind==='safe')continue;
    const dir=idx%2===0?1:-1;
    const speed=speeds[idx%speeds.length];
    const count=counts[idx%counts.length];
    // Distributed spacing; speed increases toward North Campus.
    const gap= W/count+45;
    specs.push([r,kind,speed,dir,Array.from({length:count},(_,i)=>i*gap-55-(idx%3)*23)]);
  }
}
// Longer four-district journey, with safe lanes and a central checkpoint.
zone(56,44,['car','safe','person','scooter','safe','bus','person','safe','car','scooter','safe','person','safe'],[43,0,31,47,0,36,34,0,47,51,0,36,0],[2,0,2,2,0,1,2,0,2,2,0,2,0]);
zone(42,28,['person','scooter','safe','car','person','safe','bus','person','scooter','safe','car','person','safe','scooter','safe'],[47,58,0,54,49,0,43,51,59,0,58,50,0,62,0],[2,2,0,2,2,0,1,2,2,0,2,2,0,2,0]);
zone(26,15,['scooter','person','car','safe','bus','person','safe','scooter','car','person','safe','bus'],[67,54,64,0,49,57,0,70,66,59,0,52],[2,2,2,0,1,2,0,2,2,2,0,1]);
zone(13,3,['person','scooter','car','safe','bus','scooter','person','safe','car','person','scooter'],[68,78,73,0,57,81,65,0,76,67,83],[2,2,2,0,1,2,2,0,2,2,2]);
for(const r of [58,57,43,27,14,2,1,0])rows[r]=r===1?'goal':'safe';
const CHECKPOINT=27;
const landmarkImages={};
for(const name of ['stadium','triangle','diag','fxb','robotics','home']){const img=new Image();img.src='img/frogger/'+name+'.png';landmarkImages[name]=img;}
function landmark(name,x,y,w=135,h=88){const img=landmarkImages[name];if(img.complete&&img.naturalWidth){ctx.drawImage(img,x,y,w,h);}else{rect(x,y,w,h,'#ab917b');text(name.toUpperCase(),x+5,y+15,11);}}
const collectibleTypes=[{kind:'pizza',points:150},{kind:'beer',points:100},{kind:'taco',points:200}];
const collectibleLocations=[[54,2,0],[48,9,1],[45,4,2],[40,7,0],[35,2,1],[30,9,2],[25,5,0],[21,10,1],[17,2,2],[12,8,0],[8,3,1],[5,9,2]];
let collectibles=[],score=0,found={pizza:0,beer:0,taco:0},checkpoint=false;
const widths={car:64,bus:104,scooter:32,person:23};
let lanes,cat,lives,won,invuln,camera,targetCamera,last=0,time=0,hop=0,hopFrom,hopTo,face='up',best;
let victoryTimeout = null;
function reset(){if(victoryTimeout !== null){clearTimeout(victoryTimeout);victoryTimeout=null;}document.getElementById('victoryOverlay').hidden=true;lanes=specs.map(([row,kind,speed,dir,xs],i)=>({row,kind,speed,dir,xs:[...xs],colors:['#d56772','#e6bb4b','#5c9fbc','#ddad50','#305fa3','#b24d68','#e0ad59','#608fb5'][i%8]}));cat={col:5,row:START};lives=5;won=false;score=0;found={pizza:0,beer:0,taco:0};checkpoint=false;collectibles=collectibleLocations.map(([row,col,type])=>({row,col,...collectibleTypes[type],taken:false}));invuln=0;camera=START*T-(H-75);targetCamera=camera;last=0;time=0;hop=0;best=START;face='up';statusEl.textContent='Start at Michigan Stadium. Collect snacks on the way!';hud();}
function hud(){livesEl.textContent='Lives: '+'♥'.repeat(lives)+'♡'.repeat(5-lives);document.getElementById('score').textContent='Score: '+score;document.getElementById('checkpoint').textContent=checkpoint?'✓ Diag checkpoint':'Checkpoint: Diag';}
function move(dx,dy){if(won||lives<=0||hop>0)return;let nc=Math.max(0,Math.min(11,cat.col+dx)),nr=Math.max(GOAL,Math.min(START,cat.row+dy));if(nc===cat.col&&nr===cat.row)return;hopFrom={...cat};hopTo={col:nc,row:nr};cat={...hopTo};hop=.18;face=dx<0?'left':dx>0?'right':dy>0?'down':'up';if(nr<best){best=nr;statusEl.textContent=nr<=14?'Ford Robotics ahead!':nr<=27?'North Campus — keep hopping!':nr<=43?'Central Campus — find the Diag!':'South Campus — keep hopping!';}
if(nr<=CHECKPOINT&&!checkpoint){checkpoint=true;statusEl.textContent='✓ Diag checkpoint unlocked!';hud();}
for(const item of collectibles){if(!item.taken&&item.row===nr&&item.col===nc){item.taken=true;score+=item.points;found[item.kind]++;statusEl.textContent=`${item.kind.toUpperCase()} +${item.points} points!`;hud();}}
if(nr===GOAL){won=true;statusEl.textContent='♥ Reunited at home! Happy Birthday!';completeFrogger();}}
function completeFrogger(){
  // Preserve the hub's existing progress structure and any completed missions.
  try {
    const key='birthdayMissionProgress';
    const saved=JSON.parse(localStorage.getItem(key)||'{}');
    const progress=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};
    progress.frogger=true;
    localStorage.setItem(key,JSON.stringify(progress));
  } catch (error) {
    console.warn('Unable to save Frogger progress:',error);
  }
  document.getElementById('finalScore').textContent=score.toLocaleString();
  document.getElementById('finalLives').textContent='♥'.repeat(lives)+'♡'.repeat(5-lives);
  document.getElementById('finalPizza').textContent='🍕 '+found.pizza;
  document.getElementById('finalBeer').textContent='🍺 '+found.beer;
  document.getElementById('finalTaco').textContent='🌮 '+found.taco;
  victoryTimeout=setTimeout(()=>{
    document.getElementById('victoryOverlay').hidden=false;
    document.querySelector('.victory-return').focus();
    victoryTimeout=null;
  },1100);
}
const keys={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],a:[-1,0],s:[0,1],d:[1,0]};
window.addEventListener('keydown',e=>{let k=keys[e.key];if(k){e.preventDefault();move(...k);}});
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>move(...({up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]})[b.dataset.dir])));
document.getElementById('restart').addEventListener('click',reset);
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function text(s,x,y,size=11,color='#fff4d5',align='left'){ctx.fillStyle=color;ctx.font=`bold ${size}px monospace`;ctx.textAlign=align;ctx.fillText(s,x,y);ctx.textAlign='left';}
function tree(x,y){rect(x+15,y+19,8,22,'#76533a');ctx.fillStyle='#234e40';ctx.beginPath();ctx.arc(x+19,y+17,19,0,Math.PI*2);ctx.fill();ctx.fillStyle='#387c57';ctx.beginPath();ctx.arc(x+14,y+11,14,0,Math.PI*2);ctx.fill();}
function building(x,y,w,h,name){rect(x+3,y+5,w,h,'#704e42');rect(x,y,w,h-7,'#b67c62');rect(x,y,w,7,'#d5b19b');for(let a=x+12;a<x+w-8;a+=23)for(let b=y+14;b<y+h-16;b+=20){rect(a,b,11,12,'#344e61');rect(a+5,b,1,12,'#d9b79d');}rect(x+w/2-9,y+h-24,18,18,'#443b39');text(name,x+w/2,y+11,8,'#fff0c9','center');}
function backdrop(){rect(0,0,W,H,'#467958');let first=Math.floor(camera/T),lastRow=Math.ceil((camera+H)/T);for(let r=Math.max(0,first);r<=Math.min(START,lastRow);r++){let y=r*T-camera,k=rows[r]||'safe';rect(0,y,W,T,k==='road'?'#434c55':k==='bike'?'#61766d':k==='walk'?'#c8a68c':k==='goal'?'#c8aa91':'#4b805d');if(k==='road'){for(let x=0;x<W;x+=90)rect(x+10,y+20,42,2,'#e6d6a7');}if(k==='bike'){for(let x=12;x<W;x+=90){rect(x,y+35,35,2,'#e7d78e');text('↔',x+5,y+25,18,'#d9e1ac');}}if(k==='walk'||k==='goal'){for(let x=0;x<W;x+=40){rect(x,y+2,38,1,'#a78975');rect(x+19,y+19,1,20,'#a78975');}}if(k==='safe'){for(let x=5;x<W;x+=35)rect(x+(r%3)*4,y+8,3,3,'#63946c');}}
// Landmark names are attached to the illustrated buildings, not painted on the road.
function at(r,fn){let y=r*T-camera;if(y>-160&&y<H+130)fn(y);}
function buildingSign(label,x,y,w,font=10){
 rect(x,y,w,17,'#213c50');rect(x+2,y+2,w-4,13,'#f2e8cb');
 text(label,x+w/2,y+12,font,'#233c4a','center');
}
at(57,y=>{landmark('stadium',2,y-89,158,100);buildingSign('MICHIGAN STADIUM',7,y-49,148,9);});
at(50,y=>{tree(5,y-10);tree(433,y-12);text('SOUTH CAMPUS',W/2,y+24,15,'#fff0be','center');});
at(44,y=>{tree(430,y-8);});
at(39,y=>{landmark('triangle',2,y-84,154,94);buildingSign('TRIANGLE',24,y-47,110,11);});
at(34,y=>{landmark('diag',340,y-83,136,93);buildingSign('THE DIAG',354,y-43,109,10);});
at(27,y=>{rect(0,y+5,W,30,'#5b7791');text('✓ DIAG CHECKPOINT',W/2,y+25,16,'#fff3b0','center');});
at(19,y=>{landmark('fxb',2,y-86,154,95);buildingSign('FXB',25,y-48,108,11);});
at(14,y=>{tree(4,y-7);tree(430,y-6);text('NORTH CAMPUS',W/2,y+24,15,'#fff0be','center');});
at(8,y=>{landmark('robotics',318,y-90,159,99);buildingSign('FORD ROBOTICS',324,y-52,146,10);});
at(1,y=>{landmark('home',110,y-103,260,140);});
}
function catSprite(x,y,grey=false,leap=0){ctx.save();ctx.translate(x+20,y+22-leap);let f=grey?'#999fa5':'#10131b',shade=grey?'#606872':'#2a2f3b';ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,17+leap,15,4,0,0,Math.PI*2);ctx.fill();
// Curled tail, oval body, four legs and triangular ears.
ctx.strokeStyle=f;ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(11,10);ctx.bezierCurveTo(27,17,23,-1,17,-1);ctx.stroke();
ctx.fillStyle=f;ctx.beginPath();ctx.ellipse(0,7,12,13,0,0,Math.PI*2);ctx.fill();
for(let side of [-1,1]){rect(side<0?-12:6,12+(leap?3:0),7,7,f);rect(side<0?-12:6,-1-(leap?4:0),7,8,f);}
ctx.beginPath();ctx.moveTo(-15,-8);ctx.lineTo(-15,-23);ctx.lineTo(-5,-17);ctx.lineTo(5,-17);ctx.lineTo(15,-23);ctx.lineTo(15,-8);ctx.quadraticCurveTo(15,6,0,6);ctx.quadraticCurveTo(-15,6,-15,-8);ctx.fill();
ctx.fillStyle='#c98798';ctx.beginPath();ctx.moveTo(-12,-18);ctx.lineTo(-12,-12);ctx.lineTo(-7,-15);ctx.moveTo(12,-18);ctx.lineTo(12,-12);ctx.lineTo(7,-15);ctx.fill();
for(let sx of [-1,1]){ctx.fillStyle=grey?'#d4e4b3':'#ffe246';ctx.beginPath();ctx.ellipse(sx*7,-7,4.3,5.1,0,0,Math.PI*2);ctx.fill();rect(sx*7-1,-11,2,7,'#161a1a');}
ctx.fillStyle='#edabb6';ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(3,0);ctx.lineTo(0,3);ctx.fill();ctx.strokeStyle=grey?'#34383f':'#d7d3c8';ctx.lineWidth=1;for(let s of [-1,1])for(let q of [-1,1]){ctx.beginPath();ctx.moveTo(s*4,1);ctx.lineTo(s*17,1+q*4);ctx.stroke();}
if(grey){ctx.strokeStyle='#3c444b';ctx.lineWidth=3;for(let xx of [-7,0,7]){ctx.beginPath();ctx.moveTo(xx,-19);ctx.lineTo(xx+1,-14);ctx.stroke();}for(let s of [-1,1])for(let yy of [6,11]){ctx.beginPath();ctx.moveTo(s*11,yy);ctx.lineTo(s*6,yy+2);ctx.stroke();}}ctx.restore();}
function gift(x,y){rect(x+5,y+8,30,26,'#e96983');rect(x+17,y+8,6,26,'#ffe08b');rect(x+2,y+5,36,9,'#ff9fb1');rect(x+17,y+5,6,9,'#ffe08b');rect(x+11,y,8,7,'#ffe08b');rect(x+22,y,8,7,'#ffe08b');}
function drawCollectible(item){let x=item.col*T+20,y=item.row*T-camera+20;if(y<-25||y>H+25)return;ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(-13,13,26,3);if(item.kind==='pizza'){ctx.fillStyle='#f3cf7a';ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(13,0);ctx.lineTo(-7,13);ctx.closePath();ctx.fill();ctx.strokeStyle='#b66d39';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(-7,13);ctx.stroke();ctx.fillStyle='#d55c51';for(let [a,b] of [[-4,-3],[4,1],[-3,7]]){ctx.beginPath();ctx.arc(a,b,3,0,7);ctx.fill();}}else if(item.kind==='beer'){rect(-9,-9,17,22,'#d7a34a');rect(-8,-13,17,6,'#f7f2d8');rect(-5,-16,12,5,'#fff7e2');ctx.strokeStyle='#e6d6a7';ctx.lineWidth=4;ctx.strokeRect(7,-5,7,13);rect(-4,-5,3,13,'#f8d17b');}else{ctx.fillStyle='#edc16a';ctx.beginPath();ctx.arc(0,1,14,Math.PI,0);ctx.lineTo(14,8);ctx.lineTo(-14,8);ctx.closePath();ctx.fill();rect(-12,-1,24,5,'#5b9c5a');rect(-9,3,18,5,'#b95d48');}ctx.restore();}
function obstacle(l,x){let y=l.row*T-camera,w=widths[l.kind];if(l.kind==='person'){rect(x+7,y+4,11,11,'#d8a582');rect(x+5,y+15,16,15,l.colors);rect(x+5,y+30,6,8,'#303b4c');rect(x+16,y+30,6,8,'#303b4c');rect(x+7,y+3,11,4,'#47372e');}else if(l.kind==='scooter'){rect(x+1,y+29,30,3,'#e6d85d');rect(x+25,y+10,3,21,'#dce5e7');rect(x+19,y+8,13,4,'#dce5e7');rect(x+2,y+30,9,7,'#1e2a35');rect(x+24,y+30,9,7,'#1e2a35');rect(x+14,y+14,9,12,'#b56e59');}else{rect(x,y+9,w,24,l.colors);rect(x+9,y+11,w-19,11,'#9dc6d0');for(let j=0;j<(l.kind==='bus'?3:2);j++)rect(x+12+j*24,y+12,16,8,'#547b90');rect(x+8,y+31,12,7,'#1e2732');rect(x+w-20,y+31,12,7,'#1e2732');}}
function collision(){if(invuln||won||lives<=0||hop>0)return;let cx=cat.col*T+20;for(let l of lanes)if(l.row===cat.row)for(let x of l.xs)if(cx+9>x+5&&cx-9<x+widths[l.kind]-5){lives--;hud();cat={col:5,row:checkpoint?CHECKPOINT:START};hop=0;invuln=1.4;statusEl.textContent=lives?(checkpoint?'Ouch! Respawned at the Diag checkpoint.':'Ouch! Back to Michigan Stadium.'):'Game over — try again!';return;}}
function frame(ms){let dt=Math.min((ms-last)/1000||0,.05);last=ms;time+=dt;if(!won&&lives>0){for(let l of lanes)for(let i=0;i<l.xs.length;i++){l.xs[i]+=l.speed*l.dir*dt;let w=widths[l.kind];if(l.dir>0&&l.xs[i]>W+35)l.xs[i]=-w-35;if(l.dir<0&&l.xs[i]<-w-35)l.xs[i]=W+35;}invuln=Math.max(0,invuln-dt);hop=Math.max(0,hop-dt);collision();}targetCamera=Math.max(0,Math.min(START*T-(H-75),cat.row*T-(H*.66)));camera+=(targetCamera-camera)*Math.min(1,dt*7);backdrop();for(let l of lanes)if(l.row*T-camera>-45&&l.row*T-camera<H+45)for(let x of l.xs)obstacle(l,x);for(const item of collectibles)if(!item.taken)drawCollectible(item);let gy=GOAL*T-camera;if(gy>-70&&gy<H+50){gift(5*T,gy);catSprite(6*T,gy,true,0);}let px=cat.col*T,py=cat.row*T-camera,leap=0;if(hop>0){let p=1-hop/.18;px=(hopFrom.col+(hopTo.col-hopFrom.col)*p)*T;py=(hopFrom.row+(hopTo.row-hopFrom.row)*p)*T-camera;leap=Math.sin(p*Math.PI)*19;}if(won){catSprite(5*T-34,gy,false,0);ctx.fillStyle='#f6a8bd';text('♥',5*T+16,gy-7,20,'#ffb6c9');}else if(invuln===0||Math.floor(time*8)%2===0)catSprite(px,py,false,leap);rect(0,0,W,27,'#142d43');text('ANN ARBOR • CAMPUS CAT CROSSING',12,18,12,'#f7d66c');text(`${START-best}/${START-GOAL}`,W-13,18,12,'#fff3d7','right');if(won||lives===0){rect(37,H/2-48,406,96,'#132c42');text(won?'HOME AT LAST!':'GAME OVER',W/2,H/2-7,24,'#ffe08b','center');text(won?`Score: ${score} | Pizza ${found.pizza}  Beer ${found.beer}  Tacos ${found.taco}`:'Press Restart to try again',W/2,H/2+23,12,'#fff','center');}requestAnimationFrame(frame);}
reset();requestAnimationFrame(frame);
