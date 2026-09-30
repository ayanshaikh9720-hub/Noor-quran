import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SURAH_LIST } from '../data/surahList';
import { Ayah, SurahDetail, TranslationLanguage, Bookmark } from '../types/quran';
import { fetchSurah } from '../services/quranApi';
import { saveStoredLastRead, toggleBookmarkInStorage, isAyahBookmarked, getStoredSettings, saveStoredSettings } from '../services/storage';
import { useAudio } from '../context/AudioContext';
import {
  Search,
  ArrowLeft,
  Play,
  Pause,
  Bookmark as BookmarkIcon,
  Copy,
  Share2,
  Check,
  Sliders,
  Compass,
  Volume2,
  RefreshCw,
  X,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface QuranScreenProps {
  initialSurahNumber?: number;
  initialAyahNumber?: number;
  onClearInitialState?: () => void;
  onBookmarksUpdated: () => void;
}

export const QuranScreen: React.FC<QuranScreenProps> = ({
  initialSurahNumber,
  initialAyahNumber,
  onClearInitialState,
  onBookmarksUpdated
}) => {
  // Navigation state: selectedSurahNumber null means Surah Catalog view
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(initialSurahNumber || null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [surahError, setSurahError] = useState<string | null>(null);

  // Search & Filter in catalog
  const [catalogQuery, setCatalogQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Madinan'>('all');

  // Reader Settings State
  const [settings, setSettings] = useState(getStoredSettings);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpInput, setJumpInput] = useState('');

  // Per-ayah copy feedback
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);

  // Audio Context
  const { isPlaying, activeSurah, currentAyah, playAyah, playSurah } = useAudio();

  // Scroll reference map for Ayahs
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Handle initialSurahNumber / initialAyahNumber passed from props
  useEffect(() => {
    if (initialSurahNumber) {
      setSelectedSurahNumber(initialSurahNumber);
    }
  }, [initialSurahNumber]);

  // Load Surah detail whenever selectedSurahNumber changes
  useEffect(() => {
    if (!selectedSurahNumber) {
      setSurahDetail(null);
      return;
    }

    let isMounted = true;
    setIsLoadingSurah(true);
    setSurahError(null);

    fetchSurah(selectedSurahNumber)
      .then((detail) => {
        if (!isMounted) return;
        setSurahDetail(detail);
        setIsLoadingSurah(false);

        // Record Last Read
        saveStoredLastRead({
          surahNumber: detail.number,
          surahName: detail.name,
          englishName: detail.englishName,
          ayahNumber: initialAyahNumber || 1,
          timestamp: Date.now()
        });

        // Scroll to initial Ayah if specified
        if (initialAyahNumber) {
          setTimeout(() => {
            const el = ayahRefs.current.get(initialAyahNumber);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            onClearInitialState?.();
          }, 350);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Surah load failure:', err);
        setSurahError(err.message || 'Failed to load Quran text. Please try again.');
        setIsLoadingSurah(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber, initialAyahNumber, onClearInitialState]);

  // Auto-scroll to currently playing Ayah if enabled
  useEffect(() => {
    if (
      settings.autoScrollAyah &&
      isPlaying &&
      activeSurah &&
      surahDetail &&
      activeSurah.number === surahDetail.number &&
      currentAyah
    ) {
      const el = ayahRefs.current.get(currentAyah.numberInSurah);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentAyah, isPlaying, activeSurah, surahDetail, settings.autoScrollAyah]);

  // Filtered Surahs in Catalog
  const filteredSurahs = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    return SURAH_LIST.filter((s) => {
      const matchesType = filterType === 'all' || s.revelationType === filterType;
      if (!matchesType) return false;
      if (!q) return true;
      return (
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.number.toString() === q
      );
    });
  }, [catalogQuery, filterType]);

  const handleUpdateSettings = (newSettings: Partial<typeof settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleToggleBookmark = (ayah: Ayah) => {
    if (!surahDetail) return;
    const bookmark: Bookmark = {
      id: `${surahDetail.number}-${ayah.numberInSurah}`,
      surahNumber: surahDetail.number,
      surahName: surahDetail.name,
      englishName: surahDetail.englishName,
      ayahNumber: ayah.numberInSurah,
      arabicText: ayah.text,
      translationText: ayah.hindiText || ayah.englishText || '',
      timestamp: Date.now()
    };
    toggleBookmarkInStorage(bookmark);
    onBookmarksUpdated();
  };

  const handleCopyAyah = async (ayah: Ayah) => {
    if (!surahDetail) return;
    const textToCopy = `Surah ${surahDetail.englishName} (${surahDetail.number}:${ayah.numberInSurah})\n\n${ayah.text}\n\n[Hindi]: ${ayah.hindiText || ''}\n\n[English]: ${ayah.englishText || ''}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAyahNum(ayah.numberInSurah);
      setTimeout(() => setCopiedAyahNum(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleShareAyah = async (ayah: Ayah) => {
    if (!surahDetail) return;
    const shareText = `Noor Quran\nSurah ${surahDetail.englishName} (${surahDetail.number}:${ayah.numberInSurah})\n\n${ayah.text}\n\n[Hindi]: ${ayah.hindiText}\n\n[English]: ${ayah.englishText}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surah ${surahDetail.englishName} - Ayah ${ayah.numberInSurah}`,
          text: shareText
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }
    handleCopyAyah(ayah);
  };

  const handleJumpToAyah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surahDetail) return;
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= surahDetail.numberOfAyahs) {
      setShowJumpModal(false);
      setJumpInput('');
      const el = ayahRefs.current.get(num);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // If a Surah is selected, show the Surah Reader View
  if (selectedSurahNumber !== null) {
    return (
      <div className="pb-32 pt-2 px-3 max-w-xl mx-auto">
        {/* Sticky Surah Reader Control Header */}
        <div className="sticky top-14 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-2xl shadow-sm mb-4 flex items-center justify-between transition-colors">
          <button
            onClick={() => {
              setSelectedSurahNumber(null);
              onClearInitialState?.();
            }}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Surahs List"
            aria-label="Back to Surah List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Surah Title in center */}
          <div className="text-center truncate px-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {surahDetail ? `${surahDetail.number}. ${surahDetail.englishName}` : `Surah #${selectedSurahNumber}`}
            </h2>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-arabic truncate">
              {surahDetail ? surahDetail.name : ''}
            </div>
          </div>

          {/* Quick Reader Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowJumpModal(true)}
              disabled={!surahDetail}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              title="Jump to Ayah"
              aria-label="Jump to Ayah"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowAppearanceModal(true)}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              title="Text & Translation Settings"
              aria-label="Reader Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingSurah && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Loading authentic Quran text & translations...
            </p>
          </div>
        )}

        {/* Error State */}
        {surahError && !isLoadingSurah && (
          <div className="my-8 p-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-3xl text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto" />
            <p className="text-sm text-red-800 dark:text-red-300">{surahError}</p>
            <button
              onClick={() => {
                if (selectedSurahNumber) {
                  setIsLoadingSurah(true);
                  fetchSurah(selectedSurahNumber)
                    .then((detail) => {
                      setSurahDetail(detail);
                      setSurahError(null);
                      setIsLoadingSurah(false);
                    })
                    .catch((err) => {
                      setSurahError(err.message);
                      setIsLoadingSurah(false);
                    });
                }
              }}
              className="px-4 py-2 bg-red-600 text-white font-medium text-xs rounded-xl shadow-sm hover:bg-red-700 active:scale-95 transition-all"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Loaded Surah Content */}
        {surahDetail && !isLoadingSurah && (
          <div className="space-y-4">
            {/* Surah Banner Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 text-white text-center shadow-md relative overflow-hidden">
              <div className="space-y-1.5 relative z-10">
                <span className="text-xs text-emerald-300 font-medium tracking-wide">
                  Surah {surahDetail.number} · {surahDetail.revelationType} · {surahDetail.numberOfAyahs} Ayahs
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {surahDetail.englishName}
                </h1>
                <p className="text-xs text-emerald-200/80">
                  {surahDetail.englishNameTranslation}
                </p>
                <div className="font-arabic text-3xl text-amber-200 pt-1">
                  {surahDetail.name}
                </div>
              </div>

              {/* Full Surah Audio Recitation Button */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => playSurah(surahDetail, 0)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-transform"
                >
                  <Volume2 className="w-4 h-4 fill-current" />
                  <span>Recite Full Surah (Mishary Alafasy)</span>
                </button>
              </div>
            </div>

            {/* Bismillah Calligraphy (Shown for all Surahs except 1 and 9) */}
            {surahDetail.bismillahPre && (
              <div className="py-4 text-center">
                <div className="font-arabic text-2xl md:text-3xl text-emerald-900 dark:text-emerald-300">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  In the name of Allah, the Entirely Merciful, the Especially Merciful
                </div>
              </div>
            )}

            {/* Ayahs Stream */}
            <div className="space-y-3">
              {surahDetail.ayahs.map((ayah) => {
                const isCurrentlyPlaying =
                  isPlaying &&
                  activeSurah?.number === surahDetail.number &&
                  currentAyah?.numberInSurah === ayah.numberInSurah;

                const isBookmarked = isAyahBookmarked(surahDetail.number, ayah.numberInSurah);

                return (
                  <div
                    key={ayah.numberInSurah}
                    ref={(el) => {
                      if (el) ayahRefs.current.set(ayah.numberInSurah, el);
                      else ayahRefs.current.delete(ayah.numberInSurah);
                    }}
                    className={`rounded-2xl p-4 transition-all duration-200 border ${
                      isCurrentlyPlaying
                        ? 'ayah-highlighted bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    {/* Ayah Top Action Bar */}
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      {/* Ayah Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono tabular-nums flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                          {ayah.numberInSurah}
                        </span>
                        {ayah.juz && (
                          <span className="text-[10px] text-slate-400">
                            Juz {ayah.juz}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-0.5">
                        {/* Play this Ayah */}
                        <button
                          onClick={() => playAyah(surahDetail, ayah.numberInSurah - 1)}
                          className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl transition-colors ${
                            isCurrentlyPlaying
                              ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/60'
                              : 'text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title="Play recitation"
                          aria-label={`Play Ayah ${ayah.numberInSurah}`}
                        >
                          {isCurrentlyPlaying ? (
                            <Pause className="w-4 h-4 fill-current text-emerald-700" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        {/* Bookmark */}
                        <button
                          onClick={() => handleToggleBookmark(ayah)}
                          className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl transition-colors ${
                            isBookmarked
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
                          aria-label="Bookmark"
                        >
                          <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => handleCopyAyah(ayah)}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy Ayah"
                          aria-label="Copy"
                        >
                          {copiedAyahNum === ayah.numberInSurah ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => handleShareAyah(ayah)}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Share Ayah"
                          aria-label="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Verse Text */}
                    <div
                      className={`font-arabic text-slate-900 dark:text-emerald-50 mb-3 select-text ${
                        settings.arabicFont === 'scheherazade' ? 'font-scheherazade' : ''
                      }`}
                      style={{
                        fontSize: `${settings.arabicFontSize}px`,
                        lineHeight: 2.2
                      }}
                    >
                      {ayah.text}
                      {/* Quranic Ayah End Symbol */}
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 text-sm mx-1.5 select-none">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </div>

                    {/* Translations Container */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {/* Hindi Translation */}
                      {(settings.translationLanguage === 'hi' || settings.translationLanguage === 'both') && (
                        <div
                          className="text-slate-800 dark:text-slate-200 font-devanagari leading-relaxed select-text"
                          style={{ fontSize: `${settings.translationFontSize}px` }}
                        >
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                            हिन्दी (Suhel Farooq Khan & Saifur Rahman)
                          </span>
                          {ayah.hindiText || 'अनुवाद लोड हो रहा है...'}
                        </div>
                      )}

                      {/* English Translation */}
                      {(settings.translationLanguage === 'en' || settings.translationLanguage === 'both') && (
                        <div
                          className="text-slate-600 dark:text-slate-400 leading-relaxed select-text"
                          style={{ fontSize: `${Math.max(13, settings.translationFontSize - 1)}px` }}
                        >
                          <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                            English (Sahih International)
                          </span>
                          {ayah.englishText || 'Translation loading...'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal: Appearance & Translation Settings */}
        {showAppearanceModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reading Display
                </h3>
                <button
                  onClick={() => setShowAppearanceModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Translation Language Toggle */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                  Translation Language
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(['both', 'hi', 'en'] as TranslationLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleUpdateSettings({ translationLanguage: lang })}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        settings.translationLanguage === lang
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {lang === 'both' ? 'Both (हि/En)' : lang === 'hi' ? 'Hindi Only' : 'English Only'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic Font Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Arabic Size</span>
                  <span className="font-mono text-emerald-600">{settings.arabicFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="22"
                  max="42"
                  step="2"
                  value={settings.arabicFontSize}
                  onChange={(e) => handleUpdateSettings({ arabicFontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Translation Font Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Translation Size</span>
                  <span className="font-mono text-emerald-600">{settings.translationFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="13"
                  max="22"
                  step="1"
                  value={settings.translationFontSize}
                  onChange={(e) => handleUpdateSettings({ translationFontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Arabic Font Family */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                  Arabic Script Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateSettings({ arabicFont: 'amiri' })}
                    className={`p-2.5 rounded-xl border text-center font-arabic text-lg transition-all ${
                      settings.arabicFont === 'amiri'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    العربية (Amiri)
                  </button>

                  <button
                    onClick={() => handleUpdateSettings({ arabicFont: 'scheherazade' })}
                    className={`p-2.5 rounded-xl border text-center font-scheherazade text-lg transition-all ${
                      settings.arabicFont === 'scheherazade'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    العربية (Scheherazade)
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowAppearanceModal(false)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm active:scale-98 transition-all"
              >
                Apply & Close
              </button>
            </div>
          </div>
        )}

        {/* Modal: Jump to Ayah */}
        {showJumpModal && surahDetail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-xs w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Jump to Ayah
                </h3>
                <button
                  onClick={() => setShowJumpModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Enter an Ayah number between 1 and {surahDetail.numberOfAyahs}
              </p>

              <form onSubmit={handleJumpToAyah} className="space-y-3">
                <input
                  type="number"
                  min="1"
                  max={surahDetail.numberOfAyahs}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                  placeholder={`1 - ${surahDetail.numberOfAyahs}`}
                  autoFocus
                  className="w-full px-4 py-2.5 text-center text-lg font-bold font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowJumpModal(false)}
                    className="flex-1 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                  >
                    Jump
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Otherwise: Surah Catalog List View
  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-4">
      {/* Search & Filter Header */}
      <div className="space-y-2">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={catalogQuery}
            onChange={(e) => setCatalogQuery(e.target.value)}
            placeholder="Search Surah name or number (e.g. Yaseen, 36, Mulk)..."
            className="w-full pl-9 pr-9 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-xs transition-colors"
          />
          {catalogQuery && (
            <button
              onClick={() => setCatalogQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs: All, Meccan, Madinan */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {(['all', 'Meccan', 'Madinan'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterType === type
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {type === 'all' ? 'All (114 Surahs)' : `${type}`}
            </button>
          ))}
        </div>
      </div>

      {/* Surah List */}
      <div className="space-y-2">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => setSelectedSurahNumber(surah.number)}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 flex items-center justify-between text-left transition-all shadow-xs active:scale-99 group"
          >
            {/* Left: Number + English & Meaning */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Number Hex/Circle */}
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/50 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {surah.number}
              </div>

              <div className="truncate">
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {surah.englishName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {surah.englishNameTranslation}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                  <span>{surah.revelationType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{surah.numberOfAyahs} Ayahs</span>
                </div>
              </div>
            </div>

            {/* Right: Arabic Title */}
            <div className="text-right shrink-0 pl-2">
              <div className="font-arabic text-xl text-emerald-900 dark:text-emerald-300 font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {surah.name}
              </div>
            </div>
          </button>
        ))}

        {filteredSurahs.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No Surahs found matching "{catalogQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
