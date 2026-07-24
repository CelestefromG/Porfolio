import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

(() => {
  const posterScene = document.querySelector('.poster-scene');
  if (!posterScene || posterScene.dataset.longformReady === 'v4') return;
  posterScene.dataset.longformReady = 'v4';
  posterScene.classList.add('has-longform-archive');

  const head = posterScene.querySelector('.gallery-head');
  const viewport = posterScene.querySelector('.gallery-viewport');
  const controls = posterScene.querySelector('.gallery-controls');
  const backButton = posterScene.querySelector('.scene-back');
  if (!head || !viewport || !controls || !backButton) return;

  const showcase = document.createElement('section');
  showcase.className = 'poster-showcase-panel';
  posterScene.insertBefore(showcase, head);
  showcase.append(head, viewport, controls);

  const scrollCue = document.createElement('p');
  scrollCue.className = 'poster-scroll-cue';
  scrollCue.textContent = '滚过 06 张作品 · 进入长图胶带';
  showcase.appendChild(scrollCue);

  const tapePanel = document.createElement('section');
  tapePanel.className = 'longform-tape-panel';
  tapePanel.innerHTML = `
    <div class="longform-tape-head">
      <div>
        <p class="eyebrow">02B / LONGFORM TAPE</p>
        <h3 data-longform-title>长图胶带</h3>
      </div>
      <p data-longform-intro>移动鼠标，胶带卷会沿方向滚动，并按长图原始比例把内容连续印在轨迹上。整张图铺完后可回卷重画。</p>
    </div>
    <div class="longform-draw-stage" aria-label="Cursor controlled longform tape">
      <div class="longform-canvas-host"></div>
      <div class="longform-pointer-note"><span></span><b data-pointer-note>MOVE POINTER TO LAY TAPE</b></div>
      <div class="longform-counter"><span>POINTS</span><b>000</b></div>
      <div class="longform-fps"><span>FPS</span><b>60</b></div>
    </div>
    <div class="longform-progress" aria-hidden="true">
      <div class="longform-progress-track"><span class="longform-progress-fill"></span></div>
      <div class="longform-progress-meta"><span>UNROLL</span><b>00%</b></div>
    </div>
    <nav class="longform-tape-menu" aria-label="Longform tape menu">
      <button class="longform-tape-tab is-active" type="button">
        <span class="longform-tab-reel" aria-hidden="true"></span>
        <span class="longform-tab-copy"><b data-longform-sample>示例长图</b><small>01 / INTERACTION TEST</small></span>
      </button>
      <button class="longform-tape-tab" type="button" disabled>
        <span class="longform-tab-reel" aria-hidden="true"></span>
        <span class="longform-tab-copy"><b data-longform-slot>长图预留位</b><small>02 / RESERVED</small></span>
      </button>
      <button class="longform-tape-tab" type="button" disabled>
        <span class="longform-tab-reel" aria-hidden="true"></span>
        <span class="longform-tab-copy"><b data-longform-slot>长图预留位</b><small>03 / RESERVED</small></span>
      </button>
    </nav>
    <button class="longform-rewind" type="button"><span>↺</span><b data-rewind>回卷重画</b></button>
    <button class="longform-back-to-posters" type="button">↑ <span data-longform-back>返回海报</span></button>
  `;
  posterScene.insertBefore(tapePanel, backButton);

  const stage = tapePanel.querySelector('.longform-draw-stage');
  const canvasHost = tapePanel.querySelector('.longform-canvas-host');
  const progressFill = tapePanel.querySelector('.longform-progress-fill');
  const progressValue = tapePanel.querySelector('.longform-progress-meta b');
  const pointValue = tapePanel.querySelector('.longform-counter b');
  const fpsValue = tapePanel.querySelector('.longform-fps b');
  const pointerNote = tapePanel.querySelector('.longform-pointer-note');
  const previous = posterScene.querySelector('[data-gallery-prev="poster"]');
  const next = posterScene.querySelector('[data-gallery-next="poster"]');

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');
  const renderLanguage = () => {
    const english = isEnglish();
    tapePanel.querySelector('[data-longform-title]').textContent = english ? 'LONGFORM TAPE' : '长图胶带';
    tapePanel.querySelector('[data-longform-intro]').textContent = english
      ? 'Move the pointer: the roll follows its direction and stamps the long-form artwork at its original aspect ratio. Rewind after the complete image is laid.'
      : '移动鼠标，胶带卷会沿方向滚动，并按长图原始比例把内容连续印在轨迹上。整张图铺完后可回卷重画。';
    tapePanel.querySelector('[data-longform-sample]').textContent = english ? 'SAMPLE LONGFORM' : '示例长图';
    tapePanel.querySelectorAll('[data-longform-slot]').forEach(node => {
      node.textContent = english ? 'LONGFORM SLOT' : '长图预留位';
    });
    tapePanel.querySelector('[data-longform-back]').textContent = english ? 'BACK TO POSTERS' : '返回海报';
    tapePanel.querySelector('[data-rewind]').textContent = english ? 'REWIND' : '回卷重画';
    tapePanel.querySelector('[data-pointer-note]').textContent = english ? 'MOVE POINTER TO LAY TAPE' : '移动鼠标，铺开胶带';
    scrollCue.textContent = english ? 'SCROLL THROUGH 06 WORKS · THEN LONGFORM' : '滚过 06 张作品 · 进入长图胶带';
  };

  const worldScene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 50);
  camera.position.set(0, 0, 18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'longform-webgl';
  canvasHost.appendChild(renderer.domElement);

  worldScene.add(new THREE.HemisphereLight(0xffffff, 0x767a80, 2.35));
  const key = new THREE.DirectionalLight(0xffffff, 4.2);
  key.position.set(-5, 7, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  worldScene.add(key);
  const rim = new THREE.DirectionalLight(0xb7d7ff, 2.1);
  rim.position.set(8, -3, 9);
  worldScene.add(rim);

  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 22),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.13 })
  );
  shadowPlane.position.z = -0.08;
  shadowPlane.receiveShadow = true;
  worldScene.add(shadowPlane);

  const fallbackCanvas = document.createElement('canvas');
  fallbackCanvas.width = 720;
  fallbackCanvas.height = 2800;
  const fallbackCtx = fallbackCanvas.getContext('2d');
  fallbackCtx.fillStyle = '#f3f0e8';
  fallbackCtx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
  fallbackCtx.fillStyle = '#101217';
  fallbackCtx.font = '700 54px sans-serif';
  fallbackCtx.fillText('SAMPLE LONGFORM', 52, 100);
  for (let i = 0; i < 10; i += 1) {
    const y = 170 + i * 250;
    fallbackCtx.fillStyle = i % 2 ? '#dceeff' : '#efe4c8';
    fallbackCtx.fillRect(52, y, 616, 200);
    fallbackCtx.fillStyle = '#101217';
    fallbackCtx.font = '700 34px sans-serif';
    fallbackCtx.fillText(String(i + 1).padStart(2, '0'), 84, y + 66);
    fallbackCtx.font = '500 25px sans-serif';
    fallbackCtx.fillText('VISUAL STORY / CONTENT MODULE', 84, y + 126);
  }
  const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);
  fallbackTexture.colorSpace = THREE.SRGBColorSpace;

  const radius = 1.04;
  const rollWidth = 1.56;
  const tapeWidth = 1.46;
  const sampleGap = 0.055;
  let textureAspect = fallbackCanvas.height / fallbackCanvas.width;
  let contentLength = tapeWidth * textureAspect;

  const ribbonMaterial = new THREE.MeshStandardMaterial({
    map: fallbackTexture,
    color: 0xffffff,
    roughness: 0.84,
    metalness: 0.01,
    side: THREE.DoubleSide
  });
  const ribbonMesh = new THREE.Mesh(new THREE.BufferGeometry(), ribbonMaterial);
  ribbonMesh.castShadow = true;
  ribbonMesh.receiveShadow = true;
  worldScene.add(ribbonMesh);

  const ribbonShadow = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      color: 0x16181c,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  ribbonShadow.position.set(0.13, -0.16, -0.055);
  worldScene.add(ribbonShadow);

  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xb8b7b1, transparent: true, opacity: 0.9 });
  const leftEdge = new THREE.Line(new THREE.BufferGeometry(), edgeMaterial);
  const rightEdge = new THREE.Line(new THREE.BufferGeometry(), edgeMaterial);
  worldScene.add(leftEdge, rightEdge);

  const rollTexture = fallbackTexture.clone();
  rollTexture.wrapS = THREE.RepeatWrapping;
  rollTexture.wrapT = THREE.RepeatWrapping;
  rollTexture.repeat.set(2.3, 0.23);
  rollTexture.needsUpdate = true;

  const roller = new THREE.Group();
  const orientGroup = new THREE.Group();
  const tiltGroup = new THREE.Group();
  roller.add(orientGroup);
  orientGroup.add(tiltGroup);
  tiltGroup.rotation.x = 0.57;
  tiltGroup.rotation.y = -0.12;

  const outerMaterial = new THREE.MeshStandardMaterial({
    map: rollTexture,
    color: 0xf7f7f4,
    roughness: 0.8,
    metalness: 0.01,
    side: THREE.DoubleSide
  });
  const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, rollWidth, 96, 1, true);
  cylinderGeometry.rotateZ(Math.PI / 2);
  const rollBody = new THREE.Mesh(cylinderGeometry, outerMaterial);
  rollBody.castShadow = true;
  rollBody.receiveShadow = true;
  tiltGroup.add(rollBody);

  const innerRadius = radius * 0.5;
  const innerGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, rollWidth * 1.04, 72, 1, true);
  innerGeometry.rotateZ(Math.PI / 2);
  const innerTube = new THREE.Mesh(
    innerGeometry,
    new THREE.MeshStandardMaterial({ color: 0x8d9092, roughness: 0.96, side: THREE.BackSide })
  );
  tiltGroup.add(innerTube);

  const rimGeometry = new THREE.TorusGeometry(radius, 0.065, 18, 96);
  rimGeometry.rotateY(Math.PI / 2);
  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xd5d6d3, roughness: 0.9 });
  const frontRim = new THREE.Mesh(rimGeometry, rimMaterial);
  const backRim = frontRim.clone();
  frontRim.position.x = rollWidth * 0.505;
  backRim.position.x = -rollWidth * 0.505;
  tiltGroup.add(frontRim, backRim);

  const coreGeometry = new THREE.TorusGeometry(innerRadius, 0.08, 18, 72);
  coreGeometry.rotateY(Math.PI / 2);
  const coreMaterial = new THREE.MeshStandardMaterial({ color: 0x6e7174, roughness: 0.96 });
  const coreFront = new THREE.Mesh(coreGeometry, coreMaterial);
  const coreBack = coreFront.clone();
  coreFront.position.x = rollWidth * 0.515;
  coreBack.position.x = -rollWidth * 0.515;
  tiltGroup.add(coreFront, coreBack);

  const rollerShadow = new THREE.Mesh(
    new THREE.CircleGeometry(radius * 1.12, 64),
    new THREE.MeshBasicMaterial({ color: 0x111318, transparent: true, opacity: 0.18, depthWrite: false })
  );
  rollerShadow.scale.set(1.5, 0.48, 1);
  rollerShadow.position.z = -0.045;
  worldScene.add(rollerShadow, roller);

  const target = new THREE.Vector3(3.25, -0.35, 0);
  const current = target.clone();
  const velocity = new THREE.Vector3();
  const contact = new THREE.Vector3();
  const previousHead = current.clone();
  const direction = new THREE.Vector3(1, 0, 0);
  const points = [];

  let drawnLength = 0;
  let rollSpin = 0;
  let heading = 0;
  let pointerInside = false;
  let touchDrawing = false;
  let rewinding = false;
  let panelVisible = false;
  let hasMoved = false;
  let frameCounter = 0;
  let lastFpsTime = performance.now();

  const smoothPoints = source => {
    if (source.length < 4) return source.map(point => point.clone());
    let result = source.map(point => point.clone());
    for (let pass = 0; pass < 2; pass += 1) {
      const nextResult = [result[0].clone()];
      for (let i = 1; i < result.length - 1; i += 1) {
        nextResult.push(
          result[i - 1].clone().multiplyScalar(0.18)
            .add(result[i].clone().multiplyScalar(0.64))
            .add(result[i + 1].clone().multiplyScalar(0.18))
        );
      }
      nextResult.push(result[result.length - 1].clone());
      result = nextResult;
    }
    return result;
  };

  const limitPathLength = (source, limit) => {
    if (source.length < 2) return source;
    const limited = [source[0].clone()];
    let travelled = 0;
    for (let i = 1; i < source.length; i += 1) {
      const previousPoint = source[i - 1];
      const nextPoint = source[i];
      const segment = previousPoint.distanceTo(nextPoint);
      if (travelled + segment <= limit) {
        limited.push(nextPoint.clone());
        travelled += segment;
        continue;
      }
      const remaining = Math.max(0, limit - travelled);
      if (remaining > 0.0001 && segment > 0.0001) {
        limited.push(previousPoint.clone().lerp(nextPoint, remaining / segment));
      }
      break;
    }
    return limited;
  };

  function rebuildRibbon(dynamicContact = contact) {
    const source = points.slice();
    if (!source.length || source[source.length - 1].distanceTo(dynamicContact) > 0.001) {
      source.push(dynamicContact.clone());
    }
    if (source.length < 2) return;

    const path = limitPathLength(smoothPoints(source), contentLength);
    if (path.length < 2) return;
    const vertices = [];
    const uvs = [];
    const indices = [];
    const leftPositions = [];
    const rightPositions = [];
    let cumulative = 0;

    for (let i = 0; i < path.length; i += 1) {
      const point = path[i];
      const prev = path[Math.max(0, i - 1)];
      const nextPoint = path[Math.min(path.length - 1, i + 1)];
      const tangent = nextPoint.clone().sub(prev).normalize();
      if (tangent.lengthSq() < 0.0001) tangent.set(1, 0, 0);
      const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      if (i > 0) cumulative += point.distanceTo(path[i - 1]);

      const tailRatio = i / Math.max(path.length - 1, 1);
      const lift = Math.pow(tailRatio, 12) * 0.09;
      const z = 0.026 + lift + i * 0.000025;
      const left = point.clone().addScaledVector(normal, tapeWidth / 2);
      const right = point.clone().addScaledVector(normal, -tapeWidth / 2);
      left.z = z;
      right.z = z;
      vertices.push(left.x, left.y, left.z, right.x, right.y, right.z);
      leftPositions.push(left.x, left.y, left.z + 0.012);
      rightPositions.push(right.x, right.y, right.z + 0.012);

      const v = 1 - THREE.MathUtils.clamp(cumulative / contentLength, 0, 1);
      uvs.push(0, v, 1, v);
      if (i < path.length - 1) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    ribbonMesh.geometry.dispose();
    ribbonShadow.geometry.dispose();
    ribbonMesh.geometry = geometry;
    ribbonShadow.geometry = geometry.clone();

    leftEdge.geometry.dispose();
    rightEdge.geometry.dispose();
    leftEdge.geometry = new THREE.BufferGeometry();
    rightEdge.geometry = new THREE.BufferGeometry();
    leftEdge.geometry.setAttribute('position', new THREE.Float32BufferAttribute(leftPositions, 3));
    rightEdge.geometry.setAttribute('position', new THREE.Float32BufferAttribute(rightPositions, 3));
  }

  const recomputeLength = () => {
    drawnLength = 0;
    for (let i = 1; i < points.length; i += 1) drawnLength += points[i].distanceTo(points[i - 1]);
  };

  const updateProgress = () => {
    const progress = THREE.MathUtils.clamp(drawnLength / contentLength, 0, 1);
    const percent = Math.round(progress * 100);
    progressFill.style.width = `${percent}%`;
    progressValue.textContent = `${String(percent).padStart(2, '0')}%`;
    pointValue.textContent = String(Math.max(0, points.length - 1)).padStart(3, '0');
    if (progress >= 0.999) {
      pointerNote.classList.remove('is-hidden');
      pointerNote.querySelector('b').textContent = isEnglish() ? 'FULLY UNROLLED · REWIND' : '长图已铺完 · 点击回卷';
    }
  };

  const initialisePath = () => {
    points.length = 0;
    current.set(3.25, -0.35, 0);
    target.copy(current);
    previousHead.copy(current);
    velocity.set(0, 0, 0);
    direction.set(1, 0, 0);
    heading = 0;
    contact.copy(current).addScaledVector(direction, -radius * 0.92);
    const leadLength = Math.min(2.4, contentLength * 0.28);
    points.push(
      new THREE.Vector3(contact.x - leadLength, contact.y + 0.22, 0),
      new THREE.Vector3(contact.x - leadLength * 0.48, contact.y + 0.07, 0),
      contact.clone()
    );
    recomputeLength();
    rollSpin = -drawnLength / radius;
    hasMoved = false;
    pointerNote.classList.remove('is-hidden');
    pointerNote.querySelector('b').textContent = isEnglish() ? 'MOVE POINTER TO LAY TAPE' : '移动鼠标，铺开胶带';
    rebuildRibbon(contact);
    updateProgress();
  };

  const appendToPath = dynamicContact => {
    if (!points.length) points.push(dynamicContact.clone());
    let tail = points[points.length - 1];
    let remaining = tail.distanceTo(dynamicContact);
    if (remaining < sampleGap) return;

    const dir = dynamicContact.clone().sub(tail).normalize();
    while (remaining > 0.0001 && drawnLength < contentLength - 0.0001) {
      const step = Math.min(sampleGap, remaining, contentLength - drawnLength);
      tail = tail.clone().addScaledVector(dir, step);
      points.push(tail);
      drawnLength += step;
      remaining -= step;
    }
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const drawPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const setTargetFromEvent = event => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(drawPlane, target);
    target.x = THREE.MathUtils.clamp(target.x, camera.left + 1.35, camera.right - 1.35);
    target.y = THREE.MathUtils.clamp(target.y, camera.bottom + 1.4, camera.top - 1.4);
  };

  stage.addEventListener('pointerenter', event => {
    pointerInside = true;
    document.body.classList.add('is-laying-tape');
    setTargetFromEvent(event);
  });
  stage.addEventListener('pointerleave', () => {
    pointerInside = false;
    touchDrawing = false;
    document.body.classList.remove('is-laying-tape');
  });
  stage.addEventListener('pointerdown', event => {
    touchDrawing = true;
    stage.setPointerCapture?.(event.pointerId);
    setTargetFromEvent(event);
  });
  stage.addEventListener('pointerup', event => {
    touchDrawing = false;
    stage.releasePointerCapture?.(event.pointerId);
  });
  stage.addEventListener('pointercancel', () => { touchDrawing = false; });
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' || touchDrawing) setTargetFromEvent(event);
  });

  tapePanel.querySelector('.longform-rewind').addEventListener('click', () => {
    rewinding = true;
    pointerNote.classList.remove('is-hidden');
  });
  tapePanel.querySelector('.longform-back-to-posters').addEventListener('click', () => {
    posterScene.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    const viewHeight = 10.8;
    const viewWidth = viewHeight * (width / height);
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  new IntersectionObserver(entries => {
    panelVisible = entries[0]?.isIntersecting ?? false;
  }, { threshold: 0.12 }).observe(tapePanel);

  let wheelLockedUntil = 0;
  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const now = performance.now();
    if (now < wheelLockedUntil) return;
    const directionSign = Math.sign(event.deltaY || event.deltaX);
    const cardCurrent = Number(posterScene.querySelector('.gallery-current')?.textContent || 1);
    const total = Number(posterScene.querySelector('.gallery-total')?.textContent || 6);
    if (directionSign > 0) {
      if (cardCurrent < total) {
        next?.click();
        wheelLockedUntil = now + 230;
      } else {
        posterScene.scrollTo({ top: tapePanel.offsetTop, behavior: 'smooth' });
        wheelLockedUntil = now + 700;
      }
    } else if (directionSign < 0 && cardCurrent > 1) {
      previous?.click();
      wheelLockedUntil = now + 230;
    }
  }, { capture: true, passive: false });

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(() => {
    renderLanguage();
    updateProgress();
  }, 0));
  renderLanguage();

  const loader = new THREE.TextureLoader();
  loader.load(
    './assets/sample-longform.svg?v=20260725-4',
    texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      ribbonMaterial.map = texture;
      ribbonMaterial.needsUpdate = true;

      const imageWidth = texture.image?.naturalWidth || texture.image?.width || 720;
      const imageHeight = texture.image?.naturalHeight || texture.image?.height || 2800;
      textureAspect = THREE.MathUtils.clamp(imageHeight / Math.max(imageWidth, 1), 1, 40);
      contentLength = tapeWidth * textureAspect;

      const wrapped = texture.clone();
      wrapped.wrapS = THREE.RepeatWrapping;
      wrapped.wrapT = THREE.RepeatWrapping;
      wrapped.repeat.set(2.3, 0.23);
      wrapped.needsUpdate = true;
      outerMaterial.map = wrapped;
      outerMaterial.needsUpdate = true;
      initialisePath();
    },
    undefined,
    () => {}
  );

  const clock = new THREE.Clock();
  const animate = () => {
    const deltaTime = Math.min(clock.getDelta(), 0.04);

    if (panelVisible) {
      if (rewinding) {
        const removeCount = Math.min(points.length - 1, Math.max(1, Math.ceil(220 * deltaTime)));
        if (removeCount > 0) {
          points.splice(points.length - removeCount, removeCount);
          recomputeLength();
          const tail = points[points.length - 1];
          const prev = points[Math.max(0, points.length - 2)];
          const backDir = tail.clone().sub(prev).normalize();
          if (backDir.lengthSq() < 0.001) backDir.set(1, 0, 0);
          direction.lerp(backDir, 0.35).normalize();
          heading = Math.atan2(direction.y, direction.x);
          current.copy(tail).addScaledVector(direction, radius * 0.92);
          target.copy(current);
          velocity.set(0, 0, 0);
          rollSpin = -drawnLength / radius;
          contact.copy(tail);
          rebuildRibbon(contact);
        } else {
          rewinding = false;
          initialisePath();
        }
      } else if ((pointerInside || touchDrawing) && drawnLength < contentLength - 0.0001) {
        const spring = 31;
        const damping = 9.5;
        const acceleration = target.clone().sub(current).multiplyScalar(spring);
        velocity.addScaledVector(acceleration, deltaTime);
        velocity.multiplyScalar(Math.exp(-damping * deltaTime));
        if (velocity.length() > 8.5) velocity.setLength(8.5);

        current.addScaledVector(velocity, deltaTime);
        const movement = current.distanceTo(previousHead);
        if (movement > 0.00025) {
          const velocityDirection = velocity.clone().normalize();
          if (velocityDirection.lengthSq() > 0.001) {
            direction.lerp(velocityDirection, 1 - Math.pow(0.003, deltaTime)).normalize();
            const desiredHeading = Math.atan2(direction.y, direction.x);
            heading += Math.atan2(Math.sin(desiredHeading - heading), Math.cos(desiredHeading - heading)) * 0.24;
          }
          rollSpin -= movement / radius;
          previousHead.copy(current);
          hasMoved = true;
          pointerNote.classList.add('is-hidden');
        }

        contact.copy(current).addScaledVector(direction, -radius * 0.92);
        if (hasMoved) appendToPath(contact);
        rebuildRibbon(contact);

        if (drawnLength >= contentLength - 0.0001) {
          const tail = points[points.length - 1];
          current.copy(tail).addScaledVector(direction, radius * 0.92);
          target.copy(current);
          velocity.set(0, 0, 0);
          contact.copy(tail);
          rebuildRibbon(contact);
        }
      }

      roller.position.set(current.x, current.y, radius + 0.035);
      orientGroup.rotation.z += Math.atan2(
        Math.sin(heading + Math.PI / 2 - orientGroup.rotation.z),
        Math.cos(heading + Math.PI / 2 - orientGroup.rotation.z)
      ) * 0.24;
      rollBody.rotation.x += (rollSpin - rollBody.rotation.x) * 0.35;
      innerTube.rotation.x = rollBody.rotation.x;
      frontRim.rotation.x = rollBody.rotation.x;
      backRim.rotation.x = rollBody.rotation.x;
      coreFront.rotation.x = rollBody.rotation.x;
      coreBack.rotation.x = rollBody.rotation.x;

      rollerShadow.position.set(current.x + 0.14, current.y - 0.28, -0.045);
      rollerShadow.rotation.z = orientGroup.rotation.z;
      updateProgress();
    }

    renderer.render(worldScene, camera);
    frameCounter += 1;
    const now = performance.now();
    if (now - lastFpsTime > 500) {
      const fps = Math.round(frameCounter * 1000 / (now - lastFpsTime));
      fpsValue.textContent = String(Math.min(99, fps)).padStart(2, '0');
      frameCounter = 0;
      lastFpsTime = now;
    }
    requestAnimationFrame(animate);
  };

  initialisePath();
  animate();
})();