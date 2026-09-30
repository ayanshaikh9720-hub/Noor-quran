import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Smartphone, Check, ArrowLeft, Settings2 } from 'lucide-react';
import { getStoredTasbeeh, saveStoredTasbeeh, TasbeehData } from '../services/storage';

interface TasbeehScreenProps {
  onBack?: () => void;
}

const PRESET_DHIKRS = [
  { arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah' },
  { arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', meaning: 'Praise be to Allah' },
  { arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest' },
  { arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah' },
  { arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', meaning: 'There is no deity but Allah' },
  { arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', transliteration: 'Allahumma Salli Ala Muhammad', meaning: 'Peace and blessings upon the Prophet' }
];

export const TasbeehScreen: React.FC<TasbeehScreenProps> = ({ onBack }) => {
  const [data, setData] = useState<TasbeehData>(getStoredTasbeeh);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState('');
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    saveStoredTasbeeh(data);
  }, [data]);

  const currentDhikr = PRESET_DHIKRS[data.selectedDhikrIndex] || PRESET_DHIKRS[0];

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = data.count + 1;
    const isTargetHit = nextCount === data.target;

    // Vibration feedback
    if (vibrateEnabled && navigator.vibrate) {
      if (isTargetHit) {
        navigator.vibrate([80, 50, 80]); // Double buzz on completion
      } else {
        navigator.vibrate(25); // Subtle tap buzz
      }
    }

    playClickSound();

    setData((prev) => ({
      ...prev,
      count: nextCount,
      totalToday: prev.totalToday + 1
    }));
  };

  const handleReset = () => {
    if (data.count === 0) return;
    if (window.confirm('Reset current count to 0?')) {
      setData((prev) => ({ ...prev, count: 0 }));
    }
  };

  const handleSelectTarget = (target: number) => {
    setData((prev) => ({ ...prev, target }));
  };

  const handleCustomTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customTargetInput, 10);
    if (!isNaN(val) && val > 0) {
      setData((prev) => ({ ...prev, target: val }));
      setShowCustomModal(false);
      setCustomTargetInput('');
    }
  };

  const progressPercent = Math.min(100, (data.count / data.target) * 100);

  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Digital Tasbeeh
            </h2>
            <p className="text-xs text-slate-500">
              Today's Dhikr: <span className="font-mono font-semibold text-emerald-600">{data.totalToday}</span>
            </p>
          </div>
        </div>

        {/* Vibration & Sound toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl transition-colors ${
              vibrateEnabled ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60' : 'text-slate-400'
            }`}
            title={vibrateEnabled ? 'Vibration On' : 'Vibration Off'}
            aria-label="Toggle Vibration"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl transition-colors ${
              soundEnabled ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60' : 'text-slate-400'
            }`}
            title={soundEnabled ? 'Click Sound On' : 'Click Sound Off'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dhikr Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PRESET_DHIKRS.map((d, idx) => (
          <button
            key={d.transliteration}
            onClick={() => setData((prev) => ({ ...prev, selectedDhikrIndex: idx }))}
            className={`px-3 py-1.5 rounded-2xl whitespace-nowrap text-xs transition-all ${
              data.selectedDhikrIndex === idx
                ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {d.transliteration}
          </button>
        ))}
      </div>

      {/* Main Counter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
        {/* Selected Dhikr Display */}
        <div className="space-y-1">
          <div className="font-arabic text-3xl text-emerald-900 dark:text-emerald-300 font-bold">
            {currentDhikr.arabic}
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {currentDhikr.transliteration}
          </div>
          <div className="text-xs text-slate-500">
            {currentDhikr.meaning}
          </div>
        </div>

        {/* Circular Progress & Big Tap Button */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-emerald-600 transition-all duration-150"
              strokeWidth="6"
              strokeDasharray={276.4}
              strokeDashoffset={276.4 - (276.4 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Touch Trigger Area */}
          <button
            onClick={handleTap}
            className={`absolute inset-4 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center select-none ${
              isPressing ? 'scale-95 shadow-inner' : 'scale-100'
            }`}
            aria-label="Tap Tasbeeh Counter"
          >
            <span className="font-mono text-5xl font-bold tabular-nums tracking-tight">
              {data.count}
            </span>
            <span className="text-xs text-emerald-100 font-medium mt-1">
              Target: {data.target}
            </span>
            <span className="text-[10px] text-emerald-200/80 uppercase tracking-widest mt-0.5">
              Tap Anywhere
            </span>
          </button>
        </div>

        {/* Bottom Controls: Target selector & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Target presets */}
          <div className="flex items-center gap-1.5">
            {[33, 99, 100].map((t) => (
              <button
                key={t}
                onClick={() => handleSelectTarget(t)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                  data.target === t
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}

            <button
              onClick={() => setShowCustomModal(true)}
              className={`px-2 py-1 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200`}
              title="Custom Target"
            >
              Custom
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset counter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Modal: Custom Target */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-xs w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Set Custom Target
            </h3>
            <form onSubmit={handleCustomTargetSubmit} className="space-y-3">
              <input
                type="number"
                min="1"
                max="10000"
                value={customTargetInput}
                onChange={(e) => setCustomTargetInput(e.target.value)}
                placeholder="e.g. 500"
                autoFocus
                className="w-full px-4 py-2 text-center text-lg font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl"
                >
                  Set Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
