import React, { useState } from 'react';
import { BookOpen, Bookmark, Search, Heart, CircleDot, ChevronRight, Play, Share2, Check, Sparkles, Download } from 'lucide-react';
import { DailyAyahItem, getDailyAyah } from '../data/dailyAyahs';
import { Bookmark as BookmarkType, ReadingHistory } from '../types/quran';
import { isAyahBookmarked, toggleBookmarkInStorage } from '../services/storage';
import { useAudio } from '../context/AudioContext';
import { fetchSurah } from '../services/quranApi';

interface HomeScreenProps {
  lastRead: ReadingHistory | null;
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab: (tab: 'home' | 'quran' | 'bookmarks' | 'more') => void;
  onOpenDuas: () => void;
  onOpenTasbeeh: () => void;
  onOpenSearch: () => void;
  onBookmarksUpdated: () => void;
  onOpenInstallModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lastRead,
  onOpenSurah,
  onNavigateTab,
  onOpenDuas,
  onOpenTasbeeh,
  onOpenSearch,
  onBookmarksUpdated,
  onOpenInstallModal
}) => {
  const dailyAyah: DailyAyahItem = getDailyAyah();
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [isDailyBookmarked, setIsDailyBookmarked] = useState(() =>
    isAyahBookmarked(dailyAyah.surahNumber, dailyAyah.ayahNumber)
  );
  const { playAyah } = useAudio();

  const handleToggleDailyBookmark = () => {
    const bookmark: BookmarkType = {
      id: `${dailyAyah.surahNumber}-${dailyAyah.ayahNumber}`,
      surahNumber: dailyAyah.surahNumber,
      surahName: dailyAyah.surahName,
      englishName: dailyAyah.surahEnglishName,
      ayahNumber: dailyAyah.ayahNumber,
      arabicText: dailyAyah.arabicText,
      translationText: dailyAyah.hindiTranslation,
      timestamp: Date.now()
    };
    const { isBookmarked } = toggleBookmarkInStorage(bookmark);
    setIsDailyBookmarked(isBookmarked);
    onBookmarksUpdated();
  };

  const handleShareDaily = async () => {
    const shareText = `Noor Quran - Today's Ayah\n\n${dailyAyah.arabicText}\n\n[Hindi]: ${dailyAyah.hindiTranslation}\n\n[English]: ${dailyAyah.englishTranslation}\n\n— Surah ${dailyAyah.surahEnglishName} (${dailyAyah.surahNumber}:${dailyAyah.ayahNumber})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Today's Ayah - Surah ${dailyAyah.surahEnglishName}`,
          text: shareText
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedDaily(true);
      setTimeout(() => setCopiedDaily(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handlePlayDaily = async () => {
    try {
      const surahData = await fetchSurah(dailyAyah.surahNumber);
      const ayahIndex = surahData.ayahs.findIndex(a => a.numberInSurah === dailyAyah.ayahNumber);
      if (ayahIndex !== -1) {
        playAyah(surahData, ayahIndex);
      }
    } catch (e) {
      console.error('Error playing daily ayah', e);
    }
  };

  const popularSurahs = [
    { number: 67, name: "Al-Mulk", arabic: "الملك", reason: "Protection from grave punishment" },
    { number: 36, name: "Yaseen", arabic: "يس", reason: "The Heart of the Quran" },
    { number: 18, name: "Al-Kahf", arabic: "الكهف", reason: "Friday Light & Protection" },
    { number: 55, name: "Ar-Rahmaan", arabic: "الرحمن", reason: "The Beneficent" },
    { number: 56, name: "Al-Waaqia", arabic: "الواقعة", reason: "Protection from poverty" },
    { number: 1, name: "Al-Faatiha", arabic: "الفاتحة", reason: "The Opening & Shifa" }
  ];

  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-5">
      {/* Respectful Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-lg shadow-emerald-950/20 relative overflow-hidden">
        {/* Subtle geometric background motif */}
        <div className="absolute right-0 top-0 bottom-0 w-44 opacity-10 pointer-events-none flex items-center justify-center font-arabic text-8xl select-none">
          ﷽
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
            <div className="flex items-center gap-1.5">
              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className="flex items-center gap-1 text-[11px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-full px-2.5 py-0.5 shadow-xs transition-colors active:scale-95"
                  title="Install Android App / APK"
                >
                  <Download className="w-3 h-3" />
                  <span>APK / App</span>
                </button>
              )}
              <span className="flex items-center gap-1 text-[11px] bg-emerald-700/60 rounded-full px-2.5 py-0.5 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Daily
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Noor Quran
            </h1>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Read, listen, and reflect upon the Holy Quran with Hindi & English meanings.
            </p>
          </div>

          {/* Continue Reading Card inside Hero */}
          {lastRead ? (
            <div className="pt-2 border-t border-emerald-700/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-medium">
                    Continue Reading
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Surah {lastRead.englishName} · Ayah {lastRead.ayahNumber}
                  </div>
                </div>

                <button
                  onClick={() => onOpenSurah(lastRead.surahNumber, lastRead.ayahNumber)}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                >
                  <span>Resume</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-emerald-700/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-medium">
                  Start Your Journey
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Surah Al-Faatiha · 7 Ayahs
                </div>
              </div>

              <button
                onClick={() => onOpenSurah(1, 1)}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
              >
                <span>Read</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
          Quick Access
        </div>
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => onNavigateTab('quran')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Quran</span>
          </button>

          <button
            onClick={() => onNavigateTab('bookmarks')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-1">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Saved</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-1">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Search</span>
          </button>

          <button
            onClick={onOpenDuas}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-1">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Duas</span>
          </button>

          <button
            onClick={onOpenTasbeeh}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 active:scale-95 transition-all text-slate-700 dark:text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-1">
              <CircleDot className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Tasbeeh</span>
          </button>
        </div>
      </div>

      {/* Today's Ayah Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">Today's Ayah</span>
              <span aria-hidden="true">·</span>
              <span>{dailyAyah.theme}</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Surah {dailyAyah.surahEnglishName} ({dailyAyah.surahNumber}:{dailyAyah.ayahNumber})
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleDailyBookmark}
              className={`min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl transition-colors ${
                isDailyBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isDailyBookmarked ? 'Remove Bookmark' : 'Bookmark Ayah'}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isDailyBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShareDaily}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Share Ayah"
              aria-label="Share"
            >
              {copiedDaily ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Arabic Text */}
        <div className="font-arabic text-2xl text-slate-900 dark:text-emerald-100 leading-loose py-1 select-text">
          {dailyAyah.arabicText}
        </div>

        {/* Hindi & English Translations */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-sm">
          <div className="text-slate-800 dark:text-slate-200 font-devanagari leading-relaxed">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 block mb-0.5">
              हिन्दी अनुवाद (Hindi Meaning)
            </span>
            {dailyAyah.hindiTranslation}
          </div>

          <div className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">
              English (Sahih International)
            </span>
            {dailyAyah.englishTranslation}
          </div>
        </div>

        {/* Actions bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePlayDaily}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Audio</span>
          </button>

          <button
            onClick={() => onOpenSurah(dailyAyah.surahNumber, dailyAyah.ayahNumber)}
            className="flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>Read in Context</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frequently Recited Surahs */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Frequently Recited Surahs
          </span>
          <button
            onClick={() => onNavigateTab('quran')}
            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            View All 114
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {popularSurahs.map(s => (
            <button
              key={s.number}
              onClick={() => onOpenSurah(s.number)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 text-left transition-all shadow-sm active:scale-98 group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {s.name}
                </span>
                <span className="font-arabic text-base text-emerald-800 dark:text-emerald-400">
                  {s.arabic}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {s.reason}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
