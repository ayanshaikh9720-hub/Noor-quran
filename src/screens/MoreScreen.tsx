import React from 'react';
import { Heart, CircleDot, Settings, Info, Shield, ChevronRight, Moon, Sparkles, BookOpen, Compass, Clock, Calendar, Download, Smartphone } from 'lucide-react';

interface MoreScreenProps {
  onOpenDuas: () => void;
  onOpenTasbeeh: () => void;
  onOpenSettings: () => void;
  onOpenInstallModal: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  onOpenDuas,
  onOpenTasbeeh,
  onOpenSettings,
  onOpenInstallModal
}) => {
  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          More Features
        </h2>
        <p className="text-xs text-slate-500">
          Islamic tools, daily supplications, and app preferences
        </p>
      </div>

      {/* Primary Tools List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {/* Install on Mobile / APK */}
        <button
          onClick={onOpenInstallModal}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group bg-emerald-50/40 dark:bg-emerald-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300 group-hover:text-emerald-700 transition-colors">
                Install on Android / APK
              </div>
              <div className="text-xs text-slate-500">
                Install as a native Android WebAPK or generate standalone APK
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        </button>

        {/* Duas */}
        <button
          onClick={onOpenDuas}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Authentic Duas & Azkar
              </div>
              <div className="text-xs text-slate-500">
                Morning, Evening, Travel, Protection, Forgiveness & Rizq
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Tasbeeh */}
        <button
          onClick={onOpenTasbeeh}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CircleDot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Digital Tasbeeh Counter
              </div>
              <div className="text-xs text-slate-500">
                Custom targets, tactile tap counter & vibration feedback
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Settings & Typography
              </div>
              <div className="text-xs text-slate-500">
                Arabic text size, Hindi/English translations, dark mode
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Respectful Ad-Free & Ethics Notice */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-4 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-100">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Pure & Respectful Reading Experience</span>
        </div>
        <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
          Noor Quran is built to remain serene and respectful. Quranic verses and audio recitation will never be interrupted or covered by intrusive advertisements.
        </p>
      </div>

      {/* About Box */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Noor Quran</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Version 1.0.0 · Authentic Holy Quran reader with pure Uthmani script, Hindi & English translations, and audio recitation by Mishary Rashid Alafasy.
        </p>
      </div>
    </div>
  );
};
