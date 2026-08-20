import { TrainingPlan, ScheduledSession } from '../data/types';
import { allDrills } from '../data/drills';
import { Colors } from '../theme/palettes';
import { DRILL_EN } from '../data/drillsEn';
// Imported from the leaf modules rather than i18n/index so this pure helper
// module stays free of the React context barrel.
import { phaseLabel, WEEKDAYS_SHORT, LOCALE } from '../i18n/domain';
import type { Lang } from '../i18n/types';

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
export function getPhaseDisplay(colors: Colors, lang: Lang = 'tr'): Record<string, { label: string; icon: string; iconName?: string; color: string }> {
  return {
    'Isınma':        { label: phaseLabel('Isınma', lang),        icon: '🔥', iconName: 'kalori',         color: colors.phaseIsınma },
    'Ana Antrenman': { label: phaseLabel('Ana Antrenman', lang), icon: '🎯', iconName: 'ana-antrenman',  color: colors.phaseAna },
    'Soğuma':        { label: phaseLabel('Soğuma', lang),        icon: '❄️', iconName: 'soguma',         color: colors.phaseSoğuma },
  };
}

// The web app still writes a 4th phase, 'Oyun', that mobile retired in favor of
// a 3-phase model. Fold it into 'Ana Antrenman' wherever plan drills are grouped
// by phase, so web-created "Oyun" drills don't silently vanish from mobile.
export function normalizePhase(phase: string): string {
  return phase === 'Oyun' ? 'Ana Antrenman' : phase;
}

export function resolveDrillMinutes(pd: { drill_id: number; custom_duration?: number | null }): number {
  if (pd.custom_duration) return pd.custom_duration;
  const drill = allDrills.find((d) => d.id === pd.drill_id);
  if (!drill) return 5;
  // Durations are stored as "MM:SS" (most drills are under a minute, e.g. "0:45").
  // A plain parseInt would read only the leading digits before ":" and silently
  // truncate anything under a minute to 0, so parse both parts and round up to
  // at least 1 minute for any non-zero duration.
  const [minPart, secPart] = drill.duration.split(':');
  const min = parseInt(minPart, 10) || 0;
  const sec = parseInt(secPart ?? '0', 10) || 0;
  const totalMinutes = min + sec / 60;
  return totalMinutes > 0 ? Math.max(1, Math.round(totalMinutes)) : 5;
}

export function resolveDrillName(pd: { drill_id: number; custom_name?: string | null }, lang: Lang = 'tr'): string {
  // A custom name was typed by the user, so it is never translated.
  if (pd.custom_name) return pd.custom_name;
  if (lang === 'en') {
    const translated = DRILL_EN[pd.drill_id]?.name;
    if (translated) return translated;
  }
  const drill = allDrills.find((d) => d.id === pd.drill_id);
  return drill?.name ?? (lang === 'en' ? `Drill #${pd.drill_id}` : `Hareket #${pd.drill_id}`);
}

export function buildPhaseBreakdown(plan: TrainingPlan, colors: Colors, lang: Lang = 'tr') {
  const phaseDisplay = getPhaseDisplay(colors, lang);
  return PHASES.map((phase) => {
    const rows = plan.drills.filter((d) => normalizePhase(d.phase) === phase);
    const minutes = rows.reduce((sum, pd) => sum + resolveDrillMinutes(pd), 0);
    return { phase, ...phaseDisplay[phase], minutes, count: rows.length };
  }).filter((p) => p.count > 0);
}

export function drillsInPhase(plan: TrainingPlan, phase: string) {
  return plan.drills.filter((d) => normalizePhase(d.phase) === phase).sort((a, b) => a.sort_order - b.sort_order);
}

export function estimateCalories(minutes: number): number {
  return Math.round(minutes * 8.5);
}

export function dominantPhaseColor(plan: TrainingPlan, colors: Colors): string {
  const breakdown = buildPhaseBreakdown(plan, colors);
  const top = [...breakdown].sort((a, b) => b.minutes - a.minutes)[0];
  return top?.color ?? colors.accent;
}

export function planTotalMinutes(plan: TrainingPlan, colors: Colors): number {
  return buildPhaseBreakdown(plan, colors).reduce((sum, p) => sum + p.minutes, 0);
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

// The calendar day a plan "belongs to" — its scheduled session date(s) if it
// has any, otherwise the day it was started/created. Plans without a real
// schedule still need a reference day so they don't linger forever.
export function planEffectiveDate(plan: TrainingPlan): Date {
  // start_date often comes back as '' rather than null/undefined, which `??`
  // would let through — fall back on any empty value, not just nullish ones.
  return parseLocalDate((plan.start_date || plan.created_at).slice(0, 10));
}

// A session's actual scheduled moment — date + time when a time was set.
// Without a session_time (or an unscheduled plan), it's only "over" once the
// whole calendar day has elapsed, not merely started.
export function sessionDateTime(session: ScheduledSession): Date {
  const dt = parseLocalDate(session.session_date);
  if (session.session_time) {
    const [hh, mm] = session.session_time.split(':').map(Number);
    dt.setHours(hh || 0, mm || 0, 0, 0);
  } else {
    dt.setHours(23, 59, 59, 999);
  }
  return dt;
}

// A plan whose day has closed — every scheduled session's date+time is
// already behind us, or (for unscheduled plans) its own reference day has
// fully elapsed — has "yarıda kalmış" if still unfinished. It must not keep
// surfacing as the Dashboard's active/next plan or in the "Antrenmanlarım"
// active list; it belongs in the Geçmiş tab, marked "tamamlanmadı".
export function isPlanPastDue(plan: TrainingPlan, sessions: ScheduledSession[]): boolean {
  const now = new Date();
  const planSessions = sessions.filter((s) => s.plan_id === plan.id);
  if (planSessions.length > 0) {
    return planSessions.every((s) => sessionDateTime(s) < now);
  }
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return planEffectiveDate(plan) < todayStart;
}

export function findActivePlan(plans: TrainingPlan[], sessions: ScheduledSession[] = []): TrainingPlan | undefined {
  const notStale = (p: TrainingPlan) => !isPlanPastDue(p, sessions);
  return plans.find((p) => p.status === 'active' && notStale(p))
    ?? plans.find((p) => p.drills.some((d) => !d.completed) && notStale(p))
    ?? plans.find(notStale);
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

export function buildPhaseCompletionBreakdown(plans: TrainingPlan[], colors: Colors, lang: Lang = 'tr'): PhaseCompletion[] {
  const phaseDisplay = getPhaseDisplay(colors, lang);
  const byPhase = new Map<string, { done: number; total: number }>();
  plans.forEach((plan) => {
    plan.drills.forEach((pd) => {
      const phase = normalizePhase(pd.phase);
      const entry = byPhase.get(phase) ?? { done: 0, total: 0 };
      entry.total += 1;
      if (pd.completed) entry.done += 1;
      byPhase.set(phase, entry);
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

export function weekdayLabels(lang: Lang = 'tr'): string[] {
  return lang === 'en' ? WEEKDAYS_SHORT.en : WEEKDAY_LABELS;
}

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

export function buildWeekDays(sessions: ScheduledSession[], lang: Lang = 'tr'): WeekDay[] {
  const monday = getMonday(new Date());
  const today = new Date();
  return weekdayLabels(lang).map((label, i) => {
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
  return sessionDateTime(session) < new Date();
}

export function findNextUpcomingSession(sessions: ScheduledSession[], plans: TrainingPlan[]): ScheduledSession | undefined {
  return [...sessions]
    .filter((s) => !isSessionMissed(s) && !s.completed && plans.some((p) => p.id === s.plan_id))
    .sort((a, b) => parseLocalDate(a.session_date).getTime() - parseLocalDate(b.session_date).getTime())[0];
}

export function formatRelativeDate(dateStr?: string | null, lang: Lang = 'tr'): string | null {
  if (!dateStr) return null;
  const date = parseLocalDate(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  if (sameDay(date, today)) return lang === 'en' ? 'Today' : 'Bugün';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (sameDay(date, tomorrow)) return lang === 'en' ? 'Tomorrow' : 'Yarın';
  return date.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long' });
}

export function formatSessionBadge(dateStr?: string | null, timeStr?: string | null, lang: Lang = 'tr'): string | null {
  const dateLabel = formatRelativeDate(dateStr, lang);
  if (!dateLabel) return null;
  return timeStr ? `${dateLabel} • ${timeStr}` : dateLabel;
}

export const locationLabels: Record<Lang, Record<string, string>> = {
  tr: { salon: 'Salon', dis_saha: 'Dışarıda' },
  en: { salon: 'Indoor', dis_saha: 'Outdoor' },
};

export function locationLabel(location?: string | null, lang: Lang = 'tr'): string | null {
  if (!location) return null;
  return locationLabels[lang][location] ?? location;
}
