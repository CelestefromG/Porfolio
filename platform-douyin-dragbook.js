(() => {
  const scene = document.querySelector('.video-scene');
  const dongyangSection = scene?.querySelector('.dongyang-section');
  if (!scene || !dongyangSection || scene.dataset.douyinDragbookReady === 'true') return;
  scene.dataset.douyinDragbookReady = 'true';

  const cacheVersion = '20260728-2';
  const assets = {
    leftMain: `./assets/sanqin-left-main.jpg?v=${cacheVersion}`,
    leftSmall: `./assets/sanqin-left-small.jpg?v=${cacheVersion}`,
    frontMain: `./assets/sanqin-front-main.jpg?v=${cacheVersion}`,
    frontSmall: `./assets/sanqin-front-small.jpg?v=${cacheVersion}`,
    backMain: `./assets/sanqin-back-main.jpg?v=${cacheVersion}`,
    backSmall: `./assets/sanqin-back-small.jpg?v=${cacheVersion}`,
    rightMain: `./assets/sanqin-right-main.jpg?v=${cacheVersion}`,
    rightSmall: `./assets/sanqin-right-small.jpg?v=${cacheVersion}`
  };

  const framedPage = ({ main, small, mainName, smallName, page, alt }) => `
    <div class="douyin-page-layout">
      <figure class="douyin-photo-frame douyin-photo-main">
        <div class="douyin-photo-placeholder"><b>MAIN IMAGE</b><span>${mainName}</span></div>
        <img src="${main}" alt="${alt} main image">
      </figure>
      <figure class="douyin-photo-frame douyin-photo-small">
        <div class="douyin-photo-placeholder"><b>DETAIL</b><span>${smallName}</span></div>
        <img src="${small}" alt="${alt} detail image">
      </figure>
      <div class="douyin-page-index"><span>DOUYIN / SANQIN YOUTH</span><b>${page}</b></div>
    </div>
  `;

  const section = document.createElement('section');
  section.className = 'douyin-dragbook-section';
  section.dataset.turned = 'false';
  section.innerHTML = `
    <div class="douyin-dragbook-inner">
      <header class="douyin-dragbook-heading">
        <p class="eyebrow">03D / DOUYIN</p>
        <h2 data-douyin-title>省融媒体平台运营</h2>
        <p data-douyin-intro>省级融媒体平台短视频内容运营。长按右页并向左拖动，翻阅一次案例页。</p>
      </header>

      <div class="douyin-role-note">
        <b>CONTENT OPERATIONS / SHORT VIDEO</b>
        <span data-douyin-role>职责：选题 · 剪辑</span>
      </div>

      <div class="douyin-book-wrap">
        <div class="douyin-book-shell"></div>
        <div class="douyin-book-pages">
          <div class="douyin-page douyin-page-left">
            ${framedPage({
              main: assets.leftMain,
              small: assets.leftSmall,
              mainName: 'sanqin-left-main.jpg',
              smallName: 'sanqin-left-small.jpg',
              page: '01',
              alt: 'Sanqin Youth left page'
            })}
          </div>

          <div class="douyin-page douyin-page-right">
            ${framedPage({
              main: assets.rightMain,
              small: assets.rightSmall,
              mainName: 'sanqin-right-main.jpg',
              smallName: 'sanqin-right-small.jpg',
              page: '04',
              alt: 'Sanqin Youth next right page'
            })}
          </div>

          <div class="douyin-flip-sheet" role="button" tabindex="0" aria-label="Drag to turn the page">
            <div class="douyin-flip-face douyin-flip-front">
              ${framedPage({
                main: assets.frontMain,
                small: assets.frontSmall,
                mainName: 'sanqin-front-main.jpg',
                smallName: 'sanqin-front-small.jpg',
                page: '02',
                alt: 'Sanqin Youth page front'
              })}
            </div>
            <div class="douyin-flip-face douyin-flip-back">
              ${framedPage({
                main: assets.backMain,
                small: assets.backSmall,
                mainName: 'sanqin-back-main.jpg',
                smallName: 'sanqin-back-small.jpg',
                page: '03',
                alt: 'Sanqin Youth page back'
              })}
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
  const images = [...section.querySelectorAll('.douyin-photo-frame img')];
  let progress = 0;
  let target = 0;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startProgress = 0;
  let raf = 0;

  images.forEach(image => {
    const frame = image.closest('.douyin-photo-frame');
    const placeholder = frame?.querySelector('.douyin-photo-placeholder');
    image.addEventListener('load', () => placeholder?.setAttribute('hidden', ''));
    image.addEventListener('error', () => {
      image.hidden = true;
      placeholder?.removeAttribute('hidden');
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
      title: '省融媒体平台运营',
      intro: '省级融媒体平台短视频内容运营。长按右页并向左拖动，翻阅一次案例页。',
      role: '职责：选题 · 剪辑'
    },
    en: {
      title: 'PROVINCIAL MEDIA PLATFORM OPERATIONS',
      intro: 'Short-form content operations for a provincial converged media platform. Press and drag the right page left to turn it once.',
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