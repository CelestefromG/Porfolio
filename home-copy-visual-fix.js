(() => {
  const imageCache = new Map();
  const imageCandidates = index => [
    `./assets/visual${index + 1}.png`,
    `./visual${index + 1}.png`,
    `./assets/visual${index + 1}`,
    `./visual${index + 1}`
  ];

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const injectTapeOverride = () => {
    if (document.querySelector('#tape-visual-override')) return;
    const style = document.createElement('style');
    style.id = 'tape-visual-override';
    style.textContent = '.longform-lite-stage{overflow:auto!important;scrollbar-width:none!important;padding:70px 0 180px!important}.longform-lite-stage::-webkit-scrollbar{display:none!important}.longform-lite-tape{position:relative!important;left:auto!important;top:auto!important;width:min(30vw,390px)!important;height:auto!important;margin:0 auto!important;overflow:visible!important;transform:rotate(-10deg)!important;filter:drop-shadow(0 28px 44px rgba(0,0,0,.18))!important}.longform-lite-tape:before{content:""!important;position:absolute!important;left:50%!important;top:-58px!important;width:110px!important;height:110px!important;transform:translateX(-50%)!important;border:1px solid #111!important;border-radius:50%!important;background:radial-gradient(circle,#aaa 0 17%,#eee 18% 40%,#999 41% 45%,#ddd 46% 72%,#888 73% 76%,#ccc 77%)!important;z-index:3!important}.longform-lite-tape img{display:block!important;width:100%!important;height:auto!important;user-select:none!important}.longform-lite-panel{overflow:hidden!important}@media(max-width:700px){.longform-lite-tape{width:60vw!important}}';
    document.head.appendChild(style);
  };

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
        if (cursor >= candidates.length) return resolve(candidates[0]);
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
    applyHeroCopy(); applyContactPhoto(); applyPosterImages();
  }, 20));

  injectTapeOverride();
  applyHeroCopy();
  applyContactPhoto();
  applyPosterImages();
})();