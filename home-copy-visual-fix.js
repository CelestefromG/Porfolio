(() => {
  const imageSrc = index => `./assets/poster${index + 1}.png?v=20260814-7`;

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

  const posterTrack = document.querySelector('.poster-scene .gallery-track');
  if (posterTrack) {
    new MutationObserver(() => requestAnimationFrame(applyPosterImages)).observe(posterTrack, {
      childList: true,
      subtree: true
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