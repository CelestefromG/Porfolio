(() => {
  const scene = document.querySelector('.video-scene');
  const dongyangSection = scene?.querySelector('.dongyang-section');
  if (!scene || !dongyangSection || scene.dataset.douyinReady === 'true') return;
  scene.dataset.douyinReady = 'true';

  const section = document.createElement('section');
  section.className = 'douyin-section';
  section.innerHTML = `
    <div class="douyin-sticky">
      <header class="douyin-heading">
        <p class="eyebrow">03D / DOUYIN</p>
        <h2 data-douyin-title>三秦青年</h2>
        <p data-douyin-intro>社会正面新闻与青年故事的短视频内容运营。向下滚动，翻阅作品册。</p>
      </header>

      <div class="douyin-meta">
        <b>CONTENT OPERATIONS / SHORT VIDEO</b>
        <span data-douyin-meta>社会新闻 · 青年故事 · 公益传播</span>
      </div>

      <div class="douyin-book-stage" aria-label="Douyin portfolio book">
        <div class="douyin-book">
          <div class="douyin-book-shadow" aria-hidden="true"></div>

          <div class="douyin-board douyin-board-left" aria-hidden="true">
            <span>DOUYIN / ARCHIVE</span><em>CEL</em>
          </div>
          <div class="douyin-board douyin-board-right" aria-hidden="true">
            <span>SHORT VIDEO</span><em>2026</em>
          </div>

          <div class="douyin-paper douyin-paper-base-left" aria-hidden="true">
            <span class="paper-number">00</span>
          </div>
          <div class="douyin-paper douyin-paper-base-right" aria-hidden="true">
            <span class="paper-number">04</span>
          </div>

          <article class="douyin-sheet douyin-sheet-3" data-sheet="3">
            <div class="sheet-face sheet-front"><span class="paper-number">03</span></div>
            <div class="sheet-face sheet-back"><span class="paper-number">04</span></div>
          </article>
          <article class="douyin-sheet douyin-sheet-2" data-sheet="2">
            <div class="sheet-face sheet-front"><span class="paper-number">02</span></div>
            <div class="sheet-face sheet-back"><span class="paper-number">03</span></div>
          </article>
          <article class="douyin-sheet douyin-sheet-1" data-sheet="1">
            <div class="sheet-face sheet-front"><span class="paper-number">01</span></div>
            <div class="sheet-face sheet-back"><span class="paper-number">02</span></div>
          </article>

          <div class="douyin-cover">
            <div class="douyin-cover-front">
              <span class="cover-index">03D / PLATFORM OPERATIONS</span>
              <strong>Douyin</strong>
              <small>三秦青年</small>
              <i>SHORT VIDEO ARCHIVE</i>
            </div>
            <div class="douyin-cover-back">
              <span>CONTENT BOOK</span><em>01—03</em>
            </div>
          </div>

          <div class="douyin-spine" aria-hidden="true"></div>
        </div>
      </div>

      <div class="douyin-progress" aria-live="polite">
        <span></span>
        <b data-douyin-progress-label>打开封面</b>
        <em><i data-douyin-current>0</i> / 3</em>
      </div>
    </div>
  `;
  dongyangSection.insertAdjacentElement('afterend', section);

  const book = section.querySelector('.douyin-book');
  const cover = section.querySelector('.douyin-cover');
  const sheets = [1, 2, 3].map(index => section.querySelector(`[data-sheet="${index}"]`));
  const currentNode = section.querySelector('[data-douyin-current]');
  const progressLabel = section.querySelector('[data-douyin-progress-label]');
  const progressLine = section.querySelector('.douyin-progress > span');
  let raf = 0;
  let lastPage = -1;

  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => 1 - Math.pow(1 - clamp(value), 3);
  const phase = (progress, start, end) => ease((progress - start) / (end - start));

  function getProgress() {
    const sceneRect = scene.getBoundingClientRect();
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - scene.clientHeight);
    return clamp((sceneRect.top - rect.top) / distance);
  }

  function update() {
    raf = 0;
    const progress = getProgress();
    const coverProgress = phase(progress, .02, .18);
    const page1 = phase(progress, .23, .40);
    const page2 = phase(progress, .46, .63);
    const page3 = phase(progress, .69, .86);

    book.style.setProperty('--book-shift', `${-25 * (1 - coverProgress)}%`);
    book.style.setProperty('--left-reveal', coverProgress.toFixed(4));
    book.style.setProperty('--left-scale', (0.35 + coverProgress * 0.65).toFixed(4));
    cover.style.setProperty('--cover-angle', `${-166 * coverProgress}deg`);
    sheets[0].style.setProperty('--sheet-angle', `${-174 * page1}deg`);
    sheets[1].style.setProperty('--sheet-angle', `${-174 * page2}deg`);
    sheets[2].style.setProperty('--sheet-angle', `${-174 * page3}deg`);

    const completed = page3 >= .93 ? 3 : page2 >= .93 ? 2 : page1 >= .93 ? 1 : 0;
    currentNode.textContent = String(completed);
    progressLine.style.setProperty('--douyin-progress', `${progress * 100}%`);

    const english = document.querySelector('.lang-en')?.classList.contains('is-active');
    const label = completed === 3
      ? (english ? 'END OF SAMPLE PAGES' : '示例页翻阅完成')
      : completed === 0 && coverProgress < .9
        ? (english ? 'OPENING COVER' : '打开封面')
        : (english ? `TURNING PAGE ${completed + 1}` : `翻至第 ${completed + 1} 页`);
    progressLabel.textContent = label;

    if (completed !== lastPage) {
      lastPage = completed;
      section.dataset.page = String(completed);
    }
  }

  function requestUpdate() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    const visible = entries[0]?.isIntersecting ?? false;
    document.body.classList.toggle('is-douyin-section', visible);
    if (visible) requestUpdate();
  }, { root: scene, threshold: .12 });
  observer.observe(section);

  scene.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  const copy = {
    zh: {
      title: '三秦青年',
      intro: '社会正面新闻与青年故事的短视频内容运营。向下滚动，翻阅作品册。',
      meta: '社会新闻 · 青年故事 · 公益传播'
    },
    en: {
      title: 'SANQIN YOUTH',
      intro: 'Short-form operations covering positive social news and youth stories. Scroll to turn the pages.',
      meta: 'SOCIAL NEWS · YOUTH STORIES · PUBLIC COMMUNICATION'
    }
  };

  function renderLanguage() {
    const lang = document.querySelector('.lang-en')?.classList.contains('is-active') ? 'en' : 'zh';
    section.querySelector('[data-douyin-title]').textContent = copy[lang].title;
    section.querySelector('[data-douyin-intro]').textContent = copy[lang].intro;
    section.querySelector('[data-douyin-meta]').textContent = copy[lang].meta;
    requestUpdate();
  }

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 20));
  renderLanguage();
  requestUpdate();
})();