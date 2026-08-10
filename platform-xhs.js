(() => {
  const scene = document.querySelector('.video-scene');
  if (!scene || scene.dataset.xhsReady === 'true') return;
  scene.dataset.xhsReady = 'true';
  scene.classList.add('xhs-mode');
  scene.setAttribute('aria-label', 'Platform operations — Xiaohongshu scrapbook');

  const cacheVersion = '20260730-3';
  const works = [
    { image: `./assets/rednote1.png?v=${cacheVersion}`, code: 'RED-01', year: '2024' },
    { image: `./assets/rednote2.png?v=${cacheVersion}`, code: 'RED-02', year: '2024' },
    { image: `./assets/rednote3.png?v=${cacheVersion}`, code: 'RED-03', year: '2024', engagement: '700+' },
    { image: `./assets/visual4?v=${cacheVersion}`, code: 'RED-04', year: '2024' },
    { image: `./assets/visual5?v=${cacheVersion}`, code: 'RED-05', year: '2024', engagement: '8000+' },
    { image: `./assets/visual6?v=${cacheVersion}`, code: 'RED-06', year: '2024', engagement: '2000+' }
  ];

  const root = document.createElement('section');
  root.className = 'xhs-scrapbook';
  root.innerHTML = `
    <header class="xhs-heading">
      <p class="eyebrow" data-xhs-eyebrow>03A / PLATFORM OPERATIONS</p>
      <h2 data-xhs-title>小红书</h2>
      <p data-xhs-intro>自媒体账号中的模板设计与视觉排版。</p>
    </header>
    <div class="xhs-board-label">
      <b data-xhs-account>XIAOHONGSHU / PERSONAL ACCOUNT</b>
      <span data-xhs-label>TEMPLATE DESIGN · SOCIAL CONTENT · VISUAL NOTES</span>
    </div>
    <div class="xhs-board" aria-label="Xiaohongshu works"></div>
    <span class="xhs-doodle xhs-doodle-a">collect<br>small ideas</span>
    <span class="xhs-doodle xhs-doodle-b">design → share</span>
    <div class="xhs-tab-note" data-xhs-hint>CLICK A NOTE TO OPEN<br>01 / XIAOHONGSHU</div>
  `;

  const board = root.querySelector('.xhs-board');
  works.forEach((work, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'xhs-card';
    card.dataset.workIndex = String(index);
    card.style.setProperty('--delay', `${40 + index * 65}ms`);
    card.innerHTML = `
      <img src="${work.image}" loading="lazy" decoding="async" alt="Xiaohongshu template design ${index + 1}">
      <span class="xhs-card-copy">
        <b data-card-title>模板设计 ${String(index + 1).padStart(2, '0')}</b>
        <span>${work.code}</span>
      </span>
    `;
    board.appendChild(card);
  });

  const backButton = scene.querySelector('.scene-back');
  scene.insertBefore(root, backButton || null);

  const dialog = document.createElement('dialog');
  dialog.className = 'xhs-dialog';
  dialog.innerHTML = `
    <div class="xhs-dialog-media"><img alt=""></div>
    <div class="xhs-dialog-copy">
      <button class="xhs-dialog-close" type="button" aria-label="Close">×</button>
      <p class="xhs-dialog-kicker">XIAOHONGSHU / PERSONAL MEDIA</p>
      <h3></h3>
      <p data-xhs-dialog-description></p>
      <dl class="xhs-dialog-meta">
        <div><dt data-xhs-meta-account>账号</dt><dd data-xhs-account-value>@arquakkk</dd></div>
        <div><dt data-xhs-meta-year>发布年份</dt><dd data-xhs-year>2024</dd></div>
        <div data-xhs-third-row><dt data-xhs-meta-third>职责</dt><dd data-xhs-third-value>设计排版和内容发布</dd></div>
      </dl>
    </div>
  `;
  document.body.appendChild(dialog);

  let activeIndex = 0;
  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const copy = {
    zh: {
      title: '小红书',
      intro: '个人自媒体账号中的模板设计、视觉排版与内容分享。',
      account: 'XIAOHONGSHU / PERSONAL ACCOUNT',
      label: 'TEMPLATE DESIGN · SOCIAL CONTENT · VISUAL NOTES',
      hint: '点击图片打开详情<br>01 / 小红书',
      card: index => `模板设计 ${String(index + 1).padStart(2, '0')}`,
      dialogTitle: index => `模板设计 · ${String(index + 1).padStart(2, '0')}`,
      description: '个人自媒体内容案例，围绕模板设计进行视觉制作、排版整理与平台发布。',
      accountLabel: '账号',
      yearLabel: '发布年份',
      engagementLabel: '点赞收藏',
      roleLabel: '职责',
      roleValue: '设计排版和内容发布'
    },
    en: {
      title: 'XIAOHONGSHU',
      intro: 'Template design, visual layouts and content sharing from a personal media account.',
      account: 'XIAOHONGSHU / PERSONAL ACCOUNT',
      label: 'TEMPLATE DESIGN · SOCIAL CONTENT · VISUAL NOTES',
      hint: 'CLICK A NOTE TO OPEN<br>01 / XIAOHONGSHU',
      card: index => `TEMPLATE DESIGN ${String(index + 1).padStart(2, '0')}`,
      dialogTitle: index => `Template Design · ${String(index + 1).padStart(2, '0')}`,
      description: 'A personal-media content case focused on template design, visual production, layout and publishing.',
      accountLabel: 'ACCOUNT',
      yearLabel: 'PUBLISHED',
      engagementLabel: 'LIKES + SAVES',
      roleLabel: 'ROLE',
      roleValue: 'DESIGN · LAYOUT · PUBLISHING'
    }
  };

  const renderLanguage = () => {
    const language = isEnglish() ? 'en' : 'zh';
    const text = copy[language];
    const work = works[activeIndex];

    root.querySelector('[data-xhs-title]').textContent = text.title;
    root.querySelector('[data-xhs-intro]').textContent = text.intro;
    root.querySelector('[data-xhs-account]').textContent = text.account;
    root.querySelector('[data-xhs-label]').textContent = text.label;
    root.querySelector('[data-xhs-hint]').innerHTML = text.hint;
    root.querySelectorAll('[data-card-title]').forEach((node, index) => {
      node.textContent = text.card(index);
    });

    dialog.querySelector('h3').textContent = text.dialogTitle(activeIndex);
    dialog.querySelector('[data-xhs-dialog-description]').textContent = text.description;
    dialog.querySelector('[data-xhs-meta-account]').textContent = text.accountLabel;
    dialog.querySelector('[data-xhs-meta-year]').textContent = text.yearLabel;
    dialog.querySelector('[data-xhs-account-value]').textContent = '@arquakkk';
    dialog.querySelector('[data-xhs-year]').textContent = work.year;

    const thirdLabel = dialog.querySelector('[data-xhs-meta-third]');
    const thirdValue = dialog.querySelector('[data-xhs-third-value]');
    if (work.engagement) {
      thirdLabel.textContent = text.engagementLabel;
      thirdValue.textContent = work.engagement;
    } else {
      thirdLabel.textContent = text.roleLabel;
      thirdValue.textContent = text.roleValue;
    }
  };

  const openWork = index => {
    activeIndex = index;
    const work = works[index];
    const image = dialog.querySelector('.xhs-dialog-media img');
    image.src = work.image;
    image.alt = isEnglish()
      ? `Xiaohongshu template design ${index + 1}`
      : `小红书模板设计作品 ${index + 1}`;
    dialog.querySelector('.xhs-dialog-kicker').textContent = `${work.code} / XIAOHONGSHU`;
    renderLanguage();
    dialog.showModal();
  };

  board.querySelectorAll('.xhs-card').forEach((card, index) => {
    card.addEventListener('click', () => openWork(index));
    card.addEventListener('mouseenter', () => document.querySelector('.cursor-dot')?.classList.add('is-hover'));
    card.addEventListener('mouseleave', () => document.querySelector('.cursor-dot')?.classList.remove('is-hover'));
  });

  dialog.querySelector('.xhs-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 0));

  renderLanguage();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
})();