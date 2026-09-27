(function () {
  'use strict';

  const normalize = window.FilterService.normalize;

  function searchEpisodes(episodes, query) {
    const q = normalize(query);
    if (!q) return [];

    return episodes
      .map((episode) => {
        const haystack = [
          episode.philosopher,
          episode.shortName,
          episode.title,
          episode.description,
          episode.longDescription,
          episode.historicalContext,
          ...episode.themes,
          ...episode.concepts,
          ...episode.works
        ].map(normalize);

        let score = 0;
        haystack.forEach((entry, index) => {
          if (entry === q) score += index < 3 ? 8 : 5;
          else if (entry.startsWith(q)) score += index < 3 ? 5 : 3;
          else if (entry.includes(q)) score += 2;
        });
        return { episode, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.episode);
  }

  window.SearchService = { searchEpisodes };
})();
