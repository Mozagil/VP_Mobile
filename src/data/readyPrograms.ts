import { allDrills } from './drills';
import { Drill } from './types';

export type ReadyProgram = {
  key: string;
  title: string;
  skill: string;
  desc: string;
};

export const READY_PROGRAMS: ReadyProgram[] = [
  { key: 'servis', title: 'Servis Antrenmanı', skill: 'Servis', desc: 'Servis tekniğini ve isabetini geliştirmeye odaklanan 45 dakikalık program.' },
  { key: 'atak', title: 'Atak Antrenmanı', skill: 'Atak', desc: 'Hücum ve smaç tekniğini geliştirmeye odaklanan 45 dakikalık program.' },
  { key: 'defans', title: 'Defans Antrenmanı', skill: 'Savunma', desc: 'Savunma reaksiyonu ve pozisyon almayı geliştiren 45 dakikalık program.' },
  { key: 'parmak-pas', title: 'Parmak Pas Antrenmanı', skill: 'Pas', desc: 'Parmak pas kontrolü ve isabetini geliştiren 45 dakikalık program.' },
  { key: 'manset', title: 'Manşet Antrenmanı', skill: 'Manşet', desc: 'Manşet pas kontrolü ve servis karşılamayı geliştiren 45 dakikalık program.' },
];

export type ProgramSection = { phase: string; drills: Drill[] };

// Deterministic (non-random) selection so the "ready" program shows the same
// drills every time — mirrors AIWizardScreen's buildPlan sizing for a 45min plan.
export function buildReadyProgram(skill: string): ProgramSection[] {
  const byId = (a: Drill, b: Drill) => a.id - b.id;

  const warmupPool = allDrills.filter((d) => d.phase === 'Isınma').sort(byId);
  const mainPool = allDrills.filter((d) => d.phase === 'Ana Antrenman').sort(byId);
  const cooldownPool = allDrills.filter((d) => d.phase === 'Soğuma').sort(byId);

  const usedIds = new Set<number>();
  const take = (pool: Drill[], n: number, preferSkill?: string) => {
    const available = pool.filter((d) => !usedIds.has(d.id));
    const preferred = preferSkill ? available.filter((d) => d.skill === preferSkill) : [];
    const rest = available.filter((d) => !preferred.includes(d));
    const picked = [...preferred, ...rest].slice(0, n);
    picked.forEach((d) => usedIds.add(d.id));
    return picked;
  };

  return [
    { phase: 'Isınma', drills: take(warmupPool, 2) },
    { phase: 'Ana Antrenman', drills: take(mainPool, 5, skill) },
    { phase: 'Soğuma', drills: take(cooldownPool, 2) },
  ].filter((sec) => sec.drills.length > 0);
}
