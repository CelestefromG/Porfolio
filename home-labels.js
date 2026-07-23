(() => {
  /* A fresh query string on every page load prevents replaced same-name images
     (for example assets/visual4) from being reused from the browser cache. */
  const CACHE_BUST = Date.now();

  const visualWorks = [
    {
      src: `./assets/poster1?v=${CACHE_BUST}`,
      zh: { title: '古风海报', date: '2024.12', project: '校公众号制作', style: '古风' },
      en: { title: 'Chinese-style Poster', date: '2024.12', project: 'University WeChat Account', style: 'Chinese Style' }
    },
    {
      src: `./assets/poster2?v=${CACHE_BUST}`,
      zh: { title: '视觉作品 02', date: '待补充', project: '待补充', style: '视觉设计' },
      en: { title: 'Visual Work 02', date: 'To be added', project: 'To be added', style: 'Visual Design' }
    },
    {
      src: `./assets/poster3?v=${CACHE_BUST}`,
      zh: { title: '视觉作品 03', date: '待补充', project: '待补充', style: '视觉设计' },
      en: { title: 'Visual Work 03', date: 'To be added', project: 'To be added', style: 'Visual Design' }
    },
    {
      src: `./assets/visual4?v=${CACHE_BUST}`,
      zh: { title: '视觉作品 04', date: '待补充', project: '待补充', style: '视觉设计' },
      en: { title: 'Visual Work 04', date: 'To be added', project: 'To be added', style: 'Visual Design' }
    },
    {
      src: `./assets/visual5?v=${CACHE_BUST}`,
      zh: { title: '视觉作品 05', date: '待补充', project: '待补充', style: '视觉设计' },
      en: { title: 'Visual Work 05', date: 'To be added', project: 'To be added', style: 'Visual Design' }
    },
    {
      src: `./assets/visual6?v=${CACHE_BUST}`,
      zh: { title: '视觉作品 06', date: '待补充', project: '待补充', style: '视觉设计' },
      en: { title: 'Visual Work 06', date: 'To be added', project: 'To be added', style: 'Visual Design' }
    }
  ];

  let activeVisualIndex = null;

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');
  const workCopy = index => visualWorks[index]?.[isEnglish() ? 'en' : 'zh'];

  const injectStyles = () => {
    if (document.querySelector('#poster-expand-styles')) return;
    const style = document.createElement('style');
    style.id = 'poster-expand-styles';
    style.textContent = `
      .poster-expanded-view {
        position: absolute;
        inset: 74px 0 0;
        z-index: 70;
        display: grid;
        place-items: center;
        padding: 28px 5vw 34px;
        overflow: auto;
        background: rgba(245, 243, 239, .985);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity .38s ease, visibility .38s ease;
      }

      .poster-expanded-view.is-open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .poster-expanded-inner {
        width: min(900px, 92vw);
        min-height: min-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 18px 0 34px;
      }

      .poster-expanded-close {
        position: fixed;
        top: 94px;
        right: 30px;
        z-index: 2;
        width: 42px;
        height: 42px;
        border: 1px solid #111 !important;
        background: #f5f3ef !important;
        font: 400 24px/1 "IBM Plex Mono", monospace !important;
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity .3s .15s ease, transform .45s .15s cubic-bezier(.22,1,.36,1), background .25s, color .25s;
      }

      .poster-expanded-close:hover {
        background: #111 !important;
        color: #f5f3ef;
      }

      .poster-expanded-image-wrap {
        display: grid;
        place-items: center;
        width: 100%;
        min-height: 42vh;
      }

      .poster-expanded-image {
        display: block;
        max-width: min(62vw, 720px);
        max-height: 61vh;
        width: auto;
        height: auto;
        object-fit: contain;
        box-shadow: 0 30px 80px rgba(18, 18, 20, .18);
        opacity: 0;
        transform: translateY(34px) scale(.72);
        transform-origin: center center;
        transition: opacity .42s ease, transform .78s cubic-bezier(.16,1,.3,1);
      }

      .poster-expanded-info {
        width: min(720px, 82vw);
        margin-top: 28px;
        border-top: 1px solid rgba(15, 16, 18, .45);
        padding-top: 18px;
      }

      .poster-expanded-title {
        margin: 0 0 18px;
        font-size: clamp(22px, 2.4vw, 34px);
        font-weight: 500;
        letter-spacing: -.04em;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity .4s .34s ease, transform .55s .34s cubic-bezier(.22,1,.36,1);
      }

      .poster-expanded-meta {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }

      .poster-expanded-meta div {
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .4s ease, transform .58s cubic-bezier(.22,1,.36,1);
      }

      .poster-expanded-meta div:nth-child(1) { transition-delay: .44s; }
      .poster-expanded-meta div:nth-child(2) { transition-delay: .52s; }
      .poster-expanded-meta div:nth-child(3) { transition-delay: .60s; }

      .poster-expanded-meta small {
        display: block;
        margin-bottom: 7px;
        opacity: .5;
        font: 500 9px/1.2 "IBM Plex Mono", monospace;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .poster-expanded-meta strong {
        font-size: 14px;
        font-weight: 500;
      }

      .poster-expanded-view.is-open .poster-expanded-close,
      .poster-expanded-view.is-open .poster-expanded-image,
      .poster-expanded-view.is-open .poster-expanded-title,
      .poster-expanded-view.is-open .poster-expanded-meta div {
        opacity: 1;
        transform: none;
      }

      @media (max-width: 700px) {
        .poster-expanded-view { padding: 24px 22px 32px; }
        .poster-expanded-close { top: 86px; right: 16px; }
        .poster-expanded-image { max-width: 82vw; max-height: 55vh; }
        .poster-expanded-info { width: 82vw; margin-top: 22px; }
        .poster-expanded-meta { grid-template-columns: 1fr; gap: 15px; }
      }
    `;
    document.head.appendChild(style);
  };

  const createExpandedView = () => {
    const scene = document.querySelector('.poster-scene');
    if (!scene || scene.querySelector('.poster-expanded-view')) return;

    const view = document.createElement('section');
    view.className = 'poster-expanded-view';
    view.setAttribute('aria-hidden', 'true');
    view.innerHTML = `
      <div class="poster-expanded-inner">
        <button class="poster-expanded-close" type="button" aria-label="Close expanded work">×</button>
        <div class="poster-expanded-image-wrap">
          <img class="poster-expanded-image" alt="" />
        </div>
        <div class="poster-expanded-info">
          <h3 class="poster-expanded-title"></h3>
          <div class="poster-expanded-meta">
            <div><small data-meta-label="date"></small><strong data-meta-value="date"></strong></div>
            <div><small data-meta-label="project"></small><strong data-meta-value="project"></strong></div>
            <div><small data-meta-label="style"></small><strong data-meta-value="style"></strong></div>
          </div>
        </div>
      </div>
    `;

    scene.appendChild(view);
    view.querySelector('.poster-expanded-close')?.addEventListener('click', closeExpandedView);
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
      const copy = workCopy(index);
      const art = card.querySelector('.gallery-art');
      const title = card.querySelector('.card-copy b');
      const year = card.querySelector('.card-copy span');
      if (!art || !copy) return;

      card.dataset.visualIndex = String(index);
      card.setAttribute('aria-label', copy.title);
      art.classList.add('has-real-image');
      art.dataset.code = `VIS-${String(index + 1).padStart(2, '0')}`;
      art.style.backgroundImage = `url("${work.src}")`;
      art.style.backgroundSize = 'cover';
      art.style.backgroundPosition = 'center';
      art.style.backgroundRepeat = 'no-repeat';
      if (title) title.textContent = copy.title;
      if (year) year.textContent = copy.date === '待补充' || copy.date === 'To be added' ? '' : copy.date;
    });
  };

  const renderExpandedCopy = index => {
    const view = document.querySelector('.poster-expanded-view');
    const work = visualWorks[index];
    const copy = workCopy(index);
    if (!view || !work || !copy) return;

    const english = isEnglish();
    const image = view.querySelector('.poster-expanded-image');
    const title = view.querySelector('.poster-expanded-title');
    const labels = {
      date: english ? 'DATE' : '制作日期',
      project: english ? 'PROJECT' : '项目',
      style: english ? 'STYLE' : '风格'
    };

    if (image) {
      image.src = work.src;
      image.alt = copy.title;
    }
    if (title) title.textContent = copy.title;

    Object.entries(labels).forEach(([key, label]) => {
      const labelNode = view.querySelector(`[data-meta-label="${key}"]`);
      const valueNode = view.querySelector(`[data-meta-value="${key}"]`);
      if (labelNode) labelNode.textContent = label;
      if (valueNode) valueNode.textContent = copy[key];
    });
  };

  const openExpandedView = index => {
    const view = document.querySelector('.poster-expanded-view');
    const oldDialog = document.querySelector('.project-dialog');
    if (!view || !visualWorks[index]) return;

    if (oldDialog?.open) oldDialog.close();
    activeVisualIndex = index;
    renderExpandedCopy(index);
    view.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => view.classList.add('is-open'));
  };

  function closeExpandedView() {
    const view = document.querySelector('.poster-expanded-view');
    if (!view) return;
    view.classList.remove('is-open');
    view.setAttribute('aria-hidden', 'true');
    activeVisualIndex = null;
  }

  const init = () => {
    injectStyles();
    createExpandedView();
    applyLabels();
    applyVisualCards();

    const track = document.querySelector('.poster-scene .gallery-track');
    if (track) {
      new MutationObserver(() => requestAnimationFrame(applyVisualCards))
        .observe(track, { childList: true, subtree: true });
    }

    /* Capture the event before the original card listener opens the old dialog. */
    document.addEventListener('click', event => {
      const card = event.target.closest('.poster-scene .gallery-card[data-visual-index]');
      if (!card) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openExpandedView(Number(card.dataset.visualIndex));
    }, true);

    document.querySelector('.lang-toggle')?.addEventListener('click', () => {
      window.setTimeout(() => {
        applyLabels();
        applyVisualCards();
        if (activeVisualIndex !== null) renderExpandedCopy(activeVisualIndex);
      }, 0);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && activeVisualIndex !== null) closeExpandedView();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();