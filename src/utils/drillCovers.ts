import { coverPhotoUrlFor } from './drillCoverPhotos';
import { difficultyLabel as domainDifficultyLabel } from '../i18n/domain';
import type { Lang } from '../i18n/types';

const COVERS: Record<string, any> = {
  Atak: require('../assets/covers/attack.jpg'),
  Blok: require('../assets/covers/block.jpg'),
  Savunma: require('../assets/covers/defense.jpg'),
  Pas: require('../assets/covers/passing.jpg'),
  Manşet: require('../assets/covers/passing.jpg'),
  Servis: require('../assets/covers/serve.jpg'),
  Pasörlük: require('../assets/covers/setting.jpg'),
  Taktik: require('../assets/covers/tactics.jpg'),
};

const PHASE_COVERS: Record<string, any> = {
  Isınma: require('../assets/covers/warmup.jpg'),
  Oyun: require('../assets/covers/game.jpg'),
  Soğuma: require('../assets/covers/cooldown.jpg'),
};

const FALLBACK = require('../assets/covers/game.jpg');

export function coverFor(skill: string, phase: string, drillId?: number) {
  if (drillId) {
    const url = coverPhotoUrlFor(drillId);
    if (url) return { uri: url };
  }
  return COVERS[skill] ?? PHASE_COVERS[phase] ?? FALLBACK;
}

export const levelToDifficulty: Record<string, string> = {
  'Başlangıç': 'Kolay',
  'Orta': 'Orta',
  'İleri': 'Zor',
};

/**
 * Maps a canonical drill level to the difficulty wording used on cards.
 * The Turkish value stays canonical; `lang` only affects what is rendered.
 */
export function difficultyLabel(level: string, lang: Lang = 'tr'): string {
  const difficulty = levelToDifficulty[level] ?? level;
  return domainDifficultyLabel(difficulty, lang);
}
