(() => {
  const dialog = document.querySelector('.project-dialog');
  const branches = document.querySelector('.project-branches');
  if (!dialog || !branches || document.documentElement.dataset.dataProjectEnhance === 'true') return;
  document.documentElement.dataset.dataProjectEnhance = 'true';

  const projects = {
    dialect: {
      image: './assets/dialect.png',
      href: 'https://celestefromg.github.io/Dialect/',
      zh: { title: '中国方言声学地图', desc: '收集并清洗100余条中国方言语音，完成声学嵌入、距离计算、聚类和地理对照，并制作交互式数字方言地图。', role: '独立研究者', tools: 'Python · Wav2Vec 2.0 · UMAP · Plotly', year: '2026', cta: '查看项目' },
      en: { title: 'Dialect Acoustic Atlas', desc: 'A study of 100+ Chinese dialect samples using acoustic embeddings, clustering and geospatial comparison.', role: 'Independent researcher', tools: 'Python · Wav2Vec 2.0 · UMAP · Plotly', year: '2026', cta: 'OPEN PROJECT' },
      code: 'DATA-01', tags: ['Audio embeddings','Clustering','Geospatial','Critical AI']
    },
    jstor: {
      image: './assets/Jstor.png',
      href: 'https://0siri0.github.io/UX-RESEARCH/index.html',
      zh: { title: 'JSTOR 中文用户研究', desc: '围绕中文文献检索与浏览体验开展访谈和可用性测试，并把编码结果转化为可视化洞察与优化建议。', role: '研究设计 / 访谈 / 编码 / 可视化', tools: 'Interviews · Usability Testing · Python', year: '2025', cta: '查看项目' },
      en: { title: 'JSTOR Chinese UX Research', desc: 'Interviews and usability tests on Chinese-language discovery, translated into visual insights and recommendations.', role: 'Research design / interviews / coding / visualisation', tools: 'Interviews · Usability Testing · Python', year: '2025', cta: 'OPEN PROJECT' },
      code: 'UX-02', tags: ['UX Research','Qualitative coding','Usability']
    },
    tarot: {
      image: './assets/tarot.png',
      href: 'https://celestefromg.github.io/Tarot/',
      zh: { title: '塔罗交互体验', desc: '围绕塔罗内容构建网页交互体验，将视觉叙事、界面设计与前端实现结合为可浏览的数字作品。', role: '交互设计 / 视觉设计 / 网页实现', tools: 'HTML · CSS · JavaScript', year: '2025', cta: '查看项目' },
      en: { title: 'Tarot Interactive Experience', desc: 'An interactive tarot web experience combining visual storytelling, interface design and front-end implementation.', role: 'Interaction / visual design / web build', tools: 'HTML · CSS · JavaScript', year: '2025', cta: 'OPEN PROJECT' },
      code: 'DATA-03', tags: ['Interaction','Web','Visual storytelling']
    },
    'data-news': {
      image: './assets/dishes.png',
      href: 'https://lyl2345.github.io/yuzhicai.github.io/',
      zh: { title: '预制菜数据新闻', desc: '从产业趋势、消费者态度与政策环境展开数据叙事，项目获陕西赛区二等奖。', role: '数据收集 / 可视化 / 网页实现', tools: 'Excel · Python · HTML/CSS', year: '2024', cta: '查看项目' },
      en: { title: 'Prepared Food Data Story', desc: 'A data story spanning industry trends, consumer attitudes and policy, awarded second prize.', role: 'Data collection / visualisation / web build', tools: 'Excel · Python · HTML/CSS', year: '2024', cta: 'OPEN PROJECT' },
      code: 'DATA-04', tags: ['Data journalism','Web','Award']
    }
  };

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  function ensureTarotButton() {
    if (branches.querySelector('[data-project="tarot"]')) return;
    const dataNews = branches.querySelector('[data-project="data-news"]');
    const button = document.createElement('button');
    button.dataset.project = 'tarot';
    button.innerHTML = '<span>03</span><b>塔罗交互体验</b>';
    button.addEventListener('click', () => openEnhanced('tarot'));
    branches.insertBefore(button, dataNews || branches.querySelector('.branch-back'));
    if (dataNews) dataNews.querySelector('span').textContent = '04';
  }

  function renderVisual(project) {
    const visual = dialog.querySelector('.dialog-visual');
    visual.style.removeProperty('--dialog-pattern');
    visual.style.removeProperty('--dialog-bg');
    visual.innerHTML = `<img class="data-dialog-image" src="${project.image}" alt="${project[isEnglish() ? 'en' : 'zh'].title}">`;
  }

  function ensureCTA(project) {
    const content = dialog.querySelector('.dialog-content');
    let cta = content.querySelector('.data-project-cta');
    if (!cta) {
      cta = document.createElement('a');
      cta.className = 'data-project-cta';
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      content.appendChild(cta);
    }
    cta.href = project.href;
    cta.innerHTML = `<span>${project[isEnglish() ? 'en' : 'zh'].cta}</span><b aria-hidden="true">↗</b>`;
  }

  function enhanceExisting(key) {
    const project = projects[key];
    if (!project) return;
    setTimeout(() => {
      if (!dialog.open) return;
      renderVisual(project);
      ensureCTA(project);
    }, 0);
  }

  function openEnhanced(key) {
    const project = projects[key];
    if (!project) return;
    const lang = isEnglish() ? 'en' : 'zh';
    const copy = project[lang];
    dialog.querySelector('.dialog-kicker').textContent = project.code;
    dialog.querySelector('.dialog-content h3').textContent = copy.title;
    dialog.querySelector('.dialog-description').textContent = copy.desc;
    dialog.querySelector('.dialog-role').textContent = copy.role;
    dialog.querySelector('.dialog-tools').textContent = copy.tools;
    dialog.querySelector('.dialog-year').textContent = copy.year;
    dialog.querySelector('.dialog-tags').innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');
    renderVisual(project);
    ensureCTA(project);
    dialog.showModal();
  }

  ensureTarotButton();

  ['dialect','jstor','data-news'].forEach(key => {
    const button = branches.querySelector(`[data-project="${key}"]`);
    button?.addEventListener('click', () => enhanceExisting(key));
  });

  function renderBranchLanguage() {
    const en = isEnglish();
    const labels = {
      dialect: en ? 'Dialect Acoustic Atlas' : '中国方言声学地图',
      jstor: en ? 'JSTOR Chinese UX Research' : 'JSTOR 中文用户研究',
      tarot: en ? 'Tarot Interactive Experience' : '塔罗交互体验',
      'data-news': en ? 'Prepared Food Data Story' : '预制菜数据新闻'
    };
    Object.entries(labels).forEach(([key, label]) => {
      const b = branches.querySelector(`[data-project="${key}"] b`);
      if (b) b.textContent = label;
    });
  }

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(() => {
    renderBranchLanguage();
    const currentCTA = dialog.querySelector('.data-project-cta');
    if (dialog.open && currentCTA) {
      const href = currentCTA.href;
      const project = Object.values(projects).find(p => href.startsWith(p.href));
      if (project) currentCTA.querySelector('span').textContent = project[isEnglish() ? 'en' : 'zh'].cta;
    }
  }, 0));

  dialog.addEventListener('close', () => {
    dialog.querySelector('.dialog-visual')?.replaceChildren();
    dialog.querySelector('.data-project-cta')?.remove();
  });

  renderBranchLanguage();
})();