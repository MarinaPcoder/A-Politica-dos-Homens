(function () {
  'use strict';

  const audio = new Audio();
  audio.preload = 'metadata';

  const episodes = window.APP_DATA.episodes;
  const PROGRESS_KEY = 'progress';
  const SETTINGS_KEY = 'playerSettings';
  const LAST_TRACK_KEY = 'lastTrack';

  let current = null;
  let loading = false;
  let lastPersist = 0;
  const savedSettings = window.StorageService.read(SETTINGS_KEY, { volume: 0.82, muted: false });
  audio.volume = Math.max(0, Math.min(1, Number(savedSettings.volume ?? 0.82)));
  audio.muted = Boolean(savedSettings.muted);

  function emit(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(name, { detail: { ...getState(), ...detail } }));
  }

  function findTrack(episodeId, audioId) {
    const episode = episodes.find((item) => item.id === episodeId);
    if (!episode) return null;
    const track = episode.audios.find((item) => item.id === audioId) || episode.audios[0];
    return track ? { episode, track } : null;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const total = Math.floor(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function getProgressMap() {
    return window.StorageService.read(PROGRESS_KEY, {});
  }

  function getSavedProgress(audioId) {
    return getProgressMap()[audioId] || null;
  }

  function saveProgress(force = false) {
    if (!current) return;
    const now = Date.now();
    if (!force && now - lastPersist < 2500) return;
    lastPersist = now;

    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const map = getProgressMap();
    map[current.track.id] = {
      episodeId: current.episode.id,
      audioId: current.track.id,
      time,
      duration,
      percent: duration > 0 ? Math.min(100, (time / duration) * 100) : 0,
      completed: duration > 0 && time >= duration - 3,
      updatedAt: Date.now()
    };
    window.StorageService.write(PROGRESS_KEY, map);
    window.StorageService.write(LAST_TRACK_KEY, { episodeId: current.episode.id, audioId: current.track.id });
  }

  function persistSettings() {
    window.StorageService.write(SETTINGS_KEY, { volume: audio.volume, muted: audio.muted });
  }

  async function playTrack(episodeId, audioId, options = {}) {
    const found = findTrack(episodeId, audioId);
    if (!found) {
      emit('player:error', { message: 'Episódio não encontrado.' });
      return false;
    }

    if (!found.track.available) {
      emit('player:unavailable', {
        episode: found.episode,
        track: found.track,
        message: 'Este episódio ainda não possui áudio disponível.'
      });
      return false;
    }

    const isSameTrack = current && current.track.id === found.track.id;
    if (!isSameTrack) {
      saveProgress(true);
      audio.pause();
      current = found;
      loading = true;
      audio.src = found.track.file;
      audio.load();
      emit('player:trackchanged', { episode: found.episode, track: found.track });
    }

    try {
      if (!isSameTrack || options.restart) {
        const saved = getSavedProgress(found.track.id);
        const resumeTime = options.restart ? 0 : Number(saved?.time || 0);
        if (resumeTime > 2) {
          const restore = () => {
            if (Number.isFinite(audio.duration) && resumeTime < audio.duration - 2) audio.currentTime = resumeTime;
            audio.removeEventListener('loadedmetadata', restore);
          };
          if (audio.readyState >= 1) restore();
          else audio.addEventListener('loadedmetadata', restore);
        }
      }
      await audio.play();
      loading = false;
      emit('player:state');
      return true;
    } catch (error) {
      loading = false;
      console.warn('[player] Falha ao reproduzir áudio:', error);
      emit('player:error', {
        episode: found.episode,
        track: found.track,
        message: 'Não foi possível carregar este áudio. Verifique se o arquivo MP3 está no caminho configurado.'
      });
      return false;
    }
  }

  function toggle() {
    if (!current) return false;
    if (audio.paused) {
      audio.play().catch(() => {
        emit('player:error', { message: 'Não foi possível retomar o áudio.' });
      });
    } else {
      audio.pause();
    }
    return true;
  }

  function pause() {
    audio.pause();
  }

  function seekTo(seconds) {
    if (!current || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, Number(seconds) || 0));
    emit('player:progress');
    saveProgress(true);
  }

  function seekBy(delta) {
    if (!current) return;
    const next = Math.max(0, Math.min(Number.isFinite(audio.duration) ? audio.duration : Infinity, audio.currentTime + delta));
    audio.currentTime = next;
    emit('player:seekfeedback', { delta });
    emit('player:progress');
    saveProgress(true);
  }

  function setVolume(value) {
    const next = Math.max(0, Math.min(1, Number(value)));
    audio.volume = Number.isFinite(next) ? next : 0.82;
    if (audio.volume > 0 && audio.muted) audio.muted = false;
    persistSettings();
    emit('player:volume');
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    persistSettings();
    emit('player:volume');
  }

  function getState() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    return {
      current,
      isPlaying: Boolean(current) && !audio.paused && !audio.ended,
      isPaused: audio.paused,
      loading,
      currentTime,
      duration,
      progress: duration > 0 ? currentTime / duration : 0,
      volume: audio.volume,
      muted: audio.muted,
      formattedCurrent: formatTime(currentTime),
      formattedDuration: duration > 0 ? formatTime(duration) : (current?.track.durationLabel || '--:--')
    };
  }

  function getContinueListening() {
    const map = getProgressMap();
    return Object.values(map)
      .filter((item) => item.time > 5 && !item.completed)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((item) => {
        const found = findTrack(item.episodeId, item.audioId);
        return found ? { ...item, ...found } : null;
      })
      .filter(Boolean);
  }

  function getEpisodeProgress(episodeId) {
    const map = getProgressMap();
    const values = Object.values(map).filter((item) => item.episodeId === episodeId);
    if (!values.length) return null;
    return values.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }

  function getLastTrack() {
    const saved = window.StorageService.read(LAST_TRACK_KEY, null);
    if (!saved) return null;
    return findTrack(saved.episodeId, saved.audioId);
  }

  audio.addEventListener('loadstart', () => {
    loading = true;
    emit('player:state');
  });

  audio.addEventListener('canplay', () => {
    loading = false;
    emit('player:state');
  });

  audio.addEventListener('playing', () => {
    loading = false;
    emit('player:state');
  });

  audio.addEventListener('pause', () => {
    saveProgress(true);
    emit('player:state');
  });

  audio.addEventListener('timeupdate', () => {
    saveProgress(false);
    emit('player:progress');
  });

  audio.addEventListener('durationchange', () => emit('player:progress'));
  audio.addEventListener('volumechange', () => emit('player:volume'));

  audio.addEventListener('ended', () => {
    saveProgress(true);
    emit('player:state');
  });

  audio.addEventListener('error', () => {
    loading = false;
    if (current) {
      current.track.available = false;
      emit('player:error', {
        message: 'O arquivo de áudio configurado não foi encontrado ou não pôde ser reproduzido.'
      });
    }
  });

  window.addEventListener('beforeunload', () => saveProgress(true));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveProgress(true);
  });

  window.PlayerService = {
    audio,
    playTrack,
    toggle,
    pause,
    seekTo,
    seekBy,
    setVolume,
    toggleMute,
    getState,
    getSavedProgress,
    getEpisodeProgress,
    getContinueListening,
    getLastTrack,
    formatTime
  };
})();
