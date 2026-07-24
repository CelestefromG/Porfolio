import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const host = document.querySelector('#star-stage');
if (!host) throw new Error('Missing #star-stage');
host.replaceChildren();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
camera.position.z = 9.2;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.16;
renderer.domElement.className = 'heart-fx-canvas';
renderer.domElement.style.pointerEvents = 'none';
host.appendChild(renderer.domElement);

const group = new THREE.Group();
group.rotation.set(-.08, .3, -.035);
group.scale.setScalar(.93);
scene.add(group);

const shape = new THREE.Shape();
shape.moveTo(0, -2.25);
shape.bezierCurveTo(-.32, -1.72, -2.22, -.58, -2.22, .76);
shape.bezierCurveTo(-2.22, 2.18, -.7, 2.62, 0, 1.32);
shape.bezierCurveTo(.7, 2.62, 2.22, 2.18, 2.22, .76);
shape.bezierCurveTo(2.22, -.58, .32, -1.72, 0, -2.25);
shape.closePath();

const depth = .92;
const geo = new THREE.ExtrudeGeometry(shape, {
  depth, steps: 1, curveSegments: 4,
  bevelEnabled: true, bevelSegments: 2,
  bevelSize: .2, bevelThickness: .22
});
geo.computeVertexNormals();

const coreMat = new THREE.MeshPhysicalMaterial({
  color: 0xd9dde5, metalness: .72, roughness: .07,
  clearcoat: 1, clearcoatRoughness: .02,
  iridescence: .9, iridescenceIOR: 1.37,
  iridescenceThicknessRange: [100, 780],
  transparent: true, opacity: .88,
  flatShading: true, side: THREE.DoubleSide
});
const core = new THREE.Mesh(geo, coreMat);
core.position.z = -depth / 2;
group.add(core);

const glowMat = new THREE.MeshPhysicalMaterial({
  color: 0xf5f7fb, metalness: .2, roughness: .02,
  clearcoat: 1, transmission: .18, thickness: 1,
  iridescence: 1, transparent: true, opacity: .2,
  depthWrite: false, blending: THREE.AdditiveBlending,
  flatShading: true
});
const glow = new THREE.Mesh(geo, glowMat);
glow.position.z = -depth / 2 + .025;
glow.scale.set(.955, .955, 1.02);
group.add(glow);

const edge = new THREE.LineSegments(
  new THREE.EdgesGeometry(geo, 24),
  new THREE.LineBasicMaterial({ color: 0x707783, transparent: true, opacity: .22 })
);
edge.position.z = -depth / 2;
group.add(edge);

let seed = 5042026;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const contour = shape.extractPoints(11).shape;
const tris = THREE.ShapeUtils.triangulateShape(contour, []).map(ids => {
  const a = contour[ids[0]], b = contour[ids[1]], c = contour[ids[2]];
  const area = Math.abs((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y))/2;
  return { a, b, c, area };
});
const totalArea = tris.reduce((s, t) => s + t.area, 0);
const sample = () => {
  let n = rnd() * totalArea, t = tris[tris.length - 1];
  for (const x of tris) { n -= x.area; if (n <= 0) { t = x; break; } }
  let u = rnd(), v = rnd(); if (u + v > 1) { u = 1-u; v = 1-v; }
  return new THREE.Vector2(
    t.a.x + u*(t.b.x-t.a.x) + v*(t.c.x-t.a.x),
    t.a.y + u*(t.b.y-t.a.y) + v*(t.c.y-t.a.y)
  );
};

const colors = [0xf6f8fb, 0xbcc9dd, 0xe6c6ef, 0xc5e9ee, 0xf1dfb3];
const mats = colors.map((color, i) => new THREE.MeshPhysicalMaterial({
  color, metalness: .76, roughness: .08,
  clearcoat: 1, iridescence: 1,
  iridescenceThicknessRange: [90, 880],
  transparent: true, opacity: i ? .5 : .82,
  flatShading: true, depthWrite: false
}));

const shardGeo = new THREE.TetrahedronGeometry(1, 0);
const shards = [];
for (let i = 0; i < 78; i++) {
  const p = sample(), m = new THREE.Mesh(shardGeo, mats[Math.floor(rnd()*mats.length)]);
  const s = .1 + rnd()*.15;
  m.scale.set(s*(.75+rnd()*.7), s*(.75+rnd()*.8), s*(.6+rnd()));
  m.position.set(p.x, p.y, depth/2 + .03 + rnd()*.07);
  m.rotation.set(rnd()*Math.PI, rnd()*Math.PI, rnd()*Math.PI);
  m.userData.o = m.position.clone();
  m.userData.r = m.rotation.clone();
  m.userData.p = rnd()*Math.PI*2;
  m.userData.s = 0;
  shards.push(m); group.add(m);
}

scene.add(new THREE.HemisphereLight(0xffffff, 0x535865, 2.3));
const key = new THREE.DirectionalLight(0xffffff, 5.2); key.position.set(-4, 6, 8); scene.add(key);
const cyan = new THREE.DirectionalLight(0xa9e9ff, 3.2); cyan.position.set(5, -1, 5); scene.add(cyan);
const rose = new THREE.PointLight(0xf4a8ff, 8, 13); rose.position.set(-3, -2, 5); scene.add(rose);
const gold = new THREE.PointLight(0xffd89a, 6, 12); gold.position.set(3, 3, 4); scene.add(gold);

const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2(9, 9);
const hitLocal = new THREE.Vector3(99, 99, 99);
let over = false, tiltX = 0, tiltY = 0;

addEventListener('pointermove', e => {
  const r = renderer.domElement.getBoundingClientRect();
  tiltX = (e.clientX/innerWidth-.5)*.22;
  tiltY = (e.clientY/innerHeight-.5)*.14;
  if (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) { over=false; return; }
  mouse.x = ((e.clientX-r.left)/r.width)*2-1;
  mouse.y = -((e.clientY-r.top)/r.height)*2+1;
  ray.setFromCamera(mouse, camera);
  group.updateMatrixWorld(true);
  const h = ray.intersectObject(core, false)[0];
  over = !!h;
  if (h) { hitLocal.copy(h.point); group.worldToLocal(hitLocal); }
}, { passive: true });
addEventListener('pointerleave', () => { over = false; });

const resize = () => {
  const r = host.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / Math.max(r.height, 1);
  camera.updateProjectionMatrix();
};
resize(); addEventListener('resize', resize);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  const dataMode = document.querySelector('.scene-home')?.classList.contains('data-mode');
  const ty = dataMode ? Math.PI+.24 : .3;
  group.rotation.y += (ty+tiltX-group.rotation.y)*.038;
  group.rotation.x += (-.08+tiltY-group.rotation.x)*.038;
  group.rotation.z += ((dataMode?-.12:-.035+Math.sin(t*.38)*.018)-group.rotation.z)*.028;
  for (let i=0; i<shards.length; i++) {
    const m=shards[i], o=m.userData.o;
    const d=Math.hypot(o.x-hitLocal.x,o.y-hitLocal.y);
    const q=over?Math.max(0,1-d/.82):0;
    const e=q*q*(3-2*q);
    m.userData.s += (e-m.userData.s)*(e>m.userData.s?.16:.075);
    const sp=reduced?0:m.userData.s;
    const len=Math.max(Math.hypot(o.x,o.y),.001);
    const f=Math.sin(t*2.1+m.userData.p)*.012*sp;
    m.position.set(o.x+o.x/len*.17*sp+f, o.y+o.y/len*.17*sp-f, o.z+.24*sp);
    m.rotation.set(m.userData.r.x+sp*.28, m.userData.r.y-sp*.24, m.userData.r.z+sp*.18);
  }
  if (!reduced) {
    coreMat.iridescenceIOR = 1.34 + Math.sin(t*.72)*.055;
    rose.position.x = Math.sin(t*.42)*4.2;
    gold.position.y = 2.6 + Math.cos(t*.36)*1.6;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();