import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { SearchMatch } from '../types/quran';
import { searchQuran } from '../services/quranApi';

interface SearchScreenProps {
  onOpenAyah: (surahNumber: number, ayahNumber: number) => void;
  onClose?: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onOpenAyah, onClose }) => {
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'hi' | 'en' | 'ar'>('all');
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Quick suggestions for easy access
  const suggestions = [
    { label: 'Ayat al-Kursi', query: '2:255' },
    { label: 'Surah Yaseen', query: 'Yaseen' },
    { label: 'Surah Al-Mulk', query: 'Al-Mulk' },
    { label: 'Patience (सब्र)', query: 'patience' },
    { label: 'Forgiveness (मग़फ़िरत)', query: 'forgiveness' },
    { label: 'Mercy (रहमत)', query: 'mercy' },
    { label: 'Parents (वालिदैन)', query: 'parents' }
  ];

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);
      try {
        const matches = await searchQuran(trimmed, filterMode);
        setResults(matches);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, filterMode]);

  return (
    <div className="pb-28 pt-2 px-3 max-w-lg mx-auto space-y-4">
      {/* Search Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Search the Quran
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Close
            </button>
          )}
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, Surah, or Ayah (e.g. 2:255, mercy, सब्र)..."
            autoFocus
            className="w-full pl-9 pr-9 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scope Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'hi', label: 'Hindi' },
            { id: 'en', label: 'English' },
            { id: 'ar', label: 'Arabic' }
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => setFilterMode(scope.id as typeof filterMode)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterMode === scope.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quick Searches when no active query */}
      {!query && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Popular Topics & Surahs
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => setQuery(s.query)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs text-slate-700 dark:text-slate-300 rounded-xl shadow-xs active:scale-95 transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Searching State */}
      {isSearching && (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500">Searching authentic Quran verses...</p>
        </div>
      )}

      {/* Search Results */}
      {!isSearching && hasSearched && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {results.length} {results.length === 1 ? 'match' : 'matches'} found for "{query}"
            </span>
          </div>

          {results.map((match, idx) => (
            <div
              key={`${match.surahNumber}-${match.ayahNumber}-${idx}`}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                    {match.surahNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Surah {match.surahEnglishName}
                  </span>
                  <span className="text-xs text-slate-400">
                    Ayah {match.ayahNumber}
                  </span>
                </div>

                <button
                  onClick={() => onOpenAyah(match.surahNumber, match.ayahNumber)}
                  className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                >
                  <span>Open Ayah</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <p className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed ${
                match.type === 'arabic' ? 'font-arabic text-right text-base leading-loose' : ''
              }`}>
                {match.text}
              </p>
            </div>
          ))}

          {results.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <p>No matching verses found for "{query}".</p>
              <p className="text-[11px] text-slate-400">
                Try searching for a different keyword, Surah name, or verse format like "2:255".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
