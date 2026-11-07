import type { Lang } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Domain vocabularies.
//
// The Turkish value stays the canonical one everywhere in the app: it is what
// data/*.ts stores, what filter logic compares against and what the backend
// already has persisted. These maps only translate a canonical value for
// display, so switching language never changes stored data or filter results.
// Each vocabulary gets its own map because the same Turkish word means
// different things in different contexts ("Orta" = Intermediate level but
// Medium difficulty; "Pas" = the setting skill but the Pass glossary category).
// ─────────────────────────────────────────────────────────────────────────────

function make(map: Record<string, string>) {
  return (value: string, lang: Lang) => (lang === 'en' ? map[value] ?? value : value);
}

/** drills.ts `phase` */
export const PHASE_EN: Record<string, string> = {
  'Isınma': 'Warm-up',
  'Ana Antrenman': 'Main Session',
  'Soğuma': 'Stretch',
};
export const phaseLabel = make(PHASE_EN);

/** drills.ts `skill` */
export const SKILL_EN: Record<string, string> = {
  'Mobilite': 'Mobility',
  'Esneklik': 'Flexibility',
  'Manşet': 'Forearm Pass',
  'Pas': 'Overhead Pass',
  'Pasörlük': 'Setting',
  'Atak': 'Attacking',
  'Servis': 'Serving',
  'Savunma': 'Defense',
  'Blok': 'Blocking',
  'Kondisyon': 'Conditioning',
  'Core': 'Core',
  'Taktik': 'Tactics',
  'Genel': 'General',
};
export const skillLabel = make(SKILL_EN);

/** drills.ts / modules.ts `level` */
export const LEVEL_EN: Record<string, string> = {
  'Başlangıç': 'Beginner',
  'Orta': 'Intermediate',
  'İleri': 'Advanced',
};
export const levelLabel = make(LEVEL_EN);

/**
 * The level slug stored on the user profile (`profile.level`). Both the
 * accented and unaccented spellings of "başlangıç" exist in older records.
 */
const PROFILE_LEVELS: Record<Lang, Record<string, string>> = {
  tr: {
    'başlangıç': 'Başlangıç', baslangic: 'Başlangıç',
    orta: 'Orta', ileri: 'İleri', profesyonel: 'Profesyonel',
  },
  en: {
    'başlangıç': 'Beginner', baslangic: 'Beginner',
    orta: 'Intermediate', ileri: 'Advanced', profesyonel: 'Professional',
  },
};

export function profileLevelLabel(value: string | null | undefined, lang: Lang): string | null {
  if (!value) return null;
  return PROFILE_LEVELS[lang][value] ?? value;
}

/** libraryFilters.ts DIFFICULTIES */
export const DIFFICULTY_EN: Record<string, string> = {
  'Kolay': 'Easy',
  'Orta': 'Medium',
  'Zor': 'Hard',
};
export const difficultyLabel = make(DIFFICULTY_EN);

/** libraryFilters.ts PLAYER_COUNTS */
export const PLAYERS_EN: Record<string, string> = {
  '1 Kişi': '1 Player',
  '2 Kişi': '2 Players',
  '3+ Kişi': '3+ Players',
};
export const playersLabel = make(PLAYERS_EN);

/** libraryFilters.ts QUICK_CATEGORIES / FULL_CATEGORIES */
export const LIB_CATEGORY_EN: Record<string, string> = {
  'Tümü': 'All',
  'Teknik & Pas': 'Technique & Passing',
  'Smaç': 'Spiking',
  'Servis': 'Serving',
  'Defans': 'Defense',
  'Blok': 'Blocking',
  'Kondisyon': 'Conditioning',
  'Kombinasyon': 'Combination',
};
export const libCategoryLabel = make(LIB_CATEGORY_EN);

/** sozlukTerms.ts CATEGORIES */
export const SOZLUK_CATEGORY_EN: Record<string, string> = {
  'Tümü': 'All',
  'Hücum': 'Attack',
  'Savunma': 'Defense',
  'Servis': 'Serve',
  'Pas': 'Pass',
  'Blok': 'Block',
  'Taktik': 'Tactics',
  'Pozisyon': 'Positions',
  'Saha': 'Court',
  'Kural': 'Rules',
  'Diğer': 'Other',
};
export const sozlukCategoryLabel = make(SOZLUK_CATEGORY_EN);

/**
 * Glossary keywords. The first eight are the KEYWORD_FILTERS chips; the rest
 * only ever appear as tags on a term's detail screen.
 */
export const SOZLUK_KEYWORD_EN: Record<string, string> = {
  'defans': 'defense',
  'hücum': 'attack',
  'servis': 'serve',
  'pas': 'pass',
  'blok': 'block',
  'smaç': 'spike',
  'pozisyon': 'position',
  'rotasyon': 'rotation',
  'savunma': 'defense',
  'kural': 'rules',
  'kontrol': 'control',
  'file': 'net',
  'hız': 'speed',
  'yerleştirme': 'placement',
  'doğrudan sayı': 'direct point',
  'servis karşılama': 'reception',
  'gövde pozisyonu': 'body position',
  'platform': 'platform',
  'istatistik': 'statistics',
  'saha': 'court',
  'taktik': 'tactics',
};
export const sozlukKeywordLabel = make(SOZLUK_KEYWORD_EN);

/** modules.ts `category` */
export const MODULE_CATEGORY_EN: Record<string, string> = {
  'Bireysel Performans': 'Individual Performance',
  'Teknik Gelişim': 'Technical Development',
  'Takım Organizasyonu': 'Team Organization',
  'Pozisyona Özel': 'Position-Specific',
  'Temel Teknikler': 'Fundamental Skills',
  'Atak Teknikleri': 'Attacking Skills',
  'Savunma Teknikleri': 'Defensive Skills',
  'Servis Teknikleri': 'Serving Skills',
};
export const moduleCategoryLabel = make(MODULE_CATEGORY_EN);

/** readyPrograms.ts `skill` — the ready-program flavour of the skill vocabulary */
export const PROGRAM_SKILL_EN: Record<string, string> = {
  'Servis': 'Serving',
  'Atak': 'Attacking',
  'Savunma': 'Defense',
  'Pas': 'Setting',
  'Manşet': 'Forearm Pass',
};
export const programSkillLabel = make(PROGRAM_SKILL_EN);

// ── Dates ────────────────────────────────────────────────────────────────────

export const MONTHS: Record<Lang, string[]> = {
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** Monday-first, matching the calendar grid used across the app. */
export const WEEKDAYS_SHORT: Record<Lang, string[]> = {
  tr: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};

export const WEEKDAYS_LONG: Record<Lang, string[]> = {
  tr: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

/** BCP-47 tag for Intl / toLocaleDateString / localeCompare. */
export const LOCALE: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US' };

/** Index rail alphabet — Turkish has letters an English list would never hit. */
export const ALPHABETS: Record<Lang, string[]> = {
  tr: 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split(''),
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
};
