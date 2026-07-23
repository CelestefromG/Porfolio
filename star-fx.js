import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const host = document.querySelector('#star-stage');
if (host) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.z = 8.5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'star-fx-canvas';
  host.appendChild(renderer.domElement);

  const shape = new THREE.Shape();
  for (let i = 0; i < 20; i += 1) {
    const angle = (i / 20) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 ? 0.92 : 2.35;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i ? shape.lineTo(x, y) : shape.moveTo(x, y);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.17,
    bevelThickness: 0.15
  });
  geometry.center();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xcbd1db,
    metalness: 0.78,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [110, 820],
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(-0.22, 0.36, -0.08);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const lights = [
    [0x9fdfff, 3.3, -4, 5, 7],
    [0xf2a5ff, 2.6, 5, -1, 4],
    [0xffd88a, 2.1, 1, 5, 2]
  ];
  lights.forEach(([color, intensity, x, y, z]) => {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  });

  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener('pointermove', event => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.28;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.18;
  });

  const resize = () => {
    const rect = host.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  const animate = () => {
    const dataMode = document.querySelector('.scene-home')?.classList.contains('data-mode');
    const targetY = dataMode ? Math.PI + 0.35 : 0.36;
    mesh.rotation.y += (targetY + pointerX - mesh.rotation.y) * 0.04;
    mesh.rotation.x += (-0.22 + pointerY - mesh.rotation.x) * 0.04;
    mesh.rotation.z += dataMode ? -0.0015 : 0.0007;
    material.iridescenceIOR = 1.28 + Math.sin(performance.now() * 0.00055) * 0.08;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}
