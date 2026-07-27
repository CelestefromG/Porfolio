(() => {
  const scene = document.querySelector('.video-scene');
  const dongyangSection = scene?.querySelector('.dongyang-section');
  if (!scene || !dongyangSection || scene.dataset.douyinDragbookReady === 'true') return;
  scene.dataset.douyinDragbookReady = 'true';

  const cacheVersion = '20260728-1';
  const assets = {
    left: `./assets/sanqin-left.jpg?v=${cacheVersion}`,
    front: `./assets/sanqin-front.jpg?v=${cacheVersion}`,
    back: `./assets/sanqin-back.jpg?v=${cacheVersion}`,
    right: `./assets/sanqin-right.jpg?v=${cacheVersion}`
  };

  const section = document.createElement('section');
  section.className = 'douyin-dragbook-section';
  section.dataset.turned = 'false';
  section.innerHTML = `
    <div class="douyin-dragbook-inner">
      <header class="douyin-dragbook-heading">
        <p class="eyebrow">03D / DOUYIN</p>
        <h2 data-douyin-title>三秦青年</h2>
        <p data-douyin-intro>社会正面新闻与青年故事的短视频内容运营。长按右页并向左拖动，翻阅一次案例页。</p>
      </header>

      <div class="douyin-role-note">
        <b>CONTENT OPERATIONS / SHORT VIDEO</b>
        <span data-douyin-role>职责：选题 · 剪辑</span>
      </div>

      <div class="douyin-book-wrap">
        <div class="douyin-book-shell"></div>
        <div class="douyin-book-pages">
          <div class="douyin-page douyin-page-left">
            <div class="douyin-page-placeholder"><b>LEFT PAGE</b><span>sanqin-left.jpg</span></div>
            <img class="douyin-page-image" src="${assets.left}" alt="Sanqin Youth left page">
          </div>

          <div class="douyin-page douyin-page-right">
            <div class="douyin-page-placeholder"><b>NEXT RIGHT PAGE</b><span>sanqin-right.jpg</span></div>
            <img class="douyin-page-image" src="${assets.right}" alt="Sanqin Youth next right page">
          </div>

          <div class="douyin-flip-sheet" role="button" tabindex="0" aria-label="Drag to turn the page">
            <div class="douyin-flip-face douyin-flip-front">
              <div class="douyin-page-placeholder"><b>FRONT</b><span>sanqin-front.jpg</span></div>
              <img class="douyin-flip-image" src="${assets.front}" alt="Sanqin Youth page front">
            </div>
            <div class="douyin-flip-face douyin-flip-back">
              <div class="douyin-page-placeholder"><b>BACK</b><span>sanqin-back.jpg</span></div>
              <img class="douyin-flip-image" src="${assets.back}" alt="Sanqin Youth page back">
            </div>
          </div>
        </div>

        <div class="douyin-book-spine" aria-hidden="true"></div>
        <div class="douyin-rings" aria-hidden="true">
          <i class="douyin-ring"></i><i class="douyin-ring"></i><i class="douyin-ring"></i>
          <i class="douyin-ring"></i><i class="douyin-ring"></i><i class="douyin-ring"></i>
        </div>
      </div>

      <div class="douyin-drag-hint"><span></span><b></b></div>
    </div>
  `;
  dongyangSection.insertAdjacentElement('afterend', section);

  const sheet = section.querySelector('.douyin-flip-sheet');
  const images = [...section.querySelectorAll('img')];
  let progress = 0;
  let target = 0;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startProgress = 0;
  let raf = 0;

  images.forEach(image => {
    image.addEventListener('load', () => {
      image.previousElementSibling?.setAttribute('hidden', '');
    });
    image.addEventListener('error', () => {
      image.hidden = true;
    });
  });

  const clamp = value => Math.min(1, Math.max(0, value));

  function render() {
    raf = 0;
    if (!dragging) {
      progress += (target - progress) * .16;
      if (Math.abs(target - progress) > .001) raf = requestAnimationFrame(render);
      else progress = target;
    }
    sheet.style.setProperty('--turn-progress', progress.toFixed(4));
    section.dataset.turned = progress > .5 ? 'true' : 'false';
  }

  function requestRender() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  function beginDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startProgress = progress;
    target = progress;
    sheet.classList.add('is-dragging');
    sheet.setPointerCapture?.(pointerId);
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    const width = Math.max(1, sheet.getBoundingClientRect().width);
    const delta = (startX - event.clientX) / width;
    progress = clamp(startProgress + delta);
    target = progress;
    sheet.style.setProperty('--turn-progress', progress.toFixed(4));
    section.dataset.turned = progress > .5 ? 'true' : 'false';
    event.preventDefault();
  }

  function endDrag(event) {
    if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    dragging = false;
    sheet.classList.remove('is-dragging');
    sheet.releasePointerCapture?.(pointerId);
    pointerId = null;
    target = progress >= .5 ? 1 : 0;
    requestRender();
  }

  sheet.addEventListener('pointerdown', beginDrag);
  sheet.addEventListener('pointermove', moveDrag);
  sheet.addEventListener('pointerup', endDrag);
  sheet.addEventListener('pointercancel', endDrag);
  sheet.addEventListener('lostpointercapture', endDrag);
  sheet.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    target = target > .5 ? 0 : 1;
    requestRender();
  });

  const copy = {
    zh: {
      title: '三秦青年',
      intro: '社会正面新闻与青年故事的短视频内容运营。长按右页并向左拖动，翻阅一次案例页。',
      role: '职责：选题 · 剪辑'
    },
    en: {
      title: 'SANQIN YOUTH',
      intro: 'Short-form operations covering positive social news and youth stories. Press and drag the right page left to turn it once.',
      role: 'ROLE: TOPIC SELECTION · EDITING'
    }
  };

  function renderLanguage() {
    const lang = document.querySelector('.lang-en')?.classList.contains('is-active') ? 'en' : 'zh';
    section.querySelector('[data-douyin-title]').textContent = copy[lang].title;
    section.querySelector('[data-douyin-intro]').textContent = copy[lang].intro;
    section.querySelector('[data-douyin-role]').textContent = copy[lang].role;
  }

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 20));
  renderLanguage();
  requestRender();
})();