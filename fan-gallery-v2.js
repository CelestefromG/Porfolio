(() => {
  const TOTAL = 12;
  const EXTRA = [
    ['品牌活动视觉实验','Brand Campaign Study','VIS-07','2025','#d5e4ea','linear-gradient(138deg,transparent 0 38%,#176b87 38% 45%,transparent 45%),radial-gradient(circle at 68% 34%,#efcc52 0 9%,transparent 9.5%)'],
    ['编辑设计与版式','Editorial Layout Study','VIS-08','2025','#e7d8d0','repeating-linear-gradient(90deg,rgba(45,34,31,.13) 0 1px,transparent 1px 24px),linear-gradient(28deg,transparent 58%,#cb5647 58% 72%,transparent 72%)'],
    ['社交媒体封面系统','Social Cover System','VIS-09','2024','#ddd7ef','radial-gradient(circle at 30% 40%,#5d42b7 0 13%,transparent 13.5%),linear-gradient(120deg,transparent 45%,rgba(255,255,255,.72) 45% 58%,transparent 58%)'],
    ['信息长图实验','Information Story Study','VIS-10','2024','#e5e2d2','repeating-linear-gradient(0deg,transparent 0 30px,rgba(27,30,38,.12) 30px 31px),linear-gradient(90deg,#e0a83b 0 22%,transparent 22%)'],
    ['动态视觉关键帧','Motion Keyframe Study','VIS-11','2025','#d7dfe6','conic-gradient(from 40deg at 56% 48%,#3e536a 0 12%,transparent 12% 27%,#df6f73 27% 42%,transparent 42% 72%,#e9c85e 72% 82%,transparent 82%)'],
    ['个人视觉实验档案','Personal Visual Archive','VIS-12','2023–26','#dedbd6','radial-gradient(circle at 52% 48%,transparent 0 18%,#15171b 18.5% 20%,transparent 20.5%),linear-gradient(135deg,transparent 0 48%,#a8b7c5 48% 52%,transparent 52%)']
  ];
  const lanes=[-1.18,.42,1.08,-.52,.86,-1.02,.18,-.74,1.26,-.16,.68,-1.30];
  const mod=(v,n)=>((v%n)+n)%n;
  const delta=(i,p,n)=>{let d=mod(i-p,n);if(d>n/2)d-=n;return d};

  const init=()=>{
    const viewport=document.querySelector('[data-gallery="poster"]');
    const track=viewport?.querySelector('.gallery-track');
    const prev=document.querySelector('[data-gallery-prev="poster"]');
    const next=document.querySelector('[data-gallery-next="poster"]');
    const scene=viewport?.closest('.poster-scene');
    const current=scene?.querySelector('.gallery-current');
    const total=scene?.querySelector('.gallery-total');
    if(!viewport||!track||!prev||!next||!current||!total)return;

    let cards=[],position=-.5,target=-.5,dragging=false,lastX=0,dragDistance=0,velocity=0,edge=0,snapTimer;
    const isZh=()=>document.querySelector('.lang-cn')?.classList.contains('is-active');

    const rebuild=()=>{
      const existing=[...track.querySelectorAll('.gallery-card')];
      if(!existing.length)return false;
      const originals=existing.slice(0,6);
      track.replaceChildren(...originals);
      EXTRA.forEach((meta,i)=>{
        const source=originals[i%originals.length];
        const clone=source.cloneNode(true);
        const [zh,en,code,year,bg,pattern]=meta;
        const art=clone.querySelector('.gallery-art');
        const title=clone.querySelector('.card-copy b');
        const date=clone.querySelector('.card-copy span');
        if(art){art.dataset.code=code;art.style.setProperty('--card-bg',bg);art.style.setProperty('--card-pattern',pattern)}
        if(title)title.textContent=isZh()?zh:en;
        if(date)date.textContent=year;
        clone.dataset.extraZh=zh;clone.dataset.extraEn=en;
        clone.addEventListener('click',e=>{e.stopPropagation();source.click()});
        track.appendChild(clone);
      });
      cards=[...track.querySelectorAll('.gallery-card')];
      total.textContent='12';
      return true;
    };

    const observer=new MutationObserver(()=>{if(track.querySelectorAll('.gallery-card').length!==TOTAL)requestAnimationFrame(rebuild)});
    observer.observe(track,{childList:true});
    if(!rebuild())return;

    document.querySelector('.lang-toggle')?.addEventListener('click',()=>setTimeout(()=>{
      cards.slice(6).forEach(card=>{const t=card.querySelector('.card-copy b');if(t)t.textContent=isZh()?card.dataset.extraZh:card.dataset.extraEn});
    },0));

    const snap=(delay=520)=>{clearTimeout(snapTimer);snapTimer=setTimeout(()=>{if(!dragging&&!edge)target=Math.round(target+.5)-.5},delay)};
    const move=n=>{target+=n;velocity=0;snap(260)};
    prev.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();move(-1)},true);
    next.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();move(1)},true);

    viewport.addEventListener('wheel',e=>{e.preventDefault();const d=e.deltaY||e.deltaX;target+=d*.001;velocity=d*.00005;snap(620)},{passive:false});
    viewport.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;dragDistance=0;velocity=0;edge=0;viewport.classList.add('is-dragging');viewport.setPointerCapture?.(e.pointerId);clearTimeout(snapTimer)});
    viewport.addEventListener('pointermove',e=>{
      const rect=viewport.getBoundingClientRect();
      if(dragging){const dx=e.clientX-lastX;const step=-dx/Math.max(330,rect.width*.215);target+=step;velocity=velocity*.62+step*.38;dragDistance+=Math.abs(dx);lastX=e.clientX;return}
      if(e.pointerType==='touch')return;
      const x=(e.clientX-rect.left)/rect.width;edge=x<.12?-1:x>.88?1:0;if(!edge)snap(560);else clearTimeout(snapTimer);
    });
    const end=e=>{if(!dragging)return;dragging=false;viewport.classList.remove('is-dragging');viewport.releasePointerCapture?.(e.pointerId);target+=velocity*4.6;snap(680)};
    viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('pointerleave',()=>{if(!dragging){edge=0;snap(500)}});
    viewport.addEventListener('click',e=>{if(dragDistance>8){e.preventDefault();e.stopPropagation()}dragDistance=0},true);

    const render=()=>{
      const rect=viewport.getBoundingClientRect();const width=rect.width||innerWidth;const mobile=width<900;const unit=mobile?Math.max(110,width*.22):Math.max(175,width*.098);
      cards.forEach((card,i)=>{
        const d=delta(i,position,TOTAL),a=Math.abs(d),side=d<0?-1:1,lane=lanes[i%lanes.length];
        const x=side*unit*(.62+a*1.1+a*a*.08);
        const y=lane*(mobile?52:92)+lane*Math.min(a,4)*(mobile?3:6);
        const z=(mobile?-540:-700)+Math.min(a,5.1)*(mobile?92:120);
        const ry=side*(82-Math.min(a,5)*12.4),rx=lane*-5.4,rz=lane*2.15-side*1.15,scale=Math.min(1.08,(mobile?.68:.70)+a*.076);
        let opacity=1;if(a>4.7)opacity=Math.max(0,1-(a-4.7)/.65);if(a>5.35)opacity=0;
        card.style.setProperty('--fan-x',`${x}px`);card.style.setProperty('--fan-y',`${y}px`);card.style.setProperty('--fan-z',`${z}px`);card.style.setProperty('--fan-ry',`${ry}deg`);card.style.setProperty('--fan-rx',`${rx}deg`);card.style.setProperty('--fan-rz',`${rz}deg`);card.style.setProperty('--fan-scale',scale);card.style.setProperty('--fan-opacity',opacity);card.style.setProperty('--fan-visibility',opacity<.02?'hidden':'visible');card.style.zIndex=String(1000+Math.round(z));card.dataset.fanNear=a>3.2&&a<5.1?'true':'false';
      });
      current.textContent=String(mod(Math.round(position+.5),TOTAL)+1).padStart(2,'0');
    };
    const animate=()=>{if(edge&&!dragging)target+=edge*.0065;if(!dragging&&Math.abs(velocity)>.000045){target+=velocity;velocity*=.94}position+=(target-position)*.067;if(Math.abs(position)>1200||Math.abs(target)>1200){const s=Math.trunc(position/TOTAL)*TOTAL;position-=s;target-=s}render();requestAnimationFrame(animate)};animate();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
