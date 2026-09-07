// ==========================================
// SLIDE ENGINE & CINEMATIC TRANSITIONS
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

// ==========================================
// DIRECT GAME LINK CHECK
// ==========================================
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
  if (checkDirectGameLink()) {
    goToSlide(5);
  }
});

// ==========================================
// SLIDE NAVIGATION DOTS WITH FLUID EXPANSION
// ==========================================
function renderDots() {
  const dotContainer = document.getElementById('slideDots');
  if (!dotContainer) return;
  dotContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    const isActive = idx === currentSlide;
    dot.className = `h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
      isActive
        ? 'w-7 sm:w-8 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
        : 'w-2.5 bg-slate-700 hover:w-5 hover:bg-slate-400'
    }`;
    dot.setAttribute('title', `${idx + 1}. ${slideTitles[idx]}`);
    dot.setAttribute('aria-label', `Pindah ke slide ${idx + 1}: ${slideTitles[idx]}`);
    dot.onclick = () => goToSlide(idx);
    dotContainer.appendChild(dot);
  });
}

// ==========================================
// NAVIGATION UI & COMPONENT HOOKS
// ==========================================
function updateNavUI() {
  const indicator = document.getElementById('slideIndicator');
  if (indicator) {
    indicator.innerText = `Slide 0${currentSlide + 1} / 0${slides.length}`;
    indicator.classList.remove('animate-title-pop');
    void indicator.offsetWidth;
    indicator.classList.add('animate-title-pop');
  }
  
  const titlePreview = document.getElementById('slideTitlePreview');
  if (titlePreview) {
    titlePreview.innerText = slideTitles[currentSlide];
  }
  
  renderDots();

  const btnPrev = document.getElementById('btnPrevSlide');
  const btnNext = document.getElementById('btnNextSlide');
  if (btnPrev) {
    const isFirst = currentSlide === 0;
    btnPrev.disabled = isFirst;
    btnPrev.classList.toggle('opacity-30', isFirst);
    btnPrev.classList.toggle('pointer-events-none', isFirst);
  }
  if (btnNext) {
    const isLast = currentSlide === slides.length - 1;
    btnNext.disabled = isLast;
    btnNext.classList.toggle('opacity-30', isLast);
    btnNext.classList.toggle('pointer-events-none', isLast);
  }

  if (window.lucide) window.lucide.createIcons();
}

function triggerSlideHooks(slideIdx) {
  // Trigger 3D Inspector resize when entering Slide 2 (index 1)
  if (slideIdx === 1 && typeof resizeComponentCanvas === 'function' && typeof inspectComponent === 'function') {
    setTimeout(() => {
      resizeComponentCanvas();
      inspectComponent(currentCompIdx);
    }, 60);
  }

  // Trigger Oscilloscope animation on Slide 5 (index 4)
  if (slideIdx === 4) {
    setTimeout(() => {
      if (typeof setupOscilloscopeControls === 'function') {
        setupOscilloscopeControls();
      }
      if (typeof drawOscilloscopeWaveform === 'function') {
        drawOscilloscopeWaveform();
      }
    }, 60);
  }
}

// ==========================================
// SILKY SMOOTH OPACITY SLIDE ENGINE
// ==========================================
let isSlideTransitioning = false;
let slideTransitionTimer = null;

// Direct immediate render without transition (for initial load / recovery)
function updateSlideUI() {
  if (slideTransitionTimer) {
    clearTimeout(slideTransitionTimer);
    slideTransitionTimer = null;
  }
  isSlideTransitioning = false;

  window.scrollTo({ top: 0, behavior: 'instant' });

  slides.forEach((s, idx) => {
    s.classList.remove('slide-enter', 'slide-exit');
    if (idx === currentSlide) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  updateNavUI();
  triggerSlideHooks(currentSlide);
}

// Silky Smooth Opacity Dissolve Transition
function goToSlide(targetIdx) {
  if (targetIdx < 0 || targetIdx >= slides.length || targetIdx === currentSlide) return;

  // Clear any existing transition timers
  if (slideTransitionTimer) {
    clearTimeout(slideTransitionTimer);
    slideTransitionTimer = null;
    slides.forEach((s, idx) => {
      if (idx !== currentSlide && idx !== targetIdx) {
        s.classList.remove('active', 'slide-enter', 'slide-exit');
      }
    });
  }

  const currentSlideElem = document.querySelector('.slide.active');
  const targetSlideElem = slides[targetIdx];
  currentSlide = targetIdx;

  // Update indicators immediately for responsive tactile feedback
  updateNavUI();

  if (currentSlideElem && currentSlideElem !== targetSlideElem) {
    isSlideTransitioning = true;
    currentSlideElem.classList.remove('slide-enter');
    currentSlideElem.classList.add('slide-exit');

    slideTransitionTimer = setTimeout(() => {
      currentSlideElem.classList.remove('active', 'slide-exit');
      window.scrollTo({ top: 0, behavior: 'instant' });

      targetSlideElem.classList.remove('slide-exit');
      targetSlideElem.classList.add('active', 'slide-enter');
      triggerSlideHooks(currentSlide);

      slideTransitionTimer = setTimeout(() => {
        targetSlideElem.classList.remove('slide-enter');
        isSlideTransitioning = false;
        slideTransitionTimer = null;
      }, 340);
    }, 200);
  } else {
    updateSlideUI();
  }
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
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

// ==========================================
// LIVE AMBIENT TELEMETRY TICKER
// ==========================================
function initLiveTelemetryTicker() {
  const telemetryElem = document.getElementById('telemetrySpeed');
  if (!telemetryElem) return;
  
  setInterval(() => {
    const speeds = ['10.4 Gbps', '10.8 Gbps', '11.2 Gbps', '9.9 Gbps', '12.1 Gbps', '10.6 Gbps'];
    const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
    telemetryElem.innerText = randomSpeed;
  }, 2500);
}
initLiveTelemetryTicker();
