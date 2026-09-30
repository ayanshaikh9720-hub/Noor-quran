import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Ayah, SurahDetail } from '../types/quran';

export type RepeatMode = 'none' | 'ayah' | 'surah';

interface AudioContextType {
  isPlaying: boolean;
  activeSurah: SurahDetail | null;
  activeAyahIndex: number;
  currentAyah: Ayah | null;
  duration: number;
  currentTime: number;
  repeatMode: RepeatMode;
  audioError: string | null;
  playSurah: (surah: SurahDetail, startAyahIndex?: number) => void;
  playAyah: (surah: SurahDetail, ayahIndex: number) => void;
  togglePlayPause: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seek: (seconds: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeatMode: () => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSurah, setActiveSurah] = useState<SurahDetail | null>(null);
  const [activeAyahIndex, setActiveAyahIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAttempted = useRef(false);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };

    const onError = () => {
      console.warn('Audio playback error on source:', audio.src);
      if (!fallbackAttempted.current && activeSurah && activeSurah.ayahs[activeAyahIndex]?.audioSecondary?.[0]) {
        fallbackAttempted.current = true;
        const fallbackSrc = activeSurah.ayahs[activeAyahIndex].audioSecondary![0];
        audio.src = fallbackSrc;
        audio.play().catch(e => {
          console.error('Fallback audio error:', e);
          setAudioError('Recitation audio could not be loaded. Please check your connection.');
          setIsPlaying(false);
        });
      } else {
        setAudioError('Recitation audio temporarily unavailable.');
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const currentAyah = activeSurah?.ayahs[activeAyahIndex] || null;

  // Handle Ayah ending based on repeatMode
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (!activeSurah) return;

      if (repeatMode === 'ayah') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (activeAyahIndex < activeSurah.ayahs.length - 1) {
        // Next Ayah in current Surah
        setActiveAyahIndex(prev => prev + 1);
      } else if (repeatMode === 'surah') {
        // Repeat Surah from beginning
        setActiveAyahIndex(0);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [activeSurah, activeAyahIndex, repeatMode]);

  // When activeAyahIndex or activeSurah changes, load the audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeSurah) return;

    const ayah = activeSurah.ayahs[activeAyahIndex];
    if (!ayah) return;

    const audioUrl = ayah.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
    fallbackAttempted.current = false;
    setAudioError(null);

    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Playback play() was prevented:', err);
      });
    }
  }, [activeSurah, activeAyahIndex]);

  const playSurah = useCallback((surah: SurahDetail, startAyahIndex = 0) => {
    setActiveSurah(surah);
    setActiveAyahIndex(startAyahIndex);
    setAudioError(null);
    setIsPlaying(true);

    const audio = audioRef.current;
    if (audio) {
      const ayah = surah.ayahs[startAyahIndex];
      const audioUrl = ayah?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah?.number}.mp3`;
      audio.src = audioUrl;
      audio.play().catch(e => {
        console.warn('Autoplay prevented or network error:', e);
      });
    }
  }, []);

  const playAyah = useCallback((surah: SurahDetail, ayahIndex: number) => {
    if (activeSurah?.number === surah.number && activeAyahIndex === ayahIndex && isPlaying) {
      // Toggle pause if clicking current playing Ayah
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      playSurah(surah, ayahIndex);
    }
  }, [activeSurah, activeAyahIndex, isPlaying, playSurah]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.warn('Error resuming audio:', err);
      });
    }
  }, [isPlaying]);

  const nextAyah = useCallback(() => {
    if (!activeSurah) return;
    if (activeAyahIndex < activeSurah.ayahs.length - 1) {
      setActiveAyahIndex(prev => prev + 1);
    }
  }, [activeSurah, activeAyahIndex]);

  const prevAyah = useCallback(() => {
    if (!activeSurah) return;
    if (activeAyahIndex > 0) {
      setActiveAyahIndex(prev => prev - 1);
    }
  }, [activeSurah, activeAyahIndex]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'ayah';
      if (prev === 'ayah') return 'surah';
      return 'none';
    });
  }, []);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveSurah(null);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        activeSurah,
        activeAyahIndex,
        currentAyah,
        duration,
        currentTime,
        repeatMode,
        audioError,
        playSurah,
        playAyah,
        togglePlayPause,
        nextAyah,
        prevAyah,
        seek,
        setRepeatMode,
        cycleRepeatMode,
        stopAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio(): AudioContextType {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
}
