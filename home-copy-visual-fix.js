(() => {
  const visualImages = Array.from({ length: 6 }, (_, index) => `./assets/visual${index + 1}.png`);

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const applyHeroCopy = () => {
    const title = document.querySelector('.hero-copy [data-i18n="heroTitle"]');
    if (!title || isEnglish()) return;
    title.textContent = '作品集 / 视觉 / 数据';
  };

  const applyPosterImages = () => {
    const cards = [...document.querySelectorAll('.poster-scene .gallery-card')].slice(0, 6);
    cards.forEach((card, index) => {
      const art = card.querySelector('.gallery-art');
      if (!art) return;
      art.classList.add('has-real-image');
      art.style.backgroundImage = `url("${visualImages[index]}")`;
      art.dataset.visualImage = visualImages[index];
    });
  };

  const posterTrack = document.querySelector('.poster-scene .gallery-track');
  if (posterTrack) {
    new MutationObserver(applyPosterImages).observe(posterTrack, { childList: true });
  }

  document.addEventListener('click', event => {
    const card = event.target.closest('.poster-scene .gallery-card');
    if (!card) return;
    const cards = [...document.querySelectorAll('.poster-scene .gallery-card')];
    const index = cards.indexOf(card);
    if (index < 0 || index > 5) return;

    requestAnimationFrame(() => {
      const visual = document.querySelector('.project-dialog .dialog-visual');
      if (!visual) return;
      visual.classList.add('has-real-image');
      visual.style.backgroundImage = `url("${visualImages[index]}")`;
    });
  }, true);

  document.querySelector('.project-dialog')?.addEventListener('close', () => {
    const visual = document.querySelector('.project-dialog .dialog-visual');
    if (!visual) return;
    visual.classList.remove('has-real-image');
    visual.style.backgroundImage = '';
  });

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    setTimeout(() => {
      applyHeroCopy();
      applyPosterImages();
    }, 20);
  });

  applyHeroCopy();
  applyPosterImages();
})();
