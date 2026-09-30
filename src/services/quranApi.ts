import { Ayah, SearchMatch, SurahDetail, SurahMeta } from '../types/quran';
import { BUNDLED_SURAHS } from '../data/bundledSurahs';
import { SURAH_LIST } from '../data/surahList';
import { cacheSurah, getCachedSurah } from './storage';

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const AUDIO_BASE_URL = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';
const AUDIO_FALLBACK_URL = 'https://cdn.islamic.network/quran/audio/64/ar.alafasy';

interface ApiResponseEditionAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil?: number;
  page: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
}

interface ApiResponseEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  ayahs: ApiResponseEditionAyah[];
}

interface MultiEditionResponse {
  code: number;
  status: string;
  data: ApiResponseEdition[];
}

export async function fetchSurah(surahNumber: number): Promise<SurahDetail> {
  // 1. Check local cache first for instant load
  const cached = getCachedSurah(surahNumber);
  if (cached && cached.ayahs && cached.ayahs.length > 0) {
    return cached;
  }

  // 2. Check bundled starter surahs
  if (BUNDLED_SURAHS[surahNumber]) {
    cacheSurah(BUNDLED_SURAHS[surahNumber]);
    return BUNDLED_SURAHS[surahNumber];
  }

  // 3. Find metadata from canonical SURAH_LIST
  const meta = SURAH_LIST.find(s => s.number === surahNumber);
  if (!meta) {
    throw new Error(`Surah ${surahNumber} not found`);
  }

  // 4. Fetch from official AlQuran Cloud API:
  // quran-uthmani: authentic Arabic Uthmani text
  // hi.hindi: standard recognized Hindi translation by Suhel Farooq Khan and Saifur Rahman Nadwi
  // en.sahih: Sahih International English translation
  try {
    const url = `${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,hi.hindi,en.sahih`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch Surah data: HTTP ${res.status}`);
    }

    const json: MultiEditionResponse = await res.json();
    if (!json.data || !Array.isArray(json.data) || json.data.length < 3) {
      throw new Error('Incomplete data received from Quran server');
    }

    const arabicEdition = json.data.find(e => e.identifier === 'quran-uthmani') || json.data[0];
    const hindiEdition = json.data.find(e => e.identifier === 'hi.hindi');
    const englishEdition = json.data.find(e => e.identifier === 'en.sahih');

    const ayahs: Ayah[] = arabicEdition.ayahs.map((ayah, index) => {
      const hindiAyah = hindiEdition?.ayahs[index];
      const englishAyah = englishEdition?.ayahs[index];
      const globalNumber = ayah.number;

      return {
        number: globalNumber,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        hindiText: hindiAyah?.text || '',
        englishText: englishAyah?.text || '',
        audio: `${AUDIO_BASE_URL}/${globalNumber}.mp3`,
        audioSecondary: [`${AUDIO_FALLBACK_URL}/${globalNumber}.mp3`],
        juz: ayah.juz,
        manzil: ayah.manzil,
        page: ayah.page,
        ruku: ayah.ruku,
        hizbQuarter: ayah.hizbQuarter,
        sajda: ayah.sajda
      };
    });

    const detail: SurahDetail = {
      ...meta,
      ayahs,
      bismillahPre: surahNumber !== 1 && surahNumber !== 9
    };

    // Cache locally for offline reading
    cacheSurah(detail);
    return detail;
  } catch (err: unknown) {
    console.error('Fetch Surah error:', err);
    // If cached version exists despite error, return it
    if (cached) return cached;
    const msg = err instanceof Error ? err.message : 'Unknown network error';
    throw new Error(`Unable to load Surah ${meta.englishName} (${msg}). Please verify your internet connection.`);
  }
}

export function getSurahMetadata(surahNumber: number): SurahMeta | undefined {
  return SURAH_LIST.find(s => s.number === surahNumber);
}

export async function searchQuran(query: string, searchIn: 'all' | 'hi' | 'en' | 'ar' = 'all'): Promise<SearchMatch[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const matches: SearchMatch[] = [];

  // 1. Direct Surah:Ayah pattern check (e.g. "2:255" or "2 255")
  const ayahPatternMatch = cleanQuery.match(/^(\d{1,3})[:\s]+(\d{1,3})$/);
  if (ayahPatternMatch) {
    const sNum = parseInt(ayahPatternMatch[1], 10);
    const aNum = parseInt(ayahPatternMatch[2], 10);
    const surah = SURAH_LIST.find(s => s.number === sNum);
    if (surah && aNum <= surah.numberOfAyahs) {
      matches.push({
        surahNumber: sNum,
        surahName: surah.name,
        surahEnglishName: surah.englishName,
        ayahNumber: aNum,
        text: `Go directly to Surah ${surah.englishName} Ayah ${aNum}`,
        type: 'surahName'
      });
    }
  }

  // 2. Local search on Surah names, numbers & meanings
  for (const surah of SURAH_LIST) {
    if (
      surah.englishName.toLowerCase().includes(cleanQuery) ||
      surah.englishNameTranslation.toLowerCase().includes(cleanQuery) ||
      surah.name.includes(cleanQuery) ||
      surah.number.toString() === cleanQuery
    ) {
      matches.push({
        surahNumber: surah.number,
        surahName: surah.name,
        surahEnglishName: surah.englishName,
        ayahNumber: 1,
        text: `${surah.englishNameTranslation} · Surah #${surah.number} (${surah.numberOfAyahs} Ayahs)`,
        type: 'surahName'
      });
    }
  }

  // 3. API text search if query is at least 3 characters
  if (cleanQuery.length >= 3 && !cleanQuery.includes(':')) {
    try {
      const editionsToSearch: string[] = [];
      if (searchIn === 'all' || searchIn === 'hi') editionsToSearch.push('hi.hindi');
      if (searchIn === 'all' || searchIn === 'en') editionsToSearch.push('en.sahih');
      if (searchIn === 'ar') editionsToSearch.push('quran-uthmani');

      for (const edition of editionsToSearch.slice(0, 2)) {
        try {
          const res = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(cleanQuery)}/all/${edition}`);
          if (res.ok) {
            const data = await res.json();
            if (data.code === 200 && data.data && data.data.matches) {
              const apiMatches = data.data.matches.slice(0, 25);
              for (const m of apiMatches) {
                const sNumber = m.surah.number;
                const meta = SURAH_LIST.find(s => s.number === sNumber);
                matches.push({
                  surahNumber: sNumber,
                  surahName: m.surah.name,
                  surahEnglishName: meta?.englishName || m.surah.englishName,
                  ayahNumber: m.numberInSurah,
                  text: m.text,
                  type: edition === 'quran-uthmani' ? 'arabic' : 'translation'
                });
              }
            }
          }
        } catch {
          // Continue to next edition
        }
      }
    } catch {
      // Ignore network search errors, local results will be displayed
    }
  }

  // Deduplicate matches
  const uniqueKeys = new Set<string>();
  return matches.filter(m => {
    const key = `${m.surahNumber}-${m.ayahNumber}-${m.text.substring(0, 20)}`;
    if (uniqueKeys.has(key)) return false;
    uniqueKeys.add(key);
    return true;
  });
}
