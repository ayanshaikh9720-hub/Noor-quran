import { AppSettings, Bookmark, ReadingHistory, SurahDetail } from '../types/quran';
import {
  auth,
  saveBookmarkToFirestore,
  deleteBookmarkFromFirestore,
  saveLastReadToFirestore,
  saveTasbeehToFirestore
} from './firebase';

const STORAGE_KEYS = {
  SETTINGS: 'noor_quran_settings',
  BOOKMARKS: 'noor_quran_bookmarks',
  LAST_READ: 'noor_quran_last_read',
  TASBEEH: 'noor_quran_tasbeeh',
  CACHE_PREFIX: 'noor_quran_surah_cache_',
  FAVORITE_DUAS: 'noor_quran_fav_duas'
};

export const DEFAULT_SETTINGS: AppSettings = {
  arabicFontSize: 28,
  translationFontSize: 16,
  translationLanguage: 'both',
  arabicFont: 'amiri',
  theme: 'light',
  vibrateOnTasbeeh: true,
  soundOnTasbeeh: false,
  autoScrollAyah: true,
  continuousAudio: true
};

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function getStoredBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading bookmarks', e);
  }
  return [];
}

export function saveStoredBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Error saving bookmarks', e);
  }
}

export function toggleBookmarkInStorage(bookmark: Bookmark): { bookmarks: Bookmark[]; isBookmarked: boolean } {
  const current = getStoredBookmarks();
  const exists = current.some(b => b.id === bookmark.id);
  let updated: Bookmark[];
  let isBookmarked = false;

  if (exists) {
    updated = current.filter(b => b.id !== bookmark.id);
    if (auth.currentUser) {
      deleteBookmarkFromFirestore(auth.currentUser.uid, bookmark.id).catch(err => {
        console.warn('Could not sync bookmark deletion to Firestore:', err);
      });
    }
  } else {
    updated = [bookmark, ...current];
    isBookmarked = true;
    if (auth.currentUser) {
      saveBookmarkToFirestore(auth.currentUser.uid, bookmark).catch(err => {
        console.warn('Could not sync bookmark to Firestore:', err);
      });
    }
  }

  saveStoredBookmarks(updated);
  return { bookmarks: updated, isBookmarked };
}

export function isAyahBookmarked(surahNumber: number, ayahNumber: number): boolean {
  const current = getStoredBookmarks();
  return current.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
}

export function getStoredLastRead(): ReadingHistory | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading last read', e);
  }
  return null;
}

export function saveStoredLastRead(history: ReadingHistory): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(history));
    if (auth.currentUser) {
      saveLastReadToFirestore(auth.currentUser.uid, history).catch(err => {
        console.warn('Could not sync last read to Firestore:', err);
      });
    }
  } catch (e) {
    console.error('Error saving last read', e);
  }
}

export interface TasbeehData {
  count: number;
  target: number;
  totalToday: number;
  lastDate: string;
  selectedDhikrIndex: number;
}

export function getStoredTasbeeh(): TasbeehData {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASBEEH);
    if (raw) {
      const data: TasbeehData = JSON.parse(raw);
      if (data.lastDate !== todayStr) {
        // Reset daily count if date changed
        data.totalToday = 0;
        data.lastDate = todayStr;
      }
      return data;
    }
  } catch (e) {
    console.error('Error reading tasbeeh state', e);
  }

  return {
    count: 0,
    target: 33,
    totalToday: 0,
    lastDate: todayStr,
    selectedDhikrIndex: 0
  };
}

export function saveStoredTasbeeh(data: TasbeehData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASBEEH, JSON.stringify(data));
    if (auth.currentUser) {
      saveTasbeehToFirestore(auth.currentUser.uid, data).catch(err => {
        console.warn('Could not sync tasbeeh to Firestore:', err);
      });
    }
  } catch (e) {
    console.error('Error saving tasbeeh', e);
  }
}

// Cached Surahs in localStorage for fast offline reading
export function getCachedSurah(surahNumber: number): SurahDetail | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CACHE_PREFIX}${surahNumber}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading cached surah', e);
  }
  return null;
}

export function cacheSurah(surah: SurahDetail): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CACHE_PREFIX}${surah.number}`, JSON.stringify(surah));
  } catch (e) {
    // If quota exceeded, clear older caches
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.CACHE_PREFIX)) {
          localStorage.removeItem(key);
          break;
        }
      }
      localStorage.setItem(`${STORAGE_KEYS.CACHE_PREFIX}${surah.number}`, JSON.stringify(surah));
    } catch {
      // Ignore cache write errors
    }
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Error clearing storage', e);
  }
}
