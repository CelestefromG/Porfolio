(() => {
  const ensureDialog = () => {
    let dialog = document.querySelector('.poster-native-dialog');
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.className = 'poster-native-dialog';
    dialog.innerHTML = `
      <button class="poster-native-close" type="button" aria-label="Close">×</button>
      <div class="poster-native-stage"><img alt="Poster detail" /></div>
    `;
    document.body.appendChild(dialog);

    const style = document.createElement('style');
    style.textContent = `
      .poster-native-dialog{width:min(1100px,92vw);height:min(760px,90vh);padding:0;border:1px solid #111;background:#f5f3ef;color:#111;box-shadow:0 45px 120px rgba(0,0,0,.36)}
      .poster-native-dialog::backdrop{background:rgba(5,7,10,.68);backdrop-filter:blur(9px)}
      .poster-native-dialog[open]{display:block}
      .poster-native-stage{position:absolute;inset:0;display:grid;place-items:center;padding:36px;background:#f5f3ef;overflow:hidden}
      .poster-native-stage img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;object-position:center;position:relative;z-index:1}
      .poster-native-close{position:absolute;right:12px;top:10px;z-index:5;width:34px;height:34px;border:1px solid #111;background:#f5f3ef;font-size:22px;line-height:1;cursor:pointer}
    `;
    document.head.appendChild(style);

    dialog.querySelector('.poster-native-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  };

  const getVisiblePosterSrc = card => {
    const art = card.querySelector('.gallery-art');
    if (!art) return '';
    if (art.dataset.visualImage) return art.dataset.visualImage;
    const bg = getComputedStyle(art).backgroundImage;
    const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '';
  };

  document.addEventListener('click', event => {
    const card = event.target.closest('.poster-scene .gallery-card');
    if (!card) return;

    const src = getVisiblePosterSrc(card);
    if (!src) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const oldDialog = document.querySelector('.project-dialog');
    if (oldDialog?.open) oldDialog.close();

    const dialog = ensureDialog();
    const img = dialog.querySelector('img');
    img.src = src;
    img.alt = card.querySelector('.card-copy b')?.textContent?.trim() || 'Poster detail';
    if (!dialog.open) dialog.showModal();
  }, true);
})();
