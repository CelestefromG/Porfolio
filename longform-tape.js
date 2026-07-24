(() => {
  const scene = document.querySelector('.poster-scene');
  if (!scene || scene.dataset.longformReady === 'true') return;
  scene.dataset.longformReady = 'true';
  scene.classList.add('has-longform-archive');

  const head = scene.querySelector('.gallery-head');
  const viewport = scene.querySelector('.gallery-viewport');
  const controls = scene.querySelector('.gallery-controls');
  const backButton = scene.querySelector('.scene-back');
  if (!head || !viewport || !controls || !backButton) return;

  const showcase = document.createElement('section');
  showcase.className = 'poster-showcase-panel';
  scene.insertBefore(showcase, head);
  showcase.append(head, viewport, controls);

  const scrollCue = document.createElement('p');
  scrollCue.className = 'poster-scroll-cue';
  scrollCue.textContent = 'SCROLL THROUGH 06 WORKS · THEN LONGFORM';
  showcase.appendChild(scrollCue);

  const tapePanel = document.createElement('section');
  tapePanel.className = 'longform-tape-panel';
  tapePanel.innerHTML = `
    <div class="longform-tape-head">
      <div>
        <p class="eyebrow">02B / LONGFORM TAPE</p>
        <h3 data-longform-title>长图胶带</h3>
      </div>
      <p data-longform-intro>六张视觉作品之后，进入只收录长图的可拖动胶带档案。拖动胶带或滚动鼠标查看完整内容。</p>
    </div>
    <div class="longform-tape-stage" aria-label="Draggable longform artwork">
      <div class="longform-tape-rail">
        <div class="longform-tape-strip">
          <img src="./assets/sample-longform.svg?v=20260725-1" alt="示例长图" draggable="false" />
          <span class="tape-glare" aria-hidden="true"></span>
        </div>
      </div>
      <div class="longform-reel-shadow" aria-hidden="true"></div>
      <div class="longform-reel" aria-hidden="true"></div>
    </div>
    <div class="longform-progress" aria-hidden="true">
      <div class="longform-progress-track"><span class="longform-progress-fill"></span></div>
      <div class="longform-progress-meta"><span>UNROLL</span><b>00%</b></div>
    </div>
    <nav class="longform-tape-menu" aria-label="Longform tape menu">
      <button class="longform-tape-tab is-active" type="button">
        <span class="longform-tab-reel" aria-hidden="true"></span>
        <span class="longform-tab-copy"><b data-longform-sample>SAMPLE LONGFORM</b><small>01 / INTERACTION TEST</small></span>
      </button>
      <button class="longform-tape-tab" type="button" disabled>
        <span class="longform-tab-reel" aria-hidden="true"></span>
        <span class="longform-tab-copy"><b data-longform-slot>LONGFORM SLOT</b><small>02 / RESERVED</small></span>
      </button>
      <button class="longform-tape-tab" type="button" disabled>
        <span class="longform-tab-reel" aria-hidden="true"></span>
        <span class="longform-tab-copy"><b data-longform-slot>LONGFORM SLOT</b><small>03 / RESERVED</small></span>
      </button>
    </nav>
    <button class="longform-back-to-posters" type="button">↑ <span data-longform-back>返回海报</span></button>
  `;
  scene.insertBefore(tapePanel, backButton);

  const stage = tapePanel.querySelector('.longform-tape-stage');
  const strip = tapePanel.querySelector('.longform-tape-strip');
  const image = strip.querySelector('img');
  const progressFill = tapePanel.querySelector('.longform-progress-fill');
  const progressValue = tapePanel.querySelector('.longform-progress-meta b');
  const reel = tapePanel.querySelector('.longform-reel');
  const previous = scene.querySelector('[data-gallery-prev="poster"]');
  const next = scene.querySelector('[data-gallery-next="poster"]');

  let currentShift = 0;
  let targetShift = 0;
  let minShift = -500;
  let velocity = 0;
  let dragging = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let shiftStart = 0;
  let lastProjection = 0;
  let lastTime = performance.now();
  let wheelLockedUntil = 0;

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');

  const renderLanguage = () => {
    const english = isEnglish();
    const title = tapePanel.querySelector('[data-longform-title]');
    const intro = tapePanel.querySelector('[data-longform-intro]');
    const sample = tapePanel.querySelector('[data-longform-sample]');
    const slots = tapePanel.querySelectorAll('[data-longform-slot]');
    const back = tapePanel.querySelector('[data-longform-back]');
    if (title) title.textContent = english ? 'LONGFORM TAPE' : '长图胶带';
    if (intro) intro.textContent = english
      ? 'After the six visual works, enter a draggable tape archive reserved for long-form editorial pieces. Drag the tape or use the mouse wheel.'
      : '六张视觉作品之后，进入只收录长图的可拖动胶带档案。拖动胶带或滚动鼠标查看完整内容。';
    if (sample) sample.textContent = english ? 'SAMPLE LONGFORM' : '示例长图';
    slots.forEach(slot => { slot.textContent = english ? 'LONGFORM SLOT' : '长图预留位'; });
    if (back) back.textContent = english ? 'BACK TO POSTERS' : '返回海报';
    image.alt = english ? 'Sample longform artwork' : '示例长图';
    scrollCue.textContent = english
      ? 'SCROLL THROUGH 06 WORKS · THEN LONGFORM'
      : '滚过 06 张作品 · 进入长图胶带';
  };

  const clamp = value => Math.max(minShift, Math.min(0, value));

  const calculateBounds = (reset = false) => {
    const visibleSpan = Math.max(stage.clientHeight * 1.12, 580);
    const imageHeight = Math.max(image.getBoundingClientRect().height, 700);
    minShift = Math.min(0, visibleSpan - imageHeight - 170);
    if (reset) {
      currentShift = 0;
      targetShift = 0;
      velocity = 0;
    } else {
      currentShift = clamp(currentShift);
      targetShift = clamp(targetShift);
    }
    updateProgress();
  };

  const updateProgress = () => {
    const range = Math.max(-minShift, 1);
    const progress = Math.max(0, Math.min(1, -currentShift / range));
    const percent = Math.round(progress * 100);
    progressFill.style.width = `${percent}%`;
    progressValue.textContent = `${String(percent).padStart(2, '0')}%`;
    reel.style.transform = `rotateX(68deg) rotateZ(${-18 + progress * 88}deg)`;
  };

  const projectAlongTape = (dx, dy) => {
    const radians = 34 * Math.PI / 180;
    return dx * Math.sin(radians) + dy * Math.cos(radians);
  };

  stage.addEventListener('pointerdown', event => {
    dragging = true;
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(event.pointerId);
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    shiftStart = targetShift;
    lastProjection = projectAlongTape(event.clientX, event.clientY);
    lastTime = performance.now();
    velocity = 0;
  });

  stage.addEventListener('pointermove', event => {
    if (!dragging) return;
    const delta = projectAlongTape(event.clientX - pointerStartX, event.clientY - pointerStartY);
    targetShift = clamp(shiftStart + delta);
    const now = performance.now();
    const projection = projectAlongTape(event.clientX, event.clientY);
    const elapsed = Math.max(now - lastTime, 8);
    velocity = (projection - lastProjection) / elapsed * 15;
    lastProjection = projection;
    lastTime = now;
  });

  const finishDrag = event => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    stage.releasePointerCapture?.(event.pointerId);
  };
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);

  stage.addEventListener('wheel', event => {
    event.preventDefault();
    event.stopPropagation();
    targetShift = clamp(targetShift - event.deltaY * .64);
    velocity = -event.deltaY * .04;
  }, { passive: false });

  /* The original gallery loops forever. Capture its wheel event so the sixth
     work becomes the gateway to the second screen instead of wrapping to 01. */
  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const now = performance.now();
    if (now < wheelLockedUntil) return;

    const direction = Math.sign(event.deltaY || event.deltaX);
    const current = Number(scene.querySelector('.gallery-current')?.textContent || 1);
    const total = Number(scene.querySelector('.gallery-total')?.textContent || 6);

    if (direction > 0) {
      if (current < total) {
        next?.click();
        wheelLockedUntil = now + 230;
      } else {
        scene.scrollTo({ top: tapePanel.offsetTop, behavior: 'smooth' });
        wheelLockedUntil = now + 700;
      }
    } else if (direction < 0 && current > 1) {
      previous?.click();
      wheelLockedUntil = now + 230;
    }
  }, { capture: true, passive: false });

  tapePanel.querySelector('.longform-back-to-posters')?.addEventListener('click', () => {
    scene.scrollTo({ top: 0, behavior: 'smooth' });
  });

  image.addEventListener('load', () => requestAnimationFrame(() => calculateBounds(true)));
  window.addEventListener('resize', () => calculateBounds(false));
  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 0));

  const animate = () => {
    if (!dragging && Math.abs(velocity) > .02) {
      targetShift = clamp(targetShift + velocity);
      velocity *= .91;
      if (targetShift === 0 || targetShift === minShift) velocity *= .45;
    }
    currentShift += (targetShift - currentShift) * (dragging ? .34 : .14);
    strip.style.setProperty('--longform-shift', `${currentShift}px`);
    updateProgress();
    requestAnimationFrame(animate);
  };

  renderLanguage();
  if (image.complete) calculateBounds(true);
  animate();
})();
