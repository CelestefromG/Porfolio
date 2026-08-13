(() => {
  const imageCache = new Map();
  const imageCandidates = index => [
    `./assets/visual${index + 1}.png`,
    `./visual${index + 1}.png`,
    `./assets/visual${index + 1}`,
    `./visual${index + 1}`
  ];

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const applyHeroCopy = () => {
    const title = document.querySelector('.hero-copy [data-i18n="heroTitle"]');
    if (!title || isEnglish()) return;
    title.textContent = '陈思睿的作品集';
  };

  const applyContactPhoto = () => {
    const photo = document.querySelector('.id-card-main img');
    if (!photo) return;
    photo.src = './assets/photo3.png?v=20260814-1';
    photo.alt = 'Celeste Chen';
    photo.style.filter = 'none';
    photo.style.webkitFilter = 'none';
  };

  const resolveVisualImage = index => {
    if (imageCache.has(index)) return imageCache.get(index);

    const promise = new Promise(resolve => {
      const candidates = imageCandidates(index);
      let cursor = 0;
      const tryNext = () => {
        if (cursor >= candidates.length) {
          resolve(candidates[0]);
          return;
        }
        const src = candidates[cursor++];
        const image = new Image();
        image.onload = () => resolve(src);
        image.onerror = tryNext;
        image.src = src;
      };
      tryNext();
    });

    imageCache.set(index, promise);
    return promise;
  };

  const applyPosterImages = () => {
    const cards = [...document.querySelectorAll('.poster-scene .gallery-card')].slice(0, 6);
    cards.forEach(async (card, index) => {
      const art = card.querySelector('.gallery-art');
      if (!art) return;
      const src = await resolveVisualImage(index);
      art.classList.add('has-real-image');
      art.style.backgroundImage = `url("${src}")`;
      art.dataset.visualImage = src;
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

    resolveVisualImage(index).then(src => {
      requestAnimationFrame(() => {
        const visual = document.querySelector('.project-dialog .dialog-visual');
        if (!visual) return;
        visual.classList.add('has-real-image');
        visual.style.backgroundImage = `url("${src}")`;
      });
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
      applyContactPhoto();
      applyPosterImages();
    }, 20);
  });

  applyHeroCopy();
  applyContactPhoto();
  applyPosterImages();
})();