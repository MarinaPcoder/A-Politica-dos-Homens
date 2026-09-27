(function () {
  'use strict';

  const episodes = window.APP_DATA.episodes;
  const root = () => document.getElementById('episode-modal');
  let activeEpisode = null;
  let lastFocused = null;

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));


  function paintRange(element, ratio, fill = 'var(--episode-accent, var(--wine-light))') {
    if (!element) return;
    const percent = Math.max(0, Math.min(100, Number(ratio || 0) * 100));
    element.style.background = `linear-gradient(90deg, ${fill} 0 ${percent}%, rgba(255,255,255,.13) ${percent}% 100%)`;
  }

  function imageMarkup(src, fallback, alt, className = '') {
    return `<img class="${className}" src="${escapeHTML(src)}" data-fallback="${escapeHTML(fallback)}" alt="${escapeHTML(alt)}">`;
  }

  function audioOptions(episode) {
    return episode.audios.map((track, index) => {
      const availability = track.available
        ? `<span class="status-pill status-pill--ready">Disponível</span>`
        : `<span class="status-pill">Áudio pendente</span>`;
      return `
        <article class="audio-version ${index === 0 ? 'is-primary' : ''}" data-audio-id="${track.id}">
          <div>
            <span class="eyebrow">${escapeHTML(track.label)}</span>
            <strong>${escapeHTML(track.durationLabel)}</strong>
          </div>
          <div class="audio-version__actions">
            ${availability}
            <button class="icon-action js-track-play" data-episode="${episode.id}" data-audio="${track.id}" ${track.available ? '' : 'aria-disabled="true"'} aria-label="${track.available ? 'Reproduzir' : 'Áudio ainda não disponível'} ${escapeHTML(track.label)}">
              <span class="js-play-symbol">▶</span>
            </button>
          </div>
        </article>`;
    }).join('');
  }

  function overviewMarkup(episode) {
    return `
      <div class="episode-info-grid">
        <article class="info-card info-card--wide">
          <span class="eyebrow">Sobre o episódio</span>
          <h3>Uma conversa através do tempo</h3>
          <p>${escapeHTML(episode.longDescription)}</p>
        </article>
        <article class="info-card">
          <span class="eyebrow">Conceitos</span>
          <div class="tag-cloud">${episode.concepts.map((item) => `<span>${escapeHTML(item)}</span>`).join('')}</div>
        </article>
        <article class="info-card">
          <span class="eyebrow">Obras principais</span>
          <ul class="clean-list">${episode.works.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        </article>
        <article class="info-card info-card--wide">
          <span class="eyebrow">Contexto histórico</span>
          <p>${escapeHTML(episode.historicalContext)}</p>
        </article>
      </div>`;
  }

  function teamMarkup(episode) {
    return `
      <article class="info-card info-card--wide team-detail-card">
        <span class="eyebrow">Grupo ${episode.group}</span>
        <h3>Equipe do episódio</h3>
        <p class="muted">Conheça os integrantes da equipe e suas funções na produção deste episódio.</p>
        <div class="member-grid">
          ${episode.members.map((member, index) => `
            <div class="member-chip">
              <span class="member-chip__number">${String(index + 1).padStart(2, '0')}</span>
              <span><strong>${escapeHTML(member.name)}</strong><small>${member.role ? escapeHTML(member.role) : 'Função a definir'}</small></span>
            </div>`).join('')}
        </div>
      </article>`;
  }

  function scriptMarkup(episode) {
    if (!episode.script.available) {
      return `
        <article class="empty-state empty-state--compact">
          <span class="empty-state__icon">⌁</span>
          <h3>Roteiro ainda não enviado</h3>
          <p>Quando o PDF da equipe estiver pronto, coloque o arquivo em <code>${escapeHTML(episode.script.path)}</code> e altere <code>available</code> para <code>true</code> em <code>js/data.js</code>.</p>
        </article>`;
    }
    return `
      <article class="script-viewer">
        <div class="script-viewer__header">
          <div><span class="eyebrow">Roteiro</span><h3>Documento da equipe</h3></div>
          <a class="button button--ghost" href="${escapeHTML(episode.script.path)}" target="_blank" rel="noopener">Abrir PDF</a>
        </div>
        <object data="${escapeHTML(episode.script.path)}" type="application/pdf" class="pdf-frame">
          <p>Seu navegador não conseguiu incorporar o PDF. <a href="${escapeHTML(episode.script.path)}" target="_blank" rel="noopener">Abra o arquivo em uma nova guia.</a></p>
        </object>
      </article>`;
  }

  function playerModeMarkup(episode, selectedTrack) {
    const unavailable = !selectedTrack.available;
    return `
      <section class="immersive-player" id="immersive-player" aria-label="Tela de reprodução">
        <div class="immersive-player__ambient" aria-hidden="true"></div>
        <button class="player-back js-player-back" type="button" aria-label="Voltar aos detalhes">← <span>Detalhes</span></button>
        <div class="immersive-player__stage">
          <div class="immersive-player__cover-wrap">
            ${imageMarkup(episode.image, episode.fallbackImage, `Capa do episódio de ${episode.philosopher}`, 'immersive-player__cover')}
            <div class="vinyl-ring" aria-hidden="true"></div>
          </div>
          <div class="immersive-player__meta">
            <span class="eyebrow">EPISÓDIO ${episode.number} · ${escapeHTML(selectedTrack.label)}</span>
            <h2>${escapeHTML(episode.title)}</h2>
            <p>${escapeHTML(episode.philosopher)}</p>
            <div class="waveform" aria-hidden="true">
              ${Array.from({ length: 38 }, (_, index) => `<i style="--i:${index}"></i>`).join('')}
            </div>
            ${unavailable ? `<div class="unavailable-note"><strong>Áudio ainda não disponível.</strong><span>O player já está preparado para receber o MP3 posteriormente.</span></div>` : ''}
            <div class="immersive-progress">
              <input class="range js-progress-range" type="range" min="0" max="1000" value="0" aria-label="Progresso do áudio" ${unavailable ? 'disabled' : ''}>
              <div class="time-row"><span class="js-current-time">00:00</span><span class="js-duration">${escapeHTML(selectedTrack.durationLabel)}</span></div>
            </div>
            <div class="immersive-controls">
              <button class="round-control js-seek-back" type="button" ${unavailable ? 'disabled' : ''} aria-label="Voltar 10 segundos">↶<small>10</small></button>
              <button class="round-control round-control--main js-main-toggle" type="button" ${unavailable ? 'disabled' : ''} aria-label="Reproduzir"><span class="js-play-symbol">▶</span></button>
              <button class="round-control js-seek-forward" type="button" ${unavailable ? 'disabled' : ''} aria-label="Avançar 10 segundos"><small>10</small>↷</button>
            </div>
            <div class="immersive-volume">
              <button class="text-icon js-mute" type="button" ${unavailable ? 'disabled' : ''} aria-label="Ativar ou desativar som"><span class="js-volume-symbol">◖))</span></button>
              <input class="range range--volume js-volume-range" type="range" min="0" max="1" step="0.01" value="0.82" ${unavailable ? 'disabled' : ''} aria-label="Volume">
            </div>
          </div>
        </div>
        <div class="seek-feedback js-seek-feedback" aria-hidden="true"></div>
      </section>`;
  }

  function detailsMarkup(episode) {
    const selectedTrack = episode.audios[0];
    return `
      <div class="episode-modal__details" id="episode-modal-details">
        <header class="episode-hero" style="--episode-accent:${episode.color};--episode-soft:${episode.accentSoft}">
          <div class="episode-hero__glow" aria-hidden="true"></div>
          <div class="episode-hero__cover">
            ${imageMarkup(episode.image, episode.fallbackImage, `Capa do episódio ${episode.title}`)}
            <span class="episode-number">${episode.number}</span>
          </div>
          <div class="episode-hero__copy">
            <span class="eyebrow">EPISÓDIO ${episode.number} · GRUPO ${episode.group}</span>
            <p class="episode-hero__philosopher">${escapeHTML(episode.philosopher)}</p>
            <h2 id="episode-modal-title">${escapeHTML(episode.title)}</h2>
            <p>${escapeHTML(episode.description)}</p>
            <div class="tag-row">${episode.themes.map((item) => `<span>${escapeHTML(item)}</span>`).join('')}</div>
            <div class="episode-hero__actions">
              <button class="button button--primary js-open-player" type="button" data-audio="${selectedTrack.id}">▶ Ouvir episódio</button>
              <button class="button button--ghost js-modal-favorite" type="button" data-episode="${episode.id}"><span class="js-heart">♡</span> Favoritar</button>
            </div>
          </div>
        </header>

        <section class="audio-versions" aria-label="Versões de áudio">
          <div class="section-heading section-heading--compact"><div><span class="eyebrow">Reprodução</span><h3>${episode.audios.length > 1 ? 'Escolha uma versão' : 'Áudio do episódio'}</h3></div></div>
          <div class="audio-version-list">${audioOptions(episode)}</div>
        </section>

        <div class="modal-tabs" role="tablist" aria-label="Informações do episódio">
          <button class="modal-tab is-active" type="button" role="tab" aria-selected="true" data-modal-tab="overview">Visão geral</button>
          <button class="modal-tab" type="button" role="tab" aria-selected="false" data-modal-tab="script">Roteiro</button>
          <button class="modal-tab" type="button" role="tab" aria-selected="false" data-modal-tab="team">Equipe</button>
        </div>

        <div class="episode-modal__body">
          <main class="episode-modal__main">
            <div class="modal-tab-panel" data-modal-panel="overview">${overviewMarkup(episode)}</div>
            <div class="modal-tab-panel" data-modal-panel="script" hidden>${scriptMarkup(episode)}</div>
            <div class="modal-tab-panel" data-modal-panel="team" hidden>${teamMarkup(episode)}</div>
          </main>
          <aside class="thinker-profile" style="--episode-accent:${episode.color}">
            <div class="thinker-profile__image">${imageMarkup(episode.philosopherImage, episode.fallbackImage, `Retrato de ${episode.philosopher}`)}</div>
            <span class="eyebrow">O pensador</span>
            <h3>${escapeHTML(episode.philosopher)}</h3>
            <dl>
              <div><dt>Período</dt><dd>${escapeHTML(episode.period)}</dd></div>
              <div><dt>Região</dt><dd>${escapeHTML(episode.region)}</dd></div>
            </dl>
            <p>${escapeHTML(episode.biography)}</p>
            <div class="tag-cloud tag-cloud--small">${episode.concepts.slice(0, 4).map((item) => `<span>${escapeHTML(item)}</span>`).join('')}</div>
            <button class="button button--text js-thinker-link" type="button" data-thinker="${episode.id}">Conhecer pensador →</button>
          </aside>
        </div>

        <footer class="episode-team-footer">
          <span>Equipe · Grupo ${episode.group}</span>
          <p>${episode.members.map((member) => escapeHTML(member.name)).join(' · ')}</p>
        </footer>
      </div>
      ${playerModeMarkup(episode, selectedTrack)}`;
  }

  function openEpisode(episodeId) {
    const episode = episodes.find((item) => item.id === episodeId);
    if (!episode || !root()) return;
    activeEpisode = episode;
    lastFocused = document.activeElement;
    const panel = root().querySelector('.episode-modal__panel');
    panel.style.setProperty('--episode-accent', episode.color);
    panel.innerHTML = `
      <button class="modal-close js-modal-close" type="button" aria-label="Fechar episódio">×</button>
      ${detailsMarkup(episode)}`;
    root().hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => root().classList.add('is-open'));
    bindImageFallbacks(panel);
    syncUI();
    root().querySelector('.js-modal-close')?.focus();
  }

  function close() {
    if (!root() || root().hidden) return;
    root().classList.remove('is-open');
    document.body.classList.remove('modal-open');
    setTimeout(() => {
      root().hidden = true;
      root().querySelector('.episode-modal__panel').innerHTML = '';
      activeEpisode = null;
      lastFocused?.focus?.();
    }, 260);
  }

  function enterPlayerMode(audioId) {
    if (!activeEpisode) return;
    const selected = activeEpisode.audios.find((item) => item.id === audioId) || activeEpisode.audios[0];
    const player = root().querySelector('#immersive-player');
    const details = root().querySelector('#episode-modal-details');
    if (!player || !details) return;

    if (player.dataset.audioId !== selected.id) {
      const replacement = document.createElement('div');
      replacement.innerHTML = playerModeMarkup(activeEpisode, selected).trim();
      player.replaceWith(replacement.firstElementChild);
      bindImageFallbacks(root());
    }

    root().querySelector('#immersive-player').dataset.audioId = selected.id;
    details.classList.add('is-player-transitioning');
    setTimeout(() => {
      details.hidden = true;
      const nextPlayer = root().querySelector('#immersive-player');
      nextPlayer.classList.add('is-visible');
      nextPlayer.querySelector('.js-main-toggle')?.focus();
      syncUI();
      if (selected.available) window.PlayerService.playTrack(activeEpisode.id, selected.id);
      else document.dispatchEvent(new CustomEvent('player:unavailable', { detail: { message: 'Este episódio ainda não possui áudio disponível.' } }));
    }, 180);
  }

  function exitPlayerMode() {
    const player = root()?.querySelector('#immersive-player');
    const details = root()?.querySelector('#episode-modal-details');
    if (!player || !details) return;
    player.classList.remove('is-visible');
    setTimeout(() => {
      details.hidden = false;
      details.classList.remove('is-player-transitioning');
      details.querySelector('.js-open-player')?.focus();
    }, 180);
  }

  function bindImageFallbacks(scope) {
    scope.querySelectorAll('img[data-fallback]').forEach((img) => {
      img.onerror = () => {
        if (img.src.includes(img.dataset.fallback)) return;
        img.src = img.dataset.fallback;
      };
    });
  }

  function setTab(name) {
    if (!root()) return;
    root().querySelectorAll('[data-modal-tab]').forEach((button) => {
      const active = button.dataset.modalTab === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    root().querySelectorAll('[data-modal-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.modalPanel !== name;
    });
  }

  function syncUI() {
    if (!root() || root().hidden) return;
    const state = window.PlayerService.getState();
    const playingThisEpisode = state.current?.episode.id === activeEpisode?.id;
    const activeAudioId = state.current?.track.id;

    root().querySelectorAll('.js-track-play').forEach((button) => {
      const same = button.dataset.audio === activeAudioId && playingThisEpisode;
      const isPlaying = same && state.isPlaying;
      button.classList.toggle('is-playing', isPlaying);
      const symbol = button.querySelector('.js-play-symbol');
      if (symbol) symbol.textContent = isPlaying ? '❚❚' : '▶';
    });

    const heart = root().querySelector('.js-heart');
    const favoriteButton = root().querySelector('.js-modal-favorite');
    if (heart && activeEpisode) heart.textContent = window.FavoritesService.has(activeEpisode.id) ? '♥' : '♡';
    favoriteButton?.classList.toggle('is-favorite', activeEpisode ? window.FavoritesService.has(activeEpisode.id) : false);

    const player = root().querySelector('#immersive-player');
    if (!player) return;
    const selectedAudioId = player.dataset.audioId || activeEpisode?.audios[0]?.id;
    const selectedMatches = playingThisEpisode && activeAudioId === selectedAudioId;
    const toggle = player.querySelector('.js-main-toggle');
    const symbol = toggle?.querySelector('.js-play-symbol');
    if (symbol) symbol.textContent = selectedMatches && state.isPlaying ? '❚❚' : '▶';
    if (toggle) toggle.setAttribute('aria-label', selectedMatches && state.isPlaying ? 'Pausar' : 'Reproduzir');
    player.classList.toggle('is-playing', selectedMatches && state.isPlaying);
    player.classList.toggle('is-loading', selectedMatches && state.loading);

    const progress = player.querySelector('.js-progress-range');
    if (progress && selectedMatches) progress.value = String(Math.round(state.progress * 1000));
    paintRange(progress, selectedMatches ? state.progress : 0);
    const currentTime = player.querySelector('.js-current-time');
    const duration = player.querySelector('.js-duration');
    if (currentTime) currentTime.textContent = selectedMatches ? state.formattedCurrent : '00:00';
    if (duration && selectedMatches) duration.textContent = state.formattedDuration;
    const volume = player.querySelector('.js-volume-range');
    if (volume) volume.value = String(state.volume);
    paintRange(volume, state.muted ? 0 : state.volume, 'var(--ivory)');
    const volSymbol = player.querySelector('.js-volume-symbol');
    if (volSymbol) volSymbol.textContent = state.muted || state.volume === 0 ? '×)' : state.volume < 0.45 ? '◖)' : '◖))';
  }

  function init() {
    const modalRoot = root();
    if (!modalRoot) return;

    modalRoot.addEventListener('click', (event) => {
      if (event.target === modalRoot) close();

      if (event.target.closest('.js-modal-close')) close();
      if (event.target.closest('.js-player-back')) exitPlayerMode();

      const tab = event.target.closest('[data-modal-tab]');
      if (tab) setTab(tab.dataset.modalTab);

      const favorite = event.target.closest('.js-modal-favorite');
      if (favorite && activeEpisode) {
        const active = window.FavoritesService.toggle(activeEpisode.id);
        document.dispatchEvent(new CustomEvent('ui:toast', { detail: { message: active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.' } }));
      }

      const trackButton = event.target.closest('.js-track-play');
      if (trackButton) {
        if (trackButton.getAttribute('aria-disabled') === 'true') {
          document.dispatchEvent(new CustomEvent('player:unavailable', { detail: { message: 'Este episódio ainda não possui áudio disponível.' } }));
        } else {
          const state = window.PlayerService.getState();
          if (state.current?.track.id === trackButton.dataset.audio) window.PlayerService.toggle();
          else window.PlayerService.playTrack(trackButton.dataset.episode, trackButton.dataset.audio);
        }
      }

      const openPlayer = event.target.closest('.js-open-player');
      if (openPlayer) enterPlayerMode(openPlayer.dataset.audio);

      const mainToggle = event.target.closest('.js-main-toggle');
      if (mainToggle && activeEpisode) {
        const player = modalRoot.querySelector('#immersive-player');
        const audioId = player?.dataset.audioId || activeEpisode.audios[0].id;
        const state = window.PlayerService.getState();
        if (state.current?.track.id === audioId) window.PlayerService.toggle();
        else window.PlayerService.playTrack(activeEpisode.id, audioId);
      }

      if (event.target.closest('.js-seek-back')) window.PlayerService.seekBy(-10);
      if (event.target.closest('.js-seek-forward')) window.PlayerService.seekBy(10);
      if (event.target.closest('.js-mute')) window.PlayerService.toggleMute();

      const thinkerLink = event.target.closest('.js-thinker-link');
      if (thinkerLink) {
        close();
        setTimeout(() => {
          window.NavigationService.navigate('thinkers');
          document.querySelector(`[data-thinker-card="${thinkerLink.dataset.thinker}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 280);
      }
    });

    modalRoot.addEventListener('input', (event) => {
      if (event.target.matches('.js-progress-range')) {
        const state = window.PlayerService.getState();
        if (state.duration > 0) window.PlayerService.seekTo((Number(event.target.value) / 1000) * state.duration);
      }
      if (event.target.matches('.js-volume-range')) window.PlayerService.setVolume(event.target.value);
    });

    document.addEventListener('keydown', (event) => {
      if (modalRoot.hidden) return;
      if (event.key === 'Escape') {
        const player = modalRoot.querySelector('#immersive-player.is-visible');
        if (player) exitPlayerMode();
        else close();
        return;
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(modalRoot.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });

    ['player:state', 'player:progress', 'player:volume', 'player:trackchanged', 'favorites:changed'].forEach((name) => {
      document.addEventListener(name, syncUI);
    });

    document.addEventListener('player:seekfeedback', (event) => {
      const feedback = modalRoot.querySelector('.js-seek-feedback');
      if (!feedback) return;
      feedback.textContent = event.detail.delta > 0 ? '+10s' : '-10s';
      feedback.classList.remove('is-visible');
      void feedback.offsetWidth;
      feedback.classList.add('is-visible');
    });
  }

  window.ModalService = { init, openEpisode, close, syncUI };
})();
