(function () {
  'use strict';

  const { site, episodes, assignment } = window.APP_DATA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  function imageMarkup(src, fallback, alt, className = '') {
    return `<img class="${className}" src="${escapeHTML(src)}" data-fallback="${escapeHTML(fallback)}" alt="${escapeHTML(alt)}">`;
  }

  function bindImageFallbacks(scope = document) {
    $$('img[data-fallback]', scope).forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = 'true';
      img.onerror = () => {
        if (!img.src.includes(img.dataset.fallback)) img.src = img.dataset.fallback;
      };
    });
  }

  function episodeProgressMarkup(episode) {
    const progress = window.PlayerService.getEpisodeProgress(episode.id);
    const percent = progress && !progress.completed ? Math.max(0, Math.min(100, progress.percent || 0)) : 0;
    return `<div class="card-progress js-card-progress" aria-label="${Math.round(percent)}% ouvido"><i style="width:${percent}%"></i></div>`;
  }

  function paintRange(element, ratio, fill = 'var(--episode-accent, var(--wine-light))') {
    if (!element) return;
    const percent = Math.max(0, Math.min(100, Number(ratio || 0) * 100));
    element.style.background = `linear-gradient(90deg, ${fill} 0 ${percent}%, rgba(255,255,255,.13) ${percent}% 100%)`;
  }

  function equalizerMarkup() {
    return `<span class="mini-equalizer" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
  }

  function episodeCard(episode, options = {}) {
    const favorite = window.FavoritesService.has(episode.id);
    const track = episode.audios[0];
    const unavailable = !track.available;
    const compact = Boolean(options.compact);
    return `
      <article class="episode-card ${compact ? 'episode-card--compact' : ''}" data-episode-card="${episode.id}" data-open-episode="${episode.id}" tabindex="0" style="--episode-accent:${episode.color};--episode-soft:${episode.accentSoft}" aria-label="Abrir episódio ${escapeHTML(episode.title)}">
        <div class="episode-card__visual">
          ${imageMarkup(episode.image, episode.fallbackImage, `Capa de ${episode.title}`)}
          <div class="episode-card__scrim"></div>
          <span class="episode-card__number">${episode.number}</span>
          <span class="episode-card__playing">${equalizerMarkup()} <em>Reproduzindo</em></span>
          <button class="play-fab js-card-play" data-episode="${episode.id}" data-audio="${track.id}" ${unavailable ? 'aria-disabled="true"' : ''} type="button" aria-label="${unavailable ? 'Áudio ainda não disponível' : `Reproduzir ${escapeHTML(episode.title)}`}" data-tooltip="${unavailable ? 'Áudio ainda não disponível' : 'Reproduzir'}">
            <span class="js-play-symbol">▶</span>
          </button>
          ${episodeProgressMarkup(episode)}
        </div>
        <div class="episode-card__body">
          <div class="episode-card__topline">
            <span>EPISÓDIO ${episode.number}</span>
            <button class="heart-button js-favorite" type="button" data-episode="${episode.id}" aria-label="${favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
          </div>
          <p class="episode-card__philosopher">${escapeHTML(episode.philosopher)}</p>
          <h3>${escapeHTML(episode.title)}</h3>
          ${compact ? '' : `<p class="episode-card__description">${escapeHTML(episode.description)}</p>`}
          <div class="episode-card__footer">
            <span>${escapeHTML(episode.durationLabel)}</span>
            <span class="availability-dot ${unavailable ? '' : 'is-ready'}"><i></i>${unavailable ? 'Em produção' : 'Disponível'}</span>
          </div>
        </div>
      </article>`;
  }

  function renderHome() {
    const root = $('#home-content');
    root.innerHTML = `
      <section class="hero" data-reveal>
        <div class="hero__ambient hero__ambient--one" aria-hidden="true"></div>
        <div class="hero__ambient hero__ambient--two" aria-hidden="true"></div>
        <div class="hero__content">
          <span class="overline">PLATAFORMA DE FILOSOFIA POLÍTICA</span>
          <h1>A POLÍTICA<br><em>DOS HOMENS</em></h1>
          <p class="hero__tagline">${escapeHTML(site.tagline)}</p>
          <p class="hero__description">${escapeHTML(site.description)}</p>
          <div class="hero__actions">
            <button class="button button--primary button--large" type="button" data-nav="podcasts">Explorar episódios <span>→</span></button>
            <button class="button button--ghost button--large" type="button" data-nav="assignment">Conhecer o trabalho</button>
          </div>
          <div class="hero__meta">
            <span><strong>05</strong> episódios iniciais</span>
            <span><strong>05</strong> pensadores</span>
            <span><strong>01</strong> arquivo digital</span>
          </div>
        </div>
        <div class="hero__art" aria-label="Capa principal do projeto">
          <div class="hero-cover-frame">
            ${imageMarkup(site.cover, site.coverFallback, 'Capa de A Política dos Homens', 'hero-cover')}
            <div class="hero-cover-frame__shine"></div>
          </div>
          <div class="hero__quote" aria-hidden="true"><span>IDEIAS</span><span>DEBATE</span><span>PODER</span></div>
        </div>
      </section>

      <section class="home-strip" data-reveal aria-label="Resumo do projeto">
        <div><span>Formato</span><strong>Programa de rádio</strong></div>
        <div><span>Duração</span><strong>12–18 min</strong></div>
        <div><span>Produção</span><strong>Estudantes</strong></div>
        <div><span>Experiência</span><strong>Streaming editorial</strong></div>
      </section>

      <section class="section-block" data-reveal>
        <div class="section-heading">
          <div><span class="eyebrow">POR QUE UM SITE?</span><h2>Do trabalho escolar ao arquivo vivo</h2></div>
          <p>A plataforma organiza os episódios, aproxima cada pensador do público e preserva a produção das equipes em um único lugar.</p>
        </div>
        <div class="feature-grid">
          <article class="feature-card"><span class="feature-card__index">01</span><h3>Centralizar</h3><p>Áudios, roteiros, equipes e materiais reunidos em uma única experiência.</p></article>
          <article class="feature-card"><span class="feature-card__index">02</span><h3>Contextualizar</h3><p>Cada episódio ganha contexto histórico, conceitos e uma apresentação visual própria.</p></article>
          <article class="feature-card"><span class="feature-card__index">03</span><h3>Preservar</h3><p>Os trabalhos deixam de ser arquivos soltos e passam a integrar uma biblioteca digital.</p></article>
          <article class="feature-card feature-card--accent"><span class="feature-card__index">04</span><h3>Ouvir melhor</h3><p>Player único, progresso salvo e interface pensada para navegação contínua.</p></article>
        </div>
      </section>

      <section class="section-block" data-reveal>
        <div class="section-heading">
          <div><span class="eyebrow">EM DESTAQUE</span><h2>Cinco vozes, cinco problemas políticos</h2></div>
          <button class="button button--text" type="button" data-nav="podcasts">Ver todos →</button>
        </div>
        <div class="episode-grid episode-grid--featured">${episodes.map((episode) => episodeCard(episode, { compact: true })).join('')}</div>
      </section>

      <section class="editorial-callout" data-reveal>
        <div class="editorial-callout__number">30</div>
        <div><span class="eyebrow">O PROJETO</span><h2>Uma produção que exige conteúdo, roteiro, reflexão e linguagem de rádio.</h2><p>O manual do professor define cinco blocos obrigatórios e critérios de avaliação que somam 30 pontos.</p></div>
        <button class="button button--outline" type="button" data-nav="assignment">Abrir manual</button>
      </section>
    `;
  }

  function renderPodcastFilters() {
    const philosopherOptions = episodes.map((episode) => `<option value="${episode.id}">${escapeHTML(episode.philosopher)}</option>`).join('');
    const themes = [...new Set(episodes.flatMap((episode) => episode.themes))].sort();
    const concepts = [...new Set(episodes.flatMap((episode) => episode.concepts))].sort();
    $('#podcast-filters').innerHTML = `
      <label class="filter-field"><span>Pensador</span><select id="filter-philosopher"><option value="">Todos</option>${philosopherOptions}</select></label>
      <label class="filter-field"><span>Tema</span><select id="filter-theme"><option value="">Todos</option>${themes.map((item) => `<option>${escapeHTML(item)}</option>`).join('')}</select></label>
      <label class="filter-field"><span>Conceito</span><select id="filter-concept"><option value="">Todos</option>${concepts.map((item) => `<option>${escapeHTML(item)}</option>`).join('')}</select></label>
      <button class="button button--ghost button--small" id="clear-filters" type="button">Limpar filtros</button>`;
  }

  function renderPodcastGrid(filtered = episodes) {
    const grid = $('#podcast-grid');
    grid.innerHTML = filtered.length
      ? filtered.map((episode) => episodeCard(episode)).join('')
      : `<div class="empty-state"><span class="empty-state__icon">⌕</span><h3>Nenhum episódio encontrado</h3><p>Tente remover um filtro ou escolher outro conceito.</p></div>`;
    bindImageFallbacks(grid);
    window.AnimationService.observeDynamic(grid);
  }

  function renderPodcasts() {
    renderPodcastFilters();
    renderPodcastGrid();
  }

  function thinkerCard(episode) {
    return `
      <article class="thinker-card" data-thinker-card="${episode.id}" data-open-episode="${episode.id}" tabindex="0" style="--episode-accent:${episode.color}" data-reveal>
        <div class="thinker-card__portrait">${imageMarkup(episode.philosopherImage, episode.fallbackImage, `Retrato de ${episode.philosopher}`)}</div>
        <div class="thinker-card__content">
          <span class="eyebrow">${escapeHTML(episode.period)} · ${escapeHTML(episode.region)}</span>
          <h3>${escapeHTML(episode.philosopher)}</h3>
          <p>${escapeHTML(episode.biography)}</p>
          <div class="tag-cloud tag-cloud--small">${episode.concepts.slice(0, 4).map((item) => `<span>${escapeHTML(item)}</span>`).join('')}</div>
          <div class="thinker-card__episode"><span>EP. ${episode.number}</span><strong>${escapeHTML(episode.title)}</strong><i>→</i></div>
        </div>
      </article>`;
  }

  function renderThinkers() {
    $('#thinker-grid').innerHTML = episodes.map(thinkerCard).join('');
  }

  function renderFavorites() {
    const ids = window.FavoritesService.all();
    const selected = episodes.filter((episode) => ids.includes(episode.id));
    const root = $('#favorites-content');
    root.innerHTML = selected.length
      ? `<div class="episode-grid">${selected.map((episode) => episodeCard(episode)).join('')}</div>`
      : `<div class="empty-state"><span class="empty-state__icon">♡</span><h3>Sua biblioteca ainda está vazia</h3><p>Marque um episódio com o coração para encontrá-lo rapidamente aqui.</p><button class="button button--primary" type="button" data-nav="podcasts">Explorar episódios</button></div>`;
    bindImageFallbacks(root);
  }

  function continueCard(item) {
    const { episode, track } = item;
    const percent = Math.max(0, Math.min(100, item.percent || 0));
    return `
      <article class="continue-card" style="--episode-accent:${episode.color}" data-open-episode="${episode.id}" tabindex="0">
        <div class="continue-card__image">${imageMarkup(episode.image, episode.fallbackImage, `Capa de ${episode.title}`)}</div>
        <div class="continue-card__content"><span class="eyebrow">CONTINUAR · ${escapeHTML(track.label)}</span><h3>${escapeHTML(episode.title)}</h3><p>${escapeHTML(episode.philosopher)}</p><div class="continue-progress"><i style="width:${percent}%"></i></div><small>${Math.round(percent)}% ouvido · ${window.PlayerService.formatTime(item.time)}</small></div>
        <button class="play-fab js-card-play" type="button" data-episode="${episode.id}" data-audio="${track.id}" aria-label="Continuar episódio"><span class="js-play-symbol">▶</span></button>
      </article>`;
  }

  function renderContinue() {
    const items = window.PlayerService.getContinueListening();
    const root = $('#continue-content');
    root.innerHTML = items.length
      ? `<div class="continue-grid">${items.map(continueCard).join('')}</div>`
      : `<div class="empty-state"><span class="empty-state__icon">◷</span><h3>Nada pela metade</h3><p>Quando você começar a ouvir um episódio disponível, seu progresso aparecerá aqui.</p><button class="button button--primary" type="button" data-nav="podcasts">Escolher episódio</button></div>`;
    bindImageFallbacks(root);
  }

  function renderAbout() {
    $('#about-content').innerHTML = `
      <div class="about-intro" data-reveal>
        <span class="overline">A POLÍTICA DOS HOMENS</span>
        <h2>Um lugar para escutar ideias que ainda organizam nossos conflitos.</h2>
        <p>Esta plataforma foi criada para reunir podcasts de Filosofia Política produzidos por estudantes. Em vez de deixar cada trabalho isolado em um arquivo, o projeto transforma a produção da turma em uma experiência de streaming, leitura e consulta.</p>
      </div>
      <div class="about-grid" data-reveal>
        <article><span>01</span><h3>Filosofia</h3><p>Os episódios partem de problemas, conceitos e pensadores estudados na disciplina.</p></article>
        <article><span>02</span><h3>Rádio</h3><p>A linguagem do projeto combina entrevista, narrativa, participação do público e produção sonora.</p></article>
        <article><span>03</span><h3>Arquivo</h3><p>Roteiros, grupos, capas e episódios ficam organizados como parte de uma biblioteca digital.</p></article>
      </div>
      <blockquote class="manifesto" data-reveal><p>“Um espaço dedicado às ideias que ajudaram a moldar nossa maneira de pensar a política, a sociedade, o poder e a liberdade.”</p><footer>A Política dos Homens · Ideias que atravessaram os séculos.</footer></blockquote>`;
  }

  function renderAssignment() {
    const root = $('#assignment-content');
    root.innerHTML = `
      <section class="assignment-hero" data-reveal>
        <div><span class="eyebrow">MATERIAL DO PROFESSOR</span><h2>O trabalho</h2><p>O desafio é criar um programa de rádio fictício em áudio, com entrevista a um pensador da Filosofia Política, estrutura de rádio e participação ativa dos integrantes.</p></div>
        <div class="assignment-score"><strong>${assignment.totalPoints}</strong><span>pontos</span></div>
      </section>
      <section class="assignment-metrics" data-reveal>
        <article><span>DURAÇÃO</span><strong>${assignment.duration}</strong></article>
        <article><span>FORMATO</span><strong>Programa de rádio</strong></article>
        <article><span>ESTRUTURA</span><strong>5 blocos</strong></article>
        <article><span>GRUPOS</span><strong>6 ou 7 pessoas</strong></article>
      </section>
      <section class="section-block" data-reveal>
        <div class="section-heading section-heading--compact"><div><span class="eyebrow">ESTRUTURA OBRIGATÓRIA</span><h2>Os cinco blocos</h2></div></div>
        <div class="block-timeline">${assignment.blocks.map((block) => `<article><span>${block.number}</span><div><h3>${escapeHTML(block.name)}</h3><p>${escapeHTML(block.detail)}</p></div><strong>${escapeHTML(block.time)}</strong></article>`).join('')}</div>
      </section>
      <section class="assignment-split" data-reveal>
        <div class="assignment-panel"><span class="eyebrow">PAPÉIS</span><h3>Produção em equipe</h3><ul class="clean-list clean-list--divided">${assignment.roles.map((role) => `<li>${escapeHTML(role)}</li>`).join('')}</ul></div>
        <div class="assignment-panel"><span class="eyebrow">AVALIAÇÃO</span><h3>Distribuição dos 30 pontos</h3><div class="criteria-list">${assignment.criteria.map((criterion) => `<div><span>${escapeHTML(criterion.label)}</span><strong>${criterion.points} pts</strong></div>`).join('')}</div></div>
      </section>
      <section class="manual-viewer" data-reveal>
        <div class="manual-viewer__header"><div><span class="eyebrow">DOCUMENTO COMPLETO</span><h2>${escapeHTML(assignment.title)}</h2></div><a class="button button--primary" href="${escapeHTML(assignment.file)}" target="_blank" rel="noopener">Abrir PDF ↗</a></div>
        <object data="${escapeHTML(assignment.file)}" type="application/pdf" class="manual-frame"><p>Seu navegador não conseguiu exibir o PDF aqui. <a href="${escapeHTML(assignment.file)}" target="_blank" rel="noopener">Abra o manual em uma nova guia.</a></p></object>
      </section>`;
  }

function teamCard(episode) {
  return `
    <article class="team-card" style="--episode-accent:${episode.color}" data-reveal>
      <div class="team-card__header">
        <div>
          <span>GRUPO ${episode.group}</span>
          <h3>${escapeHTML(episode.philosopher)}</h3>
          <p>${escapeHTML(episode.title)}</p>
        </div>

        <strong>${episode.number}</strong>
      </div>

      <ol>
        ${episode.members.map((member) => `
          <li>
            <span>${escapeHTML(member.name)}</span>
            <small>
              ${member.role
                ? escapeHTML(member.role)
                : 'Função a definir'}
            </small>
          </li>
        `).join('')}
      </ol>

      <button
        class="button button--text"
        type="button"
        data-open-episode="${episode.id}">
        Ver episódio →
      </button>
    </article>`;
}

  function renderTeams() {
    $('#teams-content').innerHTML = `
      <div class="teams-intro" data-reveal><div><span class="eyebrow">ORGANIZAÇÃO</span><h2>Equipes e temas</h2><p>Conheça as equipes responsáveis por cada episódio e as funções desempenhadas por seus integrantes na produção dos podcasts.</p></div><a class="button button--ghost" href="imagens/equipes/quadro-organizacao-podcasts.png" target="_blank" rel="noopener">Ver quadro original ↗</a></div>
      <div class="team-grid">${episodes.map(teamCard).join('')}</div>
      <figure class="source-board" data-reveal><img src="imagens/equipes/quadro-organizacao-podcasts.png" alt="Quadro de organização dos podcasts de Filosofia com grupos, temas e integrantes"><figcaption>Quadro original fornecido para a organização das equipes.</figcaption></figure>`;
  }

  function renderSearchResults(query) {
    const box = $('#search-results');
    const results = window.SearchService.searchEpisodes(episodes, query);
    if (!query.trim()) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    box.innerHTML = results.length ? `
      <div class="search-results__header"><span>Resultados</span><small>${results.length} encontrado${results.length > 1 ? 's' : ''}</small></div>
      ${results.map((episode) => `<button class="search-result" type="button" data-open-episode="${episode.id}"><span class="search-result__index">${episode.number}</span><span><strong>${escapeHTML(episode.philosopher)}</strong><small>${escapeHTML(episode.title)}</small></span><i>→</i></button>`).join('')}` : `<div class="search-empty"><strong>Nada por aqui.</strong><span>Tente outro filósofo, tema ou conceito.</span></div>`;
  }

  function showToast(message, type = 'default') {
    const region = $('#toast-region');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 240);
    }, 2800);
  }

  function syncEpisodeCards() {
    const state = window.PlayerService.getState();
    $$('[data-episode-card]').forEach((card) => {
      const episodeId = card.dataset.episodeCard;
      const playing = state.current?.episode.id === episodeId && state.isPlaying;
      card.classList.toggle('is-playing', playing);
      const button = $('.js-card-play', card);
      const symbol = button?.querySelector('.js-play-symbol');
      const sameTrack = state.current?.track.id === button?.dataset.audio;
      if (symbol) symbol.textContent = playing && sameTrack ? '❚❚' : '▶';
      const progressBar = card.querySelector('.js-card-progress i');
      const saved = window.PlayerService.getEpisodeProgress(episodeId);
      const percent = state.current?.episode.id === episodeId && state.duration > 0
        ? state.progress * 100
        : (saved && !saved.completed ? saved.percent || 0 : 0);
      if (progressBar) progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    });

    $$('.js-favorite').forEach((button) => {
      const active = window.FavoritesService.has(button.dataset.episode);
      button.textContent = active ? '♥' : '♡';
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    });
  }

  function syncGlobalPlayer() {
    const state = window.PlayerService.getState();
    const player = $('#global-player');
    if (!state.current) {
      player.classList.remove('is-visible');
      player.setAttribute('aria-hidden', 'true');
      return;
    }

    const { episode, track } = state.current;
    player.classList.add('is-visible');
    player.classList.toggle('is-playing', state.isPlaying);
    player.classList.toggle('is-loading', state.loading);
    player.setAttribute('aria-hidden', 'false');
    player.style.setProperty('--episode-accent', episode.color);

    const img = $('#global-player-image');
    img.src = episode.image;
    img.dataset.fallback = episode.fallbackImage;
    img.alt = `Capa de ${episode.title}`;
    $('#global-player-philosopher').textContent = `${episode.philosopher} · ${track.label}`;
    $('#global-player-title').textContent = episode.title;
    $('#global-player-current').textContent = state.formattedCurrent;
    $('#global-player-duration').textContent = state.formattedDuration;
    $('#global-progress').value = String(Math.round(state.progress * 1000));
    $('#global-volume').value = String(state.volume);
    paintRange($('#global-progress'), state.progress);
    paintRange($('#global-volume'), state.muted ? 0 : state.volume, 'var(--ivory)');
    $('#global-play-symbol').textContent = state.isPlaying ? '❚❚' : '▶';
    $('#global-play').setAttribute('aria-label', state.isPlaying ? 'Pausar' : 'Reproduzir');
    $('#global-volume-symbol').textContent = state.muted || state.volume === 0 ? '×)' : state.volume < 0.45 ? '◖)' : '◖))';
    bindImageFallbacks(player);
  }

  function updateFilters() {
    const filtered = window.FilterService.apply(episodes, {
      philosopher: $('#filter-philosopher')?.value || '',
      theme: $('#filter-theme')?.value || '',
      concept: $('#filter-concept')?.value || ''
    });
    renderPodcastGrid(filtered);
  }

  function handlePlayButton(button) {
    if (button.getAttribute('aria-disabled') === 'true') {
      showToast('Este episódio ainda não possui áudio disponível.', 'info');
      return;
    }
    const state = window.PlayerService.getState();
    if (state.current?.track.id === button.dataset.audio) window.PlayerService.toggle();
    else window.PlayerService.playTrack(button.dataset.episode, button.dataset.audio);
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const favorite = event.target.closest('.js-favorite');
      if (favorite) {
        event.preventDefault();
        event.stopPropagation();
        const active = window.FavoritesService.toggle(favorite.dataset.episode);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && favorite.animate) {
          favorite.animate([{ transform: 'scale(.82)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.2,.9,.24,1.2)' });
        }
        showToast(active ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
        return;
      }

      const play = event.target.closest('.js-card-play');
      if (play) {
        event.preventDefault();
        event.stopPropagation();
        handlePlayButton(play);
        return;
      }

      const directOpen = event.target.closest('button[data-open-episode], a[data-open-episode]');
      if (directOpen) {
        event.preventDefault();
        window.ModalService.openEpisode(directOpen.dataset.openEpisode);
        return;
      }

      const openEpisode = event.target.closest('[data-open-episode]');
      if (openEpisode) {
        if (event.target.closest('a, button, input, select')) return;
        window.ModalService.openEpisode(openEpisode.dataset.openEpisode);
        return;
      }

      if (event.target.closest('#menu-toggle')) {
        document.body.classList.toggle('sidebar-open');
        return;
      }
      if (event.target.closest('#mobile-search-toggle')) {
        document.body.classList.toggle('mobile-search-open');
        if (document.body.classList.contains('mobile-search-open')) setTimeout(() => $('#global-search').focus(), 30);
        return;
      }
      if (event.target.closest('#sidebar-scrim')) {
        document.body.classList.remove('sidebar-open');
        return;
      }

      if (event.target.closest('#clear-filters')) {
        ['filter-philosopher', 'filter-theme', 'filter-concept'].forEach((id) => { const el = document.getElementById(id); if (el) el.value = ''; });
        updateFilters();
        return;
      }

      if (event.target.closest('#global-play')) window.PlayerService.toggle();
      if (event.target.closest('#global-back')) window.PlayerService.seekBy(-10);
      if (event.target.closest('#global-forward')) window.PlayerService.seekBy(10);
      if (event.target.closest('#global-mute')) window.PlayerService.toggleMute();
      if (event.target.closest('#global-open') && window.PlayerService.getState().current) window.ModalService.openEpisode(window.PlayerService.getState().current.episode.id);
    });

    document.addEventListener('keydown', (event) => {
      const card = event.target.closest('[data-open-episode]');
      if (card && (event.key === 'Enter' || event.key === ' ') && !event.target.closest('button, a, input, select')) {
        event.preventDefault();
        window.ModalService.openEpisode(card.dataset.openEpisode);
        return;
      }

      const editable = event.target.matches('input, textarea, select, [contenteditable="true"]');
      const modalOpen = !$('#episode-modal').hidden;
      if (editable || modalOpen) return;
      if (event.key === '/') {
        event.preventDefault();
        document.body.classList.add('mobile-search-open');
        $('#global-search').focus();
        return;
      }
      const state = window.PlayerService.getState();
      if (!state.current) return;
      if (event.code === 'Space') { event.preventDefault(); window.PlayerService.toggle(); }
      else if (event.key === 'ArrowLeft') window.PlayerService.seekBy(-10);
      else if (event.key === 'ArrowRight') window.PlayerService.seekBy(10);
      else if (event.key.toLowerCase() === 'm') window.PlayerService.toggleMute();
    });

    $('#global-progress').addEventListener('input', (event) => {
      const state = window.PlayerService.getState();
      if (state.duration > 0) window.PlayerService.seekTo((Number(event.target.value) / 1000) * state.duration);
    });
    $('#global-volume').addEventListener('input', (event) => window.PlayerService.setVolume(event.target.value));

    $('#global-search').addEventListener('input', (event) => renderSearchResults(event.target.value));
    $('#global-search').addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.target.value = '';
        renderSearchResults('');
        event.target.blur();
        document.body.classList.remove('mobile-search-open');
      } else if (event.key === 'Enter') {
        const first = $('#search-results [data-open-episode]');
        if (first) {
          event.preventDefault();
          window.ModalService.openEpisode(first.dataset.openEpisode);
          $('#search-results').hidden = true;
        }
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.search-shell')) $('#search-results').hidden = true;
    });

    document.addEventListener('change', (event) => {
      if (event.target.matches('#filter-philosopher, #filter-theme, #filter-concept')) updateFilters();
    });

    document.addEventListener('favorites:changed', () => {
      renderFavorites();
      syncEpisodeCards();
    });

    document.addEventListener('player:unavailable', (event) => showToast(event.detail.message || 'Áudio ainda não disponível.', 'info'));
    document.addEventListener('player:error', (event) => showToast(event.detail.message || 'Não foi possível reproduzir o áudio.', 'error'));
    document.addEventListener('ui:toast', (event) => showToast(event.detail.message || 'Pronto.'));

    ['player:state', 'player:progress', 'player:volume', 'player:trackchanged'].forEach((name) => {
      document.addEventListener(name, () => {
        syncGlobalPlayer();
        syncEpisodeCards();
        if (name === 'player:state' || name === 'player:trackchanged') renderContinue();
      });
    });

    document.addEventListener('player:seekfeedback', (event) => {
      const feedback = $('#global-seek-feedback');
      feedback.textContent = event.detail.delta > 0 ? '+10s' : '-10s';
      feedback.classList.remove('is-visible');
      void feedback.offsetWidth;
      feedback.classList.add('is-visible');
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) document.body.classList.remove('sidebar-open');
    });
  }

  function init() {
    renderHome();
    renderPodcasts();
    renderThinkers();
    renderFavorites();
    renderContinue();
    renderAbout();
    renderAssignment();
    renderTeams();

    bindImageFallbacks();
    window.NavigationService.init();
    window.ModalService.init();
    window.AnimationService.initReveal();
    window.AnimationService.initPointerGlow();
    bindEvents();
    syncGlobalPlayer();
    syncEpisodeCards();

    document.documentElement.classList.add('app-ready');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
