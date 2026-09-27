(function () {
  'use strict';

  const PREFIX = 'aph.v2.';

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn('[storage] Não foi possível ler', key, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('[storage] Não foi possível salvar', key, error);
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      console.warn('[storage] Não foi possível remover', key, error);
    }
  }

  window.StorageService = { read, write, remove, PREFIX };
})();
