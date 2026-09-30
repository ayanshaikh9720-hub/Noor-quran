import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, X, Volume2, AlertCircle } from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const AudioPlayerBar: React.FC<{ onOpenSurah?: (surahNumber: number, ayahNumber: number) => void }> = ({ onOpenSurah }) => {
  const {
    isPlaying,
    activeSurah,
    activeAyahIndex,
    currentAyah,
    duration,
    currentTime,
    repeatMode,
    audioError,
    togglePlayPause,
    nextAyah,
    prevAyah,
    seek,
    cycleRepeatMode,
    stopAudio
  } = useAudio();

  if (!activeSurah || !currentAyah) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2 max-w-lg mx-auto">
      <div className="bg-emerald-950/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-emerald-800/40 p-3 transition-all duration-200">
        {/* Error notification banner if audio failed */}
        {audioError && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-red-900/60 border border-red-700/50 rounded-lg text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate">{audioError}</span>
          </div>
        )}

        {/* Top Info Row */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onOpenSurah?.(activeSurah.number, currentAyah.numberInSurah)}
            className="flex items-center gap-2 text-left truncate group"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-300">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                {activeSurah.englishName} ({activeSurah.name})
              </div>
              <div className="text-[11px] text-emerald-300/80">
                Ayah {currentAyah.numberInSurah} of {activeSurah.numberOfAyahs} · Mishary Alafasy
              </div>
            </div>
          </button>

          <button
            onClick={stopAudio}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-900/50 transition-colors"
            title="Close Audio Player"
            aria-label="Close Audio Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Slider */}
        <div className="space-y-1 mb-2">
          <div className="relative flex items-center h-4 cursor-pointer group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Audio progress slider"
            />
            <div className="w-full h-1.5 bg-emerald-900/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-100 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-emerald-300/70 font-mono tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Repeat Mode */}
          <button
            onClick={cycleRepeatMode}
            className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-colors ${
              repeatMode !== 'none'
                ? 'text-emerald-300 bg-emerald-800/60'
                : 'text-slate-400 hover:text-emerald-200'
            }`}
            title={`Repeat mode: ${repeatMode === 'none' ? 'Off' : repeatMode === 'ayah' ? 'Repeat Ayah' : 'Repeat Surah'}`}
            aria-label="Repeat mode"
          >
            {repeatMode === 'ayah' ? (
              <Repeat1 className="w-4 h-4 text-amber-300" />
            ) : (
              <Repeat className={`w-4 h-4 ${repeatMode === 'surah' ? 'text-amber-300' : ''}`} />
            )}
          </button>

          {/* Core Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevAyah}
              disabled={activeAyahIndex <= 0}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Ayah"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={nextAyah}
              disabled={activeAyahIndex >= activeSurah.ayahs.length - 1}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Ayah"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Repeat mode text descriptor */}
          <div className="min-w-[40px] text-right">
            <span className="text-[10px] text-emerald-400/80 font-medium">
              {repeatMode === 'ayah' ? '1x Ayah' : repeatMode === 'surah' ? 'Surah' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
