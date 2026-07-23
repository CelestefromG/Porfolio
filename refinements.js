(() => {
  const setupPosterEdgeTravel = () => {
    const viewport = document.querySelector('[data-gallery="poster"]');
    if (!viewport || viewport.dataset.edgeTravelReady === 'true') return;

    viewport.dataset.edgeTravelReady = 'true';
    let delayTimer = null;
    let repeatTimer = null;
    let direction = 0;
    let dragging = false;

    const move = step => {
      const selector = step < 0
        ? '[data-gallery-prev="poster"]'
        : '[data-gallery-next="poster"]';
      document.querySelector(selector)?.click();
    };

    const stop = () => {
      clearTimeout(delayTimer);
      clearInterval(repeatTimer);
      delayTimer = null;
      repeatTimer = null;
      direction = 0;
      delete viewport.dataset.edge;
    };

    const start = nextDirection => {
      if (nextDirection === direction) return;
      stop();
      if (!nextDirection) return;

      direction = nextDirection;
      viewport.dataset.edge = direction < 0 ? 'left' : 'right';
      delayTimer = window.setTimeout(() => {
        move(direction);
        repeatTimer = window.setInterval(() => move(direction), 720);
      }, 420);
    };

    viewport.addEventListener('pointerdown', () => {
      dragging = true;
      stop();
    });

    viewport.addEventListener('pointerup', () => {
      dragging = false;
    });

    viewport.addEventListener('pointercancel', () => {
      dragging = false;
      stop();
    });

    viewport.addEventListener('pointermove', event => {
      if (dragging || event.pointerType === 'touch') return;
      const rect = viewport.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      start(relativeX < .27 ? -1 : relativeX > .73 ? 1 : 0);
    });

    viewport.addEventListener('pointerleave', stop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
    });
  };

  const ensureUkPhone = () => {
    const meta = document.querySelector('.id-card-meta');
    if (!meta || meta.querySelector('[href="tel:+447344361482"]')) return;
    const phone = document.createElement('a');
    phone.href = 'tel:+447344361482';
    phone.textContent = '+44 7344361482';
    const email = meta.querySelector('[href^="mailto:"]');
    meta.insertBefore(phone, email);
  };

  window.addEventListener('DOMContentLoaded', () => {
    ensureUkPhone();
    setupPosterEdgeTravel();
  }, { once: true });
})();
