(() => {
  const scene = document.querySelector('.about-scene');
  if (!scene || scene.dataset.ranchReady === 'true') return;
  scene.dataset.ranchReady = 'true';
  scene.classList.add('ranch-about');

  const oldGrid = scene.querySelector('.about-grid');
  if (oldGrid) oldGrid.hidden = true;

  const stroke = '#41382e';
  const cream = '#f7f1e7';
  const tan = '#c9b69a';

  const managerSvg = `
    <svg viewBox="0 0 150 320" aria-hidden="true">
      <g fill="${cream}" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 87c6-28 46-35 57 0l4 44H42z"/>
        <path d="M53 78c-4 19-2 37 5 52M99 78c4 20 2 38-5 52" fill="none"/>
        <ellipse cx="76" cy="63" rx="25" ry="29"/>
        <path d="M55 58c4-23 39-29 48-4-14-3-27-12-37-20-2 9-6 17-11 24z" fill="${tan}"/>
        <path d="M38 34h76M48 34c2-16 11-26 28-28 18 3 28 12 29 28"/>
        <path d="M34 36c10 7 72 7 84 0"/>
        <path d="M44 126l-8 92h31l8-86 8 86h31l-8-92z"/>
        <path d="M38 217l-4 70h33l2-70M83 217l2 70h34l-5-70"/>
        <path d="M34 287c5 18 26 20 33 0M85 287c5 18 26 20 34 0" fill="${tan}"/>
        <path d="M43 139c-11 15-19 31-23 49M105 139c11 16 18 32 21 50" fill="none"/>
        <path d="M20 188c5 4 10 4 14 0M126 189c-5 4-10 4-14 0" fill="none"/>
      </g>
    </svg>`;

  const cowSvg = `
    <svg viewBox="0 0 300 190" aria-hidden="true">
      <g fill="${cream}" stroke="${stroke}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="139" cy="95" rx="84" ry="48"/>
        <path d="M205 71c16-9 39-6 51 6l4 22c-5 16-19 24-36 20l-21-17z"/>
        <path d="M231 69l-7-15M249 72l8-15M220 62l-9-6M260 68l11-5" fill="none"/>
        <path d="M78 126l-8 43M105 132l-5 39M167 133l3 38M198 124l10 42" fill="none"/>
        <path d="M68 169h14M95 171h14M164 171h14M202 166h14" fill="none"/>
        <path d="M58 80c-17-10-33-7-40 4 10 5 18 13 20 25" fill="none"/>
        <path d="M18 84c-8 10-6 25 4 33" fill="none"/>
        <path d="M89 62c18-18 45-17 59 2-8 8-18 15-27 20-12-5-23-12-32-22z" fill="#736556" stroke="none"/>
        <path d="M145 103c19-15 40-13 55 5-7 12-18 22-31 27-10-8-18-18-24-32z" fill="#736556" stroke="none"/>
        <path d="M216 79c9-8 23-8 32 0-4 9-10 15-18 20-6-5-11-12-14-20z" fill="#736556" stroke="none"/>
        <ellipse cx="243" cy="88" rx="2.4" ry="2.8" fill="${stroke}"/>
        <path d="M249 104c-5 3-10 3-15 0" fill="none"/>
      </g>
    </svg>`;

  const horseSvg = `
    <svg viewBox="0 0 320 220" aria-hidden="true">
      <g fill="${cream}" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="154" cy="119" rx="83" ry="44"/>
        <path d="M196 91c9-37 29-60 56-67l23 18-9 38-30 30z"/>
        <path d="M249 29l1-16 9 13M268 40l8-14 5 18" fill="none"/>
        <path d="M213 76c11-23 23-42 40-52-20 3-36 13-48 28" fill="${tan}"/>
        <path d="M97 147l-18 57M125 152l-5 54M184 151l7 55M214 143l19 54" fill="none"/>
        <path d="M74 205h18M112 206h18M185 206h18M227 198h18" fill="none"/>
        <path d="M76 108c-25-11-43-3-59 14 12 8 28 10 42 4" fill="${tan}"/>
        <circle cx="258" cy="51" r="2.4" fill="${stroke}"/>
        <path d="M268 68c-6 3-12 3-17 0" fill="none"/>
      </g>
    </svg>`;

  const sheepSvg = `
    <svg viewBox="0 0 220 150" aria-hidden="true">
      <g fill="${cream}" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="75" cy="77" r="34"/><circle cx="104" cy="65" r="38"/><circle cx="135" cy="77" r="34"/><circle cx="110" cy="91" r="39"/>
        <path d="M153 71c20-17 44-8 48 10-1 18-16 28-34 24l-20-15z"/>
        <path d="M168 69l-2-12M190 73l8-10" fill="none"/>
        <circle cx="188" cy="82" r="2.4" fill="${stroke}"/>
        <path d="M73 110l-5 31M102 119l-2 24M130 116l3 27M158 107l10 31" fill="none"/>
        <path d="M62 141h13M94 143h13M126 143h13M162 138h13" fill="none"/>
      </g>
    </svg>`;

  scene.insertAdjacentHTML('afterbegin', `
    <div class="ranch-about-shell">
      <header class="ranch-head">
        <p class="eyebrow">04 / ABOUT · CELESTE'S RANCH</p>
        <h2>关于我</h2>
        <p><strong>保持好奇，也保持把复杂问题讲清楚的能力。</strong><br>抓起牧场里的角色，看看我做过什么、会什么，以及我是怎样工作的人。</p>
      </header>

      <div class="ranch-hills" aria-hidden="true">
        <svg viewBox="0 0 1600 320" preserveAspectRatio="none">
          <path d="M0 224C158 142 288 164 412 216c116 48 210 15 330-51 129-71 240-76 374-4 147 79 270 87 484 7" fill="none" stroke="#796b58" stroke-width="2"/>
          <path d="M0 270c181-42 311-32 453 11 168 51 310 17 429-29 173-67 347-58 718 29" fill="none" stroke="#796b58" stroke-width="1.5"/>
        </svg>
      </div>

      <div class="ranch-fence" aria-hidden="true">
        <i class="ranch-post"></i><i class="ranch-post"></i><i class="ranch-post"></i><i class="ranch-post"></i><i class="ranch-post"></i>
      </div>

      <div class="ranch-label ranch-label-manager"><b>牧场管理员</b><span>个人信息</span></div>
      <div class="ranch-label ranch-label-cow"><b>奶牛</b><span>项目经历</span></div>
      <div class="ranch-label ranch-label-horse"><b>马</b><span>工作经历</span></div>
      <div class="ranch-label ranch-label-sheep"><b>羊</b><span>技能点</span></div>

      <button class="ranch-entity ranch-manager" data-ranch-key="profile" aria-label="个人信息">${managerSvg}</button>
      <button class="ranch-entity ranch-cow" data-ranch-key="projects" aria-label="项目经历">${cowSvg}</button>
      <button class="ranch-entity ranch-horse" data-ranch-key="work" aria-label="工作经历">${horseSvg}</button>
      <button class="ranch-entity ranch-sheep" data-ranch-key="skills" aria-label="技能点">${sheepSvg}</button>

      <aside class="ranch-info-card" aria-live="polite" aria-hidden="true">
        <div class="ranch-card-head"><div><p></p><h3></h3></div><button class="ranch-card-close" type="button" aria-label="关闭">×</button></div>
        <div class="ranch-card-body"></div>
      </aside>

      <div class="ranch-instruction">长按并拖起角色 · 查看对应信息</div>
      <div class="ranch-glove" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <g fill="#fffdf8" stroke="#2f2923" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 41c-5-4-8-9-8-15V13c0-3 4-4 5-1v11-16c0-4 5-4 5 0v15-18c0-4 6-4 6 0v18-15c0-4 5-4 5 0v18-10c0-4 5-4 5 0v13c0 8-4 12-10 16z"/>
            <path d="M10 24c-3-2-6 0-6 3 0 7 5 13 10 16"/>
          </g>
        </svg>
      </div>
    </div>
  `);

  const data = {
    profile: {
      kicker: 'RANCH MANAGER / PERSONAL INFO',
      title: '陈思睿 · Celeste',
      html: `
        <div class="ranch-profile">
          <img src="https://avatars.githubusercontent.com/u/205961239?v=4" alt="Celeste Chen">
          <div><h4>好奇心强 · 学习欲旺盛 · 适应力强</h4><p>伦敦国王学院数字人文硕士，本科网络与新媒体。我的经历横跨用户研究、数据分析、新媒体内容和视觉表达，因此我习惯快速理解陌生问题，再把信息整理成清晰、可执行的结构。</p></div>
          <div class="ranch-profile-tags"><span class="ranch-chip">用户研究</span><span class="ranch-chip">数据分析</span><span class="ranch-chip">内容运营</span><span class="ranch-chip">视觉表达</span><span class="ranch-chip">结构化沟通</span></div>
        </div>`
    },
    projects: {
      kicker: 'COW / PROJECT EXPERIENCE',
      title: '项目经历',
      html: `
        <article class="ranch-card-item"><header><span>01</span><b>中国方言语音聚类与地理可视化研究</b><time>2025</time></header><p>独立完成研究设计、语料收集、数据处理与结果分析；使用 Python 与 Wav2Vec 2.0 提取语音特征、聚类，并制作交互式方言地图。</p></article>
        <article class="ranch-card-item"><header><span>02</span><b>JSTOR 用户中心研究</b><time>2025</time></header><p>通过半结构化访谈与可用性测试收集反馈，负责访谈设计、资料编码、Python 数据整理与可视化，并将发现转化为网站体验优化建议。</p></article>`
    },
    work: {
      kicker: 'HORSE / WORK EXPERIENCE',
      title: '工作经历',
      html: `
        <article class="ranch-card-item"><header><span>01</span><b>MARINELIGHT LTD · 海外市场销售</b><time>2026–至今</time></header><p>在 Old Spitalfields Market 接待海外顾客，推动现场销售转化，并负责商品盘点、陈列与库存记录。</p></article>
        <article class="ranch-card-item"><header><span>02</span><b>上海市奇富科技有限公司 · 企业文化</b><time>2024–2025</time></header><p>负责企业内宣与员工活动策划执行，完成宣传文案、公众号长图设计、内容发布、现场记录和活动复盘。</p></article>
        <article class="ranch-card-item"><header><span>03</span><b>三秦青年融媒体中心 · 新媒体运营</b><time>2024</time></header><p>负责抖音、微信公众号及 Bilibili 的选题、视频剪辑与发布；制作视频约 70 条，并协助新账号两周增粉 1000+。</p></article>`
    },
    skills: {
      kicker: 'SHEEP / SKILL SET',
      title: '技能点',
      html: `
        <section class="ranch-skill-group"><h4>研究与数据</h4><div class="ranch-chip-grid"><span class="ranch-chip">Python</span><span class="ranch-chip">Pandas</span><span class="ranch-chip">用户研究</span><span class="ranch-chip">访谈设计</span><span class="ranch-chip">定性编码</span><span class="ranch-chip">数据可视化</span></div></section>
        <section class="ranch-skill-group"><h4>内容与视觉</h4><div class="ranch-chip-grid"><span class="ranch-chip">平台运营</span><span class="ranch-chip">活动策划</span><span class="ranch-chip">PS</span><span class="ranch-chip">长图排版</span><span class="ranch-chip">视频剪辑</span><span class="ranch-chip">内容发布</span></div></section>
        <section class="ranch-skill-group"><h4>网页与表达</h4><div class="ranch-chip-grid"><span class="ranch-chip">HTML</span><span class="ranch-chip">CSS</span><span class="ranch-chip">JavaScript</span><span class="ranch-chip">Office</span><span class="ranch-chip">英语</span></div></section>`
    }
  };

  const card = scene.querySelector('.ranch-info-card');
  const cardKicker = card.querySelector('.ranch-card-head p');
  const cardTitle = card.querySelector('.ranch-card-head h3');
  const cardBody = card.querySelector('.ranch-card-body');
  const glove = scene.querySelector('.ranch-glove');
  let dragging = null;
  let startX = 0;
  let startY = 0;
  let pointerId = null;
  let lifted = false;

  const showCard = key => {
    const item = data[key];
    if (!item) return;
    cardKicker.textContent = item.kicker;
    cardTitle.textContent = item.title;
    cardBody.innerHTML = item.html;
    card.classList.add('is-open');
    card.setAttribute('aria-hidden', 'false');
  };

  const closeCard = () => {
    card.classList.remove('is-open');
    card.setAttribute('aria-hidden', 'true');
  };

  scene.addEventListener('pointerenter', () => scene.classList.add('is-pointer-inside'));
  scene.addEventListener('pointerleave', () => {
    if (!dragging) scene.classList.remove('is-pointer-inside');
  });
  scene.addEventListener('pointermove', event => {
    glove.style.left = `${event.clientX}px`;
    glove.style.top = `${event.clientY}px`;
    if (!dragging || event.pointerId !== pointerId) return;
    const dx = Math.max(-90, Math.min(90, event.clientX - startX));
    const dy = Math.max(-120, Math.min(45, event.clientY - startY));
    dragging.style.setProperty('--drag-x', `${dx}px`);
    dragging.style.setProperty('--drag-y', `${dy}px`);
    if (!lifted && (Math.hypot(dx, dy) > 12 || dy < -8)) {
      lifted = true;
      showCard(dragging.dataset.ranchKey);
    }
    event.preventDefault();
  });

  scene.querySelectorAll('.ranch-entity').forEach(entity => {
    entity.addEventListener('pointerdown', event => {
      dragging = entity;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      lifted = false;
      entity.classList.add('is-dragging');
      scene.classList.add('is-grabbing');
      entity.setPointerCapture?.(pointerId);
      event.preventDefault();
    });
    entity.addEventListener('click', () => showCard(entity.dataset.ranchKey));
  });

  const endDrag = event => {
    if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    const entity = dragging;
    entity.classList.remove('is-dragging');
    entity.releasePointerCapture?.(pointerId);
    entity.style.setProperty('--drag-x', '0px');
    entity.style.setProperty('--drag-y', '0px');
    dragging = null;
    pointerId = null;
    lifted = false;
    scene.classList.remove('is-grabbing');
  };

  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  card.querySelector('.ranch-card-close').addEventListener('click', closeCard);
})();
