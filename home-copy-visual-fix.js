(() => {
  const imageCache = new Map();
  const imageCandidates = index => [`./assets/poster${index + 1}.png?v=20260814-1`];

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
    const src = imageCandidates(index)[0];
    imageCache.set(index, Promise.resolve(src));
    return imageCache.get(index);
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
  if (posterTrack) new MutationObserver(applyPosterImages).observe(posterTrack, { childList: true });

  document.addEventListener('click', event => {
    const card = event.target.closest('.poster-scene .gallery-card');
    if (!card) return;
    const cards = [...document.querySelectorAll('.poster-scene .gallery-card')];
    const index = cards.indexOf(card);
    if (index < 0 || index > 5) return;
    resolveVisualImage(index).then(src => requestAnimationFrame(() => {
      const visual = document.querySelector('.project-dialog .dialog-visual');
      if (!visual) return;
      visual.classList.add('has-real-image');
      visual.style.backgroundImage = `url("${src}")`;
    }));
  }, true);

  document.querySelector('.project-dialog')?.addEventListener('close', () => {
    const visual = document.querySelector('.project-dialog .dialog-visual');
    if (!visual) return;
    visual.classList.remove('has-real-image');
    visual.style.backgroundImage = '';
  });

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(() => {
    applyHeroCopy();
    applyContactPhoto();
    applyPosterImages();
  }, 20));

  applyHeroCopy();
  applyContactPhoto();
  applyPosterImages();
})();