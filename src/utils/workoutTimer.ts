// Sayacın başlangıç anı plan bazında saklanır. Hem "Antrenmanı Başlat"a
// basıldığında hem de her yeni harekete geçildiğinde yeniden başlatılır;
// böylece sayaç o hareket üzerinde geçen süreyi gösterir.
const startedAt = new Map<string, number>();

/** Sayacı bu andan itibaren yeniden başlatır. */
export function startWorkoutTimer(planId: string): void {
  startedAt.set(planId, Date.now());
}

export function workoutElapsedSeconds(planId: string): number {
  const start = startedAt.get(planId);
  return start ? Math.max(0, Math.floor((Date.now() - start) / 1000)) : 0;
}

export function formatElapsed(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
