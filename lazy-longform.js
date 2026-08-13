let longformPromise = null;

const loadLongform = () => {
  if (longformPromise) return longformPromise;
  longformPromise = (async () => {
    await import('./longform-config.js?v=20260730-1');
    await import('./longform-tape.js?v=20260730-1');
  })().catch(error => {
    longformPromise = null;
    console.error('Unable to load longform experience:', error);
  });
  return longformPromise;
};

const posterScene = document.querySelector('.poster-scene');
const posterButton = document.querySelector('[data-chapter="poster"]');

posterButton?.addEventListener('click', loadLongform, { once: true });

if (posterScene) {
  const observer = new MutationObserver(() => {
    if (posterScene.classList.contains('is-visible')) {
      loadLongform();
      observer.disconnect();
    }
  });
  observer.observe(posterScene, { attributes: true, attributeFilter: ['class'] });
}
