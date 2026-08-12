(() => {
  const scene = document.querySelector('.about-scene');
  if (!scene || scene.dataset.timelineReady === 'true') return;
  scene.dataset.timelineReady = 'true';
  scene.classList.add('about-timeline-scene');
  scene.querySelector('.about-grid')?.remove();

  const photos = ['./assets/photo1.png', './assets/photo2.png', './assets/photo3.png'];
  const rows = [
    {
      type: 'PROFILE',
      org: '陈思睿 / CELESTE',
      role: 'Digital Humanities MA',
      place: 'London · UK',
      time: '2025–2026',
      body: '伦敦国王学院数字人文硕士，本科网络与新媒体。我对陌生问题保持强烈好奇心，也习惯快速学习、调整方法并进入新的工作语境。我的经历横跨用户研究、数据分析、内容运营与视觉表达，擅长把复杂信息拆解成清晰、可执行的结构。'
    },
    {
      type: 'EXPERIENCE 01',
      org: 'MARINELIGHT LTD',
      role: '海外市场销售',
      place: 'London · UK',
      time: '2026–至今',
      body: '在 Old Spitalfields Market 面向海外顾客进行现场销售与需求沟通，推动成交转化，同时负责商品陈列、盘点与库存记录。在高频、即时反馈的线下环境中提升了跨文化沟通、判断和执行能力。'
    },
    {
      type: 'EXPERIENCE 02',
      org: '上海市奇富科技有限公司',
      role: '企业文化运营',
      place: 'Shanghai · CN',
      time: '2024–2025',
      body: '参与企业内宣和员工活动的策划与执行，负责宣传文案、公众号长图设计、内容发布、现场记录和活动复盘。工作强调信息组织、视觉排版与多方协同。'
    },
    {
      type: 'EXPERIENCE 03',
      org: '三秦青年融媒体中心',
      role: '新媒体运营',
      place: 'Xi’an · CN',
      time: '2024',
      body: '负责抖音、微信公众号及 Bilibili 的选题、视频剪辑与发布，累计制作视频约 70 条，并参与新账号冷启动。工作内容覆盖选题判断、内容加工、平台发布与基础数据反馈。'
    },
    {
      type: 'PROJECT 01',
      org: '中国方言语音聚类研究',
      role: '独立研究项目',
      place: 'KCL · London',
      time: '2026',
      body: '围绕中国方言语音的声学相似性与地理关系展开研究，使用 Python 与 Wav2Vec 2.0 / XLS-R 提取语音表示，完成距离计算、聚类、相关分析和交互式地理可视化，并讨论模型在中国方言任务中的局限。'
    },
    {
      type: 'PROJECT 02',
      org: 'JSTOR 中文用户研究',
      role: 'UX Research',
      place: 'KCL · London',
      time: '2025',
      body: '通过半结构化访谈和可用性测试收集中文用户反馈，负责研究设计、访谈资料整理与编码、数据可视化，并将用户痛点转化为具体的网站体验优化建议。'
    },
    {
      type: 'SKILLS',
      org: '研究 · 数据 · 内容 · 视觉',
      role: 'Toolbox',
      place: 'Cross-disciplinary',
      time: 'NOW',
      body: 'Python / Pandas · 用户研究 · 访谈设计 · 定性编码 · 数据可视化 · HTML / CSS / JavaScript · 平台运营 · 文案策划 · Photoshop · Premiere Pro · 视频剪辑与信息排版。'
    }
  ];

  scene.insertAdjacentHTML('afterbegin', `
    <div class="about-timeline-shell">
      <header class="about-timeline-head">
        <div class="about-head-copy">
          <p class="eyebrow">04 / ABOUT</p>
          <h2>关于我</h2>
          <p>保持好奇，快速学习，并把复杂问题整理成清晰的结构。</p>
        </div>
        <button class="about-photo-stack" type="button" aria-label="切换照片">
          <span class="about-photo-frame about-photo-frame-back"></span>
          <span class="about-photo-frame about-photo-frame-mid"></span>
          <span class="about-photo-frame about-photo-frame-front">
            <img src="${photos[0]}" alt="Celeste photo 1">
          </span>
          <small>CLICK · 1 / 3</small>
        </button>
      </header>
      <div class="about-timeline-list">
        ${rows.map((row, index) => `
          <article class="about-timeline-row" data-index="${index}">
            <div class="about-timeline-left">
              <small>${row.type}</small>
              <h3>${row.org}</h3>
              <p>${row.role}</p>
              <div class="about-timeline-meta"><span>${row.place}</span><time>${row.time}</time></div>
            </div>
            <div class="about-timeline-right"><p>${row.body}</p></div>
          </article>`).join('')}
      </div>
      <p class="about-timeline-hint">SCROLL · 条目会向中间聚拢</p>
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

  const timelineRows = [...scene.querySelectorAll('.about-timeline-row')];
  let ticking = false;

  function updateRows() {
    ticking = false;
    const sceneRect = scene.getBoundingClientRect();
    const viewportH = scene.clientHeight || innerHeight;
    const settleLine = viewportH * 0.53;
    const enterLine = viewportH * 0.92;

    timelineRows.forEach(row => {
      const rect = row.getBoundingClientRect();
      const center = rect.top - sceneRect.top + rect.height / 2;
      const progress = Math.max(0, Math.min(1, (enterLine - center) / (enterLine - settleLine)));
      const eased = 1 - Math.pow(1 - progress, 3);
      row.style.setProperty('--gather', eased.toFixed(4));
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateRows);
  }

  scene.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  new MutationObserver(requestUpdate).observe(scene, { attributes: true, attributeFilter: ['class'] });
  requestUpdate();
})();