(() => {
  const applyDongyangCopy = () => {
    const section = document.querySelector('.dongyang-section');
    if (!section) return false;

    const isEnglish = document.querySelector('.lang-en')?.classList.contains('is-active');
    const title = section.querySelector('[data-dy-title]');
    const intro = section.querySelector('[data-dy-intro]');

    if (title) {
      title.innerHTML = isEnglish
        ? 'CITY MEDIA CENTER<br>OPERATIONS'
        : '市媒体中心运营';
    }

    if (intro) {
      intro.textContent = isEnglish
        ? 'Long-form coverage of local arts and cultural events. Hover over a folder to open its moving-image archive.'
        : '市媒体中心平台运营与地方艺术活动长视频记录。悬浮文件夹，打开对应影像档案。';
    }

    return true;
  };

  if (!applyDongyangCopy()) {
    const observer = new MutationObserver(() => {
      if (applyDongyangCopy()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    window.setTimeout(applyDongyangCopy, 20);
  });
})();
