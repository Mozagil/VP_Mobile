import type { tr } from './tr';

export type Lang = 'tr' | 'en';
export type TranslationKey = keyof typeof tr;
export type Catalog = Record<TranslationKey, string>;
