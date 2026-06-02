(function () {
  let deferredInstallPrompt = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => null);
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    document.querySelectorAll('[data-install-app]').forEach((button) => button.classList.remove('hidden'));
  });

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-install-app]');
    if (!button || !deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch (error) {}
    deferredInstallPrompt = null;
    document.querySelectorAll('[data-install-app]').forEach((item) => item.classList.add('hidden'));
  });
})();
