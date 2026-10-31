// Reward Retrieval: final birthday mission.
// Uses the same storage structure as mission.js.
const STORAGE_KEY = 'birthdayMissionProgress';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const scenes = ['briefing', 'decrypting', 'revealed', 'completed'];
let audioContext = null;
let soundEnabled = false;
let animationToken = 0;

function getProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch { return {}; }
}
function saveFinalComplete() {
  const progress = getProgress();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, final: true }));
}
function showScene(id) {
  scenes.forEach(scene => { $(scene).hidden = scene !== id; });
  $('connectionStatus').textContent = id === 'completed' ? 'MISSION COMPLETE' : id === 'revealed' ? 'LOCATION CONFIRMED' : id === 'decrypting' ? 'DECRYPTING' : 'CONNECTED';
}
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function beep(frequency = 540, duration = 0.08) {
  if (!soundEnabled) return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
  } catch { /* Audio is optional. */ }
}
$('soundToggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  $('soundToggle').textContent = `SOUND: ${soundEnabled ? 'ON' : 'OFF'}`;
  $('soundToggle').setAttribute('aria-pressed', String(soundEnabled));
  beep();
});

async function startBriefing() {
  const lines = [
    '[✓] Establishing secure connection...',
    '[✓] Agent identity verified: SIMPSON',
    '[✓] Final assignment authorized',
    '[!] High-value package detected'
  ];
  const token = ++animationToken;
  $('terminalLines').replaceChildren();
  $('briefingBody').hidden = true;
  showScene('briefing');
  for (const line of lines) {
    if (token !== animationToken) return;
    const el = document.createElement('div');
    el.textContent = line;
    $('terminalLines').appendChild(el);
    beep(520, 0.055);
    if (!REDUCED_MOTION) await delay(520);
  }
  if (token !== animationToken) return;
  $('briefingBody').hidden = false;
}

let decryptTimer = null;
function finishDecryption() {
  if (decryptTimer) { clearInterval(decryptTimer); decryptTimer = null; }
  $('decryptFill').style.width = '100%';
  $('decryptPercent').textContent = '100% COMPLETE';
  beep(740, .15);
  showScene('revealed');
  sessionStorage.setItem('birthdayFinalStage', 'revealed');
}
function startDecryption() {
  showScene('decrypting');
  sessionStorage.setItem('birthdayFinalStage', 'decrypting');
  $('decryptFill').style.width = '0%';
  const duration = REDUCED_MOTION ? 0 : 3200;
  if (!duration) { finishDecryption(); return; }
  const started = performance.now();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  decryptTimer = setInterval(() => {
    const pct = Math.min(100, Math.round((performance.now() - started) / duration * 100));
    $('decryptFill').style.width = `${pct}%`;
    $('decryptPercent').textContent = `${pct}% COMPLETE`;
    $('scrambleText').textContent = Array.from({length: 22}, (_, i) => i === 11 ? ' / ' : alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    $('decryptStatus').textContent = pct < 35 ? 'LOCATING PACKAGE...' : pct < 75 ? 'DECRYPTING DROP SITE...' : 'VERIFYING LOCATION...';
    if (pct === 100) finishDecryption();
  }, 65);
}
$('decryptButton').addEventListener('click', startDecryption);
$('skipDecrypt').addEventListener('click', finishDecryption);

function launchConfetti() {
  if (REDUCED_MOTION) return;
  const canvas = $('confetti');
  const ctx = canvas.getContext('2d');
  const colors = ['#f5c66b', '#57b9ff', '#66e3a0', '#f2f6ff', '#e78caa'];
  const width = window.innerWidth, height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pieces = Array.from({length: 125}, () => ({x: Math.random()*width, y: -Math.random()*height, vx: (Math.random()-.5)*3, vy: 2+Math.random()*3, size: 3+Math.random()*6, color: colors[Math.floor(Math.random()*colors.length)], angle: Math.random()*6}));
  const start = performance.now();
  function frame(now) {
    ctx.clearRect(0,0,width,height);
    for (const p of pieces) {p.x+=p.vx;p.y+=p.vy;p.angle+=.05;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65);ctx.restore();}
    if (now-start < 4500) requestAnimationFrame(frame); else ctx.clearRect(0,0,width,height);
  }
  requestAnimationFrame(frame);
}
function completeMission() {
  saveFinalComplete();
  sessionStorage.setItem('birthdayFinalStage', 'completed');
  showScene('completed');
  beep(880, .22);
  launchConfetti();
  window.scrollTo({top:0, behavior:REDUCED_MOTION?'instant':'smooth'});
}
$('securedButton').addEventListener('click', completeMission);

// Preserve the reveal if he refreshes, and preserve campaign completion permanently.
const savedStage = sessionStorage.getItem('birthdayFinalStage');
if (getProgress().final === true || savedStage === 'completed') {
  showScene('completed');
} else if (savedStage === 'revealed' || savedStage === 'decrypting') {
  showScene('revealed');
} else {
  startBriefing();
}
