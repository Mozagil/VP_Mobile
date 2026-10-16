import { I18nManager, Platform, Settings } from 'react-native';
import type { Lang } from './types';

// The app opens in the device's language until the user picks one in the profile:
// a Turkish device gets Turkish, every other language English.
//
// Only React Native's own APIs are used (no expo-localization), so this ships in an
// over-the-air update without a new store build.

/** "tr", "tr-TR", "tr_TR" → tr; any other recognisable locale → en; nothing usable → null. */
export function langFromLocale(locale: string | null | undefined): Lang | null {
  if (!locale) return null;
  const code = locale.trim().toLowerCase().split(/[-_@.]/)[0];
  // "und" is the BCP 47 code for "undetermined".
  if (!/^[a-z]{2,3}$/.test(code) || code === 'und') return null;
  return code === 'tr' ? 'tr' : 'en';
}

/** First candidate that names a language; Turkish when none does (the previous default). */
export function pickLang(candidates: Array<string | null | undefined>): Lang {
  for (const candidate of candidates) {
    const lang = langFromLocale(candidate);
    if (lang) return lang;
  }
  return 'tr';
}

function deviceLocaleCandidates(): Array<string | null | undefined> {
  const out: Array<string | null | undefined> = [];
  try {
    if (Platform.OS === 'ios') {
      // The user's ordered language list from iOS Settings, then the region locale.
      const languages = Settings.get('AppleLanguages') as string[] | undefined;
      out.push(Array.isArray(languages) ? languages[0] : undefined, Settings.get('AppleLocale') as string | undefined);
    } else if (Platform.OS === 'android') {
      out.push(I18nManager.getConstants?.().localeIdentifier);
    }
  } catch {
    /* native setting unavailable: fall through to Intl */
  }
  try {
    out.push(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    /* no Intl */
  }
  return out;
}

export function detectDeviceLang(): Lang {
  return pickLang(deviceLocaleCandidates());
}
