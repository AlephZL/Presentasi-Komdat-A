// ==========================================
// PAYLOAD SIMULATOR & REAL-TIME OSCILLOSCOPE JITTER ENGINE
// ==========================================

// --- SIMULASI PAYLOAD TEKS MANUAL (SLIDE 3) ---
function textToBinary(text) {
  return text.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join(' ');
}

function setPresetPayload(presetVal) {
  const input = document.getElementById('customPayloadInput');
  if (input) input.value = presetVal;
  executeCustomSimulation();
}

let isSimRunning = false;
async function executeCustomSimulation() {
  if (isSimRunning) return;
  isSimRunning = true;

  const inputElem = document.getElementById('customPayloadInput');
  const inputVal = (inputElem && inputElem.value.trim()) ? inputElem.value.trim() : "USER";
  const binaryVal = textToBinary(inputVal);

  const logBox = document.getElementById('logConsole');
  const simStatus = document.getElementById('simStatus');
  const cards = [
    document.getElementById('sim-card-1'),
    document.getElementById('sim-card-2'),
    document.getElementById('sim-card-3'),
    document.getElementById('sim-card-4'),
    document.getElementById('sim-card-5')
  ];

  if (logBox) logBox.innerHTML = '';
  if (simStatus) {
    simStatus.innerText = 'TRANSMISI BERJALAN...';
    simStatus.className = 'text-amber-400 font-bold';
  }

  const appendLog = (msg) => {
    if (!logBox) return;
    const item = document.createElement('div');
    item.innerHTML = `&gt; ${msg}`;
    logBox.appendChild(item);
    logBox.scrollTop = logBox.scrollHeight;
  };

  const resetHighlights = () => {
    cards.forEach(c => {
      if (c) c.classList.remove('border-indigo-500', 'bg-indigo-950/60', 'border-emerald-500', 'bg-emerald-950/60');
    });
  };

  // Node 1: Source
  resetHighlights();
  if (cards[0]) cards[0].classList.add('border-indigo-500', 'bg-indigo-950/60');
  const dispSource = document.getElementById('disp-source');
  if (dispSource) dispSource.innerText = `Payload: "${inputVal}"`;
  appendLog(`<span class="text-indigo-400">[Sumber Data]</span> Payload teks mentah dibuat: "${inputVal}" (Panjang: ${inputVal.length} karakter)`);
  await new Promise(r => setTimeout(r, 700));

  // Node 2: Transmitter
  resetHighlights();
  if (cards[1]) cards[1].classList.add('border-indigo-500', 'bg-indigo-950/60');
  const dispTrans = document.getElementById('disp-transmitter');
  if (dispTrans) dispTrans.innerText = binaryVal.slice(0, 18) + '...';
  appendLog(`<span class="text-sky-400">[Pengirim]</span> Mengkodekan teks ke aliran biner ASCII 8-Bit: ${binaryVal}`);
  await new Promise(r => setTimeout(r, 800));

  // Node 3: Medium
  resetHighlights();
  if (cards[2]) cards[2].classList.add('border-indigo-500', 'bg-indigo-950/60');
  const dispMed = document.getElementById('disp-medium');
  if (dispMed) dispMed.innerText = '101011 (Sinyal Terbawa)';
  appendLog(`<span class="text-emerald-400">[Media Transmisi]</span> Modulasi sinyal merambat melalui media serat optik / gelombang RF.`);
  await new Promise(r => setTimeout(r, 800));

  // Node 4: Receiver
  resetHighlights();
  if (cards[3]) cards[3].classList.add('border-indigo-500', 'bg-indigo-950/60');
  const dispRec = document.getElementById('disp-receiver');
  if (dispRec) dispRec.innerText = 'CRC-32 Check: OK';
  appendLog(`<span class="text-amber-400">[Penerima]</span> Demodulasi sinyal, dekoding bit biner, dan verifikasi integritas paket OK.`);
  await new Promise(r => setTimeout(r, 700));

  // Node 5: Destination
  resetHighlights();
  if (cards[4]) cards[4].classList.add('border-emerald-500', 'bg-emerald-950/60');
  const dispDest = document.getElementById('disp-dest');
  if (dispDest) dispDest.innerText = `Diterima: "${inputVal}"`;
  appendLog(`<span class="text-emerald-400">[Tujuan]</span> Sukses! Paket data "${inputVal}" diterima utuh oleh server tujuan tanpa korupsi.`);

  if (simStatus) {
    simStatus.innerText = 'TRANSMISI SELESAI 100%';
    simStatus.className = 'text-emerald-400 font-bold';
  }
  isSimRunning = false;
}

// --- REAL-TIME OSCILLOSCOPE & JITTER ENGINE (SLIDE 5) ---
let oscPhase = 0;
let oscWaveMode = 'digital';
let isExperimentRunning = false;

// 1. Evaluasi Status Jaringan Berdasarkan Teori Dasar & RFC 3550
function getNetworkStatus(baseLatency, jitter) {
  // a. baseLatency >= 150 ms DAN jitter <= 15 ms
  if (baseLatency >= 150 && jitter <= 15) {
    return {
      text: "Delay Tinggi / Satelit (Stabil, Jitter Rendah)",
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/30",
      badgeClass: "border-sky-500/40 text-sky-300 bg-sky-500/10",
      dot: "bg-sky-400",
      desc: "Paket tiba lambat namun dengan interval yang sangat konsisten. Tidak terjadi buffering atau audio patah-patah."
    };
  }

  // c. baseLatency >= 150 ms DAN jitter > 50 ms
  if (baseLatency >= 150 && jitter > 50) {
    return {
      text: "Koneksi Buruk (Latensi & Jitter Tinggi)",
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      badgeClass: "border-rose-500/40 text-rose-300 bg-rose-500/10",
      dot: "bg-rose-400 animate-pulse",
      desc: "Kondisi terburuk: waktu tempuh sangat lambat dan jeda kedatangan sangat fluktuatif (paket teracak/terputus)."
    };
  }

  // b. baseLatency < 100 ms DAN jitter > 50 ms
  if (baseLatency < 100 && jitter > 50) {
    return {
      text: "Latensi Rendah, Jitter Tinggi (Fluktuatif/Patah-patah)",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
      badgeClass: "border-amber-500/40 text-amber-300 bg-amber-500/10",
      dot: "bg-amber-400 animate-pulse",
      desc: "Waktu tempuh cepat tetapi variasi jeda kedatangan sangat besar, menyebabkan streaming terhenti (buffering)."
    };
  }

  // d. baseLatency < 60 ms DAN jitter <= 15 ms
  if (baseLatency < 60 && jitter <= 15) {
    return {
      text: "Optimal / Sangat Stabil",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      badgeClass: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
      dot: "bg-emerald-400",
      desc: "Koneksi prima berkecepatan tinggi dengan jeda kedatangan presisi. Sempurna untuk voice, video & game."
    };
  }

  // Kasus Transisi / Moderat
  if (jitter > 50) {
    return {
      text: "Jitter Tinggi (Fluktuasi Jeda Parah)",
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      badgeClass: "border-rose-500/40 text-rose-300 bg-rose-500/10",
      dot: "bg-rose-400 animate-pulse",
      desc: "Jeda antar-paket tidak beraturan, berisiko mengacaukan rekonstruksi buffer penerima."
    };
  }

  if (baseLatency >= 150) {
    return {
      text: "Delay Tinggi (Jitter Sedang)",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
      badgeClass: "border-amber-500/40 text-amber-300 bg-amber-500/10",
      dot: "bg-amber-400",
      desc: "Waktu tempuh lama dengan sedikit variasi kedatangan."
    };
  }

  if (jitter <= 15) {
    return {
      text: "Koneksi Stabil (Jitter Rendah)",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      badgeClass: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
      dot: "bg-emerald-400",
      desc: "Variasi jeda kedatangan paket sangat minim dan stabil."
    };
  }

  return {
    text: "Kondisi Moderat (Latensi & Jitter Wajar)",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    badgeClass: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10",
    dot: "bg-cyan-400",
    desc: "Transmisi berjalan dengan toleransi variasi kedatangan wajar."
  };
}

function updateOscilloscopeLiveStatus() {
  const latSlider = document.getElementById('simLatency');
  const jitSlider = document.getElementById('simJitter');
  const baseLat = latSlider ? parseInt(latSlider.value) : 35;
  const jitterVal = jitSlider ? parseInt(jitSlider.value) : 25;

  const latVal = document.getElementById('latencyVal');
  if (latVal) latVal.innerText = `${baseLat} ms`;

  const jitVal = document.getElementById('jitterVal');
  if (jitVal) jitVal.innerText = `${jitterVal} ms`;

  if (!isExperimentRunning) {
    const statusBadge = document.getElementById('expResultBadge');
    if (statusBadge) {
      const status = getNetworkStatus(baseLat, jitterVal);
      statusBadge.innerText = status.text;
      statusBadge.className = `${status.color} font-bold font-mono text-xs transition-colors duration-200`;
    }
  }
}

function setupOscilloscopeControls() {
  const latSlider = document.getElementById('simLatency');
  const jitSlider = document.getElementById('simJitter');

  if (latSlider) {
    latSlider.oninput = () => {
      updateOscilloscopeLiveStatus();
    };
  }
  if (jitSlider) {
    jitSlider.oninput = () => {
      updateOscilloscopeLiveStatus();
    };
  }
  updateOscilloscopeLiveStatus();
}

function toggleOscWaveMode(mode) {
  oscWaveMode = mode;
  const btnDigital = document.getElementById('btnOscDigital');
  const btnAnalog = document.getElementById('btnOscAnalog');
  if (btnDigital && btnAnalog) {
    if (mode === 'digital') {
      btnDigital.className = 'px-2.5 py-1 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold transition';
      btnAnalog.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-mono text-[10px] hover:text-white transition';
    } else {
      btnAnalog.className = 'px-2.5 py-1 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold transition';
      btnDigital.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-mono text-[10px] hover:text-white transition';
    }
  }
}

// 2. Visualisasi Osiloskop Real-Time (Tampilan Semula Bersih & Smooth)
function drawOscilloscopeWaveform() {
  const canvas = document.getElementById('oscilloscopeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  const width = canvas.width;
  const height = canvas.height;
  if (width <= 0 || height <= 0) return;

  const latSlider = document.getElementById('simLatency');
  const jitSlider = document.getElementById('simJitter');

  const baseLat = latSlider ? parseInt(latSlider.value) : 35;
  const jitterVal = jitSlider ? parseInt(jitSlider.value) : 25;

  const latSpeedFactor = Math.max(0.15, (270 - baseLat) / 60);
  oscPhase += 0.08 * latSpeedFactor;

  ctx.clearRect(0, 0, width, height);

  // CRT Oscilloscope Grid
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Center Zero-Axis
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const midY = height / 2;
  const waveColor = jitterVal > 50 ? '#f43f5e' : (jitterVal > 15 ? '#f59e0b' : '#10b981');
  const wavelength = 0.025 + (baseLat / 3000);

  ctx.shadowBlur = 10;
  ctx.shadowColor = waveColor;
  ctx.strokeStyle = waveColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  if (oscWaveMode === 'digital') {
    const squarePeriod = (1 / wavelength) * 0.7;
    for (let x = 0; x < width; x++) {
      const jitterNoise = jitterVal === 0 ? 0 : (Math.random() - 0.5) * (jitterVal / 3.5);
      const t = (x + oscPhase * 25) % squarePeriod;
      const isHigh = t < squarePeriod / 2;
      const rawY = isHigh ? midY - 32 : midY + 32;
      const y = rawY + jitterNoise;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else {
    for (let x = 0; x < width; x++) {
      const jitterNoise = jitterVal === 0 ? 0 : (Math.random() - 0.5) * (jitterVal / 3);
      const phaseJitter = jitterVal === 0 ? 0 : (Math.random() - 0.5) * (jitterVal / 70);
      const y = midY + Math.sin(x * wavelength - oscPhase + phaseJitter) * 35 + jitterNoise;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Status badge update jika eksperimen sedang tidak aktif
  if (!isExperimentRunning) {
    const statusBadge = document.getElementById('expResultBadge');
    if (statusBadge) {
      const status = getNetworkStatus(baseLat, jitterVal);
      statusBadge.innerText = status.text;
      statusBadge.className = `${status.color} font-bold font-mono text-xs transition-colors duration-200`;
    }
  }

  if (typeof currentSlide !== 'undefined' && currentSlide === 4) {
    requestAnimationFrame(drawOscilloscopeWaveform);
  }
}

// 3. Transmisi 5 Paket Uji: Pemisahan Jelas Latensi & Jitter Sesuai RFC 3550
async function runNetworkExperiment() {
  if (isExperimentRunning) return;
  isExperimentRunning = true;

  const container = document.getElementById('packetTrackList');
  const badge = document.getElementById('expResultBadge');

  const latSlider = document.getElementById('simLatency');
  const jitSlider = document.getElementById('simJitter');
  const baseLatency = latSlider ? parseInt(latSlider.value) : 35;
  const jitterIntensity = jitSlider ? parseInt(jitSlider.value) : 25;

  if (badge) {
    badge.innerText = 'Mentransmisikan 5 Paket Uji...';
    badge.className = 'text-amber-400 font-bold font-mono text-xs animate-pulse';
  }

  if (container) {
    container.innerHTML = `
      <div class="space-y-1.5">
        <!-- Table Header -->
        <div class="grid grid-cols-12 text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1 px-2 font-bold select-none">
          <span class="col-span-3 sm:col-span-2">PAKET</span>
          <span class="col-span-3 sm:col-span-3 text-center">WAKTU TEMPUH (DELAY)</span>
          <span class="col-span-3 sm:col-span-3 text-center">JEDA TIBA (IAT)</span>
          <span class="col-span-3 sm:col-span-2 text-center">JITTER (RFC 3550)</span>
          <span class="hidden sm:block sm:col-span-2 text-right">EVALUASI</span>
        </div>
        <div id="packetRowsWrapper" class="space-y-1.5"></div>
      </div>
    `;
  }

  const rowsWrapper = document.getElementById('packetRowsWrapper');
  const SEND_INTERVAL = 100; // ms: interval keberangkatan pengirim
  let previousArrivalTime = null;
  const packetLogs = [];

  for (let i = 1; i <= 5; i++) {
    // 1. Variasi jitter acak [-jitterIntensity, +jitterIntensity]
    const randomVariation = jitterIntensity === 0 ? 0 : Math.round((Math.random() * 2 - 1) * jitterIntensity);
    const actualLatency = Math.max(5, baseLatency + randomVariation);

    // Waktu keberangkatan paket ke-i
    const departureTime = (i - 1) * SEND_INTERVAL;
    // Waktu tiba aktual di penerima
    const arrivalTime = departureTime + actualLatency;

    // 2. Inter-Arrival Time (IAT) & Nilai Jitter (RFC 3550)
    let iat = SEND_INTERVAL;
    let jitter = 0;

    if (i === 1) {
      // Paket pertama sebagai patokan awal (baseline)
      iat = SEND_INTERVAL;
      jitter = 0;
    } else {
      iat = arrivalTime - previousArrivalTime;
      // Jitter = deviasi mutlak dari jeda kedatangan terhadap interval normal pengiriman
      jitter = Math.abs(iat - SEND_INTERVAL);
    }
    previousArrivalTime = arrivalTime;

    packetLogs.push({
      num: i,
      actualLatency,
      iat,
      jitter
    });

    // Simulasi jeda animasi pengiriman paket ke penerima
    await new Promise(r => setTimeout(r, 200));

    // Evaluasi spesifik baris paket berdasarkan jitter
    let rowStatusLabel = "Stabil (Tepat Waktu)";
    let rowBadgeStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
    let rowDotColor = "bg-emerald-400";
    let jitterTextColor = "text-emerald-400";

    if (jitter > 50) {
      rowStatusLabel = `Jitter Tinggi (±${jitter}ms)`;
      rowBadgeStyle = "bg-rose-500/10 border-rose-500/30 text-rose-300";
      rowDotColor = "bg-rose-400";
      jitterTextColor = "text-rose-400 font-bold";
    } else if (jitter > 15) {
      rowStatusLabel = `Variasi Ringan (±${jitter}ms)`;
      rowBadgeStyle = "bg-amber-500/10 border-amber-500/30 text-amber-300";
      rowDotColor = "bg-amber-400";
      jitterTextColor = "text-amber-400 font-bold";
    }

    if (rowsWrapper) {
      const row = document.createElement('div');
      row.className = 'grid grid-cols-12 items-center text-xs font-mono p-2 bg-slate-900/90 rounded-lg border border-slate-800 transition hover:border-indigo-500/40';
      row.innerHTML = `
        <div class="col-span-3 sm:col-span-2 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full ${rowDotColor}"></span>
          <span class="font-bold text-white">#${i}</span>
          <span class="text-[9px] text-slate-500 hidden sm:inline">[0x${(i * 128).toString(16)}]</span>
        </div>
        <div class="col-span-3 sm:col-span-3 text-center text-indigo-300 font-bold">
          ${actualLatency} ms
        </div>
        <div class="col-span-3 sm:col-span-3 text-center text-slate-300">
          ${i === 1 ? '<span class="text-slate-500">100 ms (Ref)</span>' : `${iat} ms`}
        </div>
        <div class="col-span-3 sm:col-span-2 text-center ${jitterTextColor}">
          ${i === 1 ? '<span class="text-slate-500">±0 ms</span>' : `±${jitter} ms`}
        </div>
        <div class="hidden sm:block sm:col-span-2 text-right">
          <span class="px-2 py-0.5 rounded text-[9px] font-bold border ${rowBadgeStyle}">
            ${rowStatusLabel}
          </span>
        </div>
      `;
      rowsWrapper.appendChild(row);
    }
  }

  // 4. Perhitungan Rata-Rata & Evaluasi Status Akhir (Sesuai Aturan User)
  const avgLatency = Math.round(packetLogs.reduce((acc, p) => acc + p.actualLatency, 0) / packetLogs.length);
  const jitterPackets = packetLogs.slice(1);
  const avgJitter = jitterPackets.length > 0
    ? Math.round(jitterPackets.reduce((acc, p) => acc + p.jitter, 0) / jitterPackets.length)
    : 0;

  const finalStatus = getNetworkStatus(baseLatency, jitterIntensity);

  if (badge) {
    badge.innerText = finalStatus.text;
    badge.className = `${finalStatus.color} font-bold font-mono text-xs`;
  }

  if (container) {
    const summaryCard = document.createElement('div');
    summaryCard.className = `mt-2.5 p-3 rounded-xl border ${finalStatus.bg} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono`;
    summaryCard.innerHTML = `
      <div>
        <div class="font-bold ${finalStatus.color} flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${finalStatus.dot}"></span>
          <span>${finalStatus.text}</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-sans">${finalStatus.desc}</div>
      </div>
      <div class="text-[11px] text-slate-300 shrink-0 font-bold bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
        Rerata Delay: <span class="text-indigo-400">${avgLatency}ms</span> • Rerata Jitter: <span class="${avgJitter > 50 ? 'text-rose-400' : (avgJitter > 15 ? 'text-amber-400' : 'text-emerald-400')}">±${avgJitter}ms</span>
      </div>
    `;
    container.appendChild(summaryCard);
  }

  isExperimentRunning = false;
  drawOscilloscopeWaveform();
}

// Auto-inisialisasi kontrol saat skrip dimuat
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupOscilloscopeControls);
  } else {
    setupOscilloscopeControls();
  }
}
