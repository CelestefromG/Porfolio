import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

(() => {
  const posterScene = document.querySelector('.poster-scene');
  if (!posterScene || posterScene.dataset.longformReady === 'v2') return;
  posterScene.dataset.longformReady = 'v2';
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
      <p data-longform-intro>移动鼠标让胶带卷沿轨迹滚动，走过的位置会连续留下长图胶印。按住拖动也可以更精确地控制路线。</p>
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
  const previous = posterScene.querySelector('[data-gallery-prev="poster"]');
  const next = posterScene.querySelector('[data-gallery-next="poster"]');

  const isEnglish = () => document.querySelector('.lang-en')?.classList.contains('is-active');
  const renderLanguage = () => {
    const english = isEnglish();
    tapePanel.querySelector('[data-longform-title]').textContent = english ? 'LONGFORM TAPE' : '长图胶带';
    tapePanel.querySelector('[data-longform-intro]').textContent = english
      ? 'Move the pointer and the roll follows its direction, rotating as it lays a continuous long-form print along the path. Drag for more precise control.'
      : '移动鼠标让胶带卷沿轨迹滚动，走过的位置会连续留下长图胶印。按住拖动也可以更精确地控制路线。';
    tapePanel.querySelector('[data-longform-sample]').textContent = english ? 'SAMPLE LONGFORM' : '示例长图';
    tapePanel.querySelectorAll('[data-longform-slot]').forEach(node => {
      node.textContent = english ? 'LONGFORM SLOT' : '长图预留位';
    });
    tapePanel.querySelector('[data-longform-back]').textContent = english ? 'BACK TO POSTERS' : '返回海报';
    tapePanel.querySelector('[data-rewind]').textContent = english ? 'REWIND' : '回卷重画';
    tapePanel.querySelector('[data-pointer-note]').textContent = english ? 'MOVE POINTER TO LAY TAPE' : '移动鼠标，铺开胶带';
    scrollCue.textContent = english ? 'SCROLL THROUGH 06 WORKS · THEN LONGFORM' : '滚过 06 张作品 · 进入长图胶带';
  };

  // --- Three.js scene ------------------------------------------------------
  const worldScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, -0.5, 16);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'longform-webgl';
  canvasHost.appendChild(renderer.domElement);

  worldScene.add(new THREE.HemisphereLight(0xffffff, 0x777b80, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 4.8);
  key.position.set(-5, 7, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  worldScene.add(key);
  const rim = new THREE.DirectionalLight(0xa8cfff, 2.5);
  rim.position.set(8, -4, 7);
  worldScene.add(rim);

  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 26),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.17 })
  );
  shadowPlane.position.z = -0.08;
  shadowPlane.receiveShadow = true;
  worldScene.add(shadowPlane);

  const fallbackCanvas = document.createElement('canvas');
  fallbackCanvas.width = 512;
  fallbackCanvas.height = 2048;
  const ctx = fallbackCanvas.getContext('2d');
  ctx.fillStyle = '#f3f0e8';
  ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
  ctx.fillStyle = '#111318';
  ctx.font = '700 42px sans-serif';
  ctx.fillText('SAMPLE LONGFORM', 46, 92);
  for (let i = 0; i < 10; i += 1) {
    const y = 150 + i * 180;
    ctx.fillStyle = i % 2 ? '#d9ecff' : '#f0e7cc';
    ctx.fillRect(42, y, 428, 140);
    ctx.fillStyle = '#111318';
    ctx.font = '700 24px sans-serif';
    ctx.fillText(String(i + 1).padStart(2, '0'), 64, y + 48);
    ctx.font = '500 18px sans-serif';
    ctx.fillText('VISUAL STORY / CONTENT MODULE', 64, y + 88);
  }
  const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);
  fallbackTexture.colorSpace = THREE.SRGBColorSpace;

  let longformTexture = fallbackTexture;
  const loader = new THREE.TextureLoader();
  loader.load(
    './assets/sample-longform.svg?v=20260725-2',
    texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      longformTexture = texture;
      ribbonMaterial.map = texture;
      ribbonMaterial.needsUpdate = true;
      sideMaterial.map = texture.clone();
      sideMaterial.map.wrapS = THREE.RepeatWrapping;
      sideMaterial.map.wrapT = THREE.ClampToEdgeWrapping;
      sideMaterial.map.needsUpdate = true;
      sideMaterial.needsUpdate = true;
    },
    undefined,
    () => {}
  );

  const ribbonMaterial = new THREE.MeshStandardMaterial({
    map: longformTexture,
    color: 0xffffff,
    roughness: 0.82,
    metalness: 0.02,
    side: THREE.DoubleSide
  });
  const ribbonMesh = new THREE.Mesh(new THREE.BufferGeometry(), ribbonMaterial);
  ribbonMesh.castShadow = true;
  ribbonMesh.receiveShadow = true;
  worldScene.add(ribbonMesh);

  const ribbonShadow = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x15171a, transparent: true, opacity: 0.11, side: THREE.DoubleSide, depthWrite: false })
  );
  ribbonShadow.position.z = -0.035;
  worldScene.add(ribbonShadow);

  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xb9b8b2, transparent: true, opacity: 0.85 });
  const leftEdge = new THREE.Line(new THREE.BufferGeometry(), edgeMaterial);
  const rightEdge = new THREE.Line(new THREE.BufferGeometry(), edgeMaterial);
  worldScene.add(leftEdge, rightEdge);

  const radius = 1.36;
  const rollWidth = 1.72;
  const sideMaterial = new THREE.MeshStandardMaterial({
    map: longformTexture,
    color: 0xffffff,
    roughness: 0.76,
    metalness: 0.03
  });
  const capMaterial = new THREE.MeshStandardMaterial({ color: 0xc7c8c5, roughness: 0.92, metalness: 0.02 });
  const innerMaterial = new THREE.MeshStandardMaterial({ color: 0x8e9194, roughness: 0.95 });

  const roller = new THREE.Group();
  const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, rollWidth, 72, 1, false);
  cylinderGeometry.rotateZ(Math.PI / 2);
  const rollBody = new THREE.Mesh(cylinderGeometry, [sideMaterial, capMaterial, capMaterial]);
  rollBody.castShadow = true;
  rollBody.receiveShadow = true;
  roller.add(rollBody);

  const ringGeometry = new THREE.TorusGeometry(radius * 0.73, 0.08, 18, 72);
  ringGeometry.rotateY(Math.PI / 2);
  const ringA = new THREE.Mesh(ringGeometry, innerMaterial);
  const ringB = ringA.clone();
  ringA.position.x = rollWidth * 0.505;
  ringB.position.x = -rollWidth * 0.505;
  roller.add(ringA, ringB);

  const hubGeometry = new THREE.CylinderGeometry(radius * 0.38, radius * 0.38, rollWidth * 1.04, 48);
  hubGeometry.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeometry, new THREE.MeshStandardMaterial({ color: 0xdfe0dc, roughness: 0.82 }));
  roller.add(hub);
  roller.position.set(-3.4, 0.3, radius * 0.88);
  roller.rotation.y = -0.22;
  worldScene.add(roller);

  const target = new THREE.Vector3(-3.4, 0.3, 0);
  const current = target.clone();
  const previousPosition = current.clone();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const drawPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const points = [current.clone()];
  const maxTapeLength = 52;
  const tapeWidth = 1.64;
  let drawnLength = 0;
  let rollSpin = 0;
  let heading = 0;
  let pointerInside = false;
  let touchDrawing = false;
  let rewinding = false;
  let panelVisible = false;
  let lastGeometryPointCount = 0;
  let frameCounter = 0;
  let lastFpsTime = performance.now();

  const setTargetFromEvent = event => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(drawPlane, target);
    target.x = THREE.MathUtils.clamp(target.x, -9.2, 9.2);
    target.y = THREE.MathUtils.clamp(target.y, -5.1, 5.1);
  };

  stage.addEventListener('pointerenter', event => {
    pointerInside = true;
    setTargetFromEvent(event);
  });
  stage.addEventListener('pointerleave', () => {
    pointerInside = false;
    touchDrawing = false;
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

  const rebuildRibbon = () => {
    if (points.length < 2) return;
    const controlPoints = points.map(point => point.clone());
    const curve = new THREE.CatmullRomCurve3(controlPoints, false, 'centripetal', 0.5);
    const sampleCount = Math.min(360, Math.max(12, points.length * 3));
    const vertices = [];
    const uvs = [];
    const indices = [];
    const leftPositions = [];
    const rightPositions = [];
    let cumulative = 0;
    let previousSample = curve.getPoint(0);

    for (let i = 0; i < sampleCount; i += 1) {
      const t = i / (sampleCount - 1);
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      if (i > 0) cumulative += point.distanceTo(previousSample);
      previousSample = point;
      const left = point.clone().addScaledVector(normal, tapeWidth / 2);
      const right = point.clone().addScaledVector(normal, -tapeWidth / 2);
      left.z = 0.025;
      right.z = 0.025;
      vertices.push(left.x, left.y, left.z, right.x, right.y, right.z);
      leftPositions.push(left.x, left.y, left.z + 0.012);
      rightPositions.push(right.x, right.y, right.z + 0.012);
      const v = 1 - THREE.MathUtils.clamp(cumulative / maxTapeLength, 0, 1);
      uvs.push(0, v, 1, v);
      if (i < sampleCount - 1) {
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
    lastGeometryPointCount = points.length;
  };

  const recomputeLength = () => {
    drawnLength = 0;
    for (let i = 1; i < points.length; i += 1) drawnLength += points[i].distanceTo(points[i - 1]);
  };

  const updateProgress = () => {
    const progress = THREE.MathUtils.clamp(drawnLength / maxTapeLength, 0, 1);
    const percent = Math.round(progress * 100);
    progressFill.style.width = `${percent}%`;
    progressValue.textContent = `${String(percent).padStart(2, '0')}%`;
    pointValue.textContent = String(Math.max(0, points.length - 1)).padStart(3, '0');
  };

  const resetPath = () => {
    points.splice(0, points.length, current.clone());
    drawnLength = 0;
    lastGeometryPointCount = 0;
    ribbonMesh.geometry.dispose();
    ribbonShadow.geometry.dispose();
    ribbonMesh.geometry = new THREE.BufferGeometry();
    ribbonShadow.geometry = new THREE.BufferGeometry();
    leftEdge.geometry.dispose();
    rightEdge.geometry.dispose();
    leftEdge.geometry = new THREE.BufferGeometry();
    rightEdge.geometry = new THREE.BufferGeometry();
    updateProgress();
  };

  tapePanel.querySelector('.longform-rewind').addEventListener('click', () => {
    rewinding = true;
  });
  tapePanel.querySelector('.longform-back-to-posters').addEventListener('click', () => {
    posterScene.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  new IntersectionObserver(entries => {
    panelVisible = entries[0]?.isIntersecting ?? false;
  }, { threshold: 0.12 }).observe(tapePanel);

  // The sixth card becomes the gateway to the second screen instead of wrapping to 01.
  let wheelLockedUntil = 0;
  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const now = performance.now();
    if (now < wheelLockedUntil) return;
    const direction = Math.sign(event.deltaY || event.deltaX);
    const cardCurrent = Number(posterScene.querySelector('.gallery-current')?.textContent || 1);
    const total = Number(posterScene.querySelector('.gallery-total')?.textContent || 6);
    if (direction > 0) {
      if (cardCurrent < total) {
        next?.click();
        wheelLockedUntil = now + 230;
      } else {
        posterScene.scrollTo({ top: tapePanel.offsetTop, behavior: 'smooth' });
        wheelLockedUntil = now + 700;
      }
    } else if (direction < 0 && cardCurrent > 1) {
      previous?.click();
      wheelLockedUntil = now + 230;
    }
  }, { capture: true, passive: false });

  document.querySelector('.lang-toggle')?.addEventListener('click', () => setTimeout(renderLanguage, 0));
  renderLanguage();

  const clock = new THREE.Clock();
  const animate = () => {
    const deltaTime = Math.min(clock.getDelta(), 0.05);

    if (panelVisible) {
      if (rewinding) {
        if (points.length > 1) {
          const removeCount = Math.min(4, points.length - 1);
          points.splice(points.length - removeCount, removeCount);
          recomputeLength();
          const tail = points[points.length - 1];
          target.lerp(tail, 0.45);
          current.lerp(tail, 0.32);
          rebuildRibbon();
        } else {
          rewinding = false;
          resetPath();
        }
      } else if (pointerInside || touchDrawing) {
        current.lerp(target, 1 - Math.pow(0.0008, deltaTime));
        const step = current.distanceTo(previousPosition);
        if (step > 0.0005) {
          const dx = current.x - previousPosition.x;
          const dy = current.y - previousPosition.y;
          const desiredHeading = Math.atan2(dy, dx) + Math.PI / 2;
          heading += Math.atan2(Math.sin(desiredHeading - heading), Math.cos(desiredHeading - heading)) * 0.18;
          rollSpin -= step / radius;
          previousPosition.copy(current);
        }

        const tail = points[points.length - 1];
        const segment = current.distanceTo(tail);
        if (segment > 0.18 && drawnLength < maxTapeLength) {
          const allowed = Math.min(segment, maxTapeLength - drawnLength);
          const direction = current.clone().sub(tail).normalize();
          const nextPoint = tail.clone().addScaledVector(direction, allowed);
          points.push(nextPoint);
          drawnLength += allowed;
          rebuildRibbon();
        }
      }

      roller.position.x += (current.x - roller.position.x) * 0.22;
      roller.position.y += (current.y - roller.position.y) * 0.22;
      roller.position.z = radius * 0.88 + Math.sin(performance.now() * 0.002) * 0.025;
      roller.rotation.z += Math.atan2(Math.sin(heading - roller.rotation.z), Math.cos(heading - roller.rotation.z)) * 0.2;
      rollBody.rotation.x += (rollSpin - rollBody.rotation.x) * 0.3;
      ringA.rotation.x = rollBody.rotation.x;
      ringB.rotation.x = rollBody.rotation.x;
      hub.rotation.x = rollBody.rotation.x;

      if (points.length !== lastGeometryPointCount && points.length > 1) rebuildRibbon();
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
  animate();
})();