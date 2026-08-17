(() => {
  const scene = document.querySelector('.about-scene');
  if (!scene || scene.dataset.aboutReady === 'true') return;
  scene.dataset.aboutReady = 'true';
  scene.classList.add('about-structured-scene');
  scene.querySelector('.about-grid')?.remove();

  const photos = ['./assets/photo1.png', './assets/photo2.png', './assets/photo3.png'];

  const internships = [
    {
      time: '2026',
      org: 'MARINELIGHT LTD',
      role: '海外市场销售 · London',
      body: '负责海外顾客接待、需求沟通与销售转化，同时参与商品陈列、盘点与库存记录，在高频现场环境中持续优化沟通与执行方式。'
    },
    {
      time: '2024–2025',
      org: '上海市奇富科技有限公司',
      role: '企业文化运营 · Shanghai',
      body: '参与企业内宣与员工活动策划执行，负责宣传文案、公众号长图设计、内容发布、现场记录与活动复盘。'
    },
    {
      time: '2024',
      org: '三秦青年融媒体中心',
      role: '新媒体运营 · Xi’an',
      body: '负责抖音、微信公众号及 Bilibili 的选题、视频剪辑与发布，累计制作视频约 70 条，并参与新账号冷启动与基础数据反馈。'
    }
  ];

  const projects = [
    {
      index: '01',
      title: '中国方言语音聚类研究',
      meta: 'Python · XLS-R · Data Visualization',
      body: '围绕中国方言语音的声学相似性与地理关系展开研究，完成语音表示提取、距离计算、聚类、相关分析与交互式地图可视化。'
    },
    {
      index: '02',
      title: 'JSTOR 中文用户研究',
      meta: 'UX Research · Interview · Coding',
      body: '通过半结构化访谈与可用性测试收集中文用户反馈，完成研究设计、资料编码与分析，并将发现转化为网站体验优化建议。'
    },
    {
      index: '03',
      title: '数据新闻与交互可视化',
      meta: 'Data Storytelling · Web',
      body: '结合数据整理、信息结构与视觉设计完成数据叙事与网页呈现，关注复杂信息如何被更清晰地理解。'
    }
  ];

  scene.insertAdjacentHTML('afterbegin', `
    <div class="about-structured-shell">
      <header class="about-structured-head">
        <div class="about-head-copy">
          <p class="eyebrow">04 / ABOUT</p>
          <h2>关于我</h2>
          <p>保持好奇，快速学习，也保持把复杂问题讲清楚的能力。</p>
        </div>
        <button class="about-photo-stack" type="button" aria-label="切换照片">
          <span class="about-photo-frame about-photo-frame-back"></span>
          <span class="about-photo-frame about-photo-frame-mid"></span>
          <span class="about-photo-frame about-photo-frame-front"><img src="${photos[0]}" alt="Celeste photo 1"></span>
          <small>CLICK · 1 / 3</small>
        </button>
      </header>

      <section class="about-profile-card about-reveal">
        <p class="about-section-kicker">01 / PROFILE</p>
        <div class="about-profile-grid">
          <div><span>姓名</span><strong>陈思睿 / Celeste Chen</strong></div>
          <div><span>电话</span><strong>+44 7344 361482<br>+86 17307690635</strong></div>
          <div><span>邮箱</span><strong>CelesteC2003@outlook.com</strong></div>
          <div><span>理想城市</span><strong>上海 · 杭州 · 厦门 · 伦敦</strong></div>
          <div><span>理想岗位</span><strong>数据运营 · 数据分析 · 用户研究</strong></div>
        </div>
      </section>

      <section class="about-education about-reveal">
        <div class="about-education-brace" aria-hidden="true">}</div>
        <div class="about-education-label"><span>02</span><b>教育经历</b><small>EDUCATION</small></div>
        <div class="about-education-cards">
          <article class="about-edu-card">
            <header><span>硕士</span><time>2025–2026</time></header>
            <h3>King’s College London</h3>
            <p class="about-edu-major">Digital Humanities MA</p>
            <p>学习内容覆盖数字人文研究方法、用户研究、数据分析、计算方法与数据可视化，并将研究结果转化为交互式数字呈现。</p>
          </article>
          <article class="about-edu-card">
            <header><span>本科</span><time>2021–2025</time></header>
            <h3>陕西师范大学</h3>
            <p class="about-edu-major">网络与新媒体</p>
            <p>学习新媒体传播、内容策划、视觉表达、平台运营与基础编程，形成从内容生产到数字产品呈现的综合能力。</p>
          </article>
        </div>
      </section>

      <section class="about-internships about-reveal">
        <div class="about-section-heading"><p>03 / EXPERIENCE</p><h3>实习经历</h3></div>
        <div class="about-vertical-timeline">
          ${internships.map(item => `
            <article class="about-timeline-item">
              <div class="about-timeline-dot"></div>
              <time>${item.time}</time>
              <div class="about-timeline-content">
                <h4>${item.org}</h4>
                <span>${item.role}</span>
                <p>${item.body}</p>
              </div>
            </article>`).join('')}
        </div>
      </section>

      <section class="about-projects about-reveal">
        <div class="about-section-heading"><p>04 / PROJECTS</p><h3>项目经历</h3></div>
        <div class="about-project-grid">
          ${projects.map(item => `
            <article class="about-project-card">
              <span class="about-project-index">${item.index}</span>
              <h4>${item.title}</h4>
              <small>${item.meta}</small>
              <p>${item.body}</p>
            </article>`).join('')}
        </div>
      </section>

      <p class="about-scroll-hint">SCROLL · 内容会轻微向中间聚拢</p>
    </div>`);

  const photoStack = scene.querySelector('.about-photo-stack');
  const photo = photoStack.querySelector('img');
  const photoCounter = photoStack.querySelector('small');
  let photoIndex = 0;

  photoStack.addEventListener('click', () => {
    photoIndex = (photoIndex + 1) % photos.length;
    photoStack.classList.remove('is-switching');
    void photoStack.offsetWidth;
    photoStack.classList.add('is-switching');
    photo.src = photos[photoIndex];
    photo.alt = `Celeste photo ${photoIndex + 1}`;
    photoCounter.textContent = `CLICK · ${photoIndex + 1} / ${photos.length}`;
  });

  const revealItems = [...scene.querySelectorAll('.about-reveal')];
  let ticking = false;

  function updateReveal() {
    ticking = false;
    const sceneRect = scene.getBoundingClientRect();
    const viewportH = scene.clientHeight || innerHeight;
    const enterLine = viewportH * .92;
    const settleLine = viewportH * .58;

    revealItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top - sceneRect.top + Math.min(rect.height * .32, 180);
      const progress = Math.max(0, Math.min(1, (enterLine - center) / (enterLine - settleLine)));
      const eased = 1 - Math.pow(1 - progress, 3);
      const direction = index % 2 === 0 ? -1 : 1;
      item.style.setProperty('--reveal', eased.toFixed(4));
      item.style.setProperty('--reveal-dir', direction);
    });
  }

  function requestReveal() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateReveal);
  }

  scene.addEventListener('scroll', requestReveal, { passive: true });
  window.addEventListener('resize', requestReveal, { passive: true });
  new MutationObserver(requestReveal).observe(scene, { attributes: true, attributeFilter: ['class'] });
  requestReveal();
})();