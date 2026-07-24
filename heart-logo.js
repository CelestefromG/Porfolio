import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const host = document.querySelector('#star-stage');

if (host) {
  /* Remove the old star canvas. app.js may still animate its detached renderer,
     but only this heart renderer remains visible inside the stage. */
  host.replaceChildren();
  host.classList.add('heart-stage');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.z = 6.9;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.className = 'heart-logo-canvas';
  renderer.domElement.style.pointerEvents = 'none';
  host.appendChild(renderer.domElement);

  const heartGroup = new THREE.Group();
  heartGroup.scale.setScalar(1.58);
  heartGroup.rotation.set(-0.08, 0.24, -0.025);
  scene.add(heartGroup);

  const seededRandom = (() => {
    let seed = 0x0504cafe;
    return () => {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      value = value + Math.imul(value ^ (value >>> 7), 61 | value) ^ value;
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  })();

  const heartCurve = t => {
    const sin = Math.sin(t);
    const x = 1.06 * sin * sin * sin;
    const y = 1.25 * (
      13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t)
    ) / 17 + 0.1;
    return [x, y];
  };

  const points = [];
  const outlineIndices = [];
  const ringCount = 9;

  /* Nested, slightly irregular heart contours create a crystalline volume. */
  for (let ring = 1; ring <= ringCount; ring += 1) {
    const radius = ring / ringCount;
    const segments = 20 + ring * 4;
    for (let segment = 0; segment < segments; segment += 1) {
      const jitter = (seededRandom() - 0.5) * 0.055 * (1 - radius * 0.55);
      const t = segment / segments * Math.PI * 2 + jitter;
      const [curveX, curveY] = heartCurve(t);
      const depth = 0.72 * Math.pow(1 - radius, 0.46);
      const x = curveX * radius + (seededRandom() - 0.5) * 0.026 * (1 - radius);
      const y = curveY * radius + (seededRandom() - 0.5) * 0.026 * (1 - radius);
      const z = (seededRandom() - 0.5) * 2 * depth
        + Math.sin(t * 3.0) * 0.055 * (1 - radius);
      points.push(new THREE.Vector3(x, y, z));
      if (ring === ringCount) outlineIndices.push(points.length - 1);
    }
  }

  /* Extra interior fragments keep the centre from looking like concentric rings. */
  for (let index = 0; index < 96; index += 1) {
    const radius = Math.pow(seededRandom(), 0.7) * 0.88;
    const t = seededRandom() * Math.PI * 2;
    const [curveX, curveY] = heartCurve(t);
    const depth = 0.68 * Math.pow(1 - radius, 0.52);
    points.push(new THREE.Vector3(
      curveX * radius + (seededRandom() - 0.5) * 0.06,
      curveY * radius + (seededRandom() - 0.5) * 0.06,
      (seededRandom() - 0.5) * 2 * depth
    ));
  }

  const pointCount = points.length;
  const basePositions = new Float32Array(pointCount * 3);
  const livePositions = new Float32Array(pointCount * 3);
  const pointColors = new Float32Array(pointCount * 3);
  const palette = [
    new THREE.Color(0xf9fbff),
    new THREE.Color(0xc8dcff),
    new THREE.Color(0xe7d0ff),
    new THREE.Color(0xffe2b5)
  ];

  points.forEach((point, index) => {
    const offset = index * 3;
    basePositions[offset] = livePositions[offset] = point.x;
    basePositions[offset + 1] = livePositions[offset + 1] = point.y;
    basePositions[offset + 2] = livePositions[offset + 2] = point.z;

    const colorIndex = Math.floor(seededRandom() * palette.length);
    const color = new THREE.Color(0xe8edf4).lerp(palette[colorIndex], 0.28 + seededRandom() * 0.22);
    pointColors[offset] = color.r;
    pointColors[offset + 1] = color.g;
    pointColors[offset + 2] = color.b;
  });

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(livePositions, 3));
  pointGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

  const pointMaterial = new THREE.PointsMaterial({
    size: 0.032,
    vertexColors: true,
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
  heartGroup.add(pointCloud);

  /* Connect each fragment to a few local neighbours for a faceted wire structure. */
  const edges = [];
  const seenEdges = new Set();
  for (let i = 0; i < pointCount; i += 1) {
    const nearest = [];
    const pointA = points[i];
    for (let j = 0; j < pointCount; j += 1) {
      if (i === j) continue;
      const distance = pointA.distanceToSquared(points[j]);
      if (distance > 0.26) continue;
      nearest.push([distance, j]);
    }
    nearest.sort((a, b) => a[0] - b[0]);
    nearest.slice(0, 3).forEach(([, j]) => {
      const low = Math.min(i, j);
      const high = Math.max(i, j);
      const key = `${low}:${high}`;
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        edges.push([low, high]);
      }
    });
  }

  const linePositions = new Float32Array(edges.length * 6);
  const lineColors = new Float32Array(edges.length * 6);
  edges.forEach(([from, to], edgeIndex) => {
    const lineOffset = edgeIndex * 6;
    const fromOffset = from * 3;
    const toOffset = to * 3;
    linePositions.set(livePositions.subarray(fromOffset, fromOffset + 3), lineOffset);
    linePositions.set(livePositions.subarray(toOffset, toOffset + 3), lineOffset + 3);
    lineColors.set(pointColors.subarray(fromOffset, fromOffset + 3), lineOffset);
    lineColors.set(pointColors.subarray(toOffset, toOffset + 3), lineOffset + 3);
  });

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const wire = new THREE.LineSegments(lineGeometry, lineMaterial);
  heartGroup.add(wire);

  const outlinePositions = new Float32Array(outlineIndices.length * 3);
  outlineIndices.forEach((pointIndex, index) => {
    const source = pointIndex * 3;
    const target = index * 3;
    outlinePositions[target] = basePositions[source];
    outlinePositions[target + 1] = basePositions[source + 1];
    outlinePositions[target + 2] = 0;
  });
  const outlineGeometry = new THREE.BufferGeometry();
  outlineGeometry.setAttribute('position', new THREE.BufferAttribute(outlinePositions, 3));
  const outline = new THREE.LineLoop(
    outlineGeometry,
    new THREE.LineBasicMaterial({
      color: 0xf7fbff,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  heartGroup.add(outline);

  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 128;
  const glowContext = glowCanvas.getContext('2d');
  const gradient = glowContext.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(220,235,255,.34)');
  gradient.addColorStop(0.38, 'rgba(203,182,255,.12)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  glowContext.fillStyle = gradient;
  glowContext.fillRect(0, 0, 128, 128);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(glowCanvas),
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  glow.scale.set(3.25, 3.25, 1);
  glow.position.z = -0.8;
  heartGroup.add(glow);

  const pointer = new THREE.Vector2(4, 4);
  const pointerTarget = new THREE.Vector3();
  const hitWorld = new THREE.Vector3();
  const localHit = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const interactionPlane = new THREE.Plane();
  const planeNormal = new THREE.Vector3();
  let pointerInside = false;
  let pointerTiltX = 0;
  let pointerTiltY = 0;

  const updatePointer = event => {
    const rect = host.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    pointerInside = inside;
    if (!inside) return;
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
    pointerTiltX = pointer.x * 0.18;
    pointerTiltY = pointer.y * 0.12;
  };

  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('pointerleave', () => {
    pointerInside = false;
  });

  const resize = () => {
    const rect = host.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();

  const updateDeconstruction = elapsed => {
    let hasHit = false;
    const homeVisible = document.querySelector('.scene-home')?.classList.contains('is-visible');
    if (pointerInside && homeVisible && !reducedMotion) {
      raycaster.setFromCamera(pointer, camera);
      planeNormal.set(0, 0, 1).applyQuaternion(heartGroup.quaternion).normalize();
      interactionPlane.setFromNormalAndCoplanarPoint(planeNormal, heartGroup.position);
      if (raycaster.ray.intersectPlane(interactionPlane, hitWorld)) {
        localHit.copy(hitWorld);
        heartGroup.worldToLocal(localHit);
        pointerTarget.lerp(localHit, 0.28);
        hasHit = true;
      }
    }

    const interactionRadius = 0.54;
    for (let index = 0; index < pointCount; index += 1) {
      const offset = index * 3;
      const baseX = basePositions[offset];
      const baseY = basePositions[offset + 1];
      const baseZ = basePositions[offset + 2];
      let targetX = baseX;
      let targetY = baseY;
      let targetZ = baseZ;

      if (hasHit) {
        const deltaX = baseX - pointerTarget.x;
        const deltaY = baseY - pointerTarget.y;
        const deltaZ = (baseZ - pointerTarget.z) * 0.38;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        if (distance < interactionRadius) {
          const falloff = Math.pow(1 - distance / interactionRadius, 2);
          const inverse = 1 / Math.max(distance, 0.045);
          const flutter = Math.sin(elapsed * 3.2 + index * 1.713);
          targetX += deltaX * inverse * falloff * 0.34 + flutter * falloff * 0.035;
          targetY += deltaY * inverse * falloff * 0.34 + Math.cos(elapsed * 2.7 + index) * falloff * 0.035;
          targetZ += (baseZ >= 0 ? 1 : -1) * falloff * 0.24 + flutter * falloff * 0.055;
        }
      }

      const easing = hasHit ? 0.16 : 0.085;
      livePositions[offset] += (targetX - livePositions[offset]) * easing;
      livePositions[offset + 1] += (targetY - livePositions[offset + 1]) * easing;
      livePositions[offset + 2] += (targetZ - livePositions[offset + 2]) * easing;
    }
    pointGeometry.attributes.position.needsUpdate = true;

    edges.forEach(([from, to], edgeIndex) => {
      const lineOffset = edgeIndex * 6;
      const fromOffset = from * 3;
      const toOffset = to * 3;
      linePositions.set(livePositions.subarray(fromOffset, fromOffset + 3), lineOffset);
      linePositions.set(livePositions.subarray(toOffset, toOffset + 3), lineOffset + 3);
    });
    lineGeometry.attributes.position.needsUpdate = true;
  };

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    const dataMode = document.querySelector('.scene-home')?.classList.contains('data-mode');
    const targetRotationY = dataMode ? Math.PI + 0.24 : 0.24;
    const targetRotationX = -0.08 - pointerTiltY;

    heartGroup.rotation.y += (targetRotationY + pointerTiltX - heartGroup.rotation.y) * 0.038;
    heartGroup.rotation.x += (targetRotationX - heartGroup.rotation.x) * 0.038;
    heartGroup.rotation.z += dataMode ? -0.00125 : 0.00042;

    pointMaterial.size = 0.031 + Math.sin(elapsed * 1.35) * 0.002;
    lineMaterial.opacity = 0.43 + Math.sin(elapsed * 0.72) * 0.055;
    glow.material.opacity = 0.58 + Math.sin(elapsed * 0.9) * 0.1;

    updateDeconstruction(elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
