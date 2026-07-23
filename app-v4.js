import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const state = { lang: 'zh', scene: 'home', dataMode: false, videoIndex: 0 };
const copy = {
  zh: {
    brand: '陈思睿 / CELESTE', home: '首页', contact: '联系方式',
    eyebrow: 'DATA · UX RESEARCH · VISUAL STORYTELLING',
    heroTitle: '把数据、研究与视觉<br/>编织成可感知的叙事。',
    heroSub: 'A portfolio orbiting research, moving image and visual systems.',
    dataDesc: '研究、分析与交互可视化', poster: '海报 / 长图', posterDesc: '视觉系统与信息设计',
    video: '视频 / 动态', videoDesc: '剪辑、渲染与动态图像', about: '关于我', aboutDesc: '经历、技能与方法',
    selectedProjects: 'SELECTED DATA & UX PROJECTS', dialect: '中国方言声学地图', jstor: 'JSTOR 中文用户研究',
    dataNews: '预制菜数据新闻', backOrbit: '返回主轨道', status: 'AVAILABLE FOR DATA / UX OPPORTUNITIES',
    explore: 'CLICK A CHAPTER TO EXPLORE', posterTitle: '海报与长图',
    posterIntro: '统一裁切的视觉档案。拖动、滚轮或按钮均可浏览，点击作品展开完整信息。',
    videoTitle: '视频与动态视觉', videoIntro: '新闻影像、MMD渲染与短视频实验。点击卡片进入沉浸式播放界面。',
    backHome: '返回首页', aboutTitle: '研究复杂问题，<br/>并让答案清晰可见。',
    aboutP1: '伦敦国王学院数字人文硕士，关注数据分析、用户研究、计算方法与视觉传播之间的交叉地带。',
    aboutP2: '我的工作从采访和定性编码开始，也可能从一组音频、一个内容账号或一张空白画布开始。最终目标始终相同：发现结构，解释证据，构建可理解的体验。',
    role: '角色', tools: '工具', year: '年份'
  },
  en: {
    brand: 'CELESTE CHEN', home: 'HOME', contact: 'CONTACT',
    eyebrow: 'DATA · UX RESEARCH · VISUAL STORYTELLING',
    heroTitle: 'Turning data, research<br/>and visuals into felt stories.',
    heroSub: 'A portfolio orbiting research, moving image and visual systems.',
    dataDesc: 'Research, analysis & interactive visuals', poster: 'POSTER / EDITORIAL', posterDesc: 'Visual systems & information design',
    video: 'VIDEO / MOTION', videoDesc: 'Editing, rendering & moving image', about: 'ABOUT', aboutDesc: 'Experience, skills & methods',
    selectedProjects: 'SELECTED DATA & UX PROJECTS', dialect: 'Dialect Acoustic Atlas', jstor: 'JSTOR Chinese UX Research',
    dataNews: 'Prepared Food Data Story', backOrbit: 'RETURN TO ORBIT', status: 'AVAILABLE FOR DATA / UX OPPORTUNITIES',
    explore: 'CLICK A CHAPTER TO EXPLORE', posterTitle: 'Posters & Editorial',
    posterIntro: 'A consistently cropped visual archive. Drag, scroll or use arrows; click any work to expand.',
    videoTitle: 'Video & Moving Image', videoIntro: 'News films, MMD renders and short-form experiments in an immersive viewing system.',
    backHome: 'BACK HOME', aboutTitle: 'Researching complexity,<br/>then making it visible.',
    aboutP1: 'Digital Humanities MA at King’s College London, working across data analysis, user research, computational methods and visual communication.',
    aboutP2: 'A project may begin with interviews and qualitative codes, a collection of audio, a content account or an empty canvas. The goal remains the same: find structure, interpret evidence and build an understandable experience.',
    role: 'ROLE', tools: 'TOOLS', year: 'YEAR'
  }
};

const makeItem = (zh, en, year, code, roleZh, roleEn, tools, bg, pattern, descZh, descEn, tags) => ({
  title: [zh, en], year, code, role: [roleZh, roleEn], tools, bg, pattern, desc: [descZh, descEn], tags
});

const posters = [
  makeItem('程序员节活动长图','Programmer’s Day Editorial','2024','VIS-01','视觉设计 / 长图排版','Visual design / editorial layout','Photoshop · Illustrator','#ded8cf','linear-gradient(135deg,transparent 20%,#ff4a2a 20% 34%,transparent 34%),radial-gradient(circle at 72% 22%,#111 0 12%,transparent 12.5%)','为企业文化活动建立从预热到回顾的统一视觉语言。','A unified visual language for an internal culture campaign.',['Editorial','Campaign','Long-form']),
  makeItem('减重训练营活动视觉','Wellness Campaign System','2024','VIS-02','活动视觉 / 信息设计','Campaign visual / information design','Photoshop · Canva','#e4e8db','repeating-linear-gradient(0deg,transparent 0 28px,rgba(20,40,24,.18) 28px 29px),linear-gradient(115deg,#a5d86c 0 32%,transparent 32%)','以模块化视觉呈现课程安排、参与规则与阶段成果。','A modular system for schedules, participation rules and progress.',['System','Information','Campaign']),
  makeItem('小红书模板系统','RED Content Template System','2023','VIS-03','内容设计 / 模板规范','Content design / template system','Photoshop · Figma','#f1c9d3','linear-gradient(30deg,transparent 45%,#fa335c 45% 54%,transparent 54%),repeating-linear-gradient(90deg,rgba(255,255,255,.65) 0 12px,transparent 12px 24px)','围绕标题、首图与信息密度建立可复用模板。','Reusable templates for covers, hierarchy and information density.',['Social','Template','Content']),
  makeItem('校庆纪念视觉','Anniversary Visual Identity','2023','VIS-04','概念设计 / 物料制作','Concept / collateral design','Photoshop · Illustrator','#e7dfce','radial-gradient(circle at 50% 42%,transparent 0 18%,#7b1123 18.5% 20%,transparent 20.5%)','参与纪念台历与系列宣传物料的概念和制作。','Concept and production support for anniversary collateral.',['Identity','Print','Anniversary']),
  makeItem('活动招募信息长图','Volunteer Recruitment Story','2022','VIS-05','推文排版 / 封面设计','Editorial layout / cover','Photoshop · WeChat Editor','#dce5ec','linear-gradient(155deg,transparent 0 24%,#315b7d 24% 38%,transparent 38%)','将招募信息与活动故事组织为适合公众号阅读的长图。','A WeChat-native long-form recruitment story.',['WeChat','Long-form','Community']),
  makeItem('海报实验合集','Poster Experiments','2022–25','VIS-06','视觉实验','Visual experimentation','Photoshop · Blender','#d5d2e8','conic-gradient(from 45deg at 50% 50%,#342466 0 12%,transparent 12% 25%,#fe7d41 25% 37%,transparent 37% 50%,#342466 50% 62%,transparent 62%)','关于字体、材质、拼贴与空间感的个人实验。','Personal experiments in type, material, collage and space.',['Experimental','Type','3D']),
  makeItem('品牌活动视觉实验','Brand Campaign Study','2025','VIS-07','品牌视觉 / 版式实验','Brand visual / layout study','Photoshop · Illustrator','#d5e4ea','linear-gradient(138deg,transparent 0 38%,#176b87 38% 45%,transparent 45%),radial-gradient(circle at 68% 34%,#efcc52 0 9%,transparent 9.5%)','品牌活动视觉方向与信息层级实验。','A visual direction study for brand campaigns and hierarchy.',['Brand','Campaign','Study']),
  makeItem('编辑设计与版式','Editorial Layout Study','2025','VIS-08','编辑设计 / 版式','Editorial design / layout','Photoshop · InDesign','#e7d8d0','repeating-linear-gradient(90deg,rgba(45,34,31,.13) 0 1px,transparent 1px 24px),linear-gradient(28deg,transparent 58%,#cb5647 58% 72%,transparent 72%)','围绕网格、节奏与阅读顺序开展版式实验。','An editorial study in grids, rhythm and reading order.',['Editorial','Grid','Layout']),
  makeItem('社交媒体封面系统','Social Cover System','2024','VIS-09','封面设计 / 模板系统','Cover design / template system','Figma · Photoshop','#ddd7ef','radial-gradient(circle at 30% 40%,#5d42b7 0 13%,transparent 13.5%),linear-gradient(120deg,transparent 45%,rgba(255,255,255,.72) 45% 58%,transparent 58%)','建立适配不同内容栏目、可快速复用的封面系统。','A reusable cover system for multiple social content categories.',['Social','System','Template']),
  makeItem('信息长图实验','Information Story Study','2024','VIS-10','信息设计 / 长图','Information design / long-form','Photoshop · Illustrator','#e5e2d2','repeating-linear-gradient(0deg,transparent 0 30px,rgba(27,30,38,.12) 30px 31px),linear-gradient(90deg,#e0a83b 0 22%,transparent 22%)','将复杂信息拆分为适合移动端阅读的叙事模块。','Complex information translated into mobile-first narrative modules.',['Information','Mobile','Story']),
  makeItem('动态视觉关键帧','Motion Keyframe Study','2025','VIS-11','关键帧 / 动态视觉','Keyframes / motion visual','After Effects · Photoshop','#d7dfe6','conic-gradient(from 40deg at 56% 48%,#3e536a 0 12%,transparent 12% 27%,#df6f73 27% 42%,transparent 42% 72%,#e9c85e 72% 82%,transparent 82%)','用于动态项目的构图、色彩与转场关键帧探索。','Composition, colour and transition keyframes for motion work.',['Motion','Keyframe','Colour']),
  makeItem('个人视觉实验档案','Personal Visual Archive','2023–26','VIS-12','个人实验','Personal experimentation','Photoshop · Blender','#dedbd6','radial-gradient(circle at 52% 48%,transparent 0 18%,#15171b 18.5% 20%,transparent 20.5%),linear-gradient(135deg,transparent 0 48%,#a8b7c5 48% 52%,transparent 52%)','持续记录材质、构图与空间视觉实验。','An ongoing archive of material, composition and spatial studies.',['Archive','Experimental','Visual'])
];

const videos = [
  makeItem('中非木雕故事','Woodcarving Across Borders','2024','MOV-01','拍摄 / 剪辑','Cinematography / editing','Premiere Pro · Camera','#0b0c0f','radial-gradient(circle at 60% 45%,rgba(239,72,38,.75),transparent 18%),linear-gradient(105deg,transparent 15%,rgba(230,205,164,.36) 15% 32%,transparent 32%)','参与新华社约稿专题的拍摄与剪辑。','Cinematography and editing for a commissioned news feature.',['Documentary','News','Editing']),
  makeItem('竹编耳饰文化体验','Bamboo Weaving Experience','2024','MOV-02','拍摄 / 后期','Cinematography / post-production','Premiere Pro','#0b100b','repeating-linear-gradient(25deg,rgba(148,178,80,.35) 0 5px,transparent 5px 22px)','围绕手工技艺和体验过程剪辑横屏专题视频。','A horizontal craft feature emphasizing process and rhythm.',['Culture','Craft','Long-form']),
  makeItem('智慧农业宣传影像','Smart Agriculture Film','2024','MOV-03','现场支持 / 剪辑','Production support / editing','Premiere Pro · Camera','#071012','repeating-linear-gradient(90deg,transparent 0 42px,rgba(53,255,181,.28) 43px 44px)','协助现场引导、拍摄及直播支持。','Production support translating agricultural technology into an accessible story.',['Agriculture','Communication','Fieldwork']),
  makeItem('MMD 渲染实验','MMD Rendering Study','2023–25','MOV-04','灯光 / 镜头 / 渲染','Lighting / camera / rendering','MMD · After Effects','#09070f','radial-gradient(circle at 55% 45%,#a229bc 0 5%,transparent 20%),linear-gradient(130deg,transparent 10%,rgba(34,91,255,.42) 42%,transparent 60%)','探索虚拟摄影、灯光氛围与镜头运动。','A study in virtual cinematography, lighting and camera movement.',['MMD','Rendering','Motion']),
  makeItem('短视频剪辑合集','Short-form Editing Reel','2024','MOV-05','选题 / 剪辑 / 发布','Editorial / editing / publishing','Premiere Pro · Douyin','#080a0d','linear-gradient(90deg,transparent 0 20%,rgba(255,41,70,.78) 20% 24%,transparent 24% 55%,rgba(31,221,237,.68) 55% 59%,transparent 59%)','参与制作约70条视频，累计点赞7万+。','Around 70 short-form videos produced, reaching 70K+ likes.',['Short-form','Social','Performance'])
];

const projects = {
  dialect: makeItem('中国方言声学地图','Dialect Acoustic Atlas','2026','DATA-01','独立研究者','Independent researcher','Python · Wav2Vec 2.0 · UMAP · Plotly','#d4d6d8','repeating-radial-gradient(circle at 48% 48%,rgba(15,17,21,.14) 0 1px,transparent 1px 18px)','收集并清洗100余条中国方言语音，完成声学嵌入、距离计算、聚类和地理对照，并制作交互式数字方言地图。','A study of 100+ Chinese dialect samples using acoustic embeddings, clustering and geospatial comparison.',['Audio embeddings','Clustering','Geospatial','Critical AI']),
  jstor: makeItem('JSTOR 中文用户研究','JSTOR Chinese UX Research','2025','UX-02','研究设计 / 访谈 / 编码 / 可视化','Research design / interviews / coding / visualisation','Interviews · Usability Testing · Python','#e1d9c7','linear-gradient(90deg,rgba(21,28,45,.86) 0 22%,transparent 22%),repeating-linear-gradient(0deg,transparent 0 33px,rgba(0,0,0,.13) 33px 34px)','围绕中文文献检索与浏览体验开展访谈和可用性测试，并把编码结果转化为可视化洞察与优化建议。','Interviews and usability tests on Chinese-language discovery, translated into visual insights and recommendations.',['UX Research','Qualitative coding','Usability']),
  'data-news': makeItem('预制菜数据新闻','Prepared Food Data Story','2024','DATA-03','数据收集 / 可视化 / 网页实现','Data collection / visualisation / web build','Excel · Python · HTML/CSS','#d7d0c4','conic-gradient(from -20deg at 55% 48%,#e84c2b 0 11%,transparent 11% 25%,#243c70 25% 38%,transparent 38% 60%,#e5b546 60% 72%,transparent 72%)','从产业趋势、消费者态度与政策环境展开数据叙事，项目获陕西赛区二等奖。','A data story spanning industry trends, consumer attitudes and policy, awarded second prize.',['Data journalism','Web','Award'])
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const modulo = (value, length) => ((value % length) + length) % length;
const wrappedDelta = (index, position, length) => {
  let delta = modulo(index - position, length);
  if (delta > length / 2) delta -= length;
  return delta;
};

function initStar() {
  const host = $('#star-stage');
  if (!host) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.z = 8.5;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.appendChild(renderer.domElement);
  const shape = new THREE.Shape();
  for (let i = 0; i < 20; i += 1) {
    const angle = i / 20 * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 ? 0.92 : 2.35;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i ? shape.lineTo(x, y) : shape.moveTo(x, y);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: true, bevelSegments: 5, bevelSize: 0.17, bevelThickness: 0.15 });
  geometry.center();
  const star = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color: 0xbfc3c9, metalness: 0.92, roughness: 0.16, clearcoat: 1 }));
  star.rotation.set(-0.22, 0.36, -0.08);
  scene.add(star);
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));
  let light = new THREE.DirectionalLight(0xffffff, 4.8); light.position.set(-4, 6, 7); scene.add(light);
  light = new THREE.DirectionalLight(0x8da4c9, 3.6); light.position.set(5, -2, 2); scene.add(light);
  let pointerX = 0;
  let pointerY = 0;
  addEventListener('pointermove', event => {
    pointerX = (event.clientX / innerWidth - 0.5) * 0.28;
    pointerY = (event.clientY / innerHeight - 0.5) * 0.18;
  });
  const resize = () => {
    const rect = host.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);
  const frame = () => {
    const targetY = state.dataMode ? Math.PI + 0.35 : 0.36;
    star.rotation.y += (targetY + pointerX - star.rotation.y) * 0.04;
    star.rotation.x += (-0.22 + pointerY - star.rotation.x) * 0.04;
    star.rotation.z += state.dataMode ? -0.0015 : 0.0007;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  };
  frame();
}

function openDialog(item) {
  const dialog = $('.project-dialog');
  const index = state.lang === 'zh' ? 0 : 1;
  $('.dialog-kicker').textContent = item.code;
  $('.dialog-content h3').textContent = item.title[index];
  $('.dialog-description').textContent = item.desc[index];
  $('.dialog-role').textContent = item.role[index];
  $('.dialog-tools').textContent = item.tools;
  $('.dialog-year').textContent = item.year;
  $('.dialog-tags').innerHTML = item.tags.map(tag => `<span>${tag}</span>`).join('');
  $('.dialog-visual').style.setProperty('--dialog-bg', item.bg);
  $('.dialog-visual').style.setProperty('--dialog-pattern', item.pattern);
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

let posterCards = [];
let posterPosition = -0.5;
let posterTarget = -0.5;
let posterVelocity = 0;
let posterDragging = false;
let posterLastX = 0;
let posterDragDistance = 0;
let posterEdgeDirection = 0;
let posterSnapTimer = null;
let suppressPosterClickUntil = 0;
const posterLanes = [-1.05, 0.42, 1.08, -0.46, 0.88, -1.18, 0.12, -0.78, 1.22, -0.18, 0.68, -1.30];

function renderPosterGallery() {
  const viewport = $('[data-gallery="poster"]');
  const track = $('.gallery-track', viewport);
  const langIndex = state.lang === 'zh' ? 0 : 1;
  track.innerHTML = '';
  posters.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'gallery-card fan-card';
    card.dataset.posterIndex = String(index);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', item.title[langIndex]);
    card.innerHTML = `<div class="gallery-art" data-code="${item.code}" style="--card-bg:${item.bg};--card-pattern:${item.pattern}"><div class="card-copy"><b>${item.title[langIndex]}</b><span>${item.year}</span></div></div>`;
    const activate = () => {
      if (performance.now() < suppressPosterClickUntil) return;
      openDialog(item);
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
    track.appendChild(card);
  });
  posterCards = [...track.children];
  $('.gallery-total', viewport.closest('.poster-scene')).textContent = String(posters.length).padStart(2, '0');
}

function renderPosterLayout() {
  const viewport = $('[data-gallery="poster"]');
  if (!viewport || !posterCards.length) return;
  const rect = viewport.getBoundingClientRect();
  const width = rect.width || innerWidth;
  const mobile = width < 900;
  const baseX = mobile ? width * 0.18 : width * 0.105;
  const stepX = mobile ? width * 0.24 : width * 0.092;

  posterCards.forEach((card, index) => {
    const delta = wrappedDelta(index, posterPosition, posters.length);
    const absolute = Math.abs(delta);
    const side = delta < 0 ? -1 : 1;
    const lane = posterLanes[index % posterLanes.length];
    const outward = Math.max(0, absolute - 0.5);
    const x = side * (baseX + outward * stepX + outward * outward * (mobile ? 4 : 10));
    const y = lane * (mobile ? 54 : 108) + lane * Math.min(outward, 4) * (mobile ? 2 : 5);
    const z = (mobile ? -320 : -370) + Math.min(outward, 5) * (mobile ? 66 : 82);
    const rotateY = side * Math.max(mobile ? 18 : 16, (mobile ? 50 : 58) - outward * (mobile ? 8 : 8.5));
    const rotateX = lane * -4.2;
    const rotateZ = lane * 1.8 - side * 0.65;
    const scale = Math.min(mobile ? 1.04 : 1.13, (mobile ? 0.88 : 0.91) + outward * 0.045);
    let opacity = 1;
    if (absolute > 5.15) opacity = Math.max(0, 1 - (absolute - 5.15) / 0.45);
    if (absolute > 5.6) opacity = 0;

    card.style.setProperty('--fan-x', `${x.toFixed(2)}px`);
    card.style.setProperty('--fan-y', `${y.toFixed(2)}px`);
    card.style.setProperty('--fan-z', `${z.toFixed(2)}px`);
    card.style.setProperty('--fan-ry', `${rotateY.toFixed(2)}deg`);
    card.style.setProperty('--fan-rx', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--fan-rz', `${rotateZ.toFixed(2)}deg`);
    card.style.setProperty('--fan-scale', scale.toFixed(4));
    card.style.setProperty('--fan-opacity', opacity.toFixed(3));
    card.style.setProperty('--fan-visibility', opacity < 0.02 ? 'hidden' : 'visible');
    card.style.zIndex = String(1000 + Math.round(z));
    card.dataset.fanNear = outward > 2.5 && outward < 4.9 ? 'true' : 'false';
  });

  const active = modulo(Math.round(posterPosition + 0.5), posters.length);
  $('.gallery-current', viewport.closest('.poster-scene')).textContent = String(active + 1).padStart(2, '0');
}

function snapPoster(delay = 420) {
  clearTimeout(posterSnapTimer);
  posterSnapTimer = setTimeout(() => {
    if (!posterDragging && !posterEdgeDirection) posterTarget = Math.round(posterTarget + 0.5) - 0.5;
  }, delay);
}

function movePoster(amount) {
  posterTarget += amount;
  posterVelocity = 0;
  snapPoster(260);
}

function initPosterInteractions() {
  const viewport = $('[data-gallery="poster"]');
  const previous = $('[data-gallery-prev="poster"]');
  const next = $('[data-gallery-next="poster"]');
  previous.addEventListener('click', () => movePoster(-1));
  next.addEventListener('click', () => movePoster(1));

  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    const delta = event.deltaY || event.deltaX;
    posterTarget += delta * 0.0011;
    posterVelocity = delta * 0.000055;
    snapPoster(560);
  }, { passive: false });

  viewport.addEventListener('pointerdown', event => {
    if (event.button !== undefined && event.button !== 0) return;
    posterDragging = true;
    posterLastX = event.clientX;
    posterDragDistance = 0;
    posterVelocity = 0;
    posterEdgeDirection = 0;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture?.(event.pointerId);
    clearTimeout(posterSnapTimer);
  });

  viewport.addEventListener('pointermove', event => {
    const rect = viewport.getBoundingClientRect();
    if (posterDragging) {
      const dx = event.clientX - posterLastX;
      const step = -dx / Math.max(300, rect.width * 0.20);
      posterTarget += step;
      posterVelocity = posterVelocity * 0.62 + step * 0.38;
      posterDragDistance += Math.abs(dx);
      posterLastX = event.clientX;
      return;
    }
    if (event.pointerType === 'touch') return;
    const relativeX = (event.clientX - rect.left) / rect.width;
    posterEdgeDirection = relativeX < 0.11 ? -1 : relativeX > 0.89 ? 1 : 0;
    if (posterEdgeDirection) clearTimeout(posterSnapTimer);
    else snapPoster(480);
  });

  const finishDrag = event => {
    if (!posterDragging) return;
    posterDragging = false;
    viewport.classList.remove('is-dragging');
    viewport.releasePointerCapture?.(event.pointerId);
    posterTarget += posterVelocity * 4.2;
    if (posterDragDistance > 8) suppressPosterClickUntil = performance.now() + 240;
    snapPoster(580);
  };
  viewport.addEventListener('pointerup', finishDrag);
  viewport.addEventListener('pointercancel', finishDrag);
  viewport.addEventListener('pointerleave', () => {
    if (!posterDragging) {
      posterEdgeDirection = 0;
      snapPoster(420);
    }
  });

  const animate = () => {
    if (posterEdgeDirection && !posterDragging) posterTarget += posterEdgeDirection * 0.006;
    if (!posterDragging && Math.abs(posterVelocity) > 0.00004) {
      posterTarget += posterVelocity;
      posterVelocity *= 0.94;
    }
    posterPosition += (posterTarget - posterPosition) * 0.075;
    if (Math.abs(posterPosition) > 1200 || Math.abs(posterTarget) > 1200) {
      const shift = Math.trunc(posterPosition / posters.length) * posters.length;
      posterPosition -= shift;
      posterTarget -= shift;
    }
    renderPosterLayout();
    requestAnimationFrame(animate);
  };
  animate();
}

function renderVideoGallery() {
  const viewport = $('[data-gallery="video"]');
  const track = $('.gallery-track', viewport);
  const langIndex = state.lang === 'zh' ? 0 : 1;
  track.innerHTML = '';
  videos.forEach((item, index) => {
    let offset = index - state.videoIndex;
    if (offset > videos.length / 2) offset -= videos.length;
    if (offset < -videos.length / 2) offset += videos.length;
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.style.setProperty('--offset', offset);
    card.style.setProperty('--abs-offset', Math.abs(offset));
    card.style.setProperty('--opacity', Math.max(0.18, 1 - Math.abs(offset) * 0.16));
    card.innerHTML = `<div class="gallery-art" data-code="${item.code}" style="--card-bg:${item.bg};--card-pattern:${item.pattern}"><div class="card-copy"><b>${item.title[langIndex]}</b><span>${item.year}</span></div></div>`;
    card.addEventListener('click', () => openDialog(item));
    track.appendChild(card);
  });
  const scene = viewport.closest('.video-scene');
  $('.gallery-current', scene).textContent = String(state.videoIndex + 1).padStart(2, '0');
  $('.gallery-total', scene).textContent = String(videos.length).padStart(2, '0');
}

function moveVideo(amount) {
  state.videoIndex = modulo(state.videoIndex + amount, videos.length);
  renderVideoGallery();
}

function initVideoInteractions() {
  $('[data-gallery-prev="video"]').addEventListener('click', () => moveVideo(-1));
  $('[data-gallery-next="video"]').addEventListener('click', () => moveVideo(1));
  const viewport = $('[data-gallery="video"]');
  let startX;
  viewport.addEventListener('pointerdown', event => { startX = event.clientX; });
  viewport.addEventListener('pointerup', event => {
    if (startX !== undefined && Math.abs(event.clientX - startX) > 45) moveVideo(event.clientX > startX ? -1 : 1);
    startX = undefined;
  });
  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    moveVideo((event.deltaY || event.deltaX) > 0 ? 1 : -1);
  }, { passive: false });
}

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  $$('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (copy[lang][key]) element.innerHTML = copy[lang][key];
  });
  $('.lang-cn').classList.toggle('is-active', lang === 'zh');
  $('.lang-en').classList.toggle('is-active', lang === 'en');
  renderPosterGallery();
  renderVideoGallery();
}

function setScene(name) {
  state.scene = name;
  state.dataMode = false;
  $('.scene-home').classList.remove('data-mode');
  $$('.scene').forEach(element => element.classList.toggle('is-visible', element.dataset.scene === name));
  history.replaceState(null, '', name === 'home' ? location.pathname : `#${name}`);
}

function initUI() {
  $$('[data-action="home"]').forEach(element => element.addEventListener('click', () => setScene('home')));
  $$('[data-chapter]').forEach(element => element.addEventListener('click', () => {
    const chapter = element.dataset.chapter;
    if (chapter === 'data') {
      state.dataMode = true;
      $('.scene-home').classList.add('data-mode');
    } else setScene(chapter);
  }));
  $$('[data-project]').forEach(element => element.addEventListener('click', () => openDialog(projects[element.dataset.project])));
  $('.lang-toggle').addEventListener('click', () => setLanguage(state.lang === 'zh' ? 'en' : 'zh'));
  $('.dialog-close').addEventListener('click', () => $('.project-dialog').close());
  $('.project-dialog').addEventListener('click', event => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
  $('.contact-trigger').addEventListener('click', () => {
    const wrap = $('.contact-wrap');
    wrap.classList.toggle('is-open');
    $('.contact-trigger').setAttribute('aria-expanded', wrap.classList.contains('is-open'));
  });

  const cursor = $('.cursor-dot');
  addEventListener('pointermove', event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.addEventListener('mouseover', event => {
    if (event.target.closest('button,a,.gallery-card')) cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', event => {
    if (event.target.closest('button,a,.gallery-card')) cursor.classList.remove('is-hover');
  });

  addEventListener('keydown', event => {
    if (event.key === 'Escape' && state.dataMode) {
      state.dataMode = false;
      $('.scene-home').classList.remove('data-mode');
    }
    if (state.scene === 'poster') {
      if (event.key === 'ArrowRight') movePoster(1);
      if (event.key === 'ArrowLeft') movePoster(-1);
    }
    if (state.scene === 'video') {
      if (event.key === 'ArrowRight') moveVideo(1);
      if (event.key === 'ArrowLeft') moveVideo(-1);
    }
  });
}

initStar();
renderPosterGallery();
renderVideoGallery();
initPosterInteractions();
initVideoInteractions();
initUI();
const initial = location.hash.slice(1);
if (['poster', 'video', 'about'].includes(initial)) setScene(initial);
