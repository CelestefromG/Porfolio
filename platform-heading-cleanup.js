(() => {
  const applyCompactTitles = () => {
    const isEnglish = document.querySelector('.lang-en')?.classList.contains('is-active');

    const xhsTitle = document.querySelector('[data-xhs-title]');
    if (xhsTitle) xhsTitle.textContent = isEnglish ? 'XIAOHONGSHU' : '小红书';

    const biliTitle = document.querySelector('[data-bili-title]');
    if (biliTitle) biliTitle.textContent = isEnglish ? 'BILIBILI' : 'Bilibili';
  };

  applyCompactTitles();
  requestAnimationFrame(applyCompactTitles);

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    window.setTimeout(applyCompactTitles, 80);
  });
})();
