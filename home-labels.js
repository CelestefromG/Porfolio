(() => {
  const POSTER_IMAGE = './assets/gufeng-poster-2024.jpg?v=20260724-1';

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const posterCopy = () => isEnglish()
    ? {
        title: 'Chinese-style Poster',
        description: 'A Chinese-style poster completed in December 2024, combining classical painting, seal-script details and calligraphic typography into a traditional visual composition.',
        role: 'Visual design / poster layout',
        tools: 'Photoshop',
        year: '2024.12',
        tags: ['Visual Design', 'Chinese Style', 'Poster']
      }
    : {
        title: '古风海报',
        description: '2024年12月完成的古风主题海报，以传统绘画、印章与书法字体构建具有古典氛围的视觉构图。',
        role: '视觉设计 / 海报排版',
        tools: 'Photoshop',
        year: '2024.12',
        tags: ['视觉设计', '古风', '海报']
      };

  const applyLabels = () => {
    const english = isEnglish();
    const visualDesign = document.querySelector('[data-i18n="poster"]');
    const visualDesignTitle = document.querySelector('[data-i18n="posterTitle"]');
    const platformOperations = document.querySelector('[data-i18n="video"]');
    const platformDescription = document.querySelector('[data-i18n="videoDesc"]');

    if (visualDesign) visualDesign.textContent = english ? 'VISUAL DESIGN' : '视觉设计';
    if (visualDesignTitle) visualDesignTitle.textContent = english ? 'Visual Design' : '视觉设计';
    if (platformOperations) platformOperations.textContent = english ? 'PLATFORM OPERATIONS' : '平台运营';
    if (platformDescription) {
      platformDescription.textContent = english
        ? 'Content strategy, account operations & growth'
        : '内容策划、账号运营与增长';
    }
  };

  const getFirstPosterCard = () => document.querySelector('.poster-scene .gallery-track .gallery-card:first-child');

  const applyRealPoster = () => {
    const card = getFirstPosterCard();
    if (!card) return;

    const copy = posterCopy();
    const art = card.querySelector('.gallery-art');
    const title = card.querySelector('.card-copy b');
    const year = card.querySelector('.card-copy span');

    card.dataset.realPoster = 'gufeng-2024';
    card.setAttribute('aria-label', copy.title);

    if (art) {
      art.dataset.code = 'VIS-01';
      art.style.setProperty('--card-pattern', 'none');
      art.style.backgroundImage = `url("${POSTER_IMAGE}")`;
      art.style.backgroundSize = 'cover';
      art.style.backgroundPosition = 'center top';
      art.style.backgroundRepeat = 'no-repeat';
    }
    if (title) title.textContent = copy.title;
    if (year) year.textContent = copy.year;
  };

  const fillPosterDialog = () => {
    const dialog = document.querySelector('.project-dialog');
    if (!dialog) return;

    const copy = posterCopy();
    const visual = dialog.querySelector('.dialog-visual');
    const kicker = dialog.querySelector('.dialog-kicker');
    const title = dialog.querySelector('h3');
    const description = dialog.querySelector('.dialog-description');
    const role = dialog.querySelector('.dialog-role');
    const tools = dialog.querySelector('.dialog-tools');
    const year = dialog.querySelector('.dialog-year');
    const tags = dialog.querySelector('.dialog-tags');

    dialog.dataset.customPoster = 'gufeng-2024';
    if (visual) {
      visual.style.backgroundImage = `url("${POSTER_IMAGE}")`;
      visual.style.backgroundSize = 'contain';
      visual.style.backgroundPosition = 'center';
      visual.style.backgroundRepeat = 'no-repeat';
      visual.style.backgroundColor = '#efe4ca';
    }
    if (kicker) kicker.textContent = 'VIS-01 / VISUAL DESIGN';
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.description;
    if (role) role.textContent = copy.role;
    if (tools) tools.textContent = copy.tools;
    if (year) year.textContent = copy.year;
    if (tags) tags.innerHTML = copy.tags.map(tag => `<span>${tag}</span>`).join('');

    if (!dialog.open) dialog.showModal();
  };

  const init = () => {
    applyLabels();
    applyRealPoster();

    const track = document.querySelector('.poster-scene .gallery-track');
    if (track) {
      new MutationObserver(() => window.requestAnimationFrame(applyRealPoster))
        .observe(track, { childList: true, subtree: true });
    }

    document.addEventListener('click', event => {
      const card = event.target.closest('.poster-scene .gallery-card[data-real-poster="gufeng-2024"]');
      if (!card) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      fillPosterDialog();
    }, true);

    document.querySelector('.lang-toggle')?.addEventListener('click', () => {
      window.setTimeout(() => {
        applyLabels();
        applyRealPoster();
        const dialog = document.querySelector('.project-dialog');
        if (dialog?.dataset.customPoster === 'gufeng-2024' && dialog.open) fillPosterDialog();
      }, 0);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();