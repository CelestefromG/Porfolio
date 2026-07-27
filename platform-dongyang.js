(() => {
  const scene = document.querySelector('.video-scene');
  const biliSection = scene?.querySelector('.bili-scroll-section');
  if (!scene || !biliSection || scene.dataset.dongyangReady === 'true') return;
  scene.dataset.dongyangReady = 'true';

  const cacheVersion = '20260727-1';
  const folders = [
    {
      code: 'DY-01',
      video: `./assets/Dongyang_Video1.mp4?v=${cacheVersion}`,
      poster: `./assets/visual4?v=${cacheVersion}`,
      zh: '东阳艺术活动记录',
      en: 'Dongyang Art Event Record',
      descZh: '地方艺术活动长视频 · 现场记录与后期剪辑',
      descEn: 'Long-form local arts coverage · field recording and editing'
    },
    {
      code: 'DY-02',
      video: `./assets/Dongyang_Video2.mp4?v=${cacheVersion}`,
      poster: `./assets/poster2?v=${cacheVersion}`,
      zh: '舞台与展演现场',
      en: 'Stage & Performance Archive',
      descZh: '表演影像 · 活动流程 · 文化传播',
      descEn: 'Performance film · event flow · cultural communication'
    },
    {
      code: 'DY-03',
      video: `./assets/Dongyang_Video3.mp4?v=${cacheVersion}`,
      poster: `./assets/visual5?v=${cacheVersion}`,
      zh: '地方文化影像',
      en: 'Local Culture in Motion',
      descZh: '人文记录 · 环境空镜 · 长视频叙事',
      descEn: 'Cultural documentation · atmosphere shots · long-form narrative'
    },
    {
      code: 'DY-04',
      video: `./assets/Dongyang_Video4.mp4?v=${cacheVersion}`,
      poster: `./assets/visual6?v=${cacheVersion}`,
      zh: '歌画东阳精选',
      en: 'Gehua Dongyang Selection',
      descZh: '艺术活动 · 在地表达 · 视频号发布',
      descEn: 'Arts events · local storytelling · Channels publishing'
    }
  ];

  const section = document.createElement('section');
  section.className = 'dongyang-section';
  section.innerHTML = `
    <div class="dongyang-sticky">
      <header class="dongyang-heading">
        <p class="eyebrow">03C / WECHAT CHANNELS</p>
        <h2 data-dy-title>歌画东阳<br>影像文件</h2>
        <p data-dy-intro>地方艺术活动的长视频记录。悬浮文件夹，打开对应影像档案。</p>
      </header>

      <div class="dongyang-meta">
        <b>GEHUA DONGYANG / VIDEO CHANNEL</b>
        <span data-dy-meta>LOCAL ARTS · LONG-FORM VIDEO · CULTURAL RECORD</span>
      </div>

      <div class="dongyang-stack" aria-label="Gehua Dongyang video folders"></div>

      <div class="dongyang-instruction">
        <span></span><b data-dy-hint>悬浮文件夹以打开</b><em>04 FILES</em>
      </div>
    </div>
  `;
  biliSection.insertAdjacentElement('afterend', section);

  const stack = section.querySelector('.dongyang-stack');
  const folderNodes = [];
  let activeIndex = -1;
  let sectionVisible = false;

  folders.forEach((folder, index) => {
    const item = document.createElement('article');
    item.className = 'dongyang-folder';
    item.tabIndex = 0;
    item.dataset.folderIndex = String(index);
    item.style.setProperty('--folder-index', index);
    item.innerHTML = `
      <div class="dongyang-folder-back">
        <div class="dongyang-tab"><span>${String(index + 1).padStart(2, '0')}</span><b>${folder.code}</b></div>
        <div class="dongyang-file-content">
          <div class="dongyang-file-copy">
            <span>${folder.code} / VIDEO ARCHIVE</span>
            <h3></h3>
            <p></p>
          </div>
          <div class="dongyang-player">
            <img src="${folder.poster}" alt="Gehua Dongyang video preview ${index + 1}">
            <video src="${folder.video}" muted loop playsinline preload="metadata" aria-label="Gehua Dongyang video ${index + 1}"></video>
            <div class="dongyang-player-ui"><span>PLAYING</span><b>00:${String(18 + index * 7).padStart(2, '0')}</b></div>
          </div>
        </div>
      </div>
      <div class="dongyang-folder-front">
        <span>${folder.code}</span>
        <b></b>
        <em>GEHUA DONGYANG</em>
      </div>
    `;
    stack.appendChild(item);
    folderNodes.push(item);

    const video = item.querySelector('video');
    video.addEventListener('loadeddata', () => item.classList.add('is-video-ready'));
    video.addEventListener('error', () => {
      item.classList.remove('is-video-ready');
      video.removeAttribute('src');
    });

    const open = () => openFolder(index);
    item.addEventListener('mouseenter', open);
    item.addEventListener('focusin', open);
    item.addEventListener('click', event => {
      event.preventDefault();
      activeIndex === index ? closeFolders() : openFolder(index);
    });
    item.addEventListener('mouseleave', () => {
      if (!item.matches(':focus-within')) closeFolders();
    });
    item.addEventListener('focusout', event => {
      if (!item.contains(event.relatedTarget)) closeFolders();
    });
  });

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');
  const text = {
    zh: {
      title: '歌画东阳<br>影像文件',
      intro: '地方艺术活动的长视频记录。悬浮文件夹，打开对应影像档案。',
      meta: '地方艺术 · 长视频 · 文化记录',
      hint: '悬浮文件夹以打开'
    },
    en: {
      title: 'GEHUA DONGYANG<br>VIDEO FILES',
      intro: 'Long-form documentation of local arts events. Hover over a folder to open its moving-image archive.',
      meta: 'LOCAL ARTS · LONG-FORM VIDEO · CULTURAL RECORD',
      hint: 'HOVER A FOLDER TO OPEN'
    }
  };

  function renderLanguage() {
    const lang = isEnglish() ? 'en' : 'zh';
    const copy = text[lang];
    section.querySelector('[data-dy-title]').innerHTML = copy.title;
    section.querySelector('[data-dy-intro]').textContent = copy.intro;
    section.querySelector('[data-dy-meta]').textContent = copy.meta;
    section.querySelector('[data-dy-hint]').textContent = copy.hint;

    folderNodes.forEach((node, index) => {
      const folder = folders[index];
      node.querySelector('.dongyang-file-copy h3').textContent = folder[lang];
      node.querySelector('.dongyang-file-copy p').textContent = lang === 'zh' ? folder.descZh : folder.descEn;
      node.querySelector('.dongyang-folder-front b').textContent = folder[lang];
    });
  }

  function syncPlayback() {
    folderNodes.forEach((node, index) => {
      const video = node.querySelector('video');
      if (sectionVisible && index === activeIndex && node.classList.contains('is-video-ready')) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  function openFolder(index) {
    activeIndex = index;
    stack.classList.add('has-open-folder');
    folderNodes.forEach((node, nodeIndex) => {
      node.classList.toggle('is-open', nodeIndex === index);
      node.classList.toggle('is-before', nodeIndex < index);
      node.classList.toggle('is-after', nodeIndex > index);
      node.style.setProperty('--folder-shift', nodeIndex < index ? '-32px' : nodeIndex > index ? '58px' : '0px');
    });
    syncPlayback();
  }

  function closeFolders() {
    activeIndex = -1;
    stack.classList.remove('has-open-folder');
    folderNodes.forEach(node => {
      node.classList.remove('is-open', 'is-before', 'is-after');
      node.style.setProperty('--folder-shift', '0px');
    });
    syncPlayback();
  }

  new IntersectionObserver(entries => {
    sectionVisible = entries[0]?.isIntersecting ?? false;
    document.body.classList.toggle('is-dongyang-section', sectionVisible);
    if (!sectionVisible) closeFolders();
    syncPlayback();
  }, { root: scene, threshold: .25 }).observe(section);

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 0));
  renderLanguage();
})();
