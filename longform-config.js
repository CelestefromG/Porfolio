import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const LONGFORM_IMAGE = './assets/0fab38914fecb870ed6802024f6b90bc.jpg?v=20260725-2';
const prototype = THREE.TextureLoader.prototype;

const getMaxTextureSize = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return gl?.getParameter(gl.MAX_TEXTURE_SIZE) || 16384;
  } catch {
    return 16384;
  }
};

const buildLoopTexture = sourceTexture => {
  const source = sourceTexture.image;
  const sourceWidth = source?.naturalWidth || source?.videoWidth || source?.width || 1080;
  const sourceHeight = source?.naturalHeight || source?.videoHeight || source?.height || 4000;
  const aspect = sourceHeight / Math.max(sourceWidth, 1);
  const maxTextureSize = getMaxTextureSize();

  // Keep enough horizontal detail for the enlarged tape, then fit as many
  // complete copies as the GPU can safely hold in one texture.
  let targetWidth = Math.min(sourceWidth, 384);
  if (targetWidth * aspect * 2 > maxTextureSize) {
    targetWidth = Math.max(96, Math.floor(maxTextureSize / Math.max(aspect * 2, 1)));
  }

  const segmentHeight = Math.max(1, Math.round(targetWidth * aspect));
  const copies = Math.max(2, Math.min(12, Math.floor(maxTextureSize / segmentHeight)));
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = segmentHeight * copies;

  const context = canvas.getContext('2d', { alpha: false });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#f4f3ef';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < copies; index += 1) {
    context.drawImage(source, 0, index * segmentHeight, targetWidth, segmentHeight);
  }

  const loopTexture = new THREE.CanvasTexture(canvas);
  loopTexture.colorSpace = THREE.SRGBColorSpace;
  loopTexture.anisotropy = sourceTexture.anisotropy;
  loopTexture.needsUpdate = true;
  return loopTexture;
};

if (!prototype.__celesteLongformRedirected) {
  const originalLoad = prototype.load;

  prototype.load = function load(url, onLoad, onProgress, onError) {
    const isLongformRequest = typeof url === 'string' && url.includes('sample-longform.svg');
    const resolvedUrl = isLongformRequest ? LONGFORM_IMAGE : url;
    const resolvedOnLoad = isLongformRequest
      ? texture => {
          try {
            onLoad?.(buildLoopTexture(texture));
          } catch (error) {
            console.warn('Unable to build looping longform texture; using the source image.', error);
            onLoad?.(texture);
          }
        }
      : onLoad;

    return originalLoad.call(this, resolvedUrl, resolvedOnLoad, onProgress, onError);
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
  const panel = document.querySelector('.longform-tape-panel');
  if (!active || !panel) return;

  const english = document.querySelector('.lang-en')?.classList.contains('is-active');
  const title = active.querySelector('b');
  const meta = active.querySelector('small');
  const intro = panel.querySelector('[data-longform-intro]');

  const nextTitle = english ? 'LOOPING LONGFORM' : '循环长图合集';
  if (title && title.textContent !== nextTitle) title.textContent = nextTitle;
  if (meta) meta.textContent = '01 / CONTINUOUS ARCHIVE';
  if (intro) {
    intro.textContent = english
      ? 'Move the pointer to keep laying the combined long-form archive. The ending connects directly back to the beginning.'
      : '移动鼠标持续铺开长图合集，末尾会直接衔接回开头，形成连续循环。';
  }
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
