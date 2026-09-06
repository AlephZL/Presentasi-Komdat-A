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

function setupOscilloscopeControls() {
  const latSlider = document.getElementById('simLatency');
  const jitSlider = document.getElementById('simJitter');

  if (latSlider) {
    latSlider.oninput = () => {
      const latVal = document.getElementById('latencyVal');
      if (latVal) latVal.innerText = `${latSlider.value} ms`;
    };
  }
  if (jitSlider) {
    jitSlider.oninput = () => {
      const jitVal = document.getElementById('jitterVal');
      if (jitVal) jitVal.innerText = `${jitSlider.value} ms`;
    };
  }
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

  const baseLat = latSlider ? parseInt(latSlider.value) : 25;
  const jitterVal = jitSlider ? parseInt(jitSlider.value) : 15;

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

  // Center Axis
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const midY = height / 2;
  const waveColor = jitterVal > 90 ? '#f43f5e' : (jitterVal > 40 ? '#f59e0b' : '#10b981');
  const wavelength = 0.025 + (baseLat / 3000);

  ctx.shadowBlur = 10;
  ctx.shadowColor = waveColor;
  ctx.strokeStyle = waveColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  if (oscWaveMode === 'digital') {
    const squarePeriod = (1 / wavelength) * 0.7;
    for (let x = 0; x < width; x++) {
      const jitterNoise = (Math.random() - 0.5) * (jitterVal / 3.5);
      const t = (x + oscPhase * 25) % squarePeriod;
      const isHigh = t < squarePeriod / 2;
      const rawY = isHigh ? midY - 32 : midY + 32;
      const y = rawY + jitterNoise;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else {
    for (let x = 0; x < width; x++) {
      const jitterNoise = (Math.random() - 0.5) * (jitterVal / 3);
      const phaseJitter = (Math.random() - 0.5) * (jitterVal / 70);
      const y = midY + Math.sin(x * wavelength - oscPhase + phaseJitter) * 35 + jitterNoise;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Update Live Metric Status Badge
  const statusBadge = document.getElementById('expResultBadge');
  if (statusBadge) {
    if (jitterVal > 90) {
      statusBadge.innerText = `⚠️ JITTER EXTREME (${jitterVal}ms) - KORUPSI PAKET`;
      statusBadge.className = 'text-rose-400 font-bold font-mono text-xs animate-pulse';
    } else if (baseLat > 150) {
      statusBadge.innerText = `⏱️ DELAY SATELIT TINGGI (${baseLat}ms)`;
      statusBadge.className = 'text-amber-400 font-bold font-mono text-xs';
    } else {
      statusBadge.innerText = `✅ SINYAL STABIL (${baseLat}ms | Jitter ${jitterVal}ms)`;
      statusBadge.className = 'text-emerald-400 font-bold font-mono text-xs';
    }
  }

  if (typeof currentSlide !== 'undefined' && currentSlide === 4) {
    requestAnimationFrame(drawOscilloscopeWaveform);
  }
}

async function runNetworkExperiment() {
  const container = document.getElementById('packetTrackList');
  const badge = document.getElementById('expResultBadge');
  if (container) container.innerHTML = '';
  if (badge) {
    badge.innerText = 'Menguji 5 Paket...';
    badge.className = 'text-amber-400 font-bold';
  }

  const latSlider = document.getElementById('simLatency');
  const jitSlider = document.getElementById('simJitter');
  const baseLatency = latSlider ? parseInt(latSlider.value) : 25;
  const jitterIntensity = jitSlider ? parseInt(jitSlider.value) : 15;

  for (let i = 1; i <= 5; i++) {
    const offset = Math.floor((Math.random() * 2 - 1) * jitterIntensity);
    const arrivalTime = Math.max(5, baseLatency + offset);

    await new Promise(r => setTimeout(r, 180));

    if (container) {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between text-xs font-mono p-2.5 bg-slate-900 rounded-lg border border-slate-800';
      row.innerHTML = `
        <span class="text-slate-300">Paket #${i} [Seq 0x${(i * 128).toString(16)}]</span>
        <span class="text-slate-400">Jeda Kedatangan: ${arrivalTime} ms</span>
        <span class="${arrivalTime > 110 ? 'text-rose-400 font-bold' : 'text-emerald-400'}">
          ${arrivalTime > 110 ? 'Jitter Tinggi (Lag)' : 'Normal & Stabil'}
        </span>
      `;
      container.appendChild(row);
    }
  }

  if (badge) {
    badge.innerText = 'Uji Berhasil Selesai';
    badge.className = 'text-emerald-400 font-bold';
  }
  drawOscilloscopeWaveform();
}
