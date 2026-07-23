(() => {
  const TOTAL = 12;
  const EXTRA_WORKS = [
    ['品牌活动视觉实验', 'Brand Campaign Study', 'VIS-07', '2025', '#d5e4ea', 'linear-gradient(138deg, transparent 0 38%, #176b87 38% 45%, transparent 45%), radial-gradient(circle at 68% 34%, #efcc52 0 9%, transparent 9.5%)'],
    ['编辑设计与版式', 'Editorial Layout Study', 'VIS-08', '2025', '#e7d8d0', 'repeating-linear-gradient(90deg, rgba(45,34,31,.13) 0 1px, transparent 1px 24px), linear-gradient(28deg, transparent 58%, #cb5647 58% 72%, transparent 72%)'],
    ['社交媒体封面系统', 'Social Cover System', 'VIS-09', '2024', '#ddd7ef', 'radial-gradient(circle at 30% 40%, #5d42b7 0 13%, transparent 13.5%), linear-gradient(120deg, transparent 45%, rgba(255,255,255,.72) 45% 58%, transparent 58%)'],
    ['信息长图实验', 'Information Story Study', 'VIS-10', '2024', '#e5e2d2', 'repeating-linear-gradient(0deg, transparent 0 30px, rgba(27,30,38,.12) 30px 31px), linear-gradient(90deg, #e0a83b 0 22%, transparent 22%)'],
    ['动态视觉关键帧', 'Motion Keyframe Study', 'VIS-11', '2025', '#d7dfe6', 'conic-gradient(from 40deg at 56% 48%, #3e536a 0 12%, transparent 12% 27%, #df6f73 27% 42%, transparent 42% 72%, #e9c85e 72% 82%, transparent 82%)'],
    ['个人视觉实验档案', 'Personal Visual Archive', 'VIS-12', '2023–26', '#dedbd6', 'radial-gradient(circle at 52% 48%, transparent 0 18%, #15171b 18.5% 20%, transparent 20.5%), linear-gradient(135deg, transparent 0 48%, #a8b7c5 48% 52%, transparent 52%)']
  ];

  const modulo = (value, length) => ((value % length) + length) % length;
  const wrappedDelta = (index, position, length) => {
    let delta = modulo(index - position, length);
    if (delta > length / 2) delta -= length;
    return delta;
  };

  const init = () => {
    const viewport = document.querySelector('[data-gallery="poster"]');
    const track = viewport?.querySelector('.gallery-track');
    const previous = document.querySelector('[data-gallery-prev="poster"]');
    const next = document.querySelector('[data-gallery-next="poster"]');
    const scene = viewport?.closest('.poster-scene');
    const counter = scene?.querySelector('.gallery-current');
    const total = scene?.querySelector('.gallery-total');
    if (!viewport || !track || !previous || !next || !counter || !total) return;

    let cards = [];
    let position = 0;
    let target = 0;
    let dragging = false;
    let lastX = 0;
    let dragDistance = 0;
    let velocity = 0;
    let edgeDirection = 0;
    let snapTimer = null;
    let rebuilding = false;

    const isChinese = () => document.querySelector('.lang-cn')?.classList.contains('is-active');

    const decorateClone = (clone, extra, source) => {
      const [zh, en, code, year, bg, pattern] = extra;
      const art = clone.querySelector('.gallery-art');
      const title = clone.querySelector('.card-copy b');
      const date = clone.querySelector('.card-copy span');
      if (art) {
        art.dataset.code = code;
        art.style.setProperty('--card-bg', bg);
        art.style.setProperty('--card-pattern', pattern);
      }
      if (title) title.textContent = isChinese() ? zh : en;
      if (date) date.textContent = year;
      clone.dataset.extraZh = zh;
      clone.dataset.extraEn = en;
      clone.setAttribute('aria-label', isChinese() ? zh : en);
      clone.addEventListener('click', () => source.click());
      clone.addEventListener('mouseenter', () => document.querySelector('.cursor-dot')?.classList.add('is-hover'));
      clone.addEventListener('mouseleave', () => document.querySelector('.cursor-dot')?.classList.remove('is-hover'));
    };

    const refreshExtraLanguage = () => {
      cards.slice(6).forEach(card => {
        const title = card.querySelector('.card-copy b');
        const label = isChinese() ? card.dataset.extraZh : card.dataset.extraEn;
        if (title && label) title.textContent = label;
        if (label) card.setAttribute('aria-label', label);
      });
    };

    const buildTwelve = () => {
      if (rebuilding) return;
      const existing = [...track.querySelectorAll('.gallery-card')];
      if (!existing.length) return;

      if (existing.length === TOTAL) {
        cards = existing;
        cards.forEach((card, index) => { card.dataset.ringIndex = String(index); });
        total.textContent = String(TOTAL).padStart(2, '0');
        refreshExtraLanguage();
        return;
      }

      rebuilding = true;
      observer.disconnect();
      const originals = existing.slice(0, 6);
      track.replaceChildren(...originals);
      EXTRA_WORKS.forEach((extra, index) => {
        const source = originals[index % originals.length];
        const clone = source.cloneNode(true);
        decorateClone(clone, extra, source);
        track.appendChild(clone);
      });

      cards = [...track.querySelectorAll('.gallery-card')];
      cards.forEach((card, index) => {
        card.dataset.ringIndex = String(index);
        card.style.removeProperty('--offset');
        card.style.removeProperty('--abs-offset');
        card.style.removeProperty('--opacity');
      });
      total.textContent = String(TOTAL).padStart(2, '0');
      observer.observe(track, { childList: true });
      rebuilding = false;
    };

    const observer = new MutationObserver(() => requestAnimationFrame(buildTwelve));
    observer.observe(track, { childList: true });
    buildTwelve();

    document.querySelector('.lang-toggle')?.addEventListener('click', () => {
      setTimeout(refreshExtraLanguage, 0);
    });

    const scheduleSnap = (delay = 460) => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        if (!dragging && !edgeDirection) target = Math.round(target);
      }, delay);
    };

    const moveBy = amount => {
      target += amount;
      velocity = 0;
      scheduleSnap(280);
    };

    const interceptButton = (button, amount) => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        moveBy(amount);
      }, true);
    };
    interceptButton(previous, -1);
    interceptButton(next, 1);

    viewport.addEventListener('wheel', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const delta = event.deltaY || event.deltaX;
      target += delta * 0.00135;
      velocity = delta * 0.00008;
      scheduleSnap(560);
    }, { capture: true, passive: false });

    viewport.addEventListener('pointerdown', event => {
      event.stopImmediatePropagation();
      dragging = true;
      lastX = event.clientX;
      dragDistance = 0;
      velocity = 0;
      edgeDirection = 0;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture?.(event.pointerId);
      clearTimeout(snapTimer);
    }, true);

    viewport.addEventListener('pointermove', event => {
      event.stopImmediatePropagation();
      const rect = viewport.getBoundingClientRect();
      if (dragging) {
        const dx = event.clientX - lastX;
        const spacing = Math.max(290, rect.width * 0.19);
        const step = -dx / spacing;
        target += step;
        velocity = velocity * 0.58 + step * 0.42;
        dragDistance += Math.abs(dx);
        lastX = event.clientX;
        return;
      }

      if (event.pointerType === 'touch') return;
      const relativeX = (event.clientX - rect.left) / rect.width;
      edgeDirection = relativeX < 0.13 ? -1 : relativeX > 0.87 ? 1 : 0;
      if (edgeDirection) clearTimeout(snapTimer);
      else scheduleSnap(520);
    }, true);

    const endDrag = event => {
      event.stopImmediatePropagation();
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      viewport.releasePointerCapture?.(event.pointerId);
      target += velocity * 5.2;
      scheduleSnap(600);
    };
    viewport.addEventListener('pointerup', endDrag, true);
    viewport.addEventListener('pointercancel', endDrag, true);
    viewport.addEventListener('pointerleave', event => {
      if (!dragging) {
        edgeDirection = 0;
        scheduleSnap(450);
      }
      event.stopImmediatePropagation();
    }, true);

    viewport.addEventListener('click', event => {
      if (dragDistance > 8) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      dragDistance = 0;
    }, true);

    const render = () => {
      if (!cards.length) cards = [...track.querySelectorAll('.gallery-card')];
      const width = viewport.getBoundingClientRect().width || window.innerWidth;
      const mobile = width < 900;

      /* A wide radius creates the airy inner-ring spacing seen in the reference. */
      const radiusX = mobile
        ? Math.max(680, width * 1.35)
        : Math.min(1650, Math.max(1040, width * 0.84));
      const angleStep = mobile ? 0.31 : 0.245;

      cards.forEach((card, index) => {
        const delta = wrappedDelta(index, position, TOTAL);
        const absolute = Math.abs(delta);
        const angle = delta * angleStep;
        const curve = 1 - Math.cos(angle);

        const x = Math.sin(angle) * radiusX;
        const z = -360 + curve * (mobile ? 760 : 1100);
        const y = Math.pow(Math.min(absolute, 3.2), 1.45) * (mobile ? 3.5 : 5.5);
        const scaleX = Math.min(1.09, 0.80 + absolute * 0.095);
        const scaleY = Math.min(1.06, 0.80 + absolute * 0.085);
        const rotation = -angle * 0.80 * (180 / Math.PI);

        let opacity = 1;
        if (absolute > 2.7) opacity = Math.max(0, 1 - (absolute - 2.7) / 0.7);
        if (absolute > 3.4) opacity = 0;

        card.style.setProperty('--ring-x', `${x.toFixed(2)}px`);
        card.style.setProperty('--ring-y', `${y.toFixed(2)}px`);
        card.style.setProperty('--ring-z', `${z.toFixed(2)}px`);
        card.style.setProperty('--ring-rotate', `${rotation.toFixed(2)}deg`);
        card.style.setProperty('--ring-scale-x', scaleX.toFixed(4));
        card.style.setProperty('--ring-scale-y', scaleY.toFixed(4));
        card.style.setProperty('--ring-opacity', opacity.toFixed(3));
        card.style.setProperty('--ring-visibility', opacity < 0.02 ? 'hidden' : 'visible');
        card.style.zIndex = String(1000 + Math.round(z));
        card.dataset.ringActive = absolute < 0.5 ? 'true' : 'false';
      });

      const active = modulo(Math.round(position), TOTAL);
      counter.textContent = String(active + 1).padStart(2, '0');
    };

    const animate = () => {
      if (edgeDirection && !dragging) target += edgeDirection * 0.008;
      if (!dragging && Math.abs(velocity) > 0.00006) {
        target += velocity;
        velocity *= 0.935;
      }
      position += (target - position) * 0.075;

      if (Math.abs(position) > 1200 || Math.abs(target) > 1200) {
        const shift = Math.trunc(position / TOTAL) * TOTAL;
        position -= shift;
        target -= shift;
      }

      render();
      requestAnimationFrame(animate);
    };
    animate();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();