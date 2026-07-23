(() => {
  const applyHomeLabels = () => {
    const isEnglish = document.querySelector('.lang-en')?.classList.contains('is-active');
    const visualDesign = document.querySelector('[data-i18n="poster"]');
    const platformOperations = document.querySelector('[data-i18n="video"]');
    const platformDescription = document.querySelector('[data-i18n="videoDesc"]');

    if (visualDesign) visualDesign.textContent = isEnglish ? 'VISUAL DESIGN' : '视觉设计';
    if (platformOperations) platformOperations.textContent = isEnglish ? 'PLATFORM OPERATIONS' : '平台运营';
    if (platformDescription) {
      platformDescription.textContent = isEnglish
        ? 'Content strategy, account operations & growth'
        : '内容策划、账号运营与增长';
    }
  };

  const init = () => {
    applyHomeLabels();
    document.querySelector('.lang-toggle')?.addEventListener('click', () => {
      window.setTimeout(applyHomeLabels, 0);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
