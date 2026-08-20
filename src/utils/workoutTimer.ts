// "Antrenmanı Başlat"a basıldığı an plan bazında saklanır; böylece hareketler
// arasında yeni ekran açılsa da (DrillPlayer her hareket için yeniden mount
// olur) sayaç sıfırlanmadan devam eder.
const startedAt = new Map<string, number>();

/** Antrenmanı Başlat: sayacı bu andan itibaren yeniden başlatır. */
export function startWorkoutTimer(planId: string): void {
  startedAt.set(planId, Date.now());
}

/** Sayaç hiç başlatılmadıysa (ör. listeden doğrudan bir harekete girildiyse) başlatır. */
export function ensureWorkoutTimer(planId: string): void {
  if (!startedAt.has(planId)) startWorkoutTimer(planId);
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
