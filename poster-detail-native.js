(() => {
  const posterMeta = {
    'VIS-01': {
      zh: ['程序员节活动长图','视觉设计 / 长图排版','为企业文化活动建立从预热到回顾的统一视觉语言。'],
      en: ['Programmer’s Day Editorial','Visual design / editorial layout','A unified visual language for an internal culture campaign.'],
      tools: 'Photoshop · Illustrator', year: '2024', tags: ['Editorial','Campaign','Long-form']
    },
    'VIS-02': {
      zh: ['减重训练营活动视觉','活动视觉 / 信息设计','以模块化视觉呈现课程安排、参与规则与阶段成果。'],
      en: ['Wellness Campaign System','Campaign visual / information design','A modular system for schedules, participation rules and progress.'],
      tools: 'Photoshop · Canva', year: '2024', tags: ['System','Information','Campaign']
    },
    'VIS-03': {
      zh: ['小红书模板系统','内容设计 / 模板规范','围绕标题、首图与信息密度建立可复用模板。'],
      en: ['RED Content Template System','Content design / template system','Reusable templates for covers, hierarchy and information density.'],
      tools: 'Photoshop · Figma', year: '2023', tags: ['Social','Template','Content']
    },
    'VIS-04': {
      zh: ['校庆纪念视觉','概念设计 / 物料制作','参与纪念台历与系列宣传物料的概念和制作。'],
      en: ['Anniversary Visual Identity','Concept / collateral design','Concept and production support for anniversary collateral.'],
      tools: 'Photoshop · Illustrator', year: '2023', tags: ['Identity','Print','Anniversary']
    },
    'VIS-05': {
      zh: ['活动招募信息长图','推文排版 / 封面设计','将招募信息与活动故事组织为适合公众号阅读的长图。'],
      en: ['Volunteer Recruitment Story','Editorial layout / cover','A WeChat-native long-form recruitment story.'],
      tools: 'Photoshop · WeChat Editor', year: '2022', tags: ['WeChat','Long-form','Community']
    },
    'VIS-06': {
      zh: ['海报实验合集','视觉实验','关于字体、材质、拼贴与空间感的个人实验。'],
      en: ['Poster Experiments','Visual experimentation','Personal experiments in type, material, collage and space.'],
      tools: 'Photoshop · Blender', year: '2022–25', tags: ['Experimental','Type','3D']
    }
  };

  const getVisiblePosterSrc = card => {
    const art = card.querySelector('.gallery-art');
    if (!art) return '';
    if (art.dataset.visualImage) return art.dataset.visualImage;
    const bg = getComputedStyle(art).backgroundImage;
    const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '';
  };

  const isEnglish = () => document.documentElement.lang === 'en';

  document.addEventListener('click', event => {
    const card = event.target.closest('.poster-scene .gallery-card');
    if (!card) return;

    const art = card.querySelector('.gallery-art');
    const code = art?.dataset.code;
    const meta = posterMeta[code];
    const src = getVisiblePosterSrc(card);
    if (!meta || !src) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const dialog = document.querySelector('.project-dialog');
    const visual = dialog?.querySelector('.dialog-visual');
    if (!dialog || !visual) return;

    const lang = isEnglish() ? 'en' : 'zh';
    const [title, role, description] = meta[lang];

    dialog.querySelector('.dialog-kicker').textContent = code;
    dialog.querySelector('.dialog-content h3').textContent = title;
    dialog.querySelector('.dialog-description').textContent = description;
    dialog.querySelector('.dialog-role').textContent = role;
    dialog.querySelector('.dialog-tools').textContent = meta.tools;
    dialog.querySelector('.dialog-year').textContent = meta.year;
    dialog.querySelector('.dialog-tags').innerHTML = meta.tags.map(tag => `<span>${tag}</span>`).join('');

    visual.replaceChildren();
    visual.classList.add('has-real-image');
    visual.style.removeProperty('--dialog-bg');
    visual.style.removeProperty('--dialog-pattern');
    visual.style.setProperty('background', '#f5f3ef', 'important');

    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
    img.style.position = 'relative';
    img.style.zIndex = '2';
    visual.appendChild(img);

    if (!dialog.open) dialog.showModal();
  }, true);

  document.querySelector('.project-dialog')?.addEventListener('close', () => {
    const visual = document.querySelector('.project-dialog .dialog-visual');
    if (!visual) return;
    visual.replaceChildren();
    visual.classList.remove('has-real-image');
    visual.style.removeProperty('background');
  });
})();
