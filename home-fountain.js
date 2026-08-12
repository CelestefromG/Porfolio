import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const host = document.querySelector('#star-stage');
const home = document.querySelector('.scene-home');

if (host) {
  host.replaceChildren();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.3, 7.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.domElement.className = 'star-fx-canvas fountain-fx-canvas';
  renderer.domElement.style.filter = 'saturate(1.08) contrast(1.045)';
  host.appendChild(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.HemisphereLight(0xfffbf4, 0xaabed2, 1.75));

  const key = new THREE.DirectionalLight(0xffffff, 2.45);
  key.position.set(4, 7, 6);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xbfdcff, 1.15);
  fill.position.set(-5, 2, 4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffd9ef, 0.85);
  rim.position.set(2, -1, -4);
  scene.add(rim);

  let model = null;
  let mixer = null;
  let loaded = false;
  let loading = false;
  let running = false;
  let frameId = 0;
  let pointerX = 0;
  let pointerY = 0;
  let lastTime = performance.now();

  const resize = () => {
    const rect = host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  };

  const fitModel = object => {
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    object.position.sub(center);
    object.scale.setScalar(3.2 / maxDim);
    object.updateMatrixWorld(true);

    const fitted = new THREE.Box3().setFromObject(object);
    const fittedCenter = fitted.getCenter(new THREE.Vector3());
    object.position.x -= fittedCenter.x;
    object.position.y -= fittedCenter.y + 0.12;
  };

  const tuneTexture = texture => {
    if (!texture?.isTexture) return;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  };

  const loadModel = () => {
    if (loaded || loading) return;
    loading = true;
    host.classList.add('is-loading-model');

    new GLTFLoader().load(
      './assets/fountain.glb?v=11946400f00a8e84a60e66bd78f13bfb552e3058',
      gltf => {
        model = gltf.scene;
        fitModel(model);

        model.traverse(node => {
          if (!node.isMesh) return;
          node.castShadow = false;
          node.receiveShadow = false;

          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.filter(Boolean).forEach(material => {
            if ('envMapIntensity' in material) material.envMapIntensity = 0.62;
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap'].forEach(key => tuneTexture(material[key]));
            material.needsUpdate = true;
          });
        });

        root.add(model);

        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach(clip => mixer.clipAction(clip).play());
        }

        loaded = true;
        loading = false;
        host.classList.remove('is-loading-model');
        resize();
      },
      undefined,
      error => {
        loading = false;
        host.classList.remove('is-loading-model');
        host.classList.add('model-load-failed');
        console.error('Failed to load assets/fountain.glb', error);
      }
    );
  };

  const onPointerMove = event => {
    if (!running || !loaded) return;
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.22;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.11;
  };

  const animate = now => {
    if (!running) return;

    const delta = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (mixer) mixer.update(delta);

    if (model) {
      const dataMode = home?.classList.contains('data-mode');
      const baseY = dataMode ? Math.PI + 0.18 : 0;
      root.rotation.y += (baseY + pointerX - root.rotation.y) * 0.035;
      root.rotation.x += (pointerY * 0.32 - root.rotation.x) * 0.035;
      if (!dataMode) root.rotation.y += delta * 0.055;
    }

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  const setRunning = next => {
    if (next === running) return;
    running = next;

    if (running) {
      loadModel();
      resize();
      lastTime = performance.now();
      frameId = requestAnimationFrame(animate);
    } else if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();

  if (home) {
    new IntersectionObserver(entries => {
      setRunning(Boolean(entries[0]?.isIntersecting) && !document.hidden);
    }, { threshold: 0.08 }).observe(home);
  } else {
    setRunning(true);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setRunning(false);
    else if (home?.classList.contains('is-visible')) setRunning(true);
  });
}
