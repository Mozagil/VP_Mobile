import { allDrills } from './drills';
import { fillToBudget } from '../utils/trainingPlan';
import { Drill } from './types';

export type ReadyProgram = {
  key: string;
  title: string;
  /** Canonical (Turkish) skill key — translated for display via programSkillLabel. */
  skill: string;
  desc: string;
  titleEn: string;
  descEn: string;
};

export const READY_PROGRAMS: ReadyProgram[] = [
  {
    key: 'servis', title: 'Servis Antrenmanı', skill: 'Servis',
    desc: 'Servis tekniğini ve isabetini geliştirmeye odaklanan 45 dakikalık program.',
    titleEn: 'Serving Session',
    descEn: 'A 45-minute program focused on developing serving technique and accuracy.',
  },
  {
    key: 'atak', title: 'Atak Antrenmanı', skill: 'Atak',
    desc: 'Hücum ve smaç tekniğini geliştirmeye odaklanan 45 dakikalık program.',
    titleEn: 'Attacking Session',
    descEn: 'A 45-minute program focused on developing attacking and spiking technique.',
  },
  {
    key: 'defans', title: 'Defans Antrenmanı', skill: 'Savunma',
    desc: 'Savunma reaksiyonu ve pozisyon almayı geliştiren 45 dakikalık program.',
    titleEn: 'Defense Session',
    descEn: 'A 45-minute program that develops defensive reactions and positioning.',
  },
  {
    key: 'parmak-pas', title: 'Parmak Pas Antrenmanı', skill: 'Pas',
    desc: 'Parmak pas kontrolü ve isabetini geliştiren 45 dakikalık program.',
    titleEn: 'Overhead Passing Session',
    descEn: 'A 45-minute program that develops overhead pass control and accuracy.',
  },
  {
    key: 'manset', title: 'Manşet Antrenmanı', skill: 'Manşet',
    desc: 'Manşet pas kontrolü ve servis karşılamayı geliştiren 45 dakikalık program.',
    titleEn: 'Forearm Passing Session',
    descEn: 'A 45-minute program that develops forearm pass control and serve receive.',
  },
];

export type ProgramSection = { phase: string; drills: Drill[] };

// Hazır programlar 45 dakikalık olarak duyuruluyor; bölüm süreleri buna göre
// dağıtılıyor (8 dk ısınma + 32 dk ana antrenman + 5 dk soğuma).
const READY_PROGRAM_BUDGET = { 'Isınma': 8, 'Ana Antrenman': 32, 'Soğuma': 5 } as const;

// Deterministic (non-random) selection so the "ready" program shows the same
// drills every time.
export function buildReadyProgram(skill: string): ProgramSection[] {
  const byId = (a: Drill, b: Drill) => a.id - b.id;

  const warmupPool = allDrills.filter((d) => d.phase === 'Isınma').sort(byId);
  const mainPool = allDrills.filter((d) => d.phase === 'Ana Antrenman').sort(byId);
  const cooldownPool = allDrills.filter((d) => d.phase === 'Soğuma').sort(byId);

  const usedIds = new Set<number>();
  const take = (pool: Drill[], budget: number, preferSkill?: string) => {
    const available = pool.filter((d) => !usedIds.has(d.id));
    const preferred = preferSkill ? available.filter((d) => d.skill === preferSkill) : [];
    const rest = available.filter((d) => !preferred.includes(d));
    const picked = fillToBudget([...preferred, ...rest], budget);
    picked.forEach((d) => usedIds.add(d.id));
    return picked;
  };

  return [
    { phase: 'Isınma', drills: take(warmupPool, READY_PROGRAM_BUDGET['Isınma']) },
    { phase: 'Ana Antrenman', drills: take(mainPool, READY_PROGRAM_BUDGET['Ana Antrenman'], skill) },
    { phase: 'Soğuma', drills: take(cooldownPool, READY_PROGRAM_BUDGET['Soğuma']) },
  ].filter((sec) => sec.drills.length > 0);
}
