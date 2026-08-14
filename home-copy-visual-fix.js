(() => {
  const imageCache = new Map();
  const imageSrc = index => `./assets/poster${index + 1}.png?v=20260814-2`;
  let pendingDialogIndex = null;

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
    if (!imageCache.has(index)) imageCache.set(index, Promise.resolve(imageSrc(index)));
    return imageCache.get(index);
  };

  const applyPosterImages = () => {
    const cards = [...document.querySelectorAll('.poster-scene .gallery-card')].slice(0, 6);
    cards.forEach((card, index) => {
      const art = card.querySelector('.gallery-art');
      if (!art) return;
      const src = imageSrc(index);
      art.classList.add('has-real-image');
      art.style.setProperty('background-image', `url("${src}")`, 'important');
      art.style.setProperty('background-size', 'cover', 'important');
      art.style.setProperty('background-position', 'center', 'important');
      art.dataset.visualImage = src;
    });
  };

  const applyDialogImage = index => {
    if (index == null || index < 0 || index > 5) return;
    const dialog = document.querySelector('.project-dialog');
    const visual = dialog?.querySelector('.dialog-visual');
    if (!visual) return;
    const src = imageSrc(index);
    visual.classList.add('has-real-image');
    visual.style.setProperty('background-image', `url("${src}")`, 'important');
    visual.style.setProperty('background-size', 'contain', 'important');
    visual.style.setProperty('background-position', 'center', 'important');
    visual.style.setProperty('background-repeat', 'no-repeat', 'important');
    visual.dataset.visualImage = src;
  };

  const posterTrack = document.querySelector('.poster-scene .gallery-track');
  if (posterTrack) {
    new MutationObserver(() => requestAnimationFrame(applyPosterImages)).observe(posterTrack, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener('click', event => {
    const card = event.target.closest('.poster-scene .gallery-card');
    if (!card) return;
    const cards = [...document.querySelectorAll('.poster-scene .gallery-card')];
    const index = cards.indexOf(card);
    if (index < 0 || index > 5) return;
    pendingDialogIndex = index;
    requestAnimationFrame(() => requestAnimationFrame(() => applyDialogImage(index)));
    setTimeout(() => applyDialogImage(index), 80);
  }, true);

  const dialog = document.querySelector('.project-dialog');
  if (dialog) {
    new MutationObserver(() => {
      if (dialog.hasAttribute('open') && pendingDialogIndex != null) {
        requestAnimationFrame(() => applyDialogImage(pendingDialogIndex));
      }
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });

    dialog.addEventListener('close', () => {
      pendingDialogIndex = null;
      const visual = dialog.querySelector('.dialog-visual');
      if (!visual) return;
      visual.classList.remove('has-real-image');
      visual.style.removeProperty('background-image');
      visual.style.removeProperty('background-size');
      visual.style.removeProperty('background-position');
      visual.style.removeProperty('background-repeat');
      delete visual.dataset.visualImage;
    });
  }

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(() => {
    applyHeroCopy();
    applyContactPhoto();
    applyPosterImages();
  }, 20));

  applyHeroCopy();
  applyContactPhoto();
  applyPosterImages();
})();