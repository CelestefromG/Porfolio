(() => {
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
  }, { once: true });

  window.addEventListener('load', () => {
    import('./longform-restore.js?v=20260814-r3');
  }, { once: true });
})();
