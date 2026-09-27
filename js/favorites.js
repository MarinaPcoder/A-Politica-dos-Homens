(function () {
  'use strict';

  const KEY = 'favorites';
  let favorites = new Set(window.StorageService.read(KEY, []));

  function save() {
    window.StorageService.write(KEY, Array.from(favorites));
  }

  function has(episodeId) {
    return favorites.has(episodeId);
  }

  function toggle(episodeId) {
    if (favorites.has(episodeId)) favorites.delete(episodeId);
    else favorites.add(episodeId);
    save();
    document.dispatchEvent(new CustomEvent('favorites:changed', { detail: { episodeId, active: has(episodeId) } }));
    return has(episodeId);
  }

  function all() {
    return Array.from(favorites);
  }

  window.FavoritesService = { has, toggle, all };
})();
