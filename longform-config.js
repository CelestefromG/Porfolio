import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const LONGFORM_IMAGE = './assets/0fab38914fecb870ed6802024f6b90bc.jpg?v=20260725-1';
const prototype = THREE.TextureLoader.prototype;

if (!prototype.__celesteLongformRedirected) {
  const originalLoad = prototype.load;

  prototype.load = function load(url, onLoad, onProgress, onError) {
    const resolvedUrl = typeof url === 'string' && url.includes('sample-longform.svg')
      ? LONGFORM_IMAGE
      : url;

    return originalLoad.call(this, resolvedUrl, onLoad, onProgress, onError);
  };

  Object.defineProperty(prototype, '__celesteLongformRedirected', {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  });
}

const style = document.createElement('style');
style.textContent = `
  .longform-tape-menu.is-single-tape {
    width: min(320px, 38vw) !important;
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .longform-tape-menu.is-single-tape .longform-tape-tab {
    width: 100%;
  }

  @media (max-width: 620px) {
    .longform-tape-menu.is-single-tape {
      width: calc(100vw - 36px) !important;
    }
  }
`;
document.head.appendChild(style);

const applySingleTapeUI = () => {
  const menu = document.querySelector('.longform-tape-menu');
  if (!menu) return;

  menu.classList.add('is-single-tape');
  menu.querySelectorAll('.longform-tape-tab:not(.is-active)').forEach(tab => tab.remove());

  const active = menu.querySelector('.longform-tape-tab.is-active');
  if (!active) return;

  const english = document.querySelector('.lang-en')?.classList.contains('is-active');
  const title = active.querySelector('b');
  const meta = active.querySelector('small');

  const nextTitle = english ? 'LONGFORM COLLECTION' : '长图合集';
  const nextMeta = '01 / COMBINED ARCHIVE';

  if (title && title.textContent !== nextTitle) title.textContent = nextTitle;
  if (meta && meta.textContent !== nextMeta) meta.textContent = nextMeta;
};

const observer = new MutationObserver(applySingleTapeUI);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
});

document.querySelector('.lang-toggle')?.addEventListener('click', () => {
  setTimeout(applySingleTapeUI, 30);
});

document.addEventListener('DOMContentLoaded', applySingleTapeUI);
requestAnimationFrame(applySingleTapeUI);
