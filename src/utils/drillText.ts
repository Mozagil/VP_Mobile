export type DrillSections = { amac: string | null; aciklama: string | null };

// Shared parser for the "Drilin Amacı: ... \n\n Uygulama: ... \n\n Önemli Noktalar: ..."
// format used across data/drills.ts, and its English mirror in data/drillsEn.ts
// ("Drill Objective: ... / Execution: ... / Key Points: ..."). Used everywhere a
// drill's real description is shown (library detail, guided player) so the
// presentation stays identical.
const OBJECTIVE_KEYS = ['Drilin Amacı', 'Drill Objective'];
const EXECUTION_KEYS = ['Uygulama', 'Execution'];
const NOTES_KEYS = ['Önemli Noktalar', 'Key Points'];

function firstOf(map: Record<string, string>, keys: string[]): string | null {
  for (const key of keys) {
    if (map[key] != null) return map[key];
  }
  return null;
}

export function parseDrillDesc(desc: string): DrillSections {
  const parts = desc.split('\n\n').filter(Boolean);
  const map: Record<string, string> = {};
  parts.forEach((part) => {
    const idx = part.indexOf(':');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    map[key] = value;
  });

  const amac = firstOf(map, OBJECTIVE_KEYS);
  const uygulama = firstOf(map, EXECUTION_KEYS);
  const notlar = firstOf(map, NOTES_KEYS);
  const aciklama = [uygulama, notlar].filter(Boolean).join('\n\n') || null;

  return { amac, aciklama };
}
