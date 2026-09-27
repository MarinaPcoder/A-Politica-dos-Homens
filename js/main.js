window.AppUI = (() => {
  let toastTimer = 0;

  const toast = (html) => {
    const region = document.getElementById('toastRegion');
    if (!region) return;
    const item = document.createElement('div');
    item.className = 'toast';
    item.innerHTML = html;
    region.appendChild(item);
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      item.style.opacity = '0'; item.style.transform = 'translateY(8px)';
      setTimeout(() => item.remove(), 280);
    }, 3200);
  };

  const toggleFavorite = (id, sourceButton) => {
    const active = window.FavoritesManager.toggle(id);
    sourceButton?.classList.toggle('is-favorite', active);
    sourceButton?.classList.remove('favorite-pop');
    if (sourceButton) { void sourceButton.offsetWidth; sourceButton.classList.add('favorite-pop'); }
    sourceButton?.setAttribute('aria-label', active ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    const ep = window.APP_DATA.episodes.find(item => item.id === Number(id));
    toast(active ? `<strong>${ep?.philosopher || 'Episódio'}</strong> foi adicionado aos favoritos.` : `<strong>${ep?.philosopher || 'Episódio'}</strong> foi removido dos favoritos.`);
  };

  return { toast, toggleFavorite };
})();

(() => {
  const initializeCover = () => {
    const image = document.getElementById('mainCoverImage');
    const fallback = document.getElementById('mainCoverFallback');
    if (!image || !fallback) return;
    const fail = () => { image.hidden = true; fallback.hidden = false; };
    const success = () => { image.hidden = false; fallback.hidden = true; };
    fallback.hidden = true;
    image.addEventListener('load', success, { once: true });
    image.addEventListener('error', fail, { once: true });
    if (image.complete) image.naturalWidth > 0 ? success() : fail();
  };

  const initializeMotionPreference = () => {
    const key = 'aph:motion:v1';
    const saved = localStorage.getItem(key);
    const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reduced = saved ? saved === 'reduced' : systemReduced;
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
    const button = document.getElementById('motionToggle');
    const update = () => {
      const isReduced = document.documentElement.dataset.motion === 'reduced';
      button?.setAttribute('aria-label', isReduced ? 'Ativar animações' : 'Reduzir animações');
      button?.setAttribute('data-tooltip', isReduced ? 'Ativar animações' : 'Reduzir animações');
    };
    update();
    button?.addEventListener('click', () => {
      const next = document.documentElement.dataset.motion === 'reduced' ? 'full' : 'reduced';
      document.documentElement.dataset.motion = next;
      localStorage.setItem(key,next);
      update();
      window.AppUI.toast(next === 'reduced' ? 'Animações reduzidas.' : 'Animações completas ativadas.');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initializeCover();
    initializeMotionPreference();
    window.PodcastPlayer.init();
    window.EpisodeModal.init();
    window.ScrollAnimations.init();
    window.EpisodeRenderer.init();
    window.SearchManager.init();
    window.NavigationManager.init();
  });
})();
