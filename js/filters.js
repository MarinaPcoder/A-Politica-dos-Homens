(function () {
  'use strict';

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function apply(episodes, filters) {
    const philosopher = normalize(filters.philosopher);
    const theme = normalize(filters.theme);
    const concept = normalize(filters.concept);

    return episodes.filter((episode) => {
      const philosopherMatch = !philosopher || normalize(episode.id) === philosopher || normalize(episode.philosopher) === philosopher;
      const themeMatch = !theme || episode.themes.some((item) => normalize(item) === theme);
      const conceptMatch = !concept || episode.concepts.some((item) => normalize(item) === concept);
      return philosopherMatch && themeMatch && conceptMatch;
    });
  }

  window.FilterService = { apply, normalize };
})();
