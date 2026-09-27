(function () {
  'use strict';

  let currentView = 'home';

  function navigate(view, options = {}) {
    const target = document.querySelector(`[data-view-section="${view}"]`);
    if (!target) return;

    currentView = view;
    document.querySelectorAll('[data-view-section]').forEach((section) => {
      section.hidden = section !== target;
      section.classList.toggle('is-active-view', section === target);
    });

    document.querySelectorAll('[data-nav]').forEach((item) => {
      const active = item.dataset.nav === view;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    document.body.classList.remove('sidebar-open');
    if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: 'auto' });
    if (!options.silent) history.replaceState(null, '', `#${view}`);
    document.dispatchEvent(new CustomEvent('navigation:changed', { detail: { view } }));
  }

  function init() {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-nav]');
      if (!trigger) return;
      event.preventDefault();
      navigate(trigger.dataset.nav);
    });

    const initialHash = location.hash.replace('#', '');
    navigate(document.querySelector(`[data-view-section="${initialHash}"]`) ? initialHash : 'home', { silent: true });
  }

  function getCurrentView() {
    return currentView;
  }

  window.NavigationService = { init, navigate, getCurrentView };
})();
