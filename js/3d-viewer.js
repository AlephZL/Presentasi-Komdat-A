// ==========================================
// THREE.JS 5-COMPONENT INSPECTOR 3D VIEWER
// ==========================================
let compScene, compCamera, compRenderer, activeMeshGroup, compPointLight;
let isWireframe = false;
let currentCompIdx = 0;

const compData = [
  {
    badge: "KOMPONEN 01 • SUMBER DATA",
    title: "1. Sumber Data (Data Source)",
    desc: "Perangkat atau entitas awal yang membangkitkan data atau informasi mentah sebelum dilakukan konversi dan transmisi.",
    role: "Komputer PC, Kamera CCTV, Sensor IoT, Microphone",
    meshType: "source",
    color: 0x6366f1,
    label: "Mesh 3D: Workstation Server & Data Stream Core",
    details: `
      <div class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/50 space-y-1">
        <div class="font-mono text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
          <i data-lucide="cpu" class="w-3.5 h-3.5"></i> Peran & Konsep Utama Komdat:
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">
          Mengubah input fisik, suara, atau perintah pengguna menjadi aliran data mentah (Raw Data Stream) berformat digital (teks ASCII, piksel RGB, atau sinyal PCM).
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Format Output:</span>
          <span class="text-indigo-300 font-bold">Biner Digital (0 & 1)</span>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Contoh Perangkat:</span>
          <span class="text-slate-200 font-bold">PC, Sensor, Kamera</span>
        </div>
      </div>
    `
  },
  {
    badge: "KOMPONEN 02 • PENGIRIM",
    title: "2. Pengirim (Transmitter)",
    desc: "Memproses data mentah dari sumber agar dapat dikirimkan melalui media transmisi dalam bentuk gelombang elektromagnetik/optik.",
    role: "Modem Pemancar, Network Interface Card (NIC), Antena Transceiver",
    meshType: "transmitter",
    color: 0x38bdf8,
    label: "Mesh 3D: Transmitter Antenna & Modulator Wave Rings",
    details: `
      <div class="p-3 rounded-xl bg-sky-950/40 border border-sky-900/50 space-y-1">
        <div class="font-mono text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
          <i data-lucide="radio" class="w-3.5 h-3.5"></i> Tahapan Proses Teknis:
        </div>
        <ul class="list-disc pl-4 text-slate-300 text-xs space-y-0.5 leading-relaxed">
          <li><strong>Encoding:</strong> Konversi biner ke kode garis (Manchester, NRZ).</li>
          <li><strong>Modulasi:</strong> Menumpangkan biner ke gelombang pembawa (ASK, FSK, PSK, QAM).</li>
          <li><strong>Amplifikasi:</strong> Penguatan sinyal agar tahan redaman jarak jauh.</li>
        </ul>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Fungsi Kunci:</span>
          <span class="text-sky-300 font-bold">Modulasi & Encoding</span>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Hardware:</span>
          <span class="text-slate-200 font-bold">Modem, NIC Card</span>
        </div>
      </div>
    `
  },
  {
    badge: "KOMPONEN 03 • MEDIA TRANSMISI",
    title: "3. Media Transmisi (Transmission Medium)",
    desc: "Saluran atau media fisik/nirkabel perantara tempat gelombang sinyal merambat dari transmiter menuju receiver.",
    role: "Kabel UTP/STP, Serat Optik (Fiber), Gelombang Radio Wi-Fi/Cellular",
    meshType: "medium",
    color: 0x10b981,
    label: "Mesh 3D: Fiber Optic Conduit & Light Pulse Beam",
    details: `
      <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 space-y-1">
        <div class="font-mono text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
          <i data-lucide="git-commit" class="w-3.5 h-3.5"></i> Klasifikasi Saluran Transmisi:
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">
          • <strong>Guided (Terpandu):</strong> UTP, Coaxial, & Serat Optik (kecepatan cahaya, bebas kebal EMI).<br/>
          • <strong>Unguided (Nirkabel):</strong> Gelombang Radio RF (Wi-Fi 2.4/5GHz), Microwave, Satelit.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Karakteristik Utama:</span>
          <span class="text-emerald-300 font-bold">Bandwidth & Redaman</span>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Proteksi:</span>
          <span class="text-slate-200 font-bold">Shielding EMI / Noise</span>
        </div>
      </div>
    `
  },
  {
    badge: "KOMPONEN 04 • PENERIMA",
    title: "4. Penerima (Receiver)",
    desc: "Menangkap sinyal yang telah melewati saluran transmisi, melakukan demodulasi, dan mengembalikannya menjadi bentuk biner murni.",
    role: "Modem Penerima, Demodulator Antena, Network Interface Host",
    meshType: "receiver",
    color: 0xf59e0b,
    label: "Mesh 3D: Satellite Receiver Parabola & CRC Gate",
    details: `
      <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-900/50 space-y-1">
        <div class="font-mono text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
          <i data-lucide="download" class="w-3.5 h-3.5"></i> Mekanisme Demodulasi & Error Check:
        </div>
        <ul class="list-disc pl-4 text-slate-300 text-xs space-y-0.5 leading-relaxed">
          <li><strong>Filtering:</strong> Memisahkan sinyal dari kebisingan (Noise) perambatan.</li>
          <li><strong>Demodulasi:</strong> Mengonversi sinyal fisik kembali ke bit biner 0 & 1.</li>
          <li><strong>Error Check:</strong> Memeriksa keutuhan bit dengan algoritma CRC-32 / Parity.</li>
        </ul>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Verifikasi Eror:</span>
          <span class="text-amber-300 font-bold">CRC-32 Checksum</span>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Output Node:</span>
          <span class="text-slate-200 font-bold">Bit Digital Valid</span>
        </div>
      </div>
    `
  },
  {
    badge: "KOMPONEN 05 • TUJUAN",
    title: "5. Tujuan (Destination)",
    desc: "Entitas atau sistem akhir tempat data diproses oleh aplikasi, disimpan dalam basis data, atau disajikan ke pengguna visual.",
    role: "Database Server SQL, Display Monitor, Smart App User",
    meshType: "destination",
    color: 0xf43f5e,
    label: "Mesh 3D: Destination Server Tower & Orbiting Status Rings",
    details: `
      <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 space-y-1">
        <div class="font-mono text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
          <i data-lucide="database" class="w-3.5 h-3.5"></i> Pemrosesan Aplikasi & Konfirmasi ACK:
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">
          Data biner dikumpulkan oleh Application Layer (HTTP/SQL/RTSP) untuk ditampilkan ke layar pengguna. Setelah paket diterima 100% utuh, sistem mengirimkan sinyal konfirmasi balasan (ACK) ke pengirim.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Status Penerimaan:</span>
          <span class="text-rose-300 font-bold">ACK Sent (Sukses)</span>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <span class="text-slate-500 block text-[10px]">Target Akhir:</span>
          <span class="text-slate-200 font-bold">Database / UI User</span>
        </div>
      </div>
    `
  }
];

function resizeComponentCanvas() {
  const canvas = document.getElementById('component3DCanvas');
  if (!canvas || !compRenderer || !compCamera) return;

  const parent = canvas.parentElement;
  if (!parent) return;

  const w = parent.clientWidth || 450;
  const h = parent.clientHeight || 220;

  if (w > 0 && h > 0) {
    compCamera.aspect = w / h;
    compCamera.updateProjectionMatrix();
    compRenderer.setSize(w, h, true);
  }
}

function initComponent3DViewer() {
  const canvas = document.getElementById('component3DCanvas');
  if (!canvas) return;

  compScene = new THREE.Scene();

  // High Intensity Ambient Light
  const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
  compScene.add(ambLight);

  // Key & Fill Directional Lights
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight1.position.set(6, 10, 8);
  compScene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
  dirLight2.position.set(-6, -6, -5);
  compScene.add(dirLight2);

  // Dynamic Colored Point Light
  compPointLight = new THREE.PointLight(0x6366f1, 3.5, 18);
  compPointLight.position.set(0, 2, 4);
  compScene.add(compPointLight);

  const parent = canvas.parentElement;
  const w = (parent && parent.clientWidth > 0) ? parent.clientWidth : 450;
  const h = (parent && parent.clientHeight > 0) ? parent.clientHeight : 220;

  compCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  compCamera.position.set(0, 0, 4.2);

  compRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  compRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  compRenderer.setSize(w, h, true);

  inspectComponent(0);

  let lastW = w;
  let lastH = h;

  function animateCompLoop() {
    requestAnimationFrame(animateCompLoop);

    // Auto-detect size change when slide becomes visible
    if (canvas.parentElement) {
      const cw = canvas.parentElement.clientWidth;
      const ch = canvas.parentElement.clientHeight;
      if (cw > 0 && ch > 0 && (cw !== lastW || ch !== lastH)) {
        lastW = cw;
        lastH = ch;
        compCamera.aspect = cw / ch;
        compCamera.updateProjectionMatrix();
        compRenderer.setSize(cw, ch, true);
      }
    }

    // Animate Active Mesh & Sub-elements
    if (activeMeshGroup) {
      activeMeshGroup.rotation.y += 0.012;

      activeMeshGroup.children.forEach(child => {
        if (child.userData.isWaveRing) {
          child.scale.x += 0.012;
          child.scale.y += 0.012;
          child.scale.z += 0.012;
          if (child.scale.x > 1.8) {
            child.scale.set(0.6, 0.6, 0.6);
          }
        }
        if (child.userData.isLaserParticle) {
          child.position.y += child.userData.speed || 0.035;
          if (child.position.y > 1.3) child.position.y = -1.3;
        }
        if (child.userData.isOrbitRing) {
          child.rotation.z += child.userData.rotSpeed || 0.025;
        }
        if (child.userData.isParticleOrbit) {
          child.rotation.y += 0.03;
        }
      });
    }

    if (compRenderer && compScene && compCamera) {
      compRenderer.render(compScene, compCamera);
    }
  }
  animateCompLoop();
}

function renderMeshShape(meshType, colorHex) {
  if (!compScene) return;
  if (activeMeshGroup) compScene.remove(activeMeshGroup);
  activeMeshGroup = new THREE.Group();

  if (compPointLight) {
    compPointLight.color.setHex(colorHex);
  }

  const mainMat = new THREE.MeshPhongMaterial({
    color: colorHex,
    wireframe: isWireframe,
    shininess: 100,
    emissive: colorHex,
    emissiveIntensity: 0.35
  });

  const whiteCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
  const accentWireMat = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true, transparent: true, opacity: 0.4 });

  if (meshType === "source") {
    const cubeGeom = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const cube = new THREE.Mesh(cubeGeom, mainMat);
    activeMeshGroup.add(cube);

    const sphereGeom = new THREE.SphereGeometry(0.5, 20, 20);
    const sphere = new THREE.Mesh(sphereGeom, whiteCoreMat);
    activeMeshGroup.add(sphere);

    const wireCageGeom = new THREE.BoxGeometry(1.7, 1.7, 1.7);
    const wireCage = new THREE.Mesh(wireCageGeom, accentWireMat);
    activeMeshGroup.add(wireCage);

    const particleOrbitGroup = new THREE.Group();
    particleOrbitGroup.userData.isParticleOrbit = true;
    for (let i = 0; i < 8; i++) {
      const pGeom = new THREE.SphereGeometry(0.08, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 });
      const p = new THREE.Mesh(pGeom, pMat);
      const angle = (i / 8) * Math.PI * 2;
      p.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 0.4, Math.sin(angle) * 1.5);
      particleOrbitGroup.add(p);
    }
    activeMeshGroup.add(particleOrbitGroup);

  } else if (meshType === "transmitter") {
    const coneGeom = new THREE.ConeGeometry(0.85, 1.8, 20);
    const cone = new THREE.Mesh(coneGeom, mainMat);
    activeMeshGroup.add(cone);

    const tipGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const tip = new THREE.Mesh(tipGeom, whiteCoreMat);
    tip.position.y = 0.9;
    activeMeshGroup.add(tip);

    for (let r = 0; r < 3; r++) {
      const ringGeom = new THREE.TorusGeometry(1.0 + r * 0.35, 0.05, 12, 36);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: isWireframe });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.userData.isWaveRing = true;
      ring.scale.set(0.7 + r * 0.3, 0.7 + r * 0.3, 0.7 + r * 0.3);
      activeMeshGroup.add(ring);
    }

  } else if (meshType === "medium") {
    const tubeGeom = new THREE.CylinderGeometry(0.8, 0.8, 2.6, 24);
    const tubeMat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.6,
      shininess: 90
    });
    const tube = new THREE.Mesh(tubeGeom, tubeMat);
    tube.rotation.z = Math.PI / 4;
    activeMeshGroup.add(tube);

    const coreRodGeom = new THREE.CylinderGeometry(0.3, 0.3, 2.6, 16);
    const coreRod = new THREE.Mesh(coreRodGeom, whiteCoreMat);
    coreRod.rotation.z = Math.PI / 4;
    activeMeshGroup.add(coreRod);

    for (let p = 0; p < 5; p++) {
      const pulseGeom = new THREE.SphereGeometry(0.15, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const pulse = new THREE.Mesh(pulseGeom, pulseMat);
      pulse.position.set((p - 2) * 0.45, (p - 2) * 0.45, 0);
      pulse.userData.isLaserParticle = true;
      pulse.userData.speed = 0.03 + p * 0.005;
      activeMeshGroup.add(pulse);
    }

  } else if (meshType === "receiver") {
    const dishGeom = new THREE.SphereGeometry(1.3, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const dishMat = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      wireframe: isWireframe,
      side: THREE.DoubleSide,
      shininess: 100,
      emissive: 0xd97706,
      emissiveIntensity: 0.3
    });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.rotation.x = Math.PI / 4;
    activeMeshGroup.add(dish);

    const probePostGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 12);
    const probePost = new THREE.Mesh(probePostGeom, mainMat);
    probePost.position.set(0, 0, 0.5);
    probePost.rotation.x = Math.PI / 2;
    activeMeshGroup.add(probePost);

    const probeTipGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const probeTip = new THREE.Mesh(probeTipGeom, whiteCoreMat);
    probeTip.position.set(0, 0, 1.0);
    activeMeshGroup.add(probeTip);

    const catchRingGeom = new THREE.TorusGeometry(1.5, 0.04, 12, 36);
    const catchRingMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
    const catchRing = new THREE.Mesh(catchRingGeom, catchRingMat);
    catchRing.rotation.x = Math.PI / 4;
    activeMeshGroup.add(catchRing);

  } else {
    for (let s = 0; s < 3; s++) {
      const serverTierGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.4, 24);
      const tier = new THREE.Mesh(serverTierGeom, mainMat);
      tier.position.y = (s - 1) * 0.6;
      activeMeshGroup.add(tier);

      const stripGeom = new THREE.TorusGeometry(1.12, 0.03, 8, 32);
      const strip = new THREE.Mesh(stripGeom, whiteCoreMat);
      strip.position.y = (s - 1) * 0.6;
      strip.rotation.x = Math.PI / 2;
      activeMeshGroup.add(strip);
    }

    const orbit1Geom = new THREE.TorusGeometry(1.6, 0.05, 12, 36);
    const orbit1Mat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const orbit1 = new THREE.Mesh(orbit1Geom, orbit1Mat);
    orbit1.rotation.x = Math.PI / 3;
    orbit1.userData.isOrbitRing = true;
    orbit1.userData.rotSpeed = 0.02;
    activeMeshGroup.add(orbit1);

    const orbit2Geom = new THREE.TorusGeometry(1.8, 0.04, 12, 36);
    const orbit2Mat = new THREE.MeshBasicMaterial({ color: 0xfb7185 });
    const orbit2 = new THREE.Mesh(orbit2Geom, orbit2Mat);
    orbit2.rotation.y = Math.PI / 3;
    orbit2.userData.isOrbitRing = true;
    orbit2.userData.rotSpeed = -0.03;
    activeMeshGroup.add(orbit2);
  }

  compScene.add(activeMeshGroup);
}

function toggleMeshWireframe() {
  isWireframe = !isWireframe;
  const info = compData[currentCompIdx];
  renderMeshShape(info.meshType, info.color);
}

function inspectComponent(index) {
  currentCompIdx = index;

  for (let i = 0; i < 5; i++) {
    const btn = document.getElementById(`comp-btn-${i}`);
    if (btn) {
      if (i === index) {
        btn.classList.add('active-comp-card');
      } else {
        btn.classList.remove('active-comp-card');
      }
    }
  }

  const info = compData[index];
  const inspectBadge = document.getElementById('inspectBadge');
  if (inspectBadge) inspectBadge.innerText = info.badge;

  const inspectTitle = document.getElementById('inspectTitle');
  if (inspectTitle) inspectTitle.innerText = info.title;

  const inspectDesc = document.getElementById('inspectDesc');
  if (inspectDesc) inspectDesc.innerText = info.desc;

  const canvas3DLabel = document.getElementById('canvas3DLabel');
  if (canvas3DLabel) canvas3DLabel.innerText = info.label;

  const inspectDetailsBox = document.getElementById('inspectDetailsBox');
  if (inspectDetailsBox) inspectDetailsBox.innerHTML = info.details;

  resizeComponentCanvas();
  renderMeshShape(info.meshType, info.color);
  if (window.lucide) window.lucide.createIcons();
}

function triggerNodePulseTest() {
  if (!activeMeshGroup) return;
  activeMeshGroup.scale.set(1.35, 1.35, 1.35);
  setTimeout(() => activeMeshGroup.scale.set(1.0, 1.0, 1.0), 300);
}

window.addEventListener('resize', () => {
  if (typeof globalCamera !== 'undefined' && typeof globalRenderer !== 'undefined' && globalCamera && globalRenderer) {
    globalCamera.aspect = window.innerWidth / window.innerHeight;
    globalCamera.updateProjectionMatrix();
    globalRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  resizeComponentCanvas();
});
