(() => {
  const cacheVersion = '20260727-2';
  const sources = [
    `./assets/Bilibili_Video1.mp4?v=${cacheVersion}`,
    `./assets/Bilibili_Video2.mp4?v=${cacheVersion}`,
    `./assets/Bilibili_Video3.mp4?v=${cacheVersion}`
  ];

  const connectVideos = () => {
    const signals = document.querySelectorAll('.bili-signal');
    if (signals.length !== sources.length) return false;

    signals.forEach((signal, index) => {
      const video = signal.querySelector('video');
      if (!video || video.dataset.realSourceConnected === 'true') return;

      video.dataset.realSourceConnected = 'true';
      video.src = sources[index];
      video.preload = index === 0 ? 'auto' : 'metadata';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        signal.classList.add('is-video-ready');
        if (signal.classList.contains('is-active')) {
          video.play().catch(() => {});
        }
      });

      video.addEventListener('error', () => {
        signal.classList.remove('is-video-ready');
      });

      video.load();
    });

    return true;
  };

  if (!connectVideos()) {
    const observer = new MutationObserver(() => {
      if (connectVideos()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
