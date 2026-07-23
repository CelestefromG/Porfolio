(() => {
  const VERSION = '20260724-2';
  const visualWorks = [
    { src: `./assets/poster1?v=${VERSION}`, custom: true },
    { src: `./assets/poster2?v=${VERSION}` },
    { src: `./assets/poster3?v=${VERSION}` },
    { src: `./assets/visual4?v=${VERSION}` },
    { src: `./assets/visual5?v=${VERSION}` },
    { src: `./assets/visual6?v=${VERSION}` }
  ];

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const firstPosterCopy = () => isEnglish()
    ? {
        title: 'Chinese-style Poster',
        description: 'A Chinese-style poster completed in December 2024, combining classical painting, seal details and calligraphic typography into a traditional visual composition.',
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

  const applyVisualCards = () => {
    const cards = [...document.querySelectorAll('.poster-scene .gallery-track .gallery-card')];
    if (!cards.length) return;

    cards.slice(0, visualWorks.length).forEach((card, index) => {
      const work = visualWorks[index];
      const art = card.querySelector('.gallery-art');
      if (!art) return;

      card.dataset.visualIndex = String(index);
      art.classList.add('has-real-image');
      art.style.backgroundImage = `url("${work.src}")`;
      art.style.backgroundSize = 'cover';
      art.style.backgroundPosition = 'center';
      art.style.backgroundRepeat = 'no-repeat';

      if (index === 0) {
        const copy = firstPosterCopy();
        const title = card.querySelector('.card-copy b');
        const year = card.querySelector('.card-copy span');
        art.dataset.code = 'VIS-01';
        card.setAttribute('aria-label', copy.title);
        if (title) title.textContent = copy.title;
        if (year) year.textContent = copy.year;
      }
    });
  };

  const resetDialogVisual = () => {
    const visual = document.querySelector('.dialog-visual');
    if (!visual) return;
    visual.classList.remove('has-real-image');
    visual.style.removeProperty('background-image');
    visual.style.removeProperty('background-size');
    visual.style.removeProperty('background-position');
    visual.style.removeProperty('background-repeat');
    visual.style.removeProperty('background-color');
  };

  const applyDialogImage = index => {
    const dialog = document.querySelector('.project-dialog');
    const visual = dialog?.querySelector('.dialog-visual');
    const work = visualWorks[index];
    if (!dialog || !visual || !work) return;

    visual.classList.add('has-real-image');
    visual.style.backgroundImage = `url("${work.src}")`;
    visual.style.backgroundSize = 'contain';
    visual.style.backgroundPosition = 'center';
    visual.style.backgroundRepeat = 'no-repeat';
    visual.style.backgroundColor = '#e9e5dc';

    if (index === 0) {
      const copy = firstPosterCopy();
      const kicker = dialog.querySelector('.dialog-kicker');
      const title = dialog.querySelector('h3');
      const description = dialog.querySelector('.dialog-description');
      const role = dialog.querySelector('.dialog-role');
      const tools = dialog.querySelector('.dialog-tools');
      const year = dialog.querySelector('.dialog-year');
      const tags = dialog.querySelector('.dialog-tags');

      if (kicker) kicker.textContent = 'VIS-01 / VISUAL DESIGN';
      if (title) title.textContent = copy.title;
      if (description) description.textContent = copy.description;
      if (role) role.textContent = copy.role;
      if (tools) tools.textContent = copy.tools;
      if (year) year.textContent = copy.year;
      if (tags) tags.innerHTML = copy.tags.map(tag => `<span>${tag}</span>`).join('');
    }
  };

  const init = () => {
    applyLabels();
    applyVisualCards();

    const track = document.querySelector('.poster-scene .gallery-track');
    if (track) {
      new MutationObserver(() => requestAnimationFrame(applyVisualCards))
        .observe(track, { childList: true, subtree: true });
    }

    document.addEventListener('click', event => {
      if (event.target.closest('[data-project], .video-scene .gallery-card')) {
        resetDialogVisual();
      }

      const card = event.target.closest('.poster-scene .gallery-card[data-visual-index]');
      if (!card) return;
      const index = Number(card.dataset.visualIndex);
      window.setTimeout(() => applyDialogImage(index), 0);
    });

    document.querySelector('.lang-toggle')?.addEventListener('click', () => {
      window.setTimeout(() => {
        applyLabels();
        applyVisualCards();
      }, 0);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();