(() => {
  const imageSrc = index => `./assets/poster${index + 1}.png?v=20260814-4`;

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

  const showPosterDetail = index => {
    if (index < 0 || index > 5) return;
    const visual = document.querySelector('.project-dialog .dialog-visual');
    if (!visual) return;

    visual.classList.add('has-real-image');
    visual.style.setProperty('background', '#f5f3ef', 'important');
    visual.style.setProperty('background-image', 'none', 'important');
    visual.replaceChildren();

    const img = document.createElement('img');
    img.src = imageSrc(index);
    img.alt = `Poster ${index + 1}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
    visual.appendChild(img);
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

    requestAnimationFrame(() => showPosterDetail(index));
  });

  document.querySelector('.project-dialog')?.addEventListener('close', () => {
    const visual = document.querySelector('.project-dialog .dialog-visual');
    if (!visual) return;
    visual.replaceChildren();
    visual.classList.remove('has-real-image');
    visual.style.removeProperty('background');
    visual.style.removeProperty('background-image');
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