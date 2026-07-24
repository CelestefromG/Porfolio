(() => {
  const scene = document.querySelector('.poster-scene');
  if (!scene) return;

  const cacheBust = () => Date.now();
  const works = [
    {
      zh: '回所有人｜运动倡议长图',
      en: 'Wellness Initiative Longform',
      date: '2024',
      src: './assets/longform1',
      fallback: './assets/poster1'
    },
    { zh: '视觉作品 02', en: 'Visual Work 02', date: '02', src: './assets/poster2' },
    { zh: '视觉作品 03', en: 'Visual Work 03', date: '03', src: './assets/poster3' },
    { zh: '视觉作品 04', en: 'Visual Work 04', date: '04', src: './assets/visual4' },
    { zh: '视觉作品 05', en: 'Visual Work 05', date: '05', src: './assets/visual5' },
    { zh: '视觉作品 06', en: 'Visual Work 06', date: '06', src: './assets/visual6' }
  ];

  let activeIndex = 0;
  let currentOffset = 0;
  let targetOffset = 0;
  let minOffset = -1400;
  let maxOffset = 240;
  let velocity = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let lastProjected = 0;
  let lastTime = performance.now();
  let imageFailed = false;

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');
  const withBust = path => `${path}${path.includes('?') ? '&' : '?'}v=${cacheBust()}`;

  scene.classList.add('is-tape-archive');
  const oldViewport = scene.querySelector('.gallery-viewport');
  const oldControls = scene.querySelector('.gallery-controls');
  if (oldViewport) oldViewport.setAttribute('aria-hidden', 'true');
  if (oldControls) oldControls.setAttribute('aria-hidden', 'true');

  const archive = document.createElement('div');
  archive.className = 'tape-archive';
  archive.innerHTML = `
    <div class="tape-instruction">
      <b data-tape-title>拖动胶带，展开长图</b>
      <span data-tape-intro>沿胶带方向拖动或滚动鼠标，底部菜单可切换其他作品。</span>
    </div>
    <div class="tape-stage" aria-label="Draggable long-form tape gallery">
      <div class="tape-axis">
        <div class="tape-strip">
          <div class="tape-surface">
            <img class="tape-longform-image" alt="" draggable="false" />
            <div class="tape-placeholder">
              <div><strong></strong><small></small></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tape-feed-shadow" aria-hidden="true"></div>
      <div class="tape-reel" aria-hidden="true"></div>
    </div>
    <div class="tape-progress" aria-hidden="true">
      <div class="tape-progress-track"><span class="tape-progress-fill"></span></div>
      <div class="tape-progress-meta"><span>UNROLL</span><b>00%</b></div>
    </div>
    <nav class="tape-menu" aria-label="Long-form work menu"></nav>
  `;
  scene.insertBefore(archive, scene.querySelector('.scene-back'));

  const stage = archive.querySelector('.tape-stage');
  const strip = archive.querySelector('.tape-strip');
  const image = archive.querySelector('.tape-longform-image');
  const placeholder = archive.querySelector('.tape-placeholder');
  const placeholderTitle = placeholder.querySelector('strong');
  const placeholderText = placeholder.querySelector('small');
  const menu = archive.querySelector('.tape-menu');
  const progressFill = archive.querySelector('.tape-progress-fill');
  const progressValue = archive.querySelector('.tape-progress-meta b');
  const instructionTitle = archive.querySelector('[data-tape-title]');
  const instructionIntro = archive.querySelector('[data-tape-intro]');

  const renderLanguage = () => {
    const english = isEnglish();
    instructionTitle.textContent = english ? 'DRAG THE TAPE TO UNROLL' : '拖动胶带，展开长图';
    instructionIntro.textContent = english
      ? 'Drag along the tape or use the mouse wheel. Choose another reel from the menu below.'
      : '沿胶带方向拖动或滚动鼠标，底部菜单可切换其他作品。';

    menu.querySelectorAll('.tape-tab').forEach((button, index) => {
      const title = button.querySelector('b');
      if (title) title.textContent = english ? works[index].en : works[index].zh;
    });
  };

  const renderMenu = () => {
    menu.innerHTML = '';
    works.forEach((work, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tape-tab${index === activeIndex ? ' is-active' : ''}`;
      button.innerHTML = `
        <span class="tape-tab-reel" aria-hidden="true"></span>
        <span class="tape-tab-copy"><b>${isEnglish() ? work.en : work.zh}</b><small>${String(index + 1).padStart(2, '0')} / ${work.date}</small></span>
      `;
      button.addEventListener('click', () => selectWork(index));
      menu.appendChild(button);
    });
  };

  const showPlaceholder = work => {
    image.hidden = true;
    placeholder.classList.add('is-visible');
    placeholderTitle.textContent = isEnglish() ? work.en : work.zh;
    placeholderText.textContent = isEnglish()
      ? `Upload this work to ${work.src.replace('./', '')}`
      : `将对应图片上传至 ${work.src.replace('./', '')}`;
    imageFailed = true;
    recalculateBounds();
  };

  const loadSource = (work, allowFallback = true) => {
    imageFailed = false;
    placeholder.classList.remove('is-visible');
    image.hidden = false;
    image.classList.add('is-switching');
    image.alt = isEnglish() ? work.en : work.zh;

    const source = withBust(work.src);
    const onLoad = () => {
      image.classList.remove('is-switching');
      recalculateBounds(true);
    };
    const onError = () => {
      if (allowFallback && work.fallback) {
        image.onload = onLoad;
        image.onerror = () => showPlaceholder(work);
        image.src = withBust(work.fallback);
      } else {
        showPlaceholder(work);
      }
    };
    image.onload = onLoad;
    image.onerror = onError;
    image.src = source;
  };

  const selectWork = index => {
    activeIndex = index;
    renderMenu();
    loadSource(works[index]);
  };

  function recalculateBounds(reset = false) {
    const stageHeight = Math.max(stage.clientHeight, 1);
    const imageHeight = imageFailed ? 1450 : Math.max(image.getBoundingClientRect().height, 700);
    maxOffset = stageHeight * 0.36;
    minOffset = -Math.max(stageHeight * 0.7, imageHeight - stageHeight * 0.52);
    if (reset) {
      currentOffset = maxOffset - 70;
      targetOffset = currentOffset;
      velocity = 0;
    } else {
      targetOffset = Math.max(minOffset, Math.min(maxOffset, targetOffset));
      currentOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
    }
    updateProgress();
  }

  const clampOffset = value => Math.max(minOffset, Math.min(maxOffset, value));

  const projectedPointer = (x, y) => {
    const angle = -35 * Math.PI / 180;
    return x * (-Math.sin(angle)) + y * Math.cos(angle);
  };

  const updateProgress = () => {
    const range = Math.max(maxOffset - minOffset, 1);
    const progress = Math.max(0, Math.min(1, (maxOffset - currentOffset) / range));
    const percent = Math.round(progress * 100);
    progressFill.style.width = `${percent}%`;
    progressValue.textContent = `${String(percent).padStart(2, '0')}%`;
  };

  stage.addEventListener('pointerdown', event => {
    dragging = true;
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(event.pointerId);
    startX = event.clientX;
    startY = event.clientY;
    startOffset = targetOffset;
    lastProjected = projectedPointer(event.clientX, event.clientY);
    lastTime = performance.now();
    velocity = 0;
  });

  stage.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const delta = projectedPointer(dx, dy);
    targetOffset = clampOffset(startOffset + delta);

    const now = performance.now();
    const projected = projectedPointer(event.clientX, event.clientY);
    const elapsed = Math.max(now - lastTime, 8);
    velocity = (projected - lastProjected) / elapsed * 16;
    lastProjected = projected;
    lastTime = now;
  });

  const endDrag = event => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    stage.releasePointerCapture?.(event.pointerId);
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  stage.addEventListener('wheel', event => {
    event.preventDefault();
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    targetOffset = clampOffset(targetOffset - delta * 0.58);
    velocity = -delta * 0.055;
  }, { passive: false });

  const animate = () => {
    if (!dragging && Math.abs(velocity) > 0.02) {
      targetOffset = clampOffset(targetOffset + velocity);
      velocity *= 0.92;
      if (targetOffset === minOffset || targetOffset === maxOffset) velocity *= 0.45;
    }
    currentOffset += (targetOffset - currentOffset) * (dragging ? 0.34 : 0.14);
    archive.style.setProperty('--travel', `${currentOffset}px`);
    updateProgress();
    requestAnimationFrame(animate);
  };

  const originalTitle = scene.querySelector('[data-i18n="posterTitle"]');
  const originalIntro = scene.querySelector('[data-i18n="posterIntro"]');
  if (originalTitle) originalTitle.textContent = isEnglish() ? 'Long-form Archive' : '长图档案';
  if (originalIntro) originalIntro.textContent = isEnglish()
    ? 'Long-form visual work presented as an unrolling tape archive.'
    : '以可拖动胶带的方式展开长图作品。';

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    setTimeout(() => {
      renderLanguage();
      renderMenu();
      const work = works[activeIndex];
      image.alt = isEnglish() ? work.en : work.zh;
      if (originalTitle) originalTitle.textContent = isEnglish() ? 'Long-form Archive' : '长图档案';
      if (originalIntro) originalIntro.textContent = isEnglish()
        ? 'Long-form visual work presented as an unrolling tape archive.'
        : '以可拖动胶带的方式展开长图作品。';
    }, 0);
  });

  addEventListener('resize', () => recalculateBounds(false));
  renderMenu();
  renderLanguage();
  loadSource(works[0]);
  animate();
})();
