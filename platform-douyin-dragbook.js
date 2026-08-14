(() => {
  const scene = document.querySelector('.video-scene');
  const dongyangSection = scene?.querySelector('.dongyang-section');
  if (!scene || !dongyangSection || scene.dataset.douyinDragbookReady === 'true') return;
  scene.dataset.douyinDragbookReady = 'true';

  const cacheVersion = '20260728-3';
  const assets = {
    leftMain: `./assets/sanqin-left-main.png?v=${cacheVersion}`,
    leftSmall: `./assets/sanqin-left-small.png?v=${cacheVersion}`,
    frontMain: `./assets/sanqin-front-main.png?v=${cacheVersion}`,
    frontSmall: `./assets/sanqin-front-small.png?v=${cacheVersion}`,
    backMain: `./assets/sanqin-back-main.png?v=${cacheVersion}`,
    backSmall: `./assets/sanqin-back-small.png?v=${cacheVersion}`,
    rightMain: `./assets/sanqin-right-main.png?v=${cacheVersion}`,
    rightSmall: `./assets/sanqin-right-small.png?v=${cacheVersion}`
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
      <div class="douyin-page-index"><span>SHORT VIDEO / WECHAT EDITORIAL</span><b>${page}</b></div>
    </div>`;

  const section = document.createElement('section');
  section.className = 'douyin-dragbook-section';
  section.dataset.turned = 'false';
  section.innerHTML = `
    <div class="douyin-dragbook-inner">
      <header class="douyin-dragbook-heading">
        <p class="eyebrow">03D / NEWS & NEW MEDIA</p>
        <h2 data-douyin-title>新闻与新媒体内容</h2>
        <p data-douyin-intro>短视频与公众号内容编辑。点击右页翻阅案例页。</p>
      </header>
      <div class="douyin-role-note"><b>SHORT VIDEO / WECHAT EDITORIAL</b><span data-douyin-role>职责：选题 · 剪辑 · 图文排版</span></div>
      <div class="douyin-book-wrap">
        <div class="douyin-book-shell"></div>
        <div class="douyin-book-pages">
          <div class="douyin-page douyin-page-left">${framedPage({main:assets.leftMain,small:assets.leftSmall,mainName:'sanqin-left-main.png',smallName:'sanqin-left-small.png',page:'01',alt:'News and new media left page'})}</div>
          <div class="douyin-page douyin-page-right">${framedPage({main:assets.rightMain,small:assets.rightSmall,mainName:'sanqin-right-main.png',smallName:'sanqin-right-small.png',page:'04',alt:'News and new media next right page'})}</div>
          <div class="douyin-flip-sheet" role="button" tabindex="0" aria-label="Click to turn the page">
            <div class="douyin-flip-face douyin-flip-front">${framedPage({main:assets.frontMain,small:assets.frontSmall,mainName:'sanqin-front-main.png',smallName:'sanqin-front-small.png',page:'02',alt:'News and new media page front'})}</div>
            <div class="douyin-flip-face douyin-flip-back">${framedPage({main:assets.backMain,small:assets.backSmall,mainName:'sanqin-back-main.png',smallName:'sanqin-back-small.png',page:'03',alt:'News and new media page back'})}</div>
          </div>
        </div>
        <div class="douyin-book-spine" aria-hidden="true"></div>
        <div class="douyin-rings" aria-hidden="true"><i class="douyin-ring"></i><i class="douyin-ring"></i><i class="douyin-ring"></i><i class="douyin-ring"></i><i class="douyin-ring"></i><i class="douyin-ring"></i></div>
      </div>
      <div class="douyin-drag-hint"><span></span><b></b></div>
    </div>`;
  dongyangSection.insertAdjacentElement('afterend', section);

  const sheet = section.querySelector('.douyin-flip-sheet');
  const images = [...section.querySelectorAll('.douyin-photo-frame img')];
  let progress = 0;
  let target = 0;
  let raf = 0;

  images.forEach(image => {
    const frame = image.closest('.douyin-photo-frame');
    const placeholder = frame?.querySelector('.douyin-photo-placeholder');
    image.addEventListener('load', () => placeholder?.setAttribute('hidden', ''));
    image.addEventListener('error', () => { image.hidden = true; placeholder?.removeAttribute('hidden'); });
  });

  function render() {
    raf = 0;
    progress += (target - progress) * .16;
    if (Math.abs(target - progress) > .001) raf = requestAnimationFrame(render);
    else progress = target;
    sheet.style.setProperty('--turn-progress', progress.toFixed(4));
    section.dataset.turned = progress > .5 ? 'true' : 'false';
  }

  function requestRender() { if (!raf) raf = requestAnimationFrame(render); }
  function togglePage() {
    target = target > .5 ? 0 : 1;
    section.dataset.turned = target > .5 ? 'true' : 'false';
    requestRender();
  }

  sheet.addEventListener('click', event => { event.preventDefault(); togglePage(); });
  sheet.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    togglePage();
  });

  const copy = {
    zh: { title:'新闻与新媒体内容', intro:'短视频与公众号内容编辑。点击右页翻阅案例页。', role:'职责：选题 · 剪辑 · 图文排版' },
    en: { title:'NEWS & NEW MEDIA CONTENT', intro:'Short-video and WeChat editorial work. Click the right page to turn it.', role:'ROLE: TOPIC SELECTION · EDITING · EDITORIAL LAYOUT' }
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