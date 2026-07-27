(() => {
  const scene = document.querySelector('.video-scene');
  const xhsSection = scene?.querySelector('.xhs-scrapbook');
  if (!scene || !xhsSection || scene.dataset.bilibiliReady === 'true') return;
  scene.dataset.bilibiliReady = 'true';

  const cacheVersion = '20260727-1';
  const channels = [
    {
      video: `./assets/bilibili1.mp4?v=${cacheVersion}`,
      poster: `./assets/poster1?v=${cacheVersion}`,
      zh: 'MMD 渲染记录 01',
      en: 'MMD Rendering Study 01'
    },
    {
      video: `./assets/bilibili2.mp4?v=${cacheVersion}`,
      poster: `./assets/visual5?v=${cacheVersion}`,
      zh: 'MMD 镜头实验 02',
      en: 'MMD Camera Experiment 02'
    },
    {
      video: `./assets/bilibili3.mp4?v=${cacheVersion}`,
      poster: `./assets/visual6?v=${cacheVersion}`,
      zh: 'MMD 氛围渲染 03',
      en: 'MMD Atmosphere Render 03'
    }
  ];

  const section = document.createElement('section');
  section.className = 'bili-scroll-section';
  section.innerHTML = `
    <div class="bili-sticky">
      <header class="bili-heading">
        <p class="eyebrow">03B / BILIBILI</p>
        <h2 data-bili-title>Bilibili<br>MMD放映</h2>
        <p data-bili-intro>个人自媒体账号中的MMD渲染、镜头编排与视觉氛围实验。向下滚动，在电视中切换三段内容。</p>
      </header>

      <div class="bili-system-meta">
        <b data-bili-account>BILIBILI / PERSONAL ACCOUNT</b>
        <span data-bili-label>MMD · CAMERA · LIGHTING · RENDERING</span>
      </div>

      <div class="bili-tv-stage">
        <div class="bili-tv" aria-label="Bilibili video monitor">
          <div class="bili-tv-body">
            <div class="bili-screen-bezel">
              <div class="bili-screen"></div>
            </div>
            <div class="bili-tv-lower">
              <span class="bili-power" aria-hidden="true"></span>
              <span class="bili-machine-label">CELESTE / MMD</span>
              <span class="bili-drive-slot" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="bili-caption" aria-live="polite">
        <span class="bili-caption-index">VIDEO 01 / 03</span>
        <h3></h3>
        <p data-bili-role>镜头编排 · 灯光设置 · MMD渲染 · 后期剪辑</p>
      </div>

      <nav class="bili-channel-index" aria-label="Bilibili video index"></nav>

      <div class="bili-scroll-meter" aria-hidden="true">
        <div class="bili-meter-track"><span></span></div>
        <div class="bili-meter-copy"><span data-bili-scroll>SCROLL TO SWITCH</span><b>01 / 03</b></div>
      </div>

      <span class="bili-next-note" data-bili-note>继续下滑 · 切换电视信号</span>
    </div>
  `;
  xhsSection.insertAdjacentElement('afterend', section);

  const sticky = section.querySelector('.bili-sticky');
  const tv = section.querySelector('.bili-tv');
  const screen = section.querySelector('.bili-screen');
  const indexNav = section.querySelector('.bili-channel-index');
  const captionIndex = section.querySelector('.bili-caption-index');
  const captionTitle = section.querySelector('.bili-caption h3');
  const meterCurrent = section.querySelector('.bili-meter-copy b');

  channels.forEach((channel, index) => {
    const signal = document.createElement('article');
    signal.className = 'bili-signal';
    signal.dataset.signalIndex = String(index);
    signal.innerHTML = `
      <img src="${channel.poster}" alt="Bilibili MMD preview ${index + 1}">
      <video src="${channel.video}" muted loop playsinline preload="metadata" aria-label="Bilibili MMD video ${index + 1}"></video>
    `;
    screen.appendChild(signal);

    const video = signal.querySelector('video');
    video.addEventListener('loadeddata', () => {
      signal.classList.add('is-video-ready');
      if (signal.classList.contains('is-active')) video.play().catch(() => {});
    });
    video.addEventListener('error', () => {
      signal.classList.remove('is-video-ready');
      video.removeAttribute('src');
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>`;
    button.setAttribute('aria-label', `Show Bilibili video ${index + 1}`);
    button.addEventListener('click', () => {
      const maxScroll = Math.max(1, section.offsetHeight - scene.clientHeight);
      const target = section.offsetTop + maxScroll * (index / Math.max(channels.length - 1, 1));
      scene.scrollTo({ top: target, behavior: 'smooth' });
    });
    indexNav.appendChild(button);
  });

  let activeIndex = -1;
  let sectionVisible = false;
  let rafPending = false;

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const text = {
    zh: {
      title: 'Bilibili<br>MMD放映',
      intro: '个人自媒体账号中的MMD渲染、镜头编排与视觉氛围实验。向下滚动，在电视中切换三段内容。',
      role: '镜头编排 · 灯光设置 · MMD渲染 · 后期剪辑',
      note: '继续下滑 · 切换电视信号',
      scroll: '滚动切换视频'
    },
    en: {
      title: 'BILIBILI<br>MMD SCREENINGS',
      intro: 'MMD rendering, camera direction and visual-atmosphere studies from a personal media account. Scroll to switch between three films.',
      role: 'CAMERA DIRECTION · LIGHTING · MMD RENDERING · EDITING',
      note: 'KEEP SCROLLING · SWITCH SIGNAL',
      scroll: 'SCROLL TO SWITCH'
    }
  };

  const renderLanguage = () => {
    const language = isEnglish() ? 'en' : 'zh';
    const copy = text[language];
    section.querySelector('[data-bili-title]').innerHTML = copy.title;
    section.querySelector('[data-bili-intro]').textContent = copy.intro;
    section.querySelector('[data-bili-role]').textContent = copy.role;
    section.querySelector('[data-bili-note]').textContent = copy.note;
    section.querySelector('[data-bili-scroll]').textContent = copy.scroll;
    if (activeIndex >= 0) captionTitle.textContent = channels[activeIndex][language];
  };

  const playActiveSignal = () => {
    screen.querySelectorAll('.bili-signal').forEach((signal, index) => {
      const video = signal.querySelector('video');
      if (sectionVisible && index === activeIndex && signal.classList.contains('is-video-ready')) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const setActiveIndex = index => {
    const nextIndex = Math.max(0, Math.min(channels.length - 1, index));
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;

    tv.classList.remove('is-switching');
    void tv.offsetWidth;
    tv.classList.add('is-switching');
    window.setTimeout(() => tv.classList.remove('is-switching'), 430);

    screen.querySelectorAll('.bili-signal').forEach((signal, signalIndex) => {
      signal.classList.toggle('is-active', signalIndex === activeIndex);
    });
    indexNav.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeIndex);
    });

    const language = isEnglish() ? 'en' : 'zh';
    const displayIndex = String(activeIndex + 1).padStart(2, '0');
    captionIndex.textContent = `VIDEO ${displayIndex} / 03`;
    captionTitle.textContent = channels[activeIndex][language];
    meterCurrent.textContent = `${displayIndex} / 03`;
    playActiveSignal();
  };

  const updateFromScroll = () => {
    rafPending = false;
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(1, section.offsetHeight - scene.clientHeight);
    const travelled = Math.max(0, Math.min(scrollable, -rect.top));
    const progress = travelled / scrollable;
    const index = Math.min(channels.length - 1, Math.floor(progress * channels.length));

    sticky.style.setProperty('--bili-progress', String(progress));
    tv.style.setProperty('--tv-scale', String(1 + Math.sin(progress * Math.PI) * .045));
    setActiveIndex(index);
  };

  const requestUpdate = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(updateFromScroll);
  };

  scene.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  new IntersectionObserver(entries => {
    sectionVisible = entries[0]?.isIntersecting ?? false;
    document.body.classList.toggle('is-bili-section', sectionVisible);
    playActiveSignal();
    if (sectionVisible) requestUpdate();
  }, { root: scene, threshold: .28 }).observe(sticky);

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    setTimeout(renderLanguage, 0);
  });

  setActiveIndex(0);
  renderLanguage();
  requestUpdate();
})();
