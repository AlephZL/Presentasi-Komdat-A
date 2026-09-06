// ==========================================
// SLIDE ENGINE & NAVIGATION MODULE
// ==========================================
const slides = document.querySelectorAll('.slide');
const slideTitles = [
  "Pendahuluan & 3D Cover",
  "5 Komponen & 3D Inspector",
  "Simulasi Payload Teks Kustom",
  "Klasifikasi Arah & Karakteristik",
  "Live Oscilloscope & Jitter",
  "KomDat Cyber CTF: 10 Tahapan",
  "Sesi Q&A & Penutup"
];
let currentSlide = 0;

function checkDirectGameLink() {
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  if (hash.includes('game') || hash.includes('slide6') || search.includes('game')) {
    currentSlide = 5; // Direct to Slide 6 (KomDat Arcade Game)
    return true;
  }
  return false;
}
checkDirectGameLink();
window.addEventListener('hashchange', () => {
  checkDirectGameLink();
  updateSlideUI();
});

function renderDots() {
  const dotContainer = document.getElementById('slideDots');
  if (!dotContainer) return;
  dotContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `h-2 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-500'}`;
    dot.onclick = () => goToSlide(idx);
    dotContainer.appendChild(dot);
  });
}

function updateSlideUI() {
  slides.forEach((s, idx) => {
    s.classList.toggle('active', idx === currentSlide);
  });
  const indicator = document.getElementById('slideIndicator');
  if (indicator) indicator.innerText = `Slide 0${currentSlide + 1} / 0${slides.length}`;
  
  const titlePreview = document.getElementById('slideTitlePreview');
  if (titlePreview) titlePreview.innerText = slideTitles[currentSlide];
  
  renderDots();
  if (window.lucide) window.lucide.createIcons();

  // Trigger 3D Inspector resize when entering Slide 2 (index 1)
  if (currentSlide === 1 && typeof resizeComponentCanvas === 'function' && typeof inspectComponent === 'function') {
    setTimeout(() => {
      resizeComponentCanvas();
      inspectComponent(currentCompIdx);
    }, 60);
  }

  // Trigger Oscilloscope animation on Slide 5 (index 4)
  if (currentSlide === 4 && typeof drawOscilloscopeWaveform === 'function') {
    setTimeout(() => {
      drawOscilloscopeWaveform();
    }, 60);
  }
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    updateSlideUI();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlideUI();
  }
}

function goToSlide(idx) {
  currentSlide = idx;
  updateSlideUI();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key.toLowerCase() === 'f') toggleFullscreen();
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}
