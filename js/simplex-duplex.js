// ==========================================
// INTERACTIVE DIRECTION MODE SELECTOR & DYNAMIC PIPELINE SIMULATOR (SLIDE 4)
// ==========================================
function selectDirectionMode(mode) {
  const box = document.getElementById('directionGraphicBox');
  if (!box) return;

  const btnSimplex = document.getElementById('mode-btn-simplex');
  const btnHalf = document.getElementById('mode-btn-half');
  const btnFull = document.getElementById('mode-btn-full');

  [btnSimplex, btnHalf, btnFull].forEach(b => {
    if (b) b.className = 'py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white text-xs font-mono font-bold transition flex items-center justify-center gap-1.5';
  });

  if (mode === 'simplex') {
    if (btnSimplex) btnSimplex.className = 'py-2.5 px-3 rounded-xl border border-indigo-500 bg-indigo-950/60 text-indigo-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20';

    box.innerHTML = `
      <!-- Header Banner -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div class="text-indigo-400 font-bold text-sm">1. Simplex (Komunikasi Satu Arah)</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Analogi: Stasiun Siaran TV / Radio &rarr; Televisi Rumah</div>
        </div>
        <span class="text-[10px] px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Satu Arah (Hanya Mengirim)
        </span>
      </div>

      <!-- Real World Visual Diagram Stage -->
      <div class="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between text-center gap-2">
          
          <!-- Node A: Stasiun TV -->
          <div class="w-28 p-3 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex flex-col items-center">
            <div class="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1 border border-indigo-500/30">
              <i data-lucide="tv" class="w-5 h-5"></i>
            </div>
            <span class="text-white text-xs font-bold">Stasiun TV</span>
            <span class="text-[10px] text-indigo-300">Stasiun Pemancar</span>
          </div>

          <!-- Animated Packet Pipeline Channel -->
          <div class="flex-1 px-2 flex flex-col items-center space-y-1.5 relative">
            <div id="simplexPipeline" class="w-full h-8 bg-slate-950/90 rounded-xl relative border border-indigo-800/60 shadow-inner flex items-center px-3 justify-center">
              <div id="simplexPackets" class="w-full flex justify-around items-center">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1] animate-pulse"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1] animate-pulse"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse"></span>
              </div>
            </div>
            <div id="simplexStreamLabel" class="text-[10px] text-indigo-400 font-mono font-bold flex items-center gap-1">
              <span>Aliran Siaran TV &rarr; &rarr; &rarr;</span>
            </div>
          </div>

          <!-- Node B: TV Penerima -->
          <div class="w-28 p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
            <div class="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-1">
              <i data-lucide="monitor" class="w-5 h-5"></i>
            </div>
            <span class="text-white text-xs font-bold">TV Rumahan</span>
            <span class="text-[10px] text-slate-400">Televisi Penerima</span>
          </div>

        </div>
      </div>

      <!-- Interactive Control Buttons & Feedback -->
      <div class="space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <button onclick="simSimplexSend()" class="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold transition flex items-center justify-center gap-1.5">
            <i data-lucide="play" class="w-3.5 h-3.5"></i> Pancarkan Siaran TV
          </button>
          <button onclick="simSimplexReverseFail()" class="py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 border border-slate-700 font-mono text-[11px] font-bold transition flex items-center justify-center gap-1.5">
            <i data-lucide="x-circle" class="w-3.5 h-3.5 text-rose-400"></i> Coba Balas dari TV
          </button>
        </div>
        <div id="dirFeedbackBox" class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
          💡 <strong>Penjelasan Situasi:</strong> Televisi rumah hanya dapat menerima siaran (Hanya Mendengar). Tidak ada alat pemancar pada TV untuk mengirim balasan ke stasiun siaran.
        </div>
      </div>
    `;

  } else if (mode === 'half') {
    if (btnHalf) btnHalf.className = 'py-2.5 px-3 rounded-xl border border-sky-500 bg-sky-950/60 text-sky-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20';

    box.innerHTML = `
      <!-- Header Banner -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div class="text-sky-400 font-bold text-sm">2. Half-Duplex (Dua Arah Bergantian)</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Analogi: Walkie-Talkie (Radio HT Polisi)</div>
        </div>
        <span class="text-[10px] px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
          1 Saluran Bersama
        </span>
      </div>

      <!-- Real World Visual Diagram Stage -->
      <div class="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between text-center gap-2">
          
          <!-- Node A: Polisi A -->
          <div id="htNodeA" class="w-28 p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center transition-all">
            <div class="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-1 border border-sky-500/30">
              <i data-lucide="radio" class="w-5 h-5"></i>
            </div>
            <span class="text-white text-xs font-bold">Polisi A</span>
            <span id="htStateA" class="text-[10px] text-slate-400">Siap Mendengar</span>
          </div>

          <!-- Shared Channel Pipeline -->
          <div class="flex-1 px-2 flex flex-col items-center space-y-1.5 relative">
            <div id="htChannelPipeline" class="w-full h-8 bg-slate-950/90 rounded-xl relative border border-slate-800 flex items-center px-3 justify-center shadow-inner">
              <div id="htPackets" class="w-full flex justify-center items-center">
                <span class="text-[11px] text-slate-500 font-mono font-medium">Saluran Bersama (Belum ada suara)</span>
              </div>
            </div>
            <div id="htChannelLabel" class="text-[10px] text-sky-300 font-mono font-bold">
              &lt;──── Saluran Suara Bersama ────&gt;
            </div>
          </div>

          <!-- Node B: Polisi B -->
          <div id="htNodeB" class="w-28 p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center transition-all">
            <div class="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center mb-1">
              <i data-lucide="radio" class="w-5 h-5"></i>
            </div>
            <span class="text-white text-xs font-bold">Polisi B</span>
            <span id="htStateB" class="text-[10px] text-slate-400">Siap Mendengar</span>
          </div>

        </div>
      </div>

      <!-- Interactive Push-To-Talk Controls -->
      <div class="space-y-2">
        <div class="grid grid-cols-3 gap-2 text-[11px] font-bold font-mono">
          <button onclick="simHalfPttA()" class="py-2 px-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center gap-1">
            <i data-lucide="mic" class="w-3.5 h-3.5"></i> Polisi A: "GANTI!"
          </button>
          <button onclick="simHalfPttB()" class="py-2 px-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center gap-1">
            <i data-lucide="mic" class="w-3.5 h-3.5"></i> Polisi B: "MASUK!"
          </button>
          <button onclick="simHalfCollision()" class="py-2 px-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition flex items-center justify-center gap-1">
            <i data-lucide="zap-off" class="w-3.5 h-3.5"></i> Uji Tabrakan 💥
          </button>
        </div>
        <div id="dirFeedbackBox" class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
          💡 <strong>Mekanisme Walkie-Talkie:</strong> Karena hanya ada 1 saluran radio bersama, pengguna harus mengucapkan "Ganti" agar lawan bicara tahu kapan mereka boleh menekan tombol untuk membalas.
        </div>
      </div>
    `;

  } else {
    if (btnFull) btnFull.className = 'py-2.5 px-3 rounded-xl border border-emerald-500 bg-emerald-950/60 text-emerald-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20';

    box.innerHTML = `
      <!-- Header Banner -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div class="text-emerald-400 font-bold text-sm">3. Full-Duplex (Dua Arah Bersamaan)</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Analogi: Telepon HP / Video Call Zoom</div>
        </div>
        <span class="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          2 Jalur Terpisah (Kirim & Terima)
        </span>
      </div>

      <!-- Real World Visual Diagram Stage -->
      <div class="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between text-center gap-2">
          
          <!-- Node A: Phone A -->
          <div id="fullNodeA" class="w-28 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex flex-col items-center">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 border border-emerald-500/30">
              <i data-lucide="smartphone" class="w-5 h-5"></i>
            </div>
            <span class="text-white text-xs font-bold">User A</span>
            <span class="text-[10px] text-emerald-300">Bisa Bicara & Mendengar</span>
          </div>

          <!-- Dual Independent Channel Lanes -->
          <div class="flex-1 px-2 flex flex-col items-center space-y-2 relative">
            
            <!-- Pipeline Lane 1: A to B -->
            <div class="w-full space-y-0.5">
              <div class="w-full h-7 bg-emerald-950/90 rounded-xl relative border border-emerald-800/60 shadow-inner flex items-center px-3 justify-center">
                <div id="fullLane1" class="w-full flex justify-around items-center">
                  <span class="text-[10px] text-emerald-300 font-bold font-mono animate-pulse">Suara A &rarr;</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-ping"></span>
                  <span class="text-[10px] text-emerald-300 font-bold font-mono animate-pulse">Suara A &rarr;</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-ping"></span>
                </div>
              </div>
              <div class="text-[9px] text-emerald-400 font-mono font-bold text-center">Jalur 1: Suara A &rarr; &rarr; &rarr; B</div>
            </div>

            <!-- Pipeline Lane 2: B to A -->
            <div class="w-full space-y-0.5">
              <div class="w-full h-7 bg-sky-950/90 rounded-xl relative border border-sky-800/60 shadow-inner flex items-center px-3 justify-center">
                <div id="fullLane2" class="w-full flex justify-around items-center">
                  <span class="text-[10px] text-sky-300 font-bold font-mono animate-pulse">&larr; Suara B</span>
                  <span class="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] animate-ping"></span>
                  <span class="text-[10px] text-sky-300 font-bold font-mono animate-pulse">&larr; Suara B</span>
                  <span class="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] animate-ping"></span>
                </div>
              </div>
              <div class="text-[9px] text-sky-400 font-mono font-bold text-center">Jalur 2: Suara B &larr; &larr; &larr; A</div>
            </div>

          </div>

          <!-- Node B: Phone B -->
          <div id="fullNodeB" class="w-28 p-3 rounded-xl bg-sky-950/80 border border-sky-800/80 flex flex-col items-center">
            <div class="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-1 border border-sky-500/30">
              <i data-lucide="smartphone" class="w-5 h-5"></i>
            </div>
            <span class="text-white text-xs font-bold">User B</span>
            <span class="text-[10px] text-sky-300">Bisa Bicara & Mendengar</span>
          </div>

        </div>
      </div>

      <!-- Interactive Action Buttons -->
      <div class="space-y-2">
        <button onclick="simFullDuplexTalk()" class="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30">
          <i data-lucide="phone-call" class="w-4 h-4"></i> Simulasi Bicara & Mendengar Serentak (Dua Arah Bersamaan)
        </button>
        <div id="dirFeedbackBox" class="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/50 text-[11px] text-slate-300 leading-relaxed">
          ✅ <strong>Kelebihan Full-Duplex:</strong> Memiliki 2 saluran terpisah (Jalur Kirim & Jalur Terima). Kedua pihak bebas berbicara dan mendengarkan pada detik yang sama tanpa risiko bentrokan sinyal!
        </div>
      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

// Action Handlers for Direction Simulator
function simSimplexSend() {
  const fb = document.getElementById('dirFeedbackBox');
  const packets = document.getElementById('simplexPackets');
  const label = document.getElementById('simplexStreamLabel');
  
  if (packets) {
    packets.innerHTML = `
      <span class="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-mono border border-indigo-500/30 flex items-center gap-1 animate-pulse">📺 Sinyal Siaran #1 &rarr;</span>
      <span class="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-ping"></span>
      <span class="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[11px] font-mono border border-sky-500/30 flex items-center gap-1 animate-pulse">📺 Sinyal Siaran #2 &rarr;</span>
    `;
  }
  if (label) label.innerHTML = '<span class="text-indigo-300 font-bold animate-pulse">📡 Pemancaran Siaran Aktif: Sinyal Gambar & Suara &rarr; &rarr; &rarr;</span>';
  if (fb) {
    fb.className = 'p-3 bg-indigo-950/60 rounded-xl border border-indigo-800 text-[11px] text-indigo-200 leading-relaxed';
    fb.innerHTML = '📺 <strong>Siaran Berjalan:</strong> Stasiun TV terus memancarkan sinyal siaran ke jutaan TV rumah. TV penerima hanya dapat menampilkan siaran tersebut.';
  }
}

function simSimplexReverseFail() {
  const fb = document.getElementById('dirFeedbackBox');
  const pipeline = document.getElementById('simplexPipeline');
  if (pipeline) {
    pipeline.className = 'w-full h-8 bg-rose-950/90 rounded-xl relative border border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] flex items-center px-3 justify-center animate-pulse';
  }
  if (fb) {
    fb.className = 'p-3 bg-rose-950/90 rounded-xl border border-rose-600 text-[11px] text-rose-200 leading-relaxed font-mono';
    fb.innerHTML = '⛔ <strong>AKSES DITOLAK:</strong> Televisi rumah tidak memiliki alat pemancar balik. Pada komunikasi satu arah, sinyal terkunci!';
  }
}

function simHalfPttA() {
  const nodeA = document.getElementById('htNodeA');
  const nodeB = document.getElementById('htNodeB');
  const stateA = document.getElementById('htStateA');
  const stateB = document.getElementById('htStateB');
  const pipeline = document.getElementById('htChannelPipeline');
  const packets = document.getElementById('htPackets');
  const label = document.getElementById('htChannelLabel');
  const fb = document.getElementById('dirFeedbackBox');

  if (nodeA) nodeA.className = 'w-28 p-3 rounded-xl bg-sky-950 border border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex flex-col items-center';
  if (nodeB) nodeB.className = 'w-28 p-3 rounded-xl bg-slate-900 border border-slate-800 opacity-60 flex flex-col items-center';
  if (stateA) stateA.innerText = '🔴 Sedang Bicara';
  if (stateB) stateB.innerText = '🎧 Sedang Mendengar';
  
  if (pipeline) pipeline.className = 'w-full h-8 bg-slate-950/90 rounded-xl relative border border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex items-center px-3 justify-center';
  if (packets) {
    packets.innerHTML = `
      <span class="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[11px] font-mono font-bold border border-sky-400/40 flex items-center gap-1 animate-pulse">📢 Suara Polisi A &rarr;</span>
      <span class="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] animate-ping"></span>
      <span class="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[11px] font-mono font-bold border border-sky-400/40 flex items-center gap-1 animate-pulse">📢 Suara Polisi A &rarr;</span>
    `;
  }
  if (label) label.innerText = '── Polisi A ➔ Polisi B (Transmisi Aktif) ──>';
  if (fb) {
    fb.className = 'p-3 bg-sky-950/60 rounded-xl border border-sky-800 text-[11px] text-sky-200 leading-relaxed';
    fb.innerHTML = '📻 <strong>Polisi A Sedang Bicara:</strong> "Posisi aman, ganti!" Saluran dikuasai Polisi A. Polisi B mendengarkan di saluran yang sama.';
  }
}

function simHalfPttB() {
  const nodeA = document.getElementById('htNodeA');
  const nodeB = document.getElementById('htNodeB');
  const stateA = document.getElementById('htStateA');
  const stateB = document.getElementById('htStateB');
  const pipeline = document.getElementById('htChannelPipeline');
  const packets = document.getElementById('htPackets');
  const label = document.getElementById('htChannelLabel');
  const fb = document.getElementById('dirFeedbackBox');

  if (nodeB) nodeB.className = 'w-28 p-3 rounded-xl bg-amber-950 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex flex-col items-center';
  if (nodeA) nodeA.className = 'w-28 p-3 rounded-xl bg-slate-900 border border-slate-800 opacity-60 flex flex-col items-center';
  if (stateB) stateB.innerText = '🔴 Sedang Bicara';
  if (stateA) stateA.innerText = '🎧 Sedang Mendengar';
  
  if (pipeline) pipeline.className = 'w-full h-8 bg-slate-950/90 rounded-xl relative border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center px-3 justify-center';
  if (packets) {
    packets.innerHTML = `
      <span class="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold border border-amber-400/40 flex items-center gap-1 animate-pulse">&larr; Suara Polisi B 📢</span>
      <span class="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-ping"></span>
      <span class="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold border border-amber-400/40 flex items-center gap-1 animate-pulse">&larr; Suara Polisi B 📢</span>
    `;
  }
  if (label) label.innerText = '<── Polisi B ➔ Polisi A (Transmisi Balasan) ──';
  if (fb) {
    fb.className = 'p-3 bg-amber-950/60 rounded-xl border border-amber-800 text-[11px] text-amber-200 leading-relaxed';
    fb.innerHTML = '📻 <strong>Polisi B Sedang Bicara:</strong> "Siap, dimengerti!" Sinyal beralih arah kembali ke Polisi A.';
  }
}

function simHalfCollision() {
  const nodeA = document.getElementById('htNodeA');
  const nodeB = document.getElementById('htNodeB');
  const pipeline = document.getElementById('htChannelPipeline');
  const packets = document.getElementById('htPackets');
  const label = document.getElementById('htChannelLabel');
  const fb = document.getElementById('dirFeedbackBox');

  if (nodeA) nodeA.className = 'w-28 p-3 rounded-xl bg-rose-950 border border-rose-500 animate-pulse flex flex-col items-center';
  if (nodeB) nodeB.className = 'w-28 p-3 rounded-xl bg-rose-950 border border-rose-500 animate-pulse flex flex-col items-center';
  
  if (pipeline) pipeline.className = 'w-full h-8 bg-rose-950/90 rounded-xl relative border border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] flex items-center justify-center';
  if (packets) {
    packets.innerHTML = `
      <span class="px-3 py-0.5 rounded-md bg-rose-500/30 text-rose-200 text-[11px] font-mono font-extrabold border border-rose-400 flex items-center gap-1 animate-ping">💥 TABRAKAN SUARA A & B 💥</span>
    `;
  }
  if (label) label.innerText = '💥 TABRAKAN SINYAL SUARA 💥';
  if (fb) {
    fb.className = 'p-3 bg-rose-950/90 rounded-xl border border-rose-600 text-[11px] text-rose-200 leading-relaxed font-mono';
    fb.innerHTML = '💥 <strong>BENTROKAN SUARA (Tabrakan Sinyal)!</strong> Karena Polisi A dan B berbicara bersamaan pada 1 saluran yang sama, suara menjadi rusak dan tidak terdengar.';
  }
}

function simFullDuplexTalk() {
  const fb = document.getElementById('dirFeedbackBox');
  const lane1 = document.getElementById('fullLane1');
  const lane2 = document.getElementById('fullLane2');

  if (lane1) {
    lane1.innerHTML = `
      <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/30 flex items-center gap-1 animate-pulse">⚡ Stream Suara A &rarr;</span>
      <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-ping"></span>
      <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/30 flex items-center gap-1 animate-pulse">⚡ Stream Suara A &rarr;</span>
    `;
  }

  if (lane2) {
    lane2.innerHTML = `
      <span class="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold border border-sky-400/30 flex items-center gap-1 animate-pulse">&larr; Stream Suara B ⚡</span>
      <span class="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] animate-ping"></span>
      <span class="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold border border-sky-400/30 flex items-center gap-1 animate-pulse">&larr; Stream Suara B ⚡</span>
    `;
  }

  if (fb) {
    fb.className = 'p-3 bg-emerald-950/90 rounded-xl border border-emerald-500 text-[11px] text-emerald-200 leading-relaxed font-mono';
    fb.innerHTML = '📱 <strong>DUA ARAH BERSAMAAN:</strong> User A & B saling mengirim suara secara langsung di 2 lajur terpisah. Tidak ada suara yang bentrok!';
  }
}
