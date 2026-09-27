(function () {
  'use strict';

  function initReveal() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el) => observer.observe(el));
  }

  function observeDynamic(root = document) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el, index) => {
      if (reduced) el.classList.add('is-revealed');
      else setTimeout(() => el.classList.add('is-revealed'), Math.min(index * 45, 360));
    });
  }

  function initPointerGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('pointermove', (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });
  }

  window.AnimationService = { initReveal, observeDynamic, initPointerGlow };
})();
