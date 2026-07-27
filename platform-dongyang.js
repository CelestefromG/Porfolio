(() => {
  const scene = document.querySelector('.video-scene');
  const biliSection = scene?.querySelector('.bili-scroll-section');
  if (!scene || !biliSection || scene.dataset.dongyangReady === 'true') return;
  scene.dataset.dongyangReady = 'true';

  const cacheVersion = '20260727-4';
  const folders = [
    {
      code: 'CM-01',
      poster: `./assets/Dongyang1.png?v=${cacheVersion}`,
      zh: '新玩家·品藏丨金华东阳市博物馆：探索甲骨文之旅',
      en: 'New Player · Collection | Dongyang Museum: Exploring Oracle Bone Script',
      shortZh: '探索甲骨文之旅',
      shortEn: 'Oracle Bone Script',
      roleZh: '负责脚本、拍摄与剪辑',
      roleEn: 'SCRIPT · FILMING · EDITING',
      href: 'https://article.xuexi.cn/articles/index.html?art_id=980197970118944775&t=1722846226652&showmenu=false&cdn=https%3A%2F%2Fregion-zhejiang-resource&study_style_id=video_default&source=share&share_to=wx_single&item_id=980197970118944775&ref_read_id=635AD730-88E2-49CF-ABE4-7F753984F5BC'
    },
    {
      code: 'CM-02',
      poster: `./assets/dongyang2.png?v=${cacheVersion}`,
      zh: '最想去的地方丨金华东阳林村：岁月留古韵 林海藏“桃源”',
      en: 'A Place I Long to Visit | Lincun, Dongyang: Ancient Charm and a Forest Utopia',
      shortZh: '林村：林海藏“桃源”',
      shortEn: 'Lincun Forest Utopia',
      roleZh: '负责拍摄与剪辑',
      roleEn: 'FILMING · EDITING',
      href: 'https://article.xuexi.cn/articles/index.html?art_id=13032662399543710553&t=1723797499934&showmenu=false&cdn=https%3A%2F%2Fregion-zhejiang-resource&study_style_id=video_default&source=share&share_to=wx_single&item_id=13032662399543710553&ref_read_id=0216684b-c3df-42bd-a93b-5270ed55a4ae_1724121871448'
    },
    {
      code: 'CM-03',
      poster: `./assets/Dongyang3.png?v=${cacheVersion}`,
      zh: '中非合作论坛｜跨越国界的“木雕故事”',
      en: 'FOCAC | Woodcarving Stories Across Borders',
      shortZh: '跨越国界的“木雕故事”',
      shortEn: 'Woodcarving Across Borders',
      roleZh: '负责拍摄',
      roleEn: 'FILMING',
      href: 'https://h.xinhuaxmt.com/vh512/share/12163690?d=134d9bc&channel=weixin'
    },
    {
      code: 'CM-04',
      poster: `./assets/dongyang4.jpg?v=${cacheVersion}`,
      zh: '竹文化体验：竹编耳饰',
      en: 'Bamboo Culture Experience: Woven Bamboo Earrings',
      shortZh: '竹文化体验：竹编耳饰',
      shortEn: 'Bamboo Earrings',
      roleZh: '负责脚本、拍摄与剪辑',
      roleEn: 'SCRIPT · FILMING · EDITING',
      href: 'https://weixin.qq.com/sph/A3BnwCd14g'
    }
  ];

  const section = document.createElement('section');
  section.className = 'dongyang-section';
  section.innerHTML = `
    <div class="dongyang-sticky">
      <header class="dongyang-heading">
        <p class="eyebrow">03C / CITY MEDIA CENTER</p>
        <h2 data-dy-title>市媒体中心运营</h2>
        <p data-dy-intro>市媒体中心平台运营与地方文化影像内容。悬浮文件夹，打开对应案例。</p>
      </header>

      <div class="dongyang-meta">
        <b>CITY MEDIA CENTER / CONTENT OPERATIONS</b>
        <span data-dy-meta>地方文化 · 内容策划 · 拍摄 · 剪辑</span>
      </div>

      <div class="dongyang-stack" aria-label="City media center case folders"></div>

      <div class="dongyang-instruction">
        <span></span><b data-dy-hint>悬浮文件夹以打开</b><em>04 CASES</em>
      </div>
    </div>
  `;
  biliSection.insertAdjacentElement('afterend', section);

  const stack = section.querySelector('.dongyang-stack');
  const folderNodes = [];
  let activeIndex = -1;

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
            <span>${folder.code} / PUBLISHED CASE</span>
            <h3></h3>
            <p class="dongyang-role"></p>
            <a class="dongyang-explore" href="${folder.href}" target="_blank" rel="noopener noreferrer">
              <span data-dy-explore>探索更多</span><b aria-hidden="true">↗</b>
            </a>
          </div>
          <a class="dongyang-player" href="${folder.href}" target="_blank" rel="noopener noreferrer" aria-label="Open published case ${index + 1}">
            <img src="${folder.poster}" alt="City media center case preview ${index + 1}">
            <div class="dongyang-player-ui"><span>CASE PREVIEW</span><b>OPEN ↗</b></div>
          </a>
        </div>
      </div>
      <div class="dongyang-folder-front">
        <span>${folder.code}</span>
        <b></b>
        <em>CITY MEDIA CENTER</em>
      </div>
    `;
    stack.appendChild(item);
    folderNodes.push(item);

    const open = () => openFolder(index);
    item.addEventListener('mouseenter', open);
    item.addEventListener('focusin', open);
    item.addEventListener('click', event => {
      if (event.target.closest('a')) return;
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
      title: '市媒体中心运营',
      intro: '市媒体中心平台运营与地方文化影像内容。悬浮文件夹，打开对应案例。',
      meta: '地方文化 · 内容策划 · 拍摄 · 剪辑',
      hint: '悬浮文件夹以打开',
      explore: '探索更多'
    },
    en: {
      title: 'CITY MEDIA CENTER<br>OPERATIONS',
      intro: 'Platform operations and local-culture moving-image content for a city media center. Hover over a folder to open each published case.',
      meta: 'LOCAL CULTURE · CONTENT · FILMING · EDITING',
      hint: 'HOVER A FOLDER TO OPEN',
      explore: 'EXPLORE MORE'
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
      node.querySelector('.dongyang-role').textContent = lang === 'zh' ? folder.roleZh : folder.roleEn;
      node.querySelector('.dongyang-folder-front b').textContent = lang === 'zh' ? folder.shortZh : folder.shortEn;
      node.querySelector('[data-dy-explore]').textContent = copy.explore;
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
  }

  function closeFolders() {
    activeIndex = -1;
    stack.classList.remove('has-open-folder');
    folderNodes.forEach(node => {
      node.classList.remove('is-open', 'is-before', 'is-after');
      node.style.setProperty('--folder-shift', '0px');
    });
  }

  new IntersectionObserver(entries => {
    const sectionVisible = entries[0]?.isIntersecting ?? false;
    document.body.classList.toggle('is-dongyang-section', sectionVisible);
    if (!sectionVisible) closeFolders();
  }, { root: scene, threshold: .25 }).observe(section);

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 0));
  renderLanguage();
})();