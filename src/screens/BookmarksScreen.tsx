import React from 'react';
import { Bookmark as BookmarkIcon, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Bookmark } from '../types/quran';
import { saveStoredBookmarks } from '../services/storage';

interface BookmarksScreenProps {
  bookmarks: Bookmark[];
  onOpenAyah: (surahNumber: number, ayahNumber: number) => void;
  onBookmarksChange: (updated: Bookmark[]) => void;
  onExploreQuran: () => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  bookmarks,
  onOpenAyah,
  onBookmarksChange,
  onExploreQuran
}) => {
  const handleRemove = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    saveStoredBookmarks(updated);
    onBookmarksChange(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved bookmarks?')) {
      saveStoredBookmarks([]);
      onBookmarksChange([]);
    }
  };

  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Saved Bookmarks
          </h2>
          <p className="text-xs text-slate-500">
            {bookmarks.length} {bookmarks.length === 1 ? 'verse saved' : 'verses saved'}
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Bookmarks List */}
      {bookmarks.length > 0 ? (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
                    {bm.surahNumber}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Surah {bm.englishName} ({bm.surahName})
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Ayah {bm.ayahNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRemove(bm.id)}
                    className="min-w-[34px] min-h-[34px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove Bookmark"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenAyah(bm.surahNumber, bm.ayahNumber)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Arabic preview */}
              <p className="font-arabic text-right text-lg text-slate-900 dark:text-emerald-100 leading-relaxed select-text truncate">
                {bm.arabicText}
              </p>

              {/* Translation preview */}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {bm.translationText}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <BookmarkIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No bookmarks yet
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tap the bookmark icon while reading any Ayah or on the Daily Ayah to save it here for quick access.
            </p>
          </div>
          <button
            onClick={onExploreQuran}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 mx-auto active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Quran</span>
          </button>
        </div>
      )}
    </div>
  );
};
