// ==========================================
// KOMDAT CYBER CTF: 10 STAGE INTERACTIVE OPERATIONS
// ==========================================
// 100% Interactive Gameplay (ZERO Multiple-Choice / Pilgan Questions)
// Features:
// - Stage 6: DYNAMIC MOVING NOISE SPIKES (Spikes dart & bounce in real-time)
// - Leaderboard: REAL HUMAN USERS ONLY (Zero bots/seeds, live cloud sync)
// - Live Stopwatch Timer & Multi-Device Responsive (Mobile, Tablet, Desktop)
// - Synthesized Cyber SFX via Web Audio API

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
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'boost') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'win') {
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

// 2. CTF 10-STAGE GAME STATE
let ctfGame = {
  stage: 0, // 0: Pre-mission briefing, 1..10: Stages, 11: Debrief
  score: 0, // Accuracy points (max 100)
  playerName: '',
  agentToken: '',
  stageLogs: [],

  // Live Timer
  timerStartTime: null,
  timerInterval: null,
  elapsedSeconds: 0,
  timerDisplayStr: '00:00.0',

  // Stage 1: Bus Injector
  s1Slots: [null, null, null],
  s1Available: ['HEADER [0x01]', 'PAYLOAD [KOMDAT]', 'PARITY [CRC32]'],

  // Stage 2: Carrier Modulation Dial
  s2TargetFreq: 75,
  s2CurrentFreq: 30,

  // Stage 3: Mode Transmisi (Serial vs Parallel)
  s3Byte: '10110010',
  s3Scenarios: [
    { title: 'Bus Motherboard CPU-ke-RAM Jarak Dekat', targetMode: 'parallel', hint: 'Membutuhkan kecepatan ultra-tinggi multi-kabel serentak!' },
    { title: 'Kabel Jaringan Jarak Jauh Antar-Gedung', targetMode: 'serial', hint: 'Hemat kabel fisik, efisiensi tinggi, bebas skew bit!' }
  ],
  s3CurrentScenario: null,
  s3SelectedMode: null,

  // Stage 4: Fiber Optic Laser Prisms (3 mirrors)
  s4Prisms: [0, 0, 0],
  s4TargetAngles: [90, 180, 90],

  // Stage 5: Wireless RF Antenna Directional Lock
  s5TargetAngle: 120,
  s5CurrentAngle: 0,

  // Stage 6: DYNAMIC MOVING NOISE SPIKES
  s6Spikes: [],
  s6AnimId: null,

  // Stage 7: Duplex Gateway Router
  s7Cases: [
    { title: 'Siaran TV Digital & Radio FM (Satu Arah Sahaja)', target: 'simplex' },
    { title: 'Radio HT Walkie-Talkie (Dua Arah Bergantian)', target: 'half' },
    { title: 'Panggilan Video Zoom (Dua Arah Serentak)', target: 'full' }
  ],
  s7CurrentCaseIdx: 0,
  s7Points: 0,

  // Stage 8: Low-Latency QoS Accelerator
  s8PacketPos: 5,
  s8Speed: 1.5,
  s8Direction: 1,
  s8Latency: 35,
  s8AnimId: null,
  s8Committed: false,

  // Stage 9: Jitter Buffer Rhythm Calibration
  s9MarkerPos: 10,
  s9Direction: 1,
  s9HitsCount: 0,
  s9AnimId: null,

  // Stage 10: Destination Checksum Vault
  s10TargetHash: '0x7F2A',
  s10HashKeys: ['0x3B10', '0x7F2A', '0x89C4', '0x12E9']
};

function generateAgentToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'AGENT-';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function getRandomAgentName() {
  const names = ['CyberEagle', 'NetViper', 'ByteRanger', 'DataHunter', 'PacketGuard', 'GhostWire', 'NexusAgent', 'AlphaRoute'];
  return names[Math.floor(Math.random() * names.length)] + '_' + Math.floor(Math.random() * 900 + 100);
}

// 3. LIVE STOPWATCH TIMER
function startCtfTimer() {
  stopCtfTimer();
  ctfGame.timerStartTime = Date.now();
  ctfGame.timerInterval = setInterval(() => {
    const elapsedMs = Date.now() - ctfGame.timerStartTime;
    ctfGame.elapsedSeconds = elapsedMs / 1000;
    const mins = Math.floor(elapsedMs / 60000);
    const secs = Math.floor((elapsedMs % 60000) / 1000);
    const tenths = Math.floor((elapsedMs % 1000) / 100);
    ctfGame.timerDisplayStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
    
    const timerElem = document.getElementById('arcadeTimer');
    if (timerElem) timerElem.innerText = ctfGame.timerDisplayStr;
  }, 100);
}

function stopCtfTimer() {
  if (ctfGame.timerInterval) {
    clearInterval(ctfGame.timerInterval);
    ctfGame.timerInterval = null;
  }
  if (ctfGame.timerStartTime) {
    ctfGame.elapsedSeconds = (Date.now() - ctfGame.timerStartTime) / 1000;
  }
}

// 4. REAL-TIME CLOUD & LOCALSTORAGE LEADERBOARD (ZERO BOTS, REAL USERS ONLY)
const LEADERBOARD_KEY = 'komdat_ctf_real_leaderboard_v3';
const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a0778378632966';
const leaderboardChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('komdat_leaderboard_channel') : null;

if (leaderboardChannel) {
  leaderboardChannel.onmessage = (e) => {
    if (e.data && e.data.type === 'REFRESH_LEADERBOARD') {
      renderLeaderboardContent();
    }
  };
}

window.addEventListener('storage', (e) => {
  if (e.key === LEADERBOARD_KEY) {
    renderLeaderboardContent();
  }
});

function getLocalLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.log('Local leaderboard read error:', err);
  }
  return [];
}

async function fetchCloudLeaderboard() {
  try {
    const res = await fetch(CLOUD_SYNC_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.scores)) {
        return json.data.scores;
      }
    }
  } catch (err) {
    console.log('Cloud fetch offline / fallback:', err);
  }
  return null;
}

async function syncAndGetLeaderboard() {
  let localList = getLocalLeaderboard();
  const cloudList = await fetchCloudLeaderboard();

  if (cloudList) {
    const mergedMap = new Map();
    [...cloudList, ...localList].forEach(item => {
      const key = item.token || (item.name + '_' + item.timeSec);
      if (!mergedMap.has(key)) {
        mergedMap.set(key, item);
      }
    });

    const merged = Array.from(mergedMap.values());
    merged.sort((a, b) => b.totalScore !== a.totalScore ? b.totalScore - a.totalScore : a.timeSec - b.timeSec);
    const ranked = merged.slice(0, 20).map((it, idx) => ({ ...it, rank: idx + 1 }));

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(ranked));
    } catch(e) {}

    return ranked;
  }

  localList.sort((a, b) => b.totalScore !== a.totalScore ? b.totalScore - a.totalScore : a.timeSec - b.timeSec);
  return localList.map((it, idx) => ({ ...it, rank: idx + 1 }));
}

async function saveScoreToLeaderboard(entry) {
  try {
    let list = getLocalLeaderboard();
    list.push(entry);
    list.sort((a, b) => b.totalScore !== a.totalScore ? b.totalScore - a.totalScore : a.timeSec - b.timeSec);
    const top20 = list.slice(0, 20).map((item, idx) => ({ ...item, rank: idx + 1 }));
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top20));

    if (leaderboardChannel) {
      leaderboardChannel.postMessage({ type: 'REFRESH_LEADERBOARD' });
    }

    // Push to cloud sync endpoint asynchronously
    fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'KOMDAT_CTF_LEADERBOARD', data: { scores: top20 } })
    }).catch(err => console.log('Cloud sync upload error:', err));

    return top20;
  } catch (err) {
    console.log('Error saving score:', err);
    return [];
  }
}

function resetLeaderboardData() {
  if (confirm('Yakin ingin mereset seluruh data riwayat skor pada perangkat ini?')) {
    localStorage.removeItem(LEADERBOARD_KEY);
    fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'KOMDAT_CTF_LEADERBOARD', data: { scores: [] } })
    }).catch(() => {});

    renderLeaderboardContent();
  }
}

function openLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderLeaderboardContent();
  }
  if (window.lucide) window.lucide.createIcons();
}

function closeLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) modal.classList.add('hidden');
}

async function renderLeaderboardContent() {
  const container = document.getElementById('leaderboardContent');
  if (!container) return;

  let list = getLocalLeaderboard();
  renderLeaderboardRows(container, list);

  const syncedList = await syncAndGetLeaderboard();
  renderLeaderboardRows(container, syncedList);
}

function renderLeaderboardRows(container, list) {
  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="py-10 text-center space-y-3 font-mono">
        <div class="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30 text-2xl">
          🛡️
        </div>
        <div>
          <h4 class="text-sm font-bold text-white uppercase tracking-wider">Belum Ada Agen yang Menyelesaikan Misi</h4>
          <p class="text-slate-400 text-xs mt-1 max-w-sm mx-auto font-sans leading-relaxed">
            Papan peringkat bersih tanpa bot/data palsu. Siapapun yang mengakses dan menuntaskan 10 tahapan CTF akan otomatis tercatat di sini!
          </p>
        </div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Mode Pengguna Asli Terverifikasi (Zero Bots)
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-2 font-mono">
      <div class="flex items-center justify-between px-2 pb-1 border-b border-slate-800 text-[10px] text-slate-400">
        <span class="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Cloud Sync (Real Users)
        </span>
        <span>Total Pemain: ${list.length}</span>
      </div>

      <div class="grid grid-cols-12 text-[10px] text-slate-500 font-bold px-3 py-1 border-b border-slate-800">
        <span class="col-span-2">POS</span>
        <span class="col-span-4">AGEN ASLI</span>
        <span class="col-span-2 text-center">AKURASI</span>
        <span class="col-span-2 text-center">WAKTU</span>
        <span class="col-span-2 text-right">TOTAL</span>
      </div>

      ${list.map((item, idx) => {
        const rankNum = idx + 1;
        let badge = `#${rankNum}`;
        let rowBg = 'bg-slate-900/60 border-slate-800/80';
        let rankColor = 'text-slate-400 font-bold';

        if (rankNum === 1) {
          badge = '🥇 #1';
          rowBg = 'bg-amber-500/10 border-amber-500/40 shadow-sm';
          rankColor = 'text-amber-400 font-extrabold';
        } else if (rankNum === 2) {
          badge = '🥈 #2';
          rowBg = 'bg-slate-300/10 border-slate-300/40';
          rankColor = 'text-slate-200 font-extrabold';
        } else if (rankNum === 3) {
          badge = '🥉 #3';
          rowBg = 'bg-orange-500/10 border-orange-500/40';
          rankColor = 'text-orange-300 font-extrabold';
        }

        const isCurrent = ctfGame.playerName && (item.name === ctfGame.playerName || item.token === ctfGame.agentToken);
        if (isCurrent) {
          rowBg += ' ring-2 ring-cyan-400';
        }

        return `
          <div class="grid grid-cols-12 items-center px-3 py-2.5 rounded-xl border ${rowBg} text-xs transition hover:border-indigo-500/50">
            <div class="col-span-2 ${rankColor}">${badge}</div>
            <div class="col-span-4 truncate font-bold text-white flex flex-col">
              <span class="truncate flex items-center gap-1.5">
                ${item.name}
                <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-bold border border-emerald-500/40">USER</span>
              </span>
              <span class="text-[9px] text-slate-500 font-mono">${item.device || 'User'} • ${item.token || ''} • ${item.date || ''}</span>
            </div>
            <div class="col-span-2 text-center text-emerald-400 font-bold">${item.accuracy} Pts</div>
            <div class="col-span-2 text-center text-amber-300 font-mono text-[11px]">${item.timeStr}</div>
            <div class="col-span-2 text-right font-black text-cyan-400 text-sm">${item.totalScore}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 5. INITIALIZATION & RESTART
function initKomdatChallengeGame() {
  restartCtfGame();
}

function restartCtfGame() {
  if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);
  if (ctfGame.s8AnimId) cancelAnimationFrame(ctfGame.s8AnimId);
  if (ctfGame.s9AnimId) cancelAnimationFrame(ctfGame.s9AnimId);
  stopCtfTimer();

  ctfGame.stage = 0;
  ctfGame.score = 0;
  ctfGame.agentToken = generateAgentToken();
  if (!ctfGame.playerName) ctfGame.playerName = getRandomAgentName();
  ctfGame.stageLogs = [];
  ctfGame.elapsedSeconds = 0;
  ctfGame.timerDisplayStr = '00:00.0';

  // Reset Stage 1
  ctfGame.s1Slots = [null, null, null];
  ctfGame.s1Available = ['HEADER [0x01]', 'PAYLOAD [KOMDAT]', 'PARITY [CRC32]'].sort(() => Math.random() - 0.5);

  // Reset Stage 2
  ctfGame.s2TargetFreq = Math.floor(Math.random() * 40) + 50;
  ctfGame.s2CurrentFreq = 25;

  // Reset Stage 3
  ctfGame.s3CurrentScenario = ctfGame.s3Scenarios[Math.floor(Math.random() * ctfGame.s3Scenarios.length)];
  ctfGame.s3SelectedMode = null;

  // Reset Stage 4
  ctfGame.s4Prisms = [0, 0, 0];
  ctfGame.s4TargetAngles = [90, 180, 90];

  // Reset Stage 5
  ctfGame.s5TargetAngle = [45, 90, 135, 180, 225, 270][Math.floor(Math.random() * 6)];
  ctfGame.s5CurrentAngle = 0;

  // Reset Stage 6: Initialize 4 moving noise spikes
  initS6MovingSpikes();

  // Reset Stage 7
  ctfGame.s7CurrentCaseIdx = 0;
  ctfGame.s7Points = 0;

  // Reset Stage 8
  ctfGame.s8PacketPos = 5;
  ctfGame.s8Latency = 35;
  ctfGame.s8Committed = false;

  // Reset Stage 9
  ctfGame.s9MarkerPos = 10;
  ctfGame.s9HitsCount = 0;

  // Reset Stage 10
  const hashPool = ['0x7F2A', '0xA94E', '0x5C19', '0xE47B', '0x2D88'];
  ctfGame.s10TargetHash = hashPool[Math.floor(Math.random() * hashPool.length)];
  const otherHashes = ['0x3B10', '0x89C4', '0x12E9', '0x6A32', '0xF011'].filter(h => h !== ctfGame.s10TargetHash);
  ctfGame.s10HashKeys = [ctfGame.s10TargetHash, otherHashes[0], otherHashes[1], otherHashes[2]].sort(() => Math.random() - 0.5);

  updateCtfStatsUI();
  renderPreMissionBriefing();
}

function updateCtfStatsUI() {
  const scoreElem = document.getElementById('arcadeScore');
  if (scoreElem) scoreElem.innerText = ctfGame.score;

  const comboElem = document.getElementById('arcadeCombo');
  if (comboElem) comboElem.innerText = `${Math.min(10, Math.max(1, ctfGame.stage))}/10`;

  const timerElem = document.getElementById('arcadeTimer');
  if (timerElem) timerElem.innerText = ctfGame.timerDisplayStr;
}

// ROUTER FOR STAGES
function renderCtfCurrentStage() {
  updateCtfStatsUI();
  if (ctfGame.stage === 0) renderPreMissionBriefing();
  else if (ctfGame.stage === 1) renderStage1();
  else if (ctfGame.stage === 2) renderStage2();
  else if (ctfGame.stage === 3) renderStage3();
  else if (ctfGame.stage === 4) renderStage4();
  else if (ctfGame.stage === 5) renderStage5();
  else if (ctfGame.stage === 6) renderStage6();
  else if (ctfGame.stage === 7) renderStage7();
  else if (ctfGame.stage === 8) renderStage8();
  else if (ctfGame.stage === 9) renderStage9();
  else if (ctfGame.stage === 10) renderStage10();
  else showFinalScoreboard();
}

// ==========================================
// PRE-MISSION BRIEFING & NAME INPUT
// ==========================================
function renderPreMissionBriefing() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="py-4 space-y-5 max-w-xl mx-auto font-mono text-center select-none">
      <div class="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 glow-pulse">
        <i data-lucide="shield" class="w-8 h-8"></i>
      </div>

      <div>
        <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold uppercase tracking-widest">
          OPERATION PACKET DEFENDER
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-white mt-2">KomDat Cyber CTF: 10 Tahapan</h2>
        <p class="text-slate-400 text-xs mt-1.5 font-sans leading-relaxed">
          Uji pemahaman komprehensif sistem komunikasi data melalui 10 tahapan taktil interaktif (100% puzzle operasional, tanpa soal pilihan ganda).
        </p>
      </div>

      <!-- Agent Call Sign Input Card -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-left shadow-inner">
        <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>CALL SIGN / NAMA AGEN ASLI:</span>
          <span class="text-cyan-400 text-[11px] font-mono">TOKEN: ${ctfGame.agentToken}</span>
        </label>
        <div class="flex gap-2">
          <input type="text" id="inputAgentName" value="${ctfGame.playerName}" maxlength="18" placeholder="Ketik nama asli / panggilan..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-cyan-400" />
          <button onclick="randomizeAgentName()" class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer" title="Acak Nama">
            🎲 Acak
          </button>
        </div>
      </div>

      <!-- Operational Mission Rules -->
      <div class="grid grid-cols-3 gap-2 text-left text-[11px]">
        <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div class="text-emerald-400 font-bold">10 STAGES</div>
          <div class="text-slate-400 text-[10px] mt-0.5">Komponen & Karakteristik Komdat</div>
        </div>
        <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div class="text-amber-400 font-bold">1x ATTEMPT</div>
          <div class="text-slate-400 text-[10px] mt-0.5">Anti-Spam & Anti Trial-Error</div>
        </div>
        <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div class="text-cyan-400 font-bold">LIVE TIMER</div>
          <div class="text-slate-400 text-[10px] mt-0.5">Skor Akurasi + Waktu Cepat</div>
        </div>
      </div>

      <!-- Solid Cyber Start Button (No Gradient) -->
      <div class="pt-2">
        <button onclick="startMissionFromBriefing()" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/50 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-emerald-950/60 cursor-pointer flex items-center justify-center gap-2.5 mx-auto active:scale-95">
          <i data-lucide="play" class="w-4 h-4 fill-white"></i> MULAI OPERASI CYBER CTF SEKARANG
        </button>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function randomizeAgentName() {
  playCtfSFX('dial');
  ctfGame.playerName = getRandomAgentName();
  const input = document.getElementById('inputAgentName');
  if (input) input.value = ctfGame.playerName;
}

function startMissionFromBriefing() {
  const input = document.getElementById('inputAgentName');
  if (input && input.value.trim()) {
    ctfGame.playerName = input.value.trim().substring(0, 18);
  }
  playCtfSFX('win');
  startCtfTimer();
  ctfGame.stage = 1;
  renderCtfCurrentStage();
}

// ==========================================
// STAGE 1: [SUMBER DATA] BUS PACKET ASSEMBLER
// ==========================================
function renderStage1() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 uppercase">
            STAGE 1/10 • DATA SOURCE: BUS PACKET ASSEMBLER
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Rakit Blok Data Mentah ke Jalur Bus Motherboard</h3>
          <p class="text-slate-400 text-xs font-sans">Sumber Data membangkitkan data mentah. Klik kartu di bawah untuk memasukkan blok ke Bus: [HEADER] ➔ [PAYLOAD] ➔ [PARITY].</p>
        </div>
        <span class="text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800 font-bold">
          Slot: ${ctfGame.s1Slots.filter(s => s !== null).length} / 3
        </span>
      </div>

      <!-- Animated Bus Motherboard Slots -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-inner relative overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bus-flow"></div>
        <div class="text-[11px] text-slate-500 flex justify-between border-b border-slate-900 pb-1.5 font-bold">
          <span>DATA BUS CHANNEL 0x01</span>
          <span class="text-emerald-400">STATUS: READY FOR INJECTION</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${[0, 1, 2].map(idx => `
            <div class="h-20 rounded-xl border-2 ${ctfGame.s1Slots[idx] ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20' : 'border-dashed border-slate-800 bg-slate-900/60'} flex flex-col items-center justify-center text-center p-2 transition-all">
              <span class="text-[9px] text-slate-500 uppercase">Slot 0${idx + 1}</span>
              <span class="text-xs font-bold text-white mt-0.5">${ctfGame.s1Slots[idx] || '[ KOSONG ]'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Available Blocks -->
      <div class="space-y-2 pt-1">
        <span class="text-xs text-slate-400 font-bold block">Pilih Blok Data (Klik untuk Injeksi ke Bus):</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          ${ctfGame.s1Available.map(block => `
            <button onclick="injectBusBlock('${block}')" class="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400 text-white font-bold text-xs transition cursor-pointer shadow-md text-center active:scale-95">
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

  if (ctfGame.s1Slots.every(s => s !== null)) {
    const isCorrect = (ctfGame.s1Slots[0].includes('HEADER') && ctfGame.s1Slots[1].includes('PAYLOAD') && ctfGame.s1Slots[2].includes('PARITY'));
    const earned = isCorrect ? 10 : 0;
    ctfGame.score += earned;
    ctfGame.stageLogs.push({ stage: 1, name: 'Data Source Bus Injector', earned, max: 10 });

    const fb = document.getElementById('stage1Feedback');
    if (fb) {
      fb.className = isCorrect ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
      fb.innerHTML = isCorrect ? '✓ <strong>INJEKSI DATA BERHASIL (+10 PTS)!</strong> Paket siap dimodulasi di Transmitter.' : '✗ <strong>URUTAN KELIRU (0 PTS)!</strong> Header harus di awal dan Parity di akhir. Melaju ke Stage 2...';
      if (isCorrect) playCtfSFX('win');
      else playCtfSFX('buzz');
    }

    setTimeout(() => {
      ctfGame.stage = 2;
      renderCtfCurrentStage();
    }, 1300);
  }
}

// ==========================================
// STAGE 2: [TRANSMITTER] CARRIER MODULATION RESONATOR
// ==========================================
function renderStage2() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 uppercase">
            STAGE 2/10 • TRANSMITTER: CARRIER MODULATOR
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Tuning Frekuensi Gelombang Pembawa Sinyal</h3>
          <p class="text-slate-400 text-xs font-sans">Transmitter bertugas memodulasi data biner ke frekuensi perambatan fisik. Sesuaikan tuner agar sama dengan Target Resonansi!</p>
        </div>
        <span class="text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800 font-bold">
          TARGET: ${ctfGame.s2TargetFreq} MHz
        </span>
      </div>

      <!-- Live Oscilloscope Visualizer Box -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-inner text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-900 pb-2">
          <span>OSCILLOSCOPE CARRIER FREQUENCY</span>
          <span id="s2CurrentFreqText" class="text-cyan-400 font-bold">${ctfGame.s2CurrentFreq} MHz</span>
        </div>

        <div class="w-full h-24 sm:h-28 bg-[#040711] rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
          <canvas id="s2WaveCanvas" class="w-full h-full block"></canvas>
        </div>

        <!-- Frequency Steppers & Range Slider -->
        <div class="flex items-center justify-center gap-3 pt-1">
          <button onclick="adjustS2Freq(-5)" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs active:scale-95">- 5 MHz</button>
          <input type="range" id="s2Slider" min="20" max="100" value="${ctfGame.s2CurrentFreq}" oninput="onS2SliderChange(this.value)" class="w-48 sm:w-64 accent-cyan-400 cursor-pointer" />
          <button onclick="adjustS2Freq(+5)" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs active:scale-95">+ 5 MHz</button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1 border-t border-slate-800">
        <span class="text-[11px] text-slate-500">1x Kesempatan transmisi. Toleransi resonansi ±5 MHz.</span>
        <button onclick="commitStage2Modulation()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95">
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
  canvas.height = canvas.clientHeight || 110;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const midY = canvas.height / 2;

  // Target Ghost wave
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = midY + Math.sin(x * (ctfGame.s2TargetFreq / 600)) * 30;
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
    const y = midY + Math.sin(x * (ctfGame.s2CurrentFreq / 600)) * 30;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function commitStage2Modulation() {
  const diff = Math.abs(ctfGame.s2CurrentFreq - ctfGame.s2TargetFreq);
  const isMatch = diff <= 5;
  const earned = isMatch ? 10 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 2, name: 'Transmitter Carrier Resonator', earned, max: 10 });

  const fb = document.getElementById('stage2Feedback');
  if (fb) {
    fb.className = isMatch ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isMatch ? `✓ <strong>MODULASI RESONAN TEPAT (+10 PTS)!</strong> Sinyal berhasil dipancarkan dengan gelombang pembawa stabil.` : `✗ <strong>FREKUENSI MISMATCH (${ctfGame.s2CurrentFreq} MHz vs ${ctfGame.s2TargetFreq} MHz) (0 PTS)!</strong> Melaju ke Stage 3...`;
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 3;
    renderCtfCurrentStage();
  }, 1300);
}

// ==========================================
// STAGE 3: [MODE TRANSMISI] SERIAL VS PARALLEL CLOCK DISTRIBUTOR
// ==========================================
function renderStage3() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  const scn = ctfGame.s3CurrentScenario;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/40 uppercase">
            STAGE 3/10 • TRANSMISSION MODE: SERIAL VS PARALLEL
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Konfigurasi Mode Pengiriman 8-Bit Data Bus</h3>
          <p class="text-slate-400 text-xs font-sans">Tentukan mode transmisi yang paling sesuai dengan karakteristik kebutuhan arsitektur jaringan berikut!</p>
        </div>
        <span class="text-xs text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800 font-bold">
          REGISTER: ${ctfGame.s3Byte}
        </span>
      </div>

      <!-- Scenario Briefing Card -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 shadow-inner text-center">
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">SKENARIO JARINGAN:</span>
        <h2 class="text-base sm:text-lg font-bold text-white leading-relaxed">"${scn.title}"</h2>
        <p class="text-xs text-indigo-300 font-sans">${scn.hint}</p>
      </div>

      <!-- Mode Choice Selector -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button onclick="selectS3Mode('serial')" class="p-4 rounded-xl border-2 ${ctfGame.s3SelectedMode === 'serial' ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20' : 'border-slate-800 bg-slate-900'} hover:border-cyan-400 text-left transition cursor-pointer space-y-1">
          <div class="text-xs font-bold text-cyan-400 flex items-center justify-between">
            <span>🔌 TRANSMISI SERIAL</span>
            <span>1 KABEL</span>
          </div>
          <p class="text-[11px] text-slate-400 font-sans">Bit dikirimkan berurutan satu per satu secara sekuensial. Cocok untuk jarak jauh & hemat kabel.</p>
        </button>

        <button onclick="selectS3Mode('parallel')" class="p-4 rounded-xl border-2 ${ctfGame.s3SelectedMode === 'parallel' ? 'border-indigo-400 bg-indigo-950/60 shadow-lg shadow-indigo-500/20' : 'border-slate-800 bg-slate-900'} hover:border-indigo-400 text-left transition cursor-pointer space-y-1">
          <div class="text-xs font-bold text-indigo-300 flex items-center justify-between">
            <span>🔀 TRANSMISI PARALEL</span>
            <span>8 KABEL</span>
          </div>
          <p class="text-[11px] text-slate-400 font-sans">8 bit dikirimkan serentak dalam 1 denyut clock. Cocok untuk jarak sangat dekat (internal bus).</p>
        </button>
      </div>

      <!-- Transmit Action Button -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1 border-t border-slate-800">
        <span class="text-[11px] text-slate-500">Pilih salah satu mode di atas lalu transmisikan clock.</span>
        <button onclick="commitStage3Mode()" ${!ctfGame.s3SelectedMode ? 'disabled' : ''} class="w-full sm:w-auto px-6 py-2.5 rounded-xl ${ctfGame.s3SelectedMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} text-white font-bold text-xs transition active:scale-95">
          ⏱️ TRANSMISIKAN DENGAN PULSA CLOCK
        </button>
      </div>

      <div id="stage3Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function selectS3Mode(mode) {
  playCtfSFX('click');
  ctfGame.s3SelectedMode = mode;
  renderStage3();
}

function commitStage3Mode() {
  if (!ctfGame.s3SelectedMode) return;
  const isMatch = (ctfGame.s3SelectedMode === ctfGame.s3CurrentScenario.targetMode);
  const earned = isMatch ? 10 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 3, name: 'Serial vs Parallel Mode', earned, max: 10 });

  const fb = document.getElementById('stage3Feedback');
  if (fb) {
    fb.className = isMatch ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isMatch ? `✓ <strong>MODE ARSITEKTUR TEPAT (+10 PTS)!</strong> Pulsa clock berhasil mendistribusikan 8 bit biner sesuai topologi fisik.` : `✗ <strong>PEMILIHAN MODE KURANG TEPAT (0 PTS)!</strong> ${ctfGame.s3CurrentScenario.hint} Melaju ke Stage 4...`;
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 4;
    renderCtfCurrentStage();
  }, 1300);
}

// ==========================================
// STAGE 4: [MEDIA TERPANDU] FIBER OPTIC LASER REFLECTOR
// ==========================================
function renderStage4() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 uppercase">
            STAGE 4/10 • GUIDED MEDIUM: FIBER OPTIC REFLECTOR
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Arahkan Pantulan Sinar Laser di Inti Serat Optik</h3>
          <p class="text-slate-400 text-xs font-sans">Kabel serat optik mentransmisikan data via pulsa cahaya (total internal reflection). Klik masing-masing prisma optik untuk memutar sudut hingga jalur tersambung!</p>
        </div>
      </div>

      <!-- Optical Core Box with Laser Animation -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden shadow-inner space-y-4">
        <div class="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-900 pb-2">
          <span class="text-cyan-400 font-bold">LASER DIODE TX (INPUT)</span>
          <span class="text-emerald-400 font-bold">PHOTO DETECTOR RX (OUTPUT)</span>
        </div>

        <div class="grid grid-cols-3 gap-3 py-2">
          ${[0, 1, 2].map(idx => `
            <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center space-y-2">
              <span class="text-[10px] text-slate-500 block">PRISMA OPTIK #0${idx + 1}</span>
              <button onclick="rotateS4Prism(${idx})" class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-950/60 border-2 border-indigo-400 text-cyan-300 font-bold text-lg mx-auto flex items-center justify-center transition-transform duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95" style="transform: rotate(${ctfGame.s4Prisms[idx]}deg);">
                ▲
              </button>
              <span class="text-[11px] text-slate-400 block">${ctfGame.s4Prisms[idx]}°</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1 border-t border-slate-800">
        <span class="text-[11px] text-slate-500">1x Tembakan laser. Hubungkan sudut pantulan sebelum menembak!</span>
        <button onclick="commitStage4Laser()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95">
          🚀 TEMBAKKAN PULSA LASER
        </button>
      </div>

      <div id="stage4Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function rotateS4Prism(idx) {
  playCtfSFX('click');
  ctfGame.s4Prisms[idx] = (ctfGame.s4Prisms[idx] + 90) % 360;
  renderStage4();
}

function commitStage4Laser() {
  playCtfSFX('laser');
  const isMatch = (ctfGame.s4Prisms[0] === ctfGame.s4TargetAngles[0] && ctfGame.s4Prisms[1] === ctfGame.s4TargetAngles[1] && ctfGame.s4Prisms[2] === ctfGame.s4TargetAngles[2]);
  const earned = isMatch ? 10 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 4, name: 'Fiber Optic Laser Reflector', earned, max: 10 });

  const fb = document.getElementById('stage4Feedback');
  if (fb) {
    fb.className = isMatch ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isMatch ? '✓ <strong>PANTULAN LASER SEMPURNA (+10 PTS)!</strong> Pulsa cahaya tiba di Photo Detector Receiver tanpa atenuasi.' : '✗ <strong>SUDUT PRISMA TIDAK SELARAS (0 PTS)!</strong> Cahaya mengalami dispersi. Melaju ke Stage 5...';
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 5;
    renderCtfCurrentStage();
  }, 1300);
}

// ==========================================
// STAGE 5: [MEDIA NIRKABEL] RF ANTENNA AZIMUTH LOCK
// ==========================================
function renderStage5() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  const diff = Math.abs(ctfGame.s5CurrentAngle - ctfGame.s5TargetAngle);
  const snr = Math.max(5, Math.round(40 - (diff / 180) * 35));

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 uppercase">
            STAGE 5/10 • WIRELESS MEDIUM: RF ANTENNA AZIMUTH LOCK
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Arahkan Antena Nirkabel ke Menara Satelit Penerima</h3>
          <p class="text-slate-400 text-xs font-sans">Media transmisi tanpa kabel (wireless) memanfaatkan gelombang radio/mikro. Putar arah sudut azimut antena hingga Signal-to-Noise Ratio (SNR) optimal!</p>
        </div>
        <span class="text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800 font-bold">
          TARGET AZIMUTH: ${ctfGame.s5TargetAngle}°
        </span>
      </div>

      <!-- Antenna Dial & Ripple Radar Box -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-inner text-center relative overflow-hidden">
        <div class="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-900 pb-2">
          <span>ANTENNA AZIMUTH ORIENTATION</span>
          <span class="text-cyan-400">SNR: <strong class="${snr >= 30 ? 'text-emerald-400' : 'text-amber-400'}">${snr} dB</strong></span>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          <!-- Compass Dial Visualization -->
          <div class="relative w-32 h-32 rounded-full border-2 border-slate-700 bg-slate-900/80 flex items-center justify-center">
            <div class="absolute inset-2 rounded-full border border-dashed border-slate-800 animate-spin" style="animation-duration: 20s;"></div>
            <!-- Ripple Rings -->
            <div class="absolute w-20 h-20 rounded-full border border-cyan-400/40 animate-radio-ripple pointer-events-none"></div>
            <!-- Pointer Needle -->
            <div class="w-1 h-24 bg-transparent flex flex-col justify-between items-center transition-transform duration-150" style="transform: rotate(${ctfGame.s5CurrentAngle}deg);">
              <div class="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,1)]"></div>
              <div class="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            </div>
          </div>

          <!-- Slider & Angle Adjusters -->
          <div class="space-y-3 text-center sm:text-left">
            <div class="text-sm font-bold text-white">SUDUT AKTIF: <span class="text-cyan-300 text-lg">${ctfGame.s5CurrentAngle}°</span></div>
            <div class="flex items-center gap-2">
              <button onclick="adjustS5Angle(-15)" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs">-15°</button>
              <input type="range" min="0" max="360" step="5" value="${ctfGame.s5CurrentAngle}" oninput="onS5AngleChange(this.value)" class="w-48 accent-amber-400 cursor-pointer" />
              <button onclick="adjustS5Angle(+15)" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs">+15°</button>
            </div>
            <p class="text-[11px] text-slate-500">Toleransi penguncian beamwidth: ±15° dari sudut target.</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 pt-1 border-t border-slate-800">
        <span class="text-[11px] text-slate-500">1x Kesempatan penguncian sinyal gelombang radio.</span>
        <button onclick="commitStage5Antenna()" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95">
          📡 KUNCI AZIMUTH & TRANSMISIKAN
        </button>
      </div>

      <div id="stage5Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function adjustS5Angle(delta) {
  playCtfSFX('dial');
  ctfGame.s5CurrentAngle = (ctfGame.s5CurrentAngle + delta + 360) % 360;
  renderStage5();
}

function onS5AngleChange(val) {
  playCtfSFX('dial');
  ctfGame.s5CurrentAngle = parseInt(val);
  renderStage5();
}

function commitStage5Antenna() {
  const diff = Math.min(Math.abs(ctfGame.s5CurrentAngle - ctfGame.s5TargetAngle), 360 - Math.abs(ctfGame.s5CurrentAngle - ctfGame.s5TargetAngle));
  const isMatch = diff <= 15;
  const earned = isMatch ? 10 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 5, name: 'Wireless RF Antenna Lock', earned, max: 10 });

  const fb = document.getElementById('stage5Feedback');
  if (fb) {
    fb.className = isMatch ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isMatch ? `✓ <strong>BEAMWIDTH TERKUNCI (+10 PTS)!</strong> Gelombang mikro RF berhasil diterima stasiun relay dengan SNR tinggi.` : `✗ <strong>SINYAL OUT OF RANGE (${ctfGame.s5CurrentAngle}° vs ${ctfGame.s5TargetAngle}°) (0 PTS)!</strong> Terjadi packet loss. Melaju ke Stage 6...`;
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 6;
    renderCtfCurrentStage();
  }, 1300);
}

// ==========================================
// STAGE 6: [PENERIMA] DYNAMIC MOVING NOISE SPIKE ANNIHILATOR
// ==========================================
function initS6MovingSpikes() {
  ctfGame.s6Spikes = [
    { id: 1, x: 15, y: 25, vx: 1.8, vy: 1.3, cleared: false },
    { id: 2, x: 70, y: 20, vx: -1.5, vy: 1.7, cleared: false },
    { id: 3, x: 25, y: 65, vx: 1.7, vy: -1.4, cleared: false },
    { id: 4, x: 75, y: 60, vx: -1.6, vy: -1.5, cleared: false }
  ];
}

function renderStage6() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);

  const remaining = ctfGame.s6Spikes.filter(s => !s.cleared).length;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 uppercase">
            STAGE 6/10 • RECEIVER: DYNAMIC NOISE SPIKE FILTER
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Basmi Lonjakan Noise Bergerak pada Sinyal Demodulasi</h3>
          <p class="text-slate-400 text-xs font-sans">Lonjakan noise elektromagnetik bergerak tidak stabil melintasi kanal. <strong>Arahkan kursor / sentuh dan klik setiap bola noise merah ⚡ yang sedang bergerak</strong> untuk membersihkannya!</p>
        </div>
        <span id="s6CounterBadge" class="text-xs text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800 font-bold">
          Sisa Noise: ${remaining} / 4
        </span>
      </div>

      <!-- Moving Noise Arena Chamber -->
      <div id="s6Chamber" class="p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner relative overflow-hidden h-64 sm:h-72 flex flex-col justify-between">
        <!-- Oscilloscope Grid Background Pattern -->
        <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px); background-size: 24px 24px;"></div>
        <div class="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-500/20 pointer-events-none"></div>

        <div class="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-900 pb-2 z-10 font-bold">
          <span class="flex items-center gap-1.5 text-rose-400">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> KANAL DEMODULATOR: DISTORSI AKTIF
          </span>
          <span class="text-cyan-300">TARGET: KLIK / SENTUH BOLA NOISE ⚡ YANG BERGERAK</span>
        </div>

        <!-- Moving Spikes Layer -->
        <div id="s6Arena" class="relative flex-1 overflow-hidden w-full">
          ${ctfGame.s6Spikes.map(s => `
            <button id="s6-spike-${s.id}" onclick="hitMovingSpike(${s.id})" style="left: ${s.x}%; top: ${s.y}%; display: ${s.cleared ? 'none' : 'flex'};" class="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600/40 border-2 border-rose-500 text-rose-100 font-bold text-xl items-center justify-center hover:scale-125 transition-transform duration-75 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,1)] glow-pulse active:scale-90 select-none touch-none transform -translate-x-1/2 -translate-y-1/2">
              ⚡
            </button>
          `).join('')}
        </div>

        <!-- Cleared Channels Progress Dock -->
        <div class="grid grid-cols-4 gap-2 pt-2 border-t border-slate-900 z-10">
          ${ctfGame.s6Spikes.map(s => `
            <div id="s6-dock-${s.id}" class="py-1.5 px-2 rounded-lg border text-center text-[10px] font-mono font-bold transition ${s.cleared ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}">
              CH-0${s.id} ${s.cleared ? '✓' : '...'}
            </div>
          `).join('')}
        </div>
      </div>

      <div id="stage6Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;

  startS6MovingSpikesLoop();
  if (window.lucide) window.lucide.createIcons();
}

function startS6MovingSpikesLoop() {
  if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);

  function loop() {
    ctfGame.s6Spikes.forEach(s => {
      if (!s.cleared) {
        s.x += s.vx;
        s.y += s.vy;

        // Bounce boundaries (percentage)
        if (s.x <= 8) { s.x = 8; s.vx = Math.abs(s.vx); }
        if (s.x >= 92) { s.x = 92; s.vx = -Math.abs(s.vx); }
        if (s.y <= 10) { s.y = 10; s.vy = Math.abs(s.vy); }
        if (s.y >= 88) { s.y = 88; s.vy = -Math.abs(s.vy); }

        const elem = document.getElementById(`s6-spike-${s.id}`);
        if (elem) {
          elem.style.left = `${s.x}%`;
          elem.style.top = `${s.y}%`;
        }
      }
    });

    if (ctfGame.stage === 6 && ctfGame.s6Spikes.some(s => !s.cleared)) {
      ctfGame.s6AnimId = requestAnimationFrame(loop);
    }
  }

  ctfGame.s6AnimId = requestAnimationFrame(loop);
}

function hitMovingSpike(id) {
  playCtfSFX('pop');
  const target = ctfGame.s6Spikes.find(s => s.id === id);
  if (!target || target.cleared) return;

  target.cleared = true;
  const elem = document.getElementById(`s6-spike-${id}`);
  if (elem) {
    elem.style.display = 'none';
  }

  const dock = document.getElementById(`s6-dock-${id}`);
  if (dock) {
    dock.className = 'py-1.5 px-2 rounded-lg border text-center text-[10px] font-mono font-bold transition bg-emerald-950/60 border-emerald-500 text-emerald-300';
    dock.innerText = `CH-0${id} ✓`;
  }

  const remaining = ctfGame.s6Spikes.filter(s => !s.cleared).length;
  const badge = document.getElementById('s6CounterBadge');
  if (badge) badge.innerText = `Sisa Noise: ${remaining} / 4`;

  if (remaining === 0) {
    if (ctfGame.s6AnimId) cancelAnimationFrame(ctfGame.s6AnimId);
    playCtfSFX('win');
    ctfGame.score += 10;
    ctfGame.stageLogs.push({ stage: 6, name: 'Receiver Dynamic Noise Filter', earned: 10, max: 10 });

    const fb = document.getElementById('stage6Feedback');
    if (fb) {
      fb.className = 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg';
      fb.innerHTML = '✓ <strong>FILTER DEMODULASI BERHASIL (+10 PTS)!</strong> Seluruh 4 lonjakan noise bergerak berhasil dibasmi. Sinyal biner kembali murni tanpa distorsi.';
    }

    setTimeout(() => {
      ctfGame.stage = 7;
      renderCtfCurrentStage();
    }, 1300);
  }
}

// ==========================================
// STAGE 7: [ARAH KOMUNIKASI] DUPLEX GATEWAY ROUTER
// ==========================================
function renderStage7() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  const currentCase = ctfGame.s7Cases[ctfGame.s7CurrentCaseIdx];

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/40 uppercase">
            STAGE 7/10 • DIRECTION MODES: DUPLEX GATEWAY ROUTER
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Pilih Mode Arah Transmisi Sesuai Trafik Masuk</h3>
          <p class="text-slate-400 text-xs font-sans">Tekan tombol mode arah transmisi yang tepat untuk merutekan paket data komunikasi berikut!</p>
        </div>
        <span class="text-xs text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800 font-bold">
          Trafik: ${ctfGame.s7CurrentCaseIdx + 1} / 3
        </span>
      </div>

      <!-- Incoming Stream Challenge Card -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2 shadow-inner">
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PAKET TRAFIK MASUK</span>
        <h2 class="text-base sm:text-lg font-bold text-white leading-relaxed">"${currentCase.title}"</h2>
      </div>

      <!-- 3 Mode Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button onclick="commitS7Mode('simplex')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-indigo-500 text-white font-bold text-xs transition cursor-pointer text-center space-y-1 shadow-md active:scale-95">
          <div class="text-indigo-400 text-sm">SIMPLEX</div>
          <div class="text-[10px] text-slate-400">Satu Arah Sahaja</div>
        </button>

        <button onclick="commitS7Mode('half')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-sky-500 text-white font-bold text-xs transition cursor-pointer text-center space-y-1 shadow-md active:scale-95">
          <div class="text-sky-400 text-sm">HALF-DUPLEX</div>
          <div class="text-[10px] text-slate-400">Dua Arah Bergantian</div>
        </button>

        <button onclick="commitS7Mode('full')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-emerald-500 text-white font-bold text-xs transition cursor-pointer text-center space-y-1 shadow-md active:scale-95">
          <div class="text-emerald-400 text-sm">FULL-DUPLEX</div>
          <div class="text-[10px] text-slate-400">Dua Arah Serentak</div>
        </button>
      </div>

      <div id="stage7Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function commitS7Mode(chosenMode) {
  const currentCase = ctfGame.s7Cases[ctfGame.s7CurrentCaseIdx];
  const isMatch = (chosenMode === currentCase.target);

  if (isMatch) {
    playCtfSFX('win');
    ctfGame.s7Points += 3.34;
  } else {
    playCtfSFX('buzz');
  }

  const fb = document.getElementById('stage7Feedback');
  if (fb) {
    fb.className = isMatch ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isMatch ? '✓ <strong>ROUTING TEPAT!</strong> Mode jalur sesuai protokol.' : '✗ <strong>ROUTING KELIRU!</strong>';
  }

  setTimeout(() => {
    if (ctfGame.s7CurrentCaseIdx < ctfGame.s7Cases.length - 1) {
      ctfGame.s7CurrentCaseIdx++;
      renderStage7();
    } else {
      const earned = Math.min(10, Math.round(ctfGame.s7Points));
      ctfGame.score += earned;
      ctfGame.stageLogs.push({ stage: 7, name: 'Duplex Gateway Router', earned, max: 10 });
      ctfGame.stage = 8;
      renderCtfCurrentStage();
    }
  }, 800);
}

// ==========================================
// STAGE 8: [KARAKTERISTIK 1] LOW-LATENCY QoS ACCELERATOR
// ==========================================
function renderStage8() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 uppercase">
            STAGE 8/10 • TIMELINESS: QoS LATENCY ACCELERATOR
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Akselerasi Pengiriman Paket Real-Time (Ketepatan Waktu)</h3>
          <p class="text-slate-400 text-xs font-sans">Karakteristik Ketepatan Waktu menuntut data audio/video tiba tanpa lag. Tekan [BOOST QoS] saat paket berada di Zona Hijau Akselerasi (35% - 65%)!</p>
        </div>
        <span class="text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800 font-bold">
          LATENCY SLA: &lt; 50ms
        </span>
      </div>

      <!-- High-Speed Pipeline Track -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner space-y-4 text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-900 pb-2">
          <span>REAL-TIME PACKET BUFFER CORRIDOR</span>
          <span class="text-amber-400">TARGET: ZONA HIJAU (35% - 65%)</span>
        </div>

        <div class="w-full h-16 bg-[#040711] rounded-xl border border-slate-800 relative overflow-hidden flex items-center">
          <div class="absolute left-[35%] w-[30%] h-full bg-emerald-500/20 border-x-2 border-emerald-500/60 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
            ⚡ QoS PRIORITY ZONE
          </div>
          <div id="s8Packet" style="left: ${ctfGame.s8PacketPos}%;" class="absolute w-8 h-10 bg-cyan-400 rounded-lg shadow-[0_0_18px_rgba(56,189,248,1)] transform -translate-x-1/2 flex items-center justify-center text-slate-950 font-black text-[10px]">
            PKG
          </div>
        </div>

        <button onclick="tapS8Boost()" class="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-95">
          🚀 AKTIFKAN QoS PRIORITY BOOST
        </button>
      </div>

      <div id="stage8Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;

  startS8Animation();
  if (window.lucide) window.lucide.createIcons();
}

function startS8Animation() {
  if (ctfGame.s8AnimId) cancelAnimationFrame(ctfGame.s8AnimId);
  ctfGame.s8Committed = false;

  function loop() {
    if (ctfGame.s8Committed) return;
    ctfGame.s8PacketPos += ctfGame.s8Direction * 1.6;
    if (ctfGame.s8PacketPos >= 92) ctfGame.s8Direction = -1;
    if (ctfGame.s8PacketPos <= 8) ctfGame.s8Direction = 1;

    const packet = document.getElementById('s8Packet');
    if (packet) packet.style.left = `${ctfGame.s8PacketPos}%`;

    if (ctfGame.stage === 8) {
      ctfGame.s8AnimId = requestAnimationFrame(loop);
    }
  }
  loop();
}

function tapS8Boost() {
  if (ctfGame.s8Committed) return;
  ctfGame.s8Committed = true;
  if (ctfGame.s8AnimId) cancelAnimationFrame(ctfGame.s8AnimId);

  const isInside = (ctfGame.s8PacketPos >= 35 && ctfGame.s8PacketPos <= 65);
  const earned = isInside ? 10 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 8, name: 'Timeliness QoS Accelerator', earned, max: 10 });

  const fb = document.getElementById('stage8Feedback');
  if (fb) {
    fb.className = isInside ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isInside ? '✓ <strong>QoS PRIORITY AKTIF (+10 PTS)!</strong> Latensi terkunci di 22ms. Paket video tiba tepat waktu.' : '✗ <strong>MISSED PRIORITY CORRIDOR (0 PTS)!</strong> Latensi melonjak ke 180ms (lag). Melaju ke Stage 9...';
    if (isInside) {
      playCtfSFX('boost');
      playCtfSFX('win');
    } else {
      playCtfSFX('buzz');
    }
  }

  setTimeout(() => {
    ctfGame.stage = 9;
    renderCtfCurrentStage();
  }, 1300);
}

// ==========================================
// STAGE 9: [KARAKTERISTIK 2] JITTER BUFFER TIMING SYNC
// ==========================================
function renderStage9() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 uppercase">
            STAGE 9/10 • JITTER STABILITY: BUFFER TIMING SYNC
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Stabilkan Fluktuasi Jeda Kedatangan Paket (Jitter)</h3>
          <p class="text-slate-400 text-xs font-sans">Jitter adalah variasi delay waktu kedatangan paket data. Tekan tombol [SYNC JITTER] saat kursor berada di Zona Hijau Tengah (40% - 60%)!</p>
        </div>
        <span class="text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800 font-bold">
          Sync Berhasil: ${ctfGame.s9HitsCount} / 3
        </span>
      </div>

      <!-- Moving Jitter Oscillation Bar -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner space-y-4 text-center">
        <div class="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-900 pb-2">
          <span>JITTER FLUCTUATION WINDOW</span>
          <span class="text-emerald-400">TARGET: ZONA HIJAU (40% - 60%)</span>
        </div>

        <div class="w-full h-14 bg-[#040711] rounded-xl border border-slate-800 relative overflow-hidden flex items-center">
          <div class="absolute left-[40%] w-[20%] h-full bg-emerald-500/20 border-x-2 border-emerald-500/60 flex items-center justify-center text-[9px] text-emerald-400 font-bold">
            BUFFER SYNC
          </div>
          <div id="s9Marker" style="left: ${ctfGame.s9MarkerPos}%;" class="absolute w-6 h-10 bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(56,189,248,1)] transform -translate-x-1/2"></div>
        </div>

        <button onclick="tapS9Sync()" class="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95">
          🎯 SYNC JITTER PAKET SEKARANG
        </button>
      </div>

      <div id="stage9Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;

  startS9Animation();
  if (window.lucide) window.lucide.createIcons();
}

function startS9Animation() {
  if (ctfGame.s9AnimId) cancelAnimationFrame(ctfGame.s9AnimId);

  function loop() {
    ctfGame.s9MarkerPos += ctfGame.s9Direction * 1.6;
    if (ctfGame.s9MarkerPos >= 92) ctfGame.s9Direction = -1;
    if (ctfGame.s9MarkerPos <= 8) ctfGame.s9Direction = 1;

    const marker = document.getElementById('s9Marker');
    if (marker) marker.style.left = `${ctfGame.s9MarkerPos}%`;

    if (ctfGame.stage === 9) {
      ctfGame.s9AnimId = requestAnimationFrame(loop);
    }
  }
  loop();
}

function tapS9Sync() {
  const isInside = (ctfGame.s9MarkerPos >= 40 && ctfGame.s9MarkerPos <= 60);

  if (isInside) {
    playCtfSFX('win');
    ctfGame.s9HitsCount++;
  } else {
    playCtfSFX('buzz');
  }

  renderStage9();

  if (ctfGame.s9HitsCount >= 3) {
    if (ctfGame.s9AnimId) cancelAnimationFrame(ctfGame.s9AnimId);
    ctfGame.score += 10;
    ctfGame.stageLogs.push({ stage: 9, name: 'Jitter Buffer Timing Sync', earned: 10, max: 10 });

    const fb = document.getElementById('stage9Feedback');
    if (fb) {
      fb.className = 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg';
      fb.innerHTML = '✓ <strong>JITTER TERSTABILISASI (+10 PTS)!</strong> Variasi waktu kedatangan paket kembali sinkron dan konsisten.';
    }

    setTimeout(() => {
      ctfGame.stage = 10;
      renderCtfCurrentStage();
    }, 1300);
  }
}

// ==========================================
// STAGE 10: [TUJUAN & AKURASI] DESTINATION CHECKSUM VAULT
// ==========================================
function renderStage10() {
  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4 font-mono select-none">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 uppercase">
            STAGE 10/10 • DESTINATION: CHECKSUM & ACCURACY VAULT
          </span>
          <h3 class="text-base md:text-lg font-bold text-white mt-1">Verifikasi Integritas Akurasi di Server Tujuan</h3>
          <p class="text-slate-400 text-xs font-sans">Karakteristik Akurasi memastikan data tidak rusak. Cocokkan Kunci Hash dengan Checksum Vault Database Tujuan!</p>
        </div>
      </div>

      <!-- Destination Vault Box with Cyber Scanner Line -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner space-y-4 text-center relative overflow-hidden">
        <div class="absolute inset-x-0 h-1 bg-cyan-400/40 shadow-[0_0_10px_#06b6d4] animate-cyber-scan pointer-events-none"></div>

        <div class="flex justify-between items-center text-xs text-slate-400 border-b border-slate-900 pb-2">
          <span>DESTINATION DATABASE VAULT</span>
          <span class="text-amber-400 font-bold">CHECKSUM TARGET: ${ctfGame.s10TargetHash}</span>
        </div>

        <div class="text-xs text-slate-400">Pilih Kunci Hash kriptografi yang identik untuk mengunci flag dan menyelesaikan audit misi:</div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          ${ctfGame.s10HashKeys.map(hash => `
            <button onclick="commitS10Hash('${hash}')" class="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-cyan-400 text-white font-bold text-sm transition cursor-pointer text-center shadow-md active:scale-95">
              🔑 ${hash}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="stage10Feedback" class="hidden p-3 rounded-xl text-xs"></div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function commitS10Hash(chosenHash) {
  const isMatch = (chosenHash === ctfGame.s10TargetHash);
  const earned = isMatch ? 10 : 0;
  ctfGame.score += earned;
  ctfGame.stageLogs.push({ stage: 10, name: 'Destination Checksum Vault', earned, max: 10 });

  const fb = document.getElementById('stage10Feedback');
  if (fb) {
    fb.className = isMatch ? 'p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl block font-mono text-xs shadow-lg' : 'p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl block font-mono text-xs';
    fb.innerHTML = isMatch ? '✓ <strong>INTEGRITAS DATA AKURAT (+10 PTS)!</strong> Paket tersimpan sempurna di Database Tujuan.' : '✗ <strong>HASH CORRUPTED (0 PTS)!</strong> Terdeteksi anomali bit. Mengunci hasil akhir...';
    if (isMatch) playCtfSFX('win');
    else playCtfSFX('buzz');
  }

  setTimeout(() => {
    ctfGame.stage = 11; // Final Debrief
    renderCtfCurrentStage();
  }, 1300);
}

// ==========================================
// FINAL CTF SCOREBOARD, AUDIT & LEADERBOARD SUBMISSION
// ==========================================
function showFinalScoreboard() {
  stopCtfTimer();
  playCtfSFX('win');

  const container = document.getElementById('arcadeStageContainer');
  if (!container) return;

  const accuracyScore = ctfGame.score; // 0 - 100
  const elapsed = Math.round(ctfGame.elapsedSeconds);
  const timeBonus = Math.max(0, Math.round((240 - elapsed) * 2));
  const totalScore = accuracyScore + timeBonus;

  // Save to leaderboard
  const today = new Date();
  const dateStr = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0');
  saveScoreToLeaderboard({
    name: ctfGame.playerName,
    token: ctfGame.agentToken,
    accuracy: accuracyScore,
    timeStr: ctfGame.timerDisplayStr,
    timeSec: elapsed,
    totalScore: totalScore,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'HP / Mobile' : 'PC / Laptop',
    date: dateStr,
    timestamp: Date.now()
  });

  let rank = '🎖️ CYBER ARCHITECT ELITE';
  let rankDesc = 'Luar biasa! Anda menembus 10 tahapan operasional komunikasi data dengan kecakapan dan kecepatan rekor!';
  let scoreColor = 'text-cyan-400';

  if (accuracyScore < 60) {
    rank = '⚠️ FIELD TECHNICIAN';
    rankDesc = 'Misi selesai. Tinjau kembali mekanisme 5 komponen & karakteristik komunikasi data pada laporan audit.';
    scoreColor = 'text-amber-400';
  } else if (accuracyScore < 85) {
    rank = '🛡️ NETWORK OPERATIONS SENTINEL';
    rankDesc = 'Kecakapan tinggi! Pertahanan dan perakitan jaringan data Anda sangat tangguh!';
    scoreColor = 'text-indigo-400';
  }

  container.innerHTML = `
    <div class="py-4 space-y-4 max-w-2xl mx-auto font-mono text-center select-none">
      <div class="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <i data-lucide="award" class="w-8 h-8"></i>
      </div>

      <div>
        <span class="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider">
          ${rank}
        </span>
        <h2 class="text-2xl font-black text-white mt-2">10 TAHAPAN CTF TUNTAS!</h2>
        <p class="text-slate-400 text-xs mt-1 font-sans">${rankDesc}</p>
      </div>

      <!-- Combined Score Box -->
      <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
        <div class="flex justify-between items-center text-xs text-slate-500 border-b border-slate-900 pb-2">
          <span>AGEN ASLI: <strong class="text-white">${ctfGame.playerName}</strong> (${ctfGame.agentToken})</span>
          <span class="text-amber-400 font-mono font-bold">⏱️ ${ctfGame.timerDisplayStr}</span>
        </div>

        <div class="grid grid-cols-3 gap-2 py-1">
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-[10px] text-slate-500 block">AKURASI</span>
            <span class="text-lg sm:text-xl font-bold text-emerald-400">${accuracyScore} / 100</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-[10px] text-slate-500 block">BONUS WAKTU</span>
            <span class="text-lg sm:text-xl font-bold text-amber-400">+${timeBonus}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span class="text-[10px] text-slate-500 block">TOTAL SKOR</span>
            <span class="text-lg sm:text-xl font-black ${scoreColor}">${totalScore}</span>
          </div>
        </div>
      </div>

      <!-- Audit Breakdown List -->
      <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-left space-y-2 text-xs max-h-40 overflow-y-auto">
        <div class="text-xs font-bold text-cyan-300 border-b border-slate-800 pb-1">
          📋 LAPORAN KINERJA 10 TAHAPAN:
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          ${ctfGame.stageLogs.map(l => `
            <div class="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300 truncate mr-2">${l.stage}. ${l.name}</span>
              <span class="${l.earned > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">+${l.earned}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <button onclick="openLeaderboardModal()" class="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          <i data-lucide="trophy" class="w-4 h-4"></i> Buka Papan Skor Lengkap
        </button>
        <button onclick="restartCtfGame()" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Main Ulang (Sesi Agen Baru)
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
      <div class="text-center py-5 space-y-4 font-mono">
        <div class="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/40 shadow-lg text-xl">
          📱
        </div>
        <div>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">QR Code: KomDat Cyber CTF (10 Tahapan)</h3>
          <p class="text-slate-400 text-xs mt-1 font-sans">Pindai QR ini di HP untuk langsung masuk ke mode game 10 tahapan tanpa melewati slide presentasi materi!</p>
        </div>

        <div class="flex flex-col items-center gap-2 py-2">
          <div id="directQRTarget" onclick="window.open('${directGameURL}', '_blank')" title="Klik untuk Buka Langsung Game di Tab Baru" class="p-3 bg-white rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform"></div>
          <span class="text-[11px] font-mono text-cyan-300">💡 Klik kotak QR di atas atau tombol di bawah untuk langsung membuka game:</span>
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
        colorDark: '#05070d',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  const btnNext = document.getElementById('btnNextQuiz');
  if (btnNext) {
    btnNext.innerText = 'Tutup Modal QR';
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
