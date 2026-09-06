// ==========================================
// MAIN ENTRY POINT & DOM INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  if (typeof updateSlideUI === 'function') updateSlideUI();
  if (typeof initGlobal3DBackground === 'function') initGlobal3DBackground();
  if (typeof initComponent3DViewer === 'function') initComponent3DViewer();
  if (typeof selectDirectionMode === 'function') selectDirectionMode('simplex');
  if (typeof initKomdatChallengeGame === 'function') initKomdatChallengeGame();
  if (typeof renderQuizModal === 'function') renderQuizModal();

  const qrCanvas = document.getElementById("qrcodeCanvas");
  if (qrCanvas && typeof QRCode !== 'undefined') {
    const qrTarget = window.location.href.includes('http') ? window.location.href : 'https://google.com';
    new QRCode(qrCanvas, {
      text: qrTarget,
      width: 140,
      height: 140,
      colorDark : "#05070d",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.M
    });
  }

  if (window.lucide) window.lucide.createIcons();
});
