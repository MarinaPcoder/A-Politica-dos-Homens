window.EpisodeRenderer = (() => {
  let grid;
  let thinkersGrid;
  let favoritesGrid;
  let favoritesEmpty;
  let empty;
  let count;

  const esc = (value) => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  const initials = name => name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const cardHTML = (ep) => {
    const favorite = window.FavoritesManager.has(ep.id);
    const progress = window.PodcastPlayer?.getProgress(ep.id) || { percent: 0 };
    return `
      <article class="episode-card reveal" tabindex="0" role="button" aria-label="Abrir ${esc(ep.philosopher)} — ${esc(ep.title)}" data-episode-id="${ep.id}" style="--episode-color:${ep.color}">
        <div class="episode-card__image">
          <img src="${ep.episodeImage || ep.image}" alt="Imagem do episódio ${esc(ep.philosopher)}" data-card-image>
          <div class="episode-image-fallback" data-number="${String(ep.id).padStart(2,'0')}" hidden><span>ARQUIVO • ${esc(ep.episode)}</span><strong>${esc(ep.philosopher)}</strong></div>
          <div class="episode-card__overlay">
            <span class="episode-number">${esc(ep.episode)}</span>
            <span class="episode-status ${ep.available ? 'available' : ''}">${ep.available ? 'Disponível' : 'Áudio em breve'}</span>
          </div>
        </div>
        <div class="episode-card__body">
          <span class="episode-card__philosopher">${esc(ep.shortName || ep.philosopher)}</span>
          <h3>${esc(ep.title)}</h3>
          <p class="episode-card__description">${esc(ep.description)}</p>
          ${progress.percent > 1 ? `<div class="card-progress" aria-label="${Math.round(progress.percent)}% ouvido"><span style="width:${Math.min(100,progress.percent)}%"></span></div>` : ''}
          <div class="episode-card__footer">
            <span class="episode-duration">${esc(ep.duration)} • ${esc(ep.themes.slice(0,2).join(' / '))}</span>
            <div class="episode-actions">
              <span class="equalizer" aria-label="Reproduzindo"><i></i><i></i><i></i><i></i><i></i></span>
              <button class="card-action ${favorite ? 'is-favorite' : ''}" type="button" data-favorite-episode="${ep.id}" aria-label="${favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
              </button>
              <button class="card-action card-action--play" type="button" data-play-episode="${ep.id}" aria-label="Reproduzir episódio"><span data-play-icon>▶</span></button>
            </div>
          </div>
        </div>
      </article>`;
  };

  const thinkerHTML = (ep) => `
    <button class="thinker-card reveal" type="button" data-thinker-id="${ep.id}" style="--episode-color:${ep.color}" aria-label="Abrir episódio de ${esc(ep.philosopher)}">
      <span class="thinker-card__image">
        <img src="${ep.image}" alt="Retrato de ${esc(ep.philosopher)}" data-card-image>
        <span class="thinker-fallback" hidden>${esc(initials(ep.philosopher))}</span>
      </span>
      <span class="thinker-card__content">
        <small>${esc(ep.episode)} • ${esc(ep.period)}</small>
        <h3>${esc(ep.philosopher)}</h3>
        <p>${esc(ep.concepts.slice(0,3).join(' • '))}</p>
      </span>
    </button>`;

  const wireImageFallbacks = (scope = document) => {
    scope.querySelectorAll('img[data-card-image]').forEach(img => {
      const fallback = img.nextElementSibling;
      const fail = () => { img.hidden = true; fallback?.removeAttribute('hidden'); };
      img.addEventListener('error', fail, { once: true });
      if (img.complete && img.naturalWidth === 0) fail();
    });
  };

  const renderFilters = () => {
    const row = document.getElementById('filterRow');
    if (!row) return;
    row.innerHTML = window.APP_DATA.filters.map(filter => `<button class="filter-chip ${window.EpisodeFilters.get()===filter?'active':''}" type="button" data-filter="${esc(filter)}" aria-pressed="${window.EpisodeFilters.get()===filter}">${esc(filter)}</button>`).join('');
  };

  const renderEpisodes = () => {
    const filtered = window.APP_DATA.episodes.filter(window.EpisodeFilters.matches);
    grid.innerHTML = filtered.map(cardHTML).join('');
    empty.classList.toggle('hidden', filtered.length > 0);
    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'episódio' : 'episódios'}`;
    renderFilters();
    wireImageFallbacks(grid);
    window.ScrollAnimations?.observeNew(grid);
    window.PodcastPlayer?.syncModalState();
    const current = window.PodcastPlayer?.getCurrent();
    if (current) window.dispatchEvent(new CustomEvent('aph:player-state', { detail: { episode: current, playing: window.PodcastPlayer.isPlaying() } }));
  };

  const renderThinkers = () => {
    thinkersGrid.innerHTML = window.APP_DATA.episodes.map(thinkerHTML).join('');
    wireImageFallbacks(thinkersGrid);
    window.ScrollAnimations?.observeNew(thinkersGrid);
  };

  const renderFavorites = () => {
    const ids = window.FavoritesManager.getAll();
    const favorites = ids.map(id => window.APP_DATA.episodes.find(ep => ep.id === id)).filter(Boolean);
    favoritesEmpty.hidden = favorites.length > 0;
    favoritesGrid.innerHTML = favorites.map(ep => `
      <button class="favorite-mini-card" type="button" data-favorite-open="${ep.id}" style="--episode-color:${ep.color}">
        <span class="favorite-mini-card__art">${String(ep.id).padStart(2,'0')}</span>
        <span class="favorite-mini-card__text"><strong>${esc(ep.title)}</strong><span>${esc(ep.philosopher)} • ${esc(ep.duration)}</span></span>
      </button>`).join('');
  };

  const init = () => {
    grid = document.getElementById('episodesGrid');
    thinkersGrid = document.getElementById('thinkersGrid');
    favoritesGrid = document.getElementById('favoritesGrid');
    favoritesEmpty = document.getElementById('favoritesEmpty');
    empty = document.getElementById('episodesEmpty');
    count = document.getElementById('episodeCount');
    if (!grid || !thinkersGrid || !favoritesGrid || !empty || !count) return;

    renderFilters(); renderEpisodes(); renderThinkers(); renderFavorites();

    document.getElementById('filterRow')?.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (button) window.EpisodeFilters.set(button.dataset.filter);
    });
    document.getElementById('resetFiltersButton')?.addEventListener('click', () => window.EpisodeFilters.reset());

    grid.addEventListener('click', handleEpisodeGridClick);
    grid.addEventListener('keydown', event => {
      const card = event.target.closest('.episode-card');
      if (card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); window.EpisodeModal.open(Number(card.dataset.episodeId)); }
    });
    thinkersGrid.addEventListener('click', event => {
      const card = event.target.closest('[data-thinker-id]');
      if (card) window.EpisodeModal.open(Number(card.dataset.thinkerId));
    });
    favoritesGrid.addEventListener('click', event => {
      const card = event.target.closest('[data-favorite-open]');
      if (card) window.EpisodeModal.open(Number(card.dataset.favoriteOpen));
    });

    window.addEventListener('aph:filter-changed', renderEpisodes);
    window.addEventListener('aph:favorites-changed', () => { renderEpisodes(); renderFavorites(); });
    window.addEventListener('aph:progress-changed', event => {
      const card = grid.querySelector(`[data-episode-id="${event.detail.episodeId}"]`);
      const body = card?.querySelector('.episode-card__body');
      if (!body || !event.detail.progress) return;
      let bar = body.querySelector('.card-progress');
      if (!bar && event.detail.progress.percent > 1) {
        bar = document.createElement('div'); bar.className = 'card-progress'; bar.innerHTML = '<span></span>';
        body.insertBefore(bar, body.querySelector('.episode-card__footer'));
      }
      if (bar) bar.querySelector('span').style.width = `${Math.min(100,event.detail.progress.percent)}%`;
    });
  };

  const handleEpisodeGridClick = (event) => {
    const favorite = event.target.closest('[data-favorite-episode]');
    if (favorite) { event.stopPropagation(); window.AppUI.toggleFavorite(Number(favorite.dataset.favoriteEpisode), favorite); return; }
    const play = event.target.closest('[data-play-episode]');
    if (play) { event.stopPropagation(); window.PodcastPlayer.toggle(Number(play.dataset.playEpisode)); return; }
    const card = event.target.closest('.episode-card');
    if (card) window.EpisodeModal.open(Number(card.dataset.episodeId));
  };

  return { init, renderEpisodes, renderFavorites, renderThinkers };
})();
