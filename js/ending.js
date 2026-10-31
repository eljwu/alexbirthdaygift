const progressKey = 'birthdayMissionProgress';
let progress = {};
try { progress = JSON.parse(localStorage.getItem(progressKey) || '{}') || {}; } catch { progress = {}; }
const complete = progress.trivia === true && progress.frogger === true && progress.final === true;
document.getElementById(complete ? 'report' : 'locked').hidden = false;
function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const colors = ['#f5c66b','#57b9ff','#66e3a0','#f2f6ff','#e78caa'];
  const pieces = Array.from({length:125},()=>({x:Math.random()*w,y:-Math.random()*h,vx:(Math.random()-.5)*3,vy:2+Math.random()*3,a:Math.random()*6,s:3+Math.random()*6,c:colors[Math.floor(Math.random()*colors.length)]}));
  const start = performance.now();
  function frame(now){ctx.clearRect(0,0,w,h);for(const p of pieces){p.x+=p.vx;p.y+=p.vy;p.a+=.05;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.7);ctx.restore();}if(now-start<4300)requestAnimationFrame(frame);else ctx.clearRect(0,0,w,h);}
  requestAnimationFrame(frame);
}
if (complete) {
  document.getElementById('celebrateAgain').addEventListener('click',celebrate);
  celebrate();
}
