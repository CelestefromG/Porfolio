(() => {
  const scene = document.querySelector('.about-scene');
  if (!scene || scene.dataset.carouselReady === 'true') return;
  scene.dataset.carouselReady = 'true';
  scene.classList.add('about-carousel');

  const oldGrid = scene.querySelector('.about-grid');
  if (oldGrid) oldGrid.hidden = true;

  const items = [
    {
      key: 'profile',
      image: './assets/lamb1.png',
      label: '个人信息',
      kicker: '01 / PERSONAL INFO',
      title: '陈思睿 · Celeste',
      html: `
        <div class="about-card-profile">
          <img src="https://avatars.githubusercontent.com/u/205961239?v=4" alt="Celeste Chen">
          <div>
            <h4>好奇心强 · 学习欲旺盛 · 适应力强</h4>
            <p>伦敦国王学院数字人文硕士，本科网络与新媒体。我的经历横跨用户研究、数据分析、新媒体内容与视觉表达。我喜欢快速理解陌生问题，再把复杂信息整理成清晰、可执行的结构。</p>
          </div>
        </div>
        <div class="about-chip-row"><span>用户研究</span><span>数据分析</span><span>内容运营</span><span>视觉表达</span><span>结构化沟通</span></div>`
    },
    {
      key: 'projects',
      image: './assets/lamb2.png',
      label: '项目经历',
      kicker: '02 / PROJECTS',
      title: '项目经历',
      html: `
        <article class="about-card-item"><header><b>中国方言语音聚类与地理可视化研究</b><time>2025</time></header><p>独立完成研究设计、语料收集、数据处理与结果分析；使用 Python 与 Wav2Vec 2.0 提取语音特征、聚类，并制作交互式方言地图。</p></article>
        <article class="about-card-item"><header><b>JSTOR 用户中心研究</b><time>2025</time></header><p>通过半结构化访谈与可用性测试收集反馈，负责访谈设计、资料编码、Python 数据整理与可视化，并将发现转化为网站体验优化建议。</p></article>`
    },
    {
      key: 'work',
      image: './assets/lamb3.png',
      label: '工作经历',
      kicker: '03 / EXPERIENCE',
      title: '工作经历',
      html: `
        <article class="about-card-item"><header><b>MARINELIGHT LTD · 海外市场销售</b><time>2026–至今</time></header><p>在 Old Spitalfields Market 接待海外顾客，推动现场销售转化，并负责商品盘点、陈列与库存记录。</p></article>
        <article class="about-card-item"><header><b>上海市奇富科技有限公司 · 企业文化</b><time>2024–2025</time></header><p>负责企业内宣与员工活动策划执行，完成宣传文案、公众号长图设计、内容发布、现场记录和活动复盘。</p></article>
        <article class="about-card-item"><header><b>三秦青年融媒体中心 · 新媒体运营</b><time>2024</time></header><p>负责抖音、微信公众号及 Bilibili 的选题、视频剪辑与发布；制作视频约 70 条，并协助新账号两周增粉 1000+。</p></article>`
    },
    {
      key: 'skills',
      image: './assets/lamb4.png',
      label: '技能点',
      kicker: '04 / SKILLS',
      title: '技能点',
      html: `
        <section class="about-skill-group"><h4>研究与数据</h4><div class="about-chip-row"><span>Python</span><span>Pandas</span><span>用户研究</span><span>访谈设计</span><span>定性编码</span><span>数据可视化</span></div></section>
        <section class="about-skill-group"><h4>内容与视觉</h4><div class="about-chip-row"><span>平台运营</span><span>文案策划</span><span>长图排版</span><span>PS</span><span>PR</span><span>视频剪辑</span></div></section>
        <section class="about-skill-group"><h4>网页与交互</h4><div class="about-chip-row"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>交互展示</span></div></section>`
    }
  ];

  scene.insertAdjacentHTML('afterbegin', `
    <div class="about-carousel-shell">
      <header class="about-carousel-head">
        <p class="eyebrow">04 / ABOUT · LITTLE LAMB CAROUSEL</p>
        <h2>关于我</h2>
        <p>四只小羊分别装着我的个人信息、项目、经历和技能。<br>点击一只羊，旋转木马会暂停并打开对应内容。</p>
      </header>

      <div class="about-carousel-stage" aria-label="About carousel">
        <div class="about-carousel-core" aria-hidden="true">
          <div class="carousel-apple-top"><i></i></div>
          <div class="carousel-pole"></div>
          <div class="carousel-apple-base"><span>CELESTE</span></div>
        </div>
        <div class="about-carousel-orbit"></div>
      </div>

      <aside class="about-carousel-card" aria-live="polite" aria-hidden="true">
        <div class="about-carousel-card-head">
          <div><p></p><h3></h3></div>
          <button type="button" class="about-carousel-close" aria-label="关闭">×</button>
        </div>
        <div class="about-carousel-card-body"></div>
      </aside>

      <p class="about-carousel-hint">CLICK A LAMB · 点击小羊查看内容</p>
    </div>
  `);

  const stage = scene.querySelector('.about-carousel-stage');
  const orbit = scene.querySelector('.about-carousel-orbit');
  const slots = [];

  items.forEach(item => {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'about-lamb-slot';
    slot.dataset.aboutKey = item.key;
    slot.setAttribute('aria-label', item.label);
    slot.innerHTML = `
      <span class="about-lamb-upright">
        <img src="${item.image}" alt="${item.label}">
        <b>${item.label}</b>
      </span>`;
    orbit.appendChild(slot);
    slots.push(slot);
  });

  const card = scene.querySelector('.about-carousel-card');
  const cardKicker = card.querySelector('.about-carousel-card-head p');
  const cardTitle = card.querySelector('.about-carousel-card-head h3');
  const cardBody = card.querySelector('.about-carousel-card-body');

  const openItem = item => {
    cardKicker.textContent = item.kicker;
    cardTitle.textContent = item.title;
    cardBody.innerHTML = item.html;
    card.classList.add('is-open');
    card.setAttribute('aria-hidden', 'false');
    scene.classList.add('is-carousel-paused');
  };

  const closeCard = () => {
    card.classList.remove('is-open');
    card.setAttribute('aria-hidden', 'true');
    scene.classList.remove('is-carousel-paused');
  };

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      const item = items.find(entry => entry.key === slot.dataset.aboutKey);
      if (item) openItem(item);
    });
  });

  card.querySelector('.about-carousel-close').addEventListener('click', closeCard);
  scene.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeCard();
  });

  let phase = 0;
  let last = performance.now();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const layoutLambs = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const radiusX = w * 0.31;
    const radiusY = h * 0.055;
    const centerY = h * 0.53;

    slots.forEach((slot, index) => {
      const angle = phase + index * (Math.PI * 2 / slots.length);
      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      const depth = (Math.sin(angle) + 1) / 2;
      const scale = 0.78 + depth * 0.24;
      const opacity = 0.58 + depth * 0.42;

      slot.style.left = '50%';
      slot.style.top = `${centerY}px`;
      slot.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      slot.style.opacity = opacity.toFixed(3);
      slot.style.zIndex = String(5 + Math.round(depth * 12));
    });
  };

  const animate = now => {
    const dt = Math.min(40, now - last);
    last = now;
    const paused = scene.classList.contains('is-carousel-paused') || stage.matches(':hover');
    if (!paused && !reducedMotion) phase += dt * 0.00022;
    layoutLambs();
    requestAnimationFrame(animate);
  };

  layoutLambs();
  requestAnimationFrame(animate);
  window.addEventListener('resize', layoutLambs, { passive: true });
})();
