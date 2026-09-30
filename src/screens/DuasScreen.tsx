import React, { useState } from 'react';
import { DUAS_DATA, DUA_CATEGORIES } from '../data/duasData';
import { DuaItem } from '../types/quran';
import { Copy, Share2, Check, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface DuasScreenProps {
  onBack?: () => void;
}

export const DuasScreen: React.FC<DuasScreenProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const filteredDuas = selectedCategory === 'All'
    ? DUAS_DATA
    : DUAS_DATA.filter((d) => d.category === selectedCategory);

  const handleCopy = async (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n[Transliteration]: ${dua.transliteration}\n\n[Hindi]: ${dua.hindiMeaning}\n\n[English]: ${dua.englishMeaning}\n\nReference: ${dua.source}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleShare = async (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n[Transliteration]: ${dua.transliteration}\n\n[Hindi]: ${dua.hindiMeaning}\n\n[English]: ${dua.englishMeaning}\n\nReference: ${dua.source}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: dua.title,
          text
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopy(dua);
  };

  const incrementCount = (id: string, target?: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      const next = target && current >= target ? 0 : current + 1;
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-4">
      {/* Top Header */}
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
              Authentic Duas & Azkar
            </h2>
            <p className="text-xs text-slate-500">
              Verified supplications from the Quran and Sunnah
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Duas List */}
      <div className="space-y-4">
        {filteredDuas.map((dua) => {
          const currentCount = counts[dua.id] || 0;
          const target = dua.targetCount || 1;
          const isCompleted = currentCount >= target;

          return (
            <div
              key={dua.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors"
            >
              {/* Dua Title and Category */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    {dua.category}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {dua.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Copy Dua"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(dua)}
                    className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Share Dua"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <div className="font-arabic text-xl sm:text-2xl text-slate-900 dark:text-emerald-100 leading-loose text-right select-text py-1">
                {dua.arabic}
              </div>

              {/* Transliteration */}
              <div className="text-xs text-emerald-900 dark:text-emerald-300/90 italic font-serif leading-relaxed select-text">
                {dua.transliteration}
              </div>

              {/* Hindi Meaning */}
              <div className="text-xs text-slate-800 dark:text-slate-200 font-devanagari leading-relaxed select-text pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 block mb-0.5">
                  हिन्दी अर्थ (Hindi Meaning)
                </span>
                {dua.hindiMeaning}
              </div>

              {/* English Meaning */}
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed select-text">
                <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                  English Meaning
                </span>
                {dua.englishMeaning}
              </div>

              {/* Footer: Source Reference and Interactive Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <div className="text-slate-500 italic truncate max-w-[200px]">
                  {dua.source}
                </div>

                {target > 1 ? (
                  <button
                    onClick={() => incrementCount(dua.id, target)}
                    className={`px-3 py-1 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>{currentCount} / {target}</span>
                    {isCompleted && <Check className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                    Verified Hadith
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
