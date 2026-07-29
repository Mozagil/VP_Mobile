export type DrillSections = { amac: string | null; aciklama: string | null };

// Shared parser for the "Drilin Amacı: ... \n\n Uygulama: ... \n\n Önemli Noktalar: ..."
// format used across data/drills.ts. Used everywhere a drill's real description is
// shown (library detail, guided player) so the presentation stays identical.
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

  const amac = map['Drilin Amacı'] ?? null;
  const uygulama = map['Uygulama'] ?? null;
  const notlar = map['Önemli Noktalar'] ?? null;
  const aciklama = [uygulama, notlar].filter(Boolean).join('\n\n') || null;

  return { amac, aciklama };
}
