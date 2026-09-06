// ==========================================
// KOMDAT CYBER CTF: 7 STAGE INTERACTIVE OPERATIONS
// ==========================================
// 100% Interactive Gameplay (ZERO Multiple-Choice / Pilgan Questions)
// Every stage is a playable interactive mini-game / puzzle:
// Stage 1: Data Source - Bus Packet Injector (Tactile Slot Injection)
// Stage 2: Transmitter - Frequency & Modulation Tuner (Oscilloscope Dial)
// Stage 3: Medium - Fiber Optic Laser Reflector (Optical Mirror Rotation)
// Stage 4: Receiver - Noise & EMI Spike Filter (Tap to Eliminate Glitches)
// Stage 5: Arah Komunikasi - Duplex Gateway Switcher (Traffic Direction Router)
// Stage 6: Karakteristik - Jitter Buffer Timing Sync (Beat/Rhythm Calibration)
// Stage 7: Destination - Checksum Vault Handshake (Hash Verification)
// Features: Strict 1-Attempt Lock, Anti-Cheat Session Tokens, Web Audio Synth, Direct QR HP Link

// 1. CYBER WEB AUDIO SYNTHESIZER
let ctfAudioCtx = null;

function initCtfAudio() {
  if (!ctfAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      ctfAudioCtx = new AudioContextClass();
    }
  }
  if (ctfAudioCtx && ctfAudioCtx.state === 'suspended') {
    ctfAudioCtx.resume();
  }
}

function playCtfSFX(type) {
  try {
    initCtfAudio();
    if (!ctfAudioCtx) return;

    const osc = ctfAudioCtx.createOscillator();
    const gain = ctfAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(ctfAudioCtx.destination);

    const now = ctfAudioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'dial') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'win') {
      // Victory Chime C5 -> E5 -> G5 -> C6
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.09);
      osc.frequency.setValueAtTime(783.99, now + 0.18);
      osc.frequency.setValueAtTime(1046.50, now + 0.27);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    } else if (type === 'buzz') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (err) {
    console.log('Audio error:', err);
  }
}

// 2. CTF 7-STAGE GAME STATE
let ctfGame = {
  stage: 1, // 1 to 7 (8 is final debrief)
  score: 0,
  agentToken: "",
  stageLogs: [], // Records performance per stage

  // Stage 1: Bus Injector
  s1Slots: [null, null, null],
  s1Available: ['HEADER [0x01]', 'PAYLOAD [KOMDAT]', 'PARITY [CRC32]'],

  // Stage 2: Frequency Modulation Dial
  s2TargetFreq: 75,
  s2CurrentFreq: 30,

  // Stage 3: Fiber Optic Laser Prisms (3 mirrors)
  s3Prisms: [0, 0, 0], // Angles: 0, 90, 180, 270
  s3TargetAngles: [90, 180, 90],

  // Stage 4: Noise Filter Spikes
  s4Spikes: [true, true, true],

  // Stage 5: Duplex Gateway Router (3 traffic cases)
  s5Cases: [
    { title: "Siaran TV Digital (1 Arah Tanpa Feedback)", target: "simplex" },
    { title: "Radio HT Militer (Dua Arah Bergantian)", target: "half" },
    { title: "Panggilan Video Zoom (Dua Arah Serentak)", target: "full" }
  ],
  s5CurrentCaseIdx: 0,
  s5Points: 0,

  // Stage 6: Jitter Buffer Rhythm Calibration
  s6MarkerPos: 10,
  s6Direction: 1,
  s6HitsCount: 0,
  s6AnimId: null,

  // Stage 7: Destination Checksum Vault
  s7TargetHash: "0x7F2A",
  s7HashKeys: ["0x3B10", "0x7F2A", "0x89C4", "0x12E9"]
};

// Generate Random Agent Token
function generateAgentToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "AGENT-KOMDAT-";
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// 3. INITIALIZATION & RESTART
function initKomdatChallengeGame() {
  restartCtfGame();
}

function restartCtfGame() {
  if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);

  ctfGame.stage = 1;
  ctfGame.score = 0;
  ctfGame.agentToken = generateAgentToken();
  ctfGame.stageLogs = [];

  // Reset Stage 1
  ctfGame.s1Slots = [null, null, null];
  ctfGame.s1Available = ['HEADER [0x01]', 'PAYLOAD [KOMDAT]', 'PARITY [CRC32]'].sort(() => Math.random() - 0.5);

  // Reset Stage 2
  ctfGame.s2TargetFreq = Math.floor(Math.random() * 40) + 50; // 50 to 90 MHz
  ctfGame.s2CurrentFreq = 25;

  // Reset Stage 3
  ctfGame.s3Prisms = [0, 0, 0];
  ctfGame.s3TargetAngles = [90, 180, 90];

  // Reset Stage 4
  ctfGame.s4Spikes = [true, true, true];

  // Reset Stage 5
  ctfGame.s5CurrentCaseIdx = 0;
  ctfGame.s5Points = 0;

  // Reset Stage 6
  ctfGame.s6MarkerPos = 10;
  ctfGame.s6HitsCount = 0;

  // Reset Stage 7
  const hashPool = ["0x7F2A", "0xA94E", "0x5C19", "0xE47B", "0x2D88"];
  ctfGame.s7TargetHash = hashPool[Math.floor(Math.random() * hashPool.length)];
  const otherHashes = ["0x3B10", "0x89C4", "0x12E9", "0x6A32", "0xF011"].filter(h => h !== ctfGame.s7TargetHash);
  ctfGame.s7HashKeys = [ctfGame.s7TargetHash, otherHashes[0], otherHashes[1], otherHashes[2]].sort(() => Math.random() - 0.5);

  updateCtfStatsUI();
  renderCtfCurrentStage();
}

function updateCtfStatsUI() {
  const scoreElem = document.getElementById('arcadeScore');
  if (scoreElem) scoreElem.innerText = ctfGame.score;

  const comboElem = document.getElementById('arcadeCombo');
  if (comboElem) comboElem.innerText = `${Math.min(7, ctfGame.stage)}/7`;
}

// Router for 7 Stages
function renderCtfCurrentStage() {
  updateCtfStatsUI();
  if (ctfGame.stage === 1) renderStage1();
  else if (ctfGame.stage === 2) renderStage2();
  else if (ctfGame.stage === 3) renderStage3();
  else if (ctfGame.stage === 4) renderStage4();
  else if (ctfGame.stage === 5) renderStage5();
  else if (ctfGame.stage === 6) renderStage6();
  else if (ctfGame.stage === 7) renderStage7();
  else showFinalScoreboard();
}

// ==========================================
// STAGE 1: [SUMBER DATA] BUS PACKET INJECTOR
// ==========================================
function renderStage1() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 uppercase">
            STAGE 1/7 • DATA SOURCE: BUS PACKET INJECTOR
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Rakit Blok Data Mentah ke Bus Motherboard Komputer</h3>
          <p class="text-slate-400 text-xs font-sans">Sumber Data membangkitkan data mentah. Klik kartu di bawah untuk memasukkan blok ke Bus: [HEADER] ➔ [PAYLOAD] ➔ [PARITY].</p>
        </div>
        <span class="text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800 font-bold">
          Slot: ${ctfGame.s1Slots.filter(s => s !== null).length} / 3
        </span>
      </div>

      <!-- Bus Motherboard Slots -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
        <div class="text-[11px] text-slate-500 flex justify-between border-b border-slate-900 pb-1.5 font-bold">
          <span>DATA BUS CHANNEL 0x01</span>
          <span class="text-emerald-400">STATUS: MENUNGGU INJEKSI</span>
        </div>
        <div class="grid grid-cols-3 gap-3">
          ${[0, 1, 2].map(idx => `
            <div class="h-20 rounded-xl border-2 ${ctfGame.s1Slots[idx] ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20' : 'border-dashed border-slate-800 bg-slate-900/60'} flex flex-col items-center justify-center text-center p-2">
              <span class="text-[9px] text-slate-500 uppercase">Slot 0${idx + 1}</span>
              <span class="text-xs font-bold text-white mt-0.5">${ctfGame.s1Slots[idx] || '[ KOSONG ]'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Available Blocks to Click -->
      <div class="space-y-2 pt-1">
        <span class="text-xs text-slate-400 font-bold block">Pilih Blok Data (Klik untuk Injeksi ke Slot):</span>
        <div class="grid grid-cols-3 gap-2.5">
          ${ctfGame.s1Available.map(block => `
            <button onclick="injectBusBlock('${block}')" class="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-white font-bold text-xs transition cursor-pointer shadow-md text-center">
              ${block}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="stage1Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function injectBusBlock(block) {
  playCtfSFX('click');
  const emptyIdx = ctfGame.s1Slots.findIndex(s => s === null);
  if (emptyIdx === -1) return;

  ctfGame.s1Slots[emptyIdx] = block;
  ctfGame.s1Available = ctfGame.s1Available.filter(b => b !== block);
  renderStage1();

  // Check when 3 slots are filled
  if (ctfGame.s1Slots.every(s => s !== null)) {
    const isCorrect = (ctfGame.s1Slots[0].includes('HEADER') && ctfGame.s1Slots[1].includes('PAYLOAD') && ctfGame.s1Slots[2].includes('PARITY'));
    const earned = isCorrect ? 15 : 0;
    ctfGame.score += earned;
    ctfGame.stageLogs.push({ stage: 1, name: "Data Source Bus Injector", earned, max: 15 });

    const fb = document.getElementById('stage1Feedback');
    if (fb) {
      fb.className = isCorrect ? "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg" : "p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs";
      fb.innerHTML = isCorrect ? `✓ <strong>INJEKSI DATA BERHASIL (+15 PTS)!</strong> Paket siap dimodulasi di Transmitter.` : `✗ <strong>URUTAN KELIRU (0 PTS)!</strong> Header harus di awal dan Parity di akhir. Melaju ke Stage 2...`;
      if (isCorrect) playCtfSFX('win');
      else playCtfSFX('buzz');
    }

    setTimeout(() => {
      ctfGame.stage = 2;
      renderCtfCurrentStage();
    }, 1400);
  }
}

// ==========================================
// STAGE 2: [TRANSMITTER] FREQUENCY & MODULATION TUNER
// ==========================================
function renderStage2() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 uppercase">
            STAGE 2/7 • TRANSMITTER: CARRIER MODULATOR TUNING
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Tuning Frekuensi Gelombang Pembawa Sinyal</h3>
          <p class="text-slate-400 text-xs font-sans">Transmitter bertugas memodulasi data biner ke frekuensi perambatan fisik. Geser tuner agar sama dengan Target Resonansi!</p>
        </div>
        <span class="text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800 font-bold">
          TARGET: ${ctfGame.s2TargetFreq} MHz
        </span>
      </div>

      <!-- Waveform Simulation Visualizer Box -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-inner text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-900 pb-2">
          <span>OSCILLOSCOPE CARRIER FREQUENCY</span>
          <span id="s2CurrentFreqText" class="text-cyan-400 font-bold">${ctfGame.s2CurrentFreq} MHz</span>
        </div>

        <div class="w-full h-24 bg-[#040711] rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
          <canvas id="s2WaveCanvas" class="w-full h-full block"></canvas>
        </div>

        <!-- Frequency Tuner Slider & Steppers -->
        <div class="flex items-center justify-center gap-4 pt-1">
          <button onclick="adjustS2Freq(-5)" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs">- 5 MHz</button>
          <input type="range" id="s2Slider" min="20" max="100" value="${ctfGame.s2CurrentFreq}" oninput="onS2SliderChange(this.value)" class="w-64 accent-cyan-400 cursor-pointer" />
          <button onclick="adjustS2Freq(+5)" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs">+ 5 MHz</button>
        </div>
      </div>

      <!-- 1-Attempt Lock Button -->
      <div class="flex justify-between items-center pt-1 border-t border-slate-800">
        <span class="text-[11px] text-slate-500">1x Kesempatan transmisi. Pastikan frekuensi tepat sebelum mengunci!</span>
        <button onclick="commitStage2Modulation()" class="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/30 cursor-pointer">
          ⚡ TRANSMIT & KUNCI FREKUENSI
        </button>
      </div>

      <div id="stage2Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;

  drawS2Wave();
  if (window.lucide) window.lucide.createIcons();
}

function adjustS2Freq(delta) {
  playCtfSFX('dial');
  ctfGame.s2CurrentFreq = Math.max(20, Math.min(100, ctfGame.s2CurrentFreq + delta));
  const slider = document.getElementById('s2Slider');
  if (slider) slider.value = ctfGame.s2CurrentFreq;
  const txt = document.getElementById('s2CurrentFreqText');
  if (txt) txt.innerText = `${ctfGame.s2CurrentFreq} MHz`;
  drawS2Wave();
}

function onS2SliderChange(val) {
  playCtfSFX('dial');
  ctfGame.s2CurrentFreq = parseInt(val);
  const txt = document.getElementById('s2CurrentFreqText');
  if (txt) txt.innerText = `${ctfGame.s2CurrentFreq} MHz`;
  drawS2Wave();
}

function drawS2Wave() {
  const canvas = document.getElementById('s2WaveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth || 600;
  canvas.height = canvas.clientHeight || 96;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const midY = canvas.height / 2;

  // Target Ghost wave
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = midY + Math.sin(x * (ctfGame.s2TargetFreq / 600)) * 28;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Current User wave
  ctx.setLineDash([]);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = midY + Math.sin(x * (ctfGame.s2CurrentFreq / 600)) * 28;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function commitStage2Modulation() {
  const diff = Math.abs(ctfGame.s2CurrentFreq - ctfGame.s2TargetFreq);
  const isMatch = diff <= 5; // tolerance ±5 MHz
  const earned = isMatch ? 15 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 2, name: "Transmitter Modulation Tuner", earned, max: 15 });

  const fb = document.getElementById('stage2Feedback');
  if (fb) {
    fb.className = isMatch ? "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg" : "p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs";
    fb.innerHTML = isMatch ? `✓ <strong>MODULASI RESONAN TEPAT (+15 PTS)!</strong> Sinyal berhasil dipancarkan ke media kabel.` : `✗ <strong>FREKUENSI MISMATCH (${ctfGame.s2CurrentFreq} MHz vs ${ctfGame.s2TargetFreq} MHz) (0 PTS)!</strong> Melaju ke Stage 3...`;
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 3;
    renderCtfCurrentStage();
  }, 1400);
}

// ==========================================
// STAGE 3: [MEDIA TRANSMISI] FIBER OPTIC LASER REFLECTOR
// ==========================================
function renderStage3() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 uppercase">
            STAGE 3/7 • TRANSMISSION MEDIUM: FIBER OPTIC REFLECTOR
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Arahkan Pantulan Sinar Laser di Inti Serat Optik</h3>
          <p class="text-slate-400 text-xs font-sans">Kabel serat optik mentransmisikan data via pulsa cahaya (total internal reflection). Klik masing-masing prisma optik untuk memutar sudut hingga jalur tersambung!</p>
        </div>
      </div>

      <!-- Fiber Cable Optical Core Box -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden shadow-inner space-y-4">
        <div class="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-900 pb-2">
          <span class="text-cyan-400 font-bold">LASER DIODE TX (INPUT)</span>
          <span class="text-emerald-400 font-bold">PHOTO DETECTOR RX (OUTPUT)</span>
        </div>

        <div class="grid grid-cols-3 gap-4 py-2">
          ${[0, 1, 2].map(idx => `
            <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center space-y-2">
              <span class="text-[10px] text-slate-500 block">PRISMA OPTIK #${idx + 1}</span>
              <button onclick="rotateS3Prism(${idx})" class="w-16 h-16 rounded-2xl bg-indigo-950/60 border-2 border-indigo-400 text-cyan-300 font-bold text-lg mx-auto flex items-center justify-center transition-transform duration-200 cursor-pointer shadow-md hover:scale-105" style="transform: rotate(${ctfGame.s3Prisms[idx]}deg);">
                ▲
              </button>
              <span class="text-[11px] text-slate-400 block">${ctfGame.s3Prisms[idx]}°</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="flex justify-between items-center pt-1 border-t border-slate-800">
        <span class="text-[11px] text-slate-500">1x Tembakan laser. Hubungkan pantulan sudut sebelum menembak!</span>
        <button onclick="commitStage3Laser()" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 cursor-pointer">
          🚀 TEMBAKKAN PULSA LASER
        </button>
      </div>

      <div id="stage3Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function rotateS3Prism(idx) {
  playCtfSFX('click');
  ctfGame.s3Prisms[idx] = (ctfGame.s3Prisms[idx] + 90) % 360;
  renderStage3();
}

function commitStage3Laser() {
  playCtfSFX('laser');
  const isMatch = (ctfGame.s3Prisms[0] === ctfGame.s3TargetAngles[0] && ctfGame.s3Prisms[1] === ctfGame.s3TargetAngles[1] && ctfGame.s3Prisms[2] === ctfGame.s3TargetAngles[2]);
  const earned = isMatch ? 15 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 3, name: "Fiber Optic Laser Reflector", earned, max: 15 });

  const fb = document.getElementById('stage3Feedback');
  if (fb) {
    fb.className = isMatch ? "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg" : "p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs";
    fb.innerHTML = isMatch ? `✓ <strong>PANTULAN LASER SEMPURNA (+15 PTS)!</strong> Pulsa cahaya tiba di Photo Detector Receiver.` : `✗ <strong>SUDUT PRISMA TIDAK SELARAS (0 PTS)!</strong> Cahaya mengalami dispersi. Melaju ke Stage 4...`;
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 4;
    renderCtfCurrentStage();
  }, 1400);
}

// ==========================================
// STAGE 4: [PENERIMA] NOISE & EMI SPIKE FILTER
// ==========================================
function renderStage4() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 uppercase">
            STAGE 4/7 • RECEIVER: NOISE & PARITY DECODER
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Basmi Lonjakan Noise Merah pada Sinyal Masuk</h3>
          <p class="text-slate-400 text-xs font-sans">Penerima (Receiver) mendemodulasi sinyal dan memfilter distorsi/noise sebelum decoding bit. Klik 3 lonjakan noise merah ⚡ di bawah!</p>
        </div>
        <span class="text-xs text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800 font-bold">
          Sisa Noise: ${ctfGame.s4Spikes.filter(s => s).length} / 3
        </span>
      </div>

      <!-- Noise Filter Stage Canvas Box -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner space-y-4 text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 border-b border-slate-900 pb-2 font-bold">
          <span>RECEIVER DEMODULATOR FILTER BUS</span>
          <span class="text-cyan-400">KLIK SETIAP NOISE SPIKE UNTUK MEMBASMI</span>
        </div>

        <div class="grid grid-cols-3 gap-4 py-4">
          ${[0, 1, 2].map(idx => `
            <div class="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span class="text-[10px] text-slate-500">FILTER CH-${idx + 1}</span>
              ${ctfGame.s4Spikes[idx] ? `
                <button onclick="clearS4Spike(${idx})" class="w-16 h-16 rounded-full bg-rose-600/40 border-2 border-rose-500 text-rose-200 font-bold text-xl flex items-center justify-center hover:scale-125 transition-transform duration-150 cursor-pointer glow-pulse active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.9)]">
                  ⚡
                </button>
                <span class="text-[10px] text-rose-400 font-bold">NOISE SPIKE</span>
              ` : `
                <div class="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 font-bold text-xl flex items-center justify-center">
                  ✓
                </div>
                <span class="text-[10px] text-emerald-400 font-bold">CLEAN SIGNAL</span>
              `}
            </div>
          `).join('')}
        </div>
      </div>

      <div id="stage4Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function clearS4Spike(idx) {
  playCtfSFX('pop');
  ctfGame.s4Spikes[idx] = false;
  renderStage4();

  if (ctfGame.s4Spikes.every(s => !s)) {
    playCtfSFX('win');
    ctfGame.score += 15;
    ctfGame.stageLogs.push({ stage: 4, name: "Receiver Noise & Demodulator", earned: 15, max: 15 });

    const fb = document.getElementById('stage4Feedback');
    if (fb) {
      fb.className = "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg";
      fb.innerHTML = `✓ <strong>FILTER SELESAI (+15 PTS)!</strong> Receiver berhasil mengonversi sinyal bersih ke bit data biner.`;
    }

    setTimeout(() => {
      ctfGame.stage = 5;
      renderCtfCurrentStage();
    }, 1300);
  }
}

// ==========================================
// STAGE 5: [ARAH KOMUNIKASI] DUPLEX GATEWAY SWITCHER
// ==========================================
function renderStage5() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  const currentCase = ctfGame.s5Cases[ctfGame.s5CurrentCaseIdx];

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/40 uppercase">
            STAGE 5/7 • DIRECTION MODES: DUPLEX GATEWAY ROUTER
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Pilih Mode Arah Transmisi Sesuai Trafik Masuk</h3>
          <p class="text-slate-400 text-xs font-sans">Tekan tombol mode arah transmisi yang tepat untuk merutekan paket data komunikasi berikut!</p>
        </div>
        <span class="text-xs text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800 font-bold">
          Trafik: ${ctfGame.s5CurrentCaseIdx + 1} / 3
        </span>
      </div>

      <!-- Incoming Stream Challenge Card -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2 shadow-inner">
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PAKET TRAFIK MASUK</span>
        <h2 class="text-lg md:text-xl font-bold text-white leading-relaxed">"${currentCase.title}"</h2>
      </div>

      <!-- 3 Mode Buttons (1 attempt per case) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button onclick="commitS5Mode('simplex')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-indigo-500 text-white font-bold text-xs transition cursor-pointer text-center space-y-1 shadow-md">
          <div class="text-indigo-400 text-sm">SIMPLEX</div>
          <div class="text-[10px] text-slate-400">Satu Arah Sahaja</div>
        </button>

        <button onclick="commitS5Mode('half')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-sky-500 text-white font-bold text-xs transition cursor-pointer text-center space-y-1 shadow-md">
          <div class="text-sky-400 text-sm">HALF-DUPLEX</div>
          <div class="text-[10px] text-slate-400">Dua Arah Bergantian</div>
        </button>

        <button onclick="commitS5Mode('full')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-emerald-500 text-white font-bold text-xs transition cursor-pointer text-center space-y-1 shadow-md">
          <div class="text-emerald-400 text-sm">FULL-DUPLEX</div>
          <div class="text-[10px] text-slate-400">Dua Arah Serentak</div>
        </button>
      </div>

      <div id="stage5Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function commitS5Mode(chosenMode) {
  const currentCase = ctfGame.s5Cases[ctfGame.s5CurrentCaseIdx];
  const isMatch = (chosenMode === currentCase.target);

  if (isMatch) {
    playCtfSFX('win');
    ctfGame.s5Points += 5; // 3 cases x 5 = 15
  } else {
    playCtfSFX('buzz');
  }

  const fb = document.getElementById('stage5Feedback');
  if (fb) {
    fb.className = isMatch ? "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs" : "p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs";
    fb.innerHTML = isMatch ? `✓ <strong>ROUTING TEPAT (+5 PTS)!</strong>` : `✗ <strong>ROUTING KELIRU (0 PTS)!</strong>`;
  }

  setTimeout(() => {
    if (ctfGame.s5CurrentCaseIdx < ctfGame.s5Cases.length - 1) {
      ctfGame.s5CurrentCaseIdx++;
      renderStage5();
    } else {
      ctfGame.score += ctfGame.s5Points;
      ctfGame.stageLogs.push({ stage: 5, name: "Duplex Gateway Router", earned: ctfGame.s5Points, max: 15 });
      ctfGame.stage = 6;
      renderCtfCurrentStage();
    }
  }, 900);
}

// ==========================================
// STAGE 6: [KARAKTERISTIK] JITTER BUFFER TIMING SYNC
// ==========================================
function renderStage6() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 uppercase">
            STAGE 6/7 • DATA CHARACTERISTICS: JITTER BUFFER SYNC
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Stabilkan Fluktuasi Jeda Kedatangan Paket (Jitter)</h3>
          <p class="text-slate-400 text-xs font-sans">Jitter adalah variasi delay waktu kedatangan paket data. Tekan tombol [SYNC JITTER] saat kursor berada di Zona Hijau Tengah!</p>
        </div>
        <span class="text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800 font-bold">
          Sync Berhasil: ${ctfGame.s6HitsCount} / 3
        </span>
      </div>

      <!-- Moving Jitter Oscillation Bar -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner space-y-4 text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-900 pb-2">
          <span>JITTER FLUCTUATION WINDOW</span>
          <span class="text-emerald-400">TARGET: ZONA HIJAU (40% - 60%)</span>
        </div>

        <div class="w-full h-14 bg-[#040711] rounded-xl border border-slate-800 relative overflow-hidden flex items-center">
          <!-- Middle Green Sync Target Zone -->
          <div class="absolute left-[40%] w-[20%] h-full bg-emerald-500/20 border-x-2 border-emerald-500/60 flex items-center justify-center text-[9px] text-emerald-400 font-bold">
            BUFFER SYNC
          </div>
          <!-- Moving Indicator -->
          <div id="s6Marker" style="left: ${ctfGame.s6MarkerPos}%;" class="absolute w-6 h-10 bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(56,189,248,1)] transform -translate-x-1/2"></div>
        </div>

        <button onclick="tapS6Sync()" class="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 cursor-pointer">
          🎯 SYNC JITTER PAKET SEKARANG
        </button>
      </div>

      <div id="stage6Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;

  startS6Animation();
  if (window.lucide) window.lucide.createIcons();
}

function startS6Animation() {
  if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);

  function loop() {
    ctfGame.s6MarkerPos += ctfGame.s6Direction * 1.5;
    if (ctfGame.s6MarkerPos >= 92) ctfGame.s6Direction = -1;
    if (ctfGame.s6MarkerPos <= 8) ctfGame.s6Direction = 1;

    const marker = document.getElementById('s6Marker');
    if (marker) marker.style.left = `${ctfGame.s6MarkerPos}%`;

    if (ctfGame.stage === 6) {
      ctfGame.s6AnimId = requestAnimationFrame(loop);
    }
  }
  loop();
}

function tapS6Sync() {
  const isInside = (ctfGame.s6MarkerPos >= 40 && ctfGame.s6MarkerPos <= 60);

  if (isInside) {
    playCtfSFX('win');
    ctfGame.s6HitsCount++;
  } else {
    playCtfSFX('buzz');
  }

  renderStage6();

  if (ctfGame.s6HitsCount >= 3) {
    if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);
    ctfGame.score += 15;
    ctfGame.stageLogs.push({ stage: 6, name: "Jitter Buffer Timing Sync", earned: 15, max: 15 });

    const fb = document.getElementById('stage6Feedback');
    if (fb) {
      fb.className = "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg";
      fb.innerHTML = `✓ <strong>JITTER TERSTABILISASI (+15 PTS)!</strong> Variasi waktu kedatangan paket kembali sinkron.`;
    }

    setTimeout(() => {
      ctfGame.stage = 7;
      renderCtfCurrentStage();
    }, 1300);
  }
}

// ==========================================
// STAGE 7: [TUJUAN & AKURASI] DESTINATION CHECKSUM VAULT
// ==========================================
function renderStage7() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 uppercase">
            STAGE 7/7 • DESTINATION: CHECKSUM & ACCURACY HANDSHAKE
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Verifikasi Integritas Akurasi di Server Tujuan</h3>
          <p class="text-slate-400 text-xs font-sans">Karakteristik Akurasi memastikan data tidak rusak. Cocokkan Hash Kunci dengan Checksum Vault Database Tujuan!</p>
        </div>
      </div>

      <!-- Destination Vault Box -->
      <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner space-y-4 text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 border-b border-slate-900 pb-2">
          <span>DESTINATION DATABASE VAULT</span>
          <span class="text-amber-400 font-bold">CHECKSUM TARGET: ${ctfGame.s7TargetHash}</span>
        </div>

        <div class="text-xs text-slate-400">Pilih Kunci Hash yang identik untuk mengunci flag dan menyelesaikan audit:</div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          ${ctfGame.s7HashKeys.map(hash => `
            <button onclick="commitS7Hash('${hash}')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-cyan-400 text-white font-bold text-sm transition cursor-pointer text-center shadow-md">
              🔑 ${hash}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="stage7Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function commitS7Hash(chosenHash) {
  const isMatch = (chosenHash === ctfGame.s7TargetHash);
  const earned = isMatch ? 15 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 7, name: "Destination Checksum Vault", earned, max: 15 });

  const fb = document.getElementById('stage7Feedback');
  if (fb) {
    fb.className = isMatch ? "p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg" : "p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs";
    fb.innerHTML = isMatch ? `✓ <strong>INTEGRITAS DATA AKURAT (+15 PTS)!</strong> Paket tersimpan sempurna di Database Tujuan.` : `✗ <strong>HASH CORRUPTED (0 PTS)!</strong> Terdeteksi anomali bit. Mengunci hasil akhir...`;
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 8;
    renderCtfCurrentStage();
  }, 1400);
}

// ==========================================
// FINAL CTF SCOREBOARD & DEBRIEF
// ==========================================
function showFinalScoreboard() {
  playCtfSFX('win');
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  const totalScore = ctfGame.score;
  const scaledScore = Math.min(100, Math.round((totalScore / 105) * 100));

  let rank = "🎖️ CYBER ARCHITECT CTF CHAMPION";
  let rankDesc = "Sempurna! Anda berhasil menembus 7 tahapan gameplay operasional komunikasi data dengan kecakapan penuh!";
  let badgeColor = "from-emerald-400 via-cyan-400 to-indigo-400";

  if (scaledScore < 60) {
    rank = "⚠️ FIELD TECHNICIAN";
    rankDesc = "Misi selesai. Tinjau kembali mekanisme 5 komponen & karakteristik komunikasi data pada laporan audit.";
    badgeColor = "from-amber-400 to-rose-400";
  } else if (scaledScore < 85) {
    rank = "🛡️ NETWORK OPERATIONS SENTINEL";
    rankDesc = "Kecakapan tinggi! Pertahanan dan perakitan jaringan data Anda sangat solid!";
    badgeColor = "from-cyan-400 to-indigo-400";
  }

  container.innerHTML = `
    <div class="py-4 space-y-4 max-w-2xl mx-auto font-mono text-center select-none">
      <div class="w-16 h-16 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-emerald-500/20 text-cyan-400 rounded-3xl flex items-center justify-center mx-auto border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 glow-pulse">
        <i data-lucide="award" class="w-8 h-8"></i>
      </div>

      <div>
        <span class="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider">
          ${rank}
        </span>
        <h2 class="text-2xl font-black text-white mt-2">7 TAHAPAN CTF TUNTAS!</h2>
        <p class="text-slate-400 text-xs mt-1 font-sans">${rankDesc}</p>
      </div>

      <!-- Score Box -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
        <div class="flex justify-between items-center text-xs text-slate-500 border-b border-slate-900 pb-2">
          <span>AGENT TOKEN: <strong class="text-slate-300">${ctfGame.agentToken}</strong></span>
          <span class="text-emerald-400 font-bold">STATUS: 7/7 TAHAPAN VERIFIED</span>
        </div>
        <div class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${badgeColor} tracking-tight pt-1">
          ${scaledScore} <span class="text-lg font-bold text-slate-500">/ 100 PTS</span>
        </div>
      </div>

      <!-- Audit Breakdown -->
      <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
        <div class="text-xs font-bold text-cyan-300 border-b border-slate-800 pb-1">
          📋 LAPORAN KINERJA 7 TAHAPAN:
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          ${ctfGame.stageLogs.map(l => `
            <div class="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300">${l.stage}. ${l.name}</span>
              <span class="${l.earned > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">+${l.earned} Pts</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Replay Button -->
      <div class="pt-2 flex justify-center gap-3">
        <button onclick="restartCtfGame()" class="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Main Ulang (Sesi Agent Baru)
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// DIRECT GAME LINK QR CODE MODAL
// ==========================================
function openDirectGameQRModal() {
  const modal = document.getElementById('quizModal');
  if (!modal) return;

  const directGameURL = window.location.href.split('#')[0].split('?')[0] + '?game=1#slide6';

  modal.classList.remove('hidden');
  const quizBox = document.getElementById('quizBox');
  if (quizBox) {
    quizBox.innerHTML = `
      <div class="text-center py-6 space-y-4 font-mono">
        <div class="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/40 shadow-lg font-mono font-bold text-xl mx-auto flex items-center justify-center">
          📱
        </div>
        <div>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">QR Code: KomDat Cyber CTF (7 Tahapan)</h3>
          <p class="text-slate-400 text-xs mt-1 font-sans">Pindai QR ini di HP untuk langsung masuk ke mode game 7 tahapan tanpa melewati slide presentasi materi!</p>
        </div>

        <div class="flex flex-col items-center gap-2 py-2">
          <div id="directQRTarget" onclick="window.open('${directGameURL}', '_blank')" title="Klik untuk Buka Langsung Game di Tab Baru" class="p-3 bg-white rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform"></div>
          <span class="text-[11px] font-mono text-cyan-300">💡 Klik kotak QR di atas atau tombol di bawah untuk langsung membuka game di browser:</span>
        </div>

        <a href="${directGameURL}" target="_blank" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-cyan-600/30">
          <i data-lucide="external-link" class="w-4 h-4"></i> Buka Direct Game Link (Slide 6)
        </a>
      </div>
    `;
    const qrElem = document.getElementById('directQRTarget');
    if (qrElem && typeof QRCode !== 'undefined') {
      qrElem.innerHTML = '';
      new QRCode(qrElem, {
        text: directGameURL,
        width: 160,
        height: 160,
        colorDark: "#05070d",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  const btnNext = document.getElementById('btnNextQuiz');
  if (btnNext) {
    btnNext.innerText = "Tutup Modal QR";
    btnNext.onclick = () => closeDirectGameQRModal();
  }
  if (window.lucide) window.lucide.createIcons();
}

function closeDirectGameQRModal() {
  const modal = document.getElementById('quizModal');
  if (modal) modal.classList.add('hidden');
}

function toggleMobileQuizModal() {
  openDirectGameQRModal();
}
