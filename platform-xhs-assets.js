(() => {
  const cacheVersion = '20260728-1';
  const rednoteSources = Array.from(
    { length: 6 },
    (_, index) => `./assets/rednote${index + 1}.png?v=${cacheVersion}`
  );

  let activeIndex = 0;

  const connect = () => {
    const cards = [...document.querySelectorAll('.xhs-card')];
    const dialog = document.querySelector('.xhs-dialog');
    const dialogImage = dialog?.querySelector('.xhs-dialog-media img');
    if (cards.length !== 6 || !dialog || !dialogImage) return false;

    const syncDialogImage = () => {
      const cardImage = cards[activeIndex]?.querySelector('img');
      const source = rednoteSources[activeIndex];
      if (!cardImage || !source) return;

      dialogImage.onerror = () => {
        dialogImage.onerror = null;
        dialogImage.src = cardImage.currentSrc || cardImage.src;
      };
      dialogImage.src = source;
    };

    cards.forEach((card, index) => {
      const image = card.querySelector('img');
      if (!image || image.dataset.rednoteConnected === 'true') return;

      image.dataset.rednoteConnected = 'true';
      const fallbackSource = image.getAttribute('src') || '';

      image.onerror = () => {
        image.onerror = null;
        if (fallbackSource) image.src = fallbackSource;
      };
      image.src = rednoteSources[index];

      card.addEventListener('click', () => {
        activeIndex = index;
        queueMicrotask(syncDialogImage);
      });
    });

    new MutationObserver(() => {
      if (dialog.open) syncDialogImage();
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });

    return true;
  };

  if (!connect()) {
    const observer = new MutationObserver(() => {
      if (connect()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();