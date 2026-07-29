import { Drill } from '../data/types';

export type QuickCategory = 'Tümü' | 'Teknik & Pas' | 'Smaç' | 'Servis' | 'Defans';

export const QUICK_CATEGORIES: QuickCategory[] = ['Tümü', 'Teknik & Pas', 'Smaç', 'Servis', 'Defans'];

export type FullCategory = 'Teknik & Pas' | 'Smaç' | 'Servis' | 'Defans' | 'Blok' | 'Kondisyon' | 'Kombinasyon';

export const FULL_CATEGORIES: FullCategory[] = [
  'Teknik & Pas', 'Smaç', 'Servis', 'Defans', 'Blok', 'Kondisyon', 'Kombinasyon',
];

export function matchesCategory(drill: Drill, category: string): boolean {
  switch (category) {
    case 'Teknik & Pas': return ['Pas', 'Manşet', 'Pasörlük'].includes(drill.skill);
    case 'Smaç': return drill.skill === 'Atak';
    case 'Servis': return drill.skill === 'Servis';
    case 'Defans': return drill.skill === 'Savunma';
    case 'Blok': return drill.skill === 'Blok';
    case 'Kondisyon': return drill.skill === 'Kondisyon' || drill.skill === 'Core';
    case 'Kombinasyon': return drill.skill === 'Genel' || drill.skill === 'Taktik';
    default: return true;
  }
}

export const DIFFICULTIES = ['Kolay', 'Orta', 'Zor'];
export const difficultyToLevel: Record<string, string> = { Kolay: 'Başlangıç', Orta: 'Orta', Zor: 'İleri' };

export const PLAYER_COUNTS = ['1 Kişi', '2 Kişi', '3+ Kişi'];

function minPlayers(players: string): number {
  const n = parseInt(players, 10);
  return Number.isNaN(n) ? 1 : n;
}

export function matchesPlayerCount(drill: Drill, option: string): boolean {
  const n = minPlayers(drill.players);
  if (option === '1 Kişi') return n <= 1;
  if (option === '2 Kişi') return n === 2;
  if (option === '3+ Kişi') return n >= 3;
  return true;
}

export function minDurationMinutes(duration: string): number {
  const m = duration.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}
