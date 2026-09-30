export type RevelationType = 'Meccan' | 'Madinan';

export interface SurahMeta {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  juzStart?: number;
}

export interface Ayah {
  number: number; // Global Ayah number (1 - 6236)
  numberInSurah: number;
  text: string; // Arabic Uthmani text
  hindiText?: string;
  englishText?: string;
  audio?: string;
  audioSecondary?: string[];
  juz?: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
  bismillahPre?: boolean;
}

export interface Bookmark {
  id: string; // e.g. "surah-ayah" like "1-1"
  surahNumber: number;
  surahName: string;
  englishName: string;
  ayahNumber: number;
  arabicText: string;
  translationText: string;
  timestamp: number;
}

export interface ReadingHistory {
  surahNumber: number;
  surahName: string;
  englishName: string;
  ayahNumber: number;
  timestamp: number;
}

export type TranslationLanguage = 'hi' | 'en' | 'both';
export type ArabicFontFamily = 'amiri' | 'scheherazade';

export interface AppSettings {
  arabicFontSize: number; // in pixels (e.g. 24 to 40)
  translationFontSize: number; // in pixels (e.g. 14 to 22)
  translationLanguage: TranslationLanguage;
  arabicFont: ArabicFontFamily;
  theme: 'light' | 'dark' | 'system';
  vibrateOnTasbeeh: boolean;
  soundOnTasbeeh: boolean;
  autoScrollAyah: boolean;
  continuousAudio: boolean;
}

export interface DuaItem {
  id: string;
  title: string;
  category: string;
  arabic: string;
  transliteration: string;
  hindiMeaning: string;
  englishMeaning: string;
  source: string;
  targetCount?: number;
}

export interface SearchMatch {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  text: string;
  type: 'arabic' | 'translation' | 'surahName';
}
