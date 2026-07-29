import { TrainingPlan, ScheduledSession } from '../data/types';
import { allDrills } from '../data/drills';
import { colors } from '../theme/colors';

// Shared helpers for turning raw plan/session data into what the
// Dashboard + "Sıradaki Antrenman" detail screen render.

export const PHASES = ['Isınma', 'Ana Antrenman', 'Soğuma'] as const;

// Date-only strings (e.g. "2026-07-30") must NEVER go through `new Date(str)` directly —
// the JS spec parses that form as UTC midnight, which silently shifts to the previous
// local day in any timezone behind UTC. Parse the Y/M/D parts and build a local Date instead.
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function dateKeyOf(dateStr: string): string {
  return dateStr.slice(0, 10);
}

// `iconName` points at an SVG in the shared icon set; `icon` is the emoji fallback
// used only for phases that have no matching SVG yet. Render via <PhaseIcon />.
export const phaseDisplay: Record<string, { label: string; icon: string; iconName?: string; color: string }> = {
  'Isınma':        { label: 'Isınma',         icon: '🔥', iconName: 'kalori',         color: colors.phaseIsınma },
  'Ana Antrenman': { label: 'Ana Antrenman',  icon: '🎯', iconName: 'ana-antrenman',  color: colors.phaseAna },
  'Soğuma':        { label: 'Soğuma',         icon: '❄️', iconName: 'soguma',         color: colors.phaseSoğuma },
};

export function resolveDrillMinutes(pd: { drill_id: number; custom_duration?: number | null }): number {
  if (pd.custom_duration) return pd.custom_duration;
  const drill = allDrills.find((d) => d.id === pd.drill_id);
  if (!drill) return 5;
  const m = parseInt(drill.duration, 10);
  return Number.isNaN(m) ? 5 : m;
}

export function resolveDrillName(pd: { drill_id: number; custom_name?: string | null }): string {
  if (pd.custom_name) return pd.custom_name;
  const drill = allDrills.find((d) => d.id === pd.drill_id);
  return drill?.name ?? `Hareket #${pd.drill_id}`;
}

export function buildPhaseBreakdown(plan: TrainingPlan) {
  return PHASES.map((phase) => {
    const rows = plan.drills.filter((d) => d.phase === phase);
    const minutes = rows.reduce((sum, pd) => sum + resolveDrillMinutes(pd), 0);
    return { phase, ...phaseDisplay[phase], minutes, count: rows.length };
  }).filter((p) => p.count > 0);
}

export function drillsInPhase(plan: TrainingPlan, phase: string) {
  return plan.drills.filter((d) => d.phase === phase).sort((a, b) => a.sort_order - b.sort_order);
}

export function estimateCalories(minutes: number): number {
  return Math.round(minutes * 8.5);
}

export function dominantPhaseColor(plan: TrainingPlan): string {
  const breakdown = buildPhaseBreakdown(plan);
  const top = [...breakdown].sort((a, b) => b.minutes - a.minutes)[0];
  return top?.color ?? colors.accent;
}

export function planTotalMinutes(plan: TrainingPlan): number {
  return buildPhaseBreakdown(plan).reduce((sum, p) => sum + p.minutes, 0);
}

export function planSkills(plan: TrainingPlan): string[] {
  const skills = new Set<string>();
  plan.drills.forEach((pd) => {
    const drill = allDrills.find((d) => d.id === pd.drill_id);
    const skill = pd.custom_skill ?? drill?.skill;
    if (skill) skills.add(skill);
  });
  return Array.from(skills);
}

export function findActivePlan(plans: TrainingPlan[]): TrainingPlan | undefined {
  return plans.find((p) => p.status === 'active')
    ?? plans.find((p) => p.drills.some((d) => !d.completed))
    ?? plans[0];
}

// ── Overall / skill progress (all plans, real drill-completion data) ────────

export function overallCompletionPct(plans: TrainingPlan[]): number {
  const allDrillRows = plans.flatMap((p) => p.drills);
  if (allDrillRows.length === 0) return 0;
  const done = allDrillRows.filter((d) => d.completed).length;
  return Math.round((done / allDrillRows.length) * 100);
}

export const skillIcons: Record<string, string> = {
  Atak: '💥', Blok: '🧱', Core: '🧘', Genel: '🏐', Kondisyon: '🏃',
  Manşet: '🙌', Pas: '🤝', Pasörlük: '🎯', Savunma: '🛡️', Servis: '🎾', Taktik: '🧠',
};

export type SkillBreakdown = { skill: string; icon: string; pct: number; count: number };

export function buildSkillBreakdown(plans: TrainingPlan[], limit = 4): SkillBreakdown[] {
  const bySkill = new Map<string, { done: number; total: number }>();
  plans.forEach((plan) => {
    plan.drills.forEach((pd) => {
      const drill = allDrills.find((d) => d.id === pd.drill_id);
      const skill = pd.custom_skill ?? drill?.skill;
      if (!skill) return;
      const entry = bySkill.get(skill) ?? { done: 0, total: 0 };
      entry.total += 1;
      if (pd.completed) entry.done += 1;
      bySkill.set(skill, entry);
    });
  });

  return Array.from(bySkill.entries())
    .map(([skill, { done, total }]) => ({
      skill, icon: skillIcons[skill] ?? '🏐',
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
      count: total,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type PhaseCompletion = { phase: string; label: string; icon: string; pct: number; count: number };

export function buildPhaseCompletionBreakdown(plans: TrainingPlan[]): PhaseCompletion[] {
  const byPhase = new Map<string, { done: number; total: number }>();
  plans.forEach((plan) => {
    plan.drills.forEach((pd) => {
      const entry = byPhase.get(pd.phase) ?? { done: 0, total: 0 };
      entry.total += 1;
      if (pd.completed) entry.done += 1;
      byPhase.set(pd.phase, entry);
    });
  });

  return PHASES
    .filter((phase) => byPhase.has(phase))
    .map((phase) => {
      const { done, total } = byPhase.get(phase)!;
      const display = phaseDisplay[phase] ?? { label: phase, icon: '🏐', color: colors.accent };
      return {
        phase, label: display.label, icon: display.icon,
        pct: total > 0 ? Math.round((done / total) * 100) : 0,
        count: total,
      };
    });
}

// ── Weekly schedule helpers ──────────────────────────────────────────────────

export const WEEKDAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export type WeekDay = { key: string; label: string; date: Date; status: 'done' | 'scheduled' | 'none'; isToday: boolean };

export function buildWeekDays(sessions: ScheduledSession[]): WeekDay[] {
  const monday = getMonday(new Date());
  const today = new Date();
  return WEEKDAY_LABELS.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const daySessions = sessions.filter((s) => sameDay(parseLocalDate(s.session_date), date));
    const done = daySessions.length > 0 && daySessions.every((s) => s.completed);
    const scheduled = daySessions.length > 0 && !done;
    const status: WeekDay['status'] = done ? 'done' : scheduled ? 'scheduled' : 'none';
    return { key: `${label}-${i}`, label, date, status, isToday: sameDay(date, today) };
  });
}

export function weekSessionsOf(sessions: ScheduledSession[]): ScheduledSession[] {
  const monday = getMonday(new Date());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sessions.filter((s) => {
    const d = parseLocalDate(s.session_date);
    return d >= monday && d <= sunday;
  });
}

export function findNextSession(sessions: ScheduledSession[], planId?: string): ScheduledSession | undefined {
  if (!planId) return undefined;
  return sessions
    .filter((s) => s.plan_id === planId && !s.completed)
    .sort((a, b) => parseLocalDate(a.session_date).getTime() - parseLocalDate(b.session_date).getTime())[0];
}

export function isSessionMissed(session: ScheduledSession): boolean {
  if (session.completed) return false;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return parseLocalDate(session.session_date) < todayStart;
}

export function findNextUpcomingSession(sessions: ScheduledSession[], plans: TrainingPlan[]): ScheduledSession | undefined {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return [...sessions]
    .filter((s) => !s.completed && parseLocalDate(s.session_date) >= todayStart && plans.some((p) => p.id === s.plan_id))
    .sort((a, b) => parseLocalDate(a.session_date).getTime() - parseLocalDate(b.session_date).getTime())[0];
}

export function formatRelativeDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const date = parseLocalDate(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  if (sameDay(date, today)) return 'Bugün';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (sameDay(date, tomorrow)) return 'Yarın';
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

export function formatSessionBadge(dateStr?: string | null, timeStr?: string | null): string | null {
  const dateLabel = formatRelativeDate(dateStr);
  if (!dateLabel) return null;
  return timeStr ? `${dateLabel} • ${timeStr}` : dateLabel;
}

export const locationLabels: Record<string, string> = {
  salon: 'Salon',
  dis_saha: 'Dışarıda',
};

export function locationLabel(location?: string | null): string | null {
  if (!location) return null;
  return locationLabels[location] ?? location;
}
