import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tr } from './tr';
import { en } from './en';
import type { Lang, TranslationKey, Catalog } from './types';

const STORAGE_KEY = 'voleypro_language';

const CATALOGS: Record<Lang, Catalog> = { tr, en };

export type TFunc = (key: TranslationKey, vars?: Record<string, string | number>) => string;

type LanguageContextValue = {
  lang: Lang;
  /** Translate a catalog key. Unknown keys fall back to Turkish, then to the key itself. */
  t: TFunc;
  /** Pick the field matching the active language from a bilingual content record. */
  pick: <T>(tr: T, en: T | undefined | null) => T;
  setLang: (lang: Lang) => void;
};

const noop = (k: string) => k;

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'tr',
  t: noop as TFunc,
  pick: (a) => a,
  setLang: () => {},
});

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m,
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Turkish stays the default: existing users see no change until they opt in.
  const [lang, setLangState] = useState<Lang>('tr');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'tr' || saved === 'en') setLangState(saved);
    });
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const value = useMemo<LanguageContextValue>(() => {
    const catalog = CATALOGS[lang];
    const t: TFunc = (key, vars) => interpolate(catalog[key] ?? tr[key] ?? key, vars);
    const pick = <T,>(trValue: T, enValue: T | undefined | null): T =>
      lang === 'en' && enValue != null ? enValue : trValue;
    return { lang, t, pick, setLang };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  return useContext(LanguageContext);
}
