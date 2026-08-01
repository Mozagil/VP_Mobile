import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type NotificationType = 'reminder' | 'completed' | 'goal' | 'motivation';

export type NotificationEntry = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string; // ISO
  read: boolean;
  important: boolean;
};

const FEED_KEY = 'voleypro_notifications_feed';
const SESSION_NOTIF_KEY = 'voleypro_session_notif_ids';
const MAX_FEED_SIZE = 100;

export const notificationIcons: Record<NotificationType, string> = {
  reminder: '📅',
  completed: '✅',
  goal: '🎯',
  motivation: '💬',
};

let initialized = false;

export function initNotifications() {
  if (initialized) return;
  initialized = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  Notifications.requestPermissionsAsync().catch(() => {});

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    }).catch(() => {});
  }

  // The in-app feed is populated when a notification actually fires (not when it's
  // scheduled), so reminders scheduled for later show up at the right time.
  Notifications.addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data as any;
    appendToFeed({
      id: notification.request.identifier,
      type: (data?.type as NotificationType) ?? 'reminder',
      title: notification.request.content.title ?? '',
      body: notification.request.content.body ?? '',
      timestamp: new Date().toISOString(),
      read: false,
      important: !!data?.important,
    });
  });
}

export async function getFeed(): Promise<NotificationEntry[]> {
  const raw = await AsyncStorage.getItem(FEED_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

async function appendToFeed(entry: NotificationEntry) {
  const feed = await getFeed();
  const next = [entry, ...feed].slice(0, MAX_FEED_SIZE);
  await AsyncStorage.setItem(FEED_KEY, JSON.stringify(next));
}

export async function markAllRead(): Promise<NotificationEntry[]> {
  const feed = await getFeed();
  const next = feed.map((n) => ({ ...n, read: true }));
  await AsyncStorage.setItem(FEED_KEY, JSON.stringify(next));
  return next;
}

export async function markRead(id: string): Promise<NotificationEntry[]> {
  const feed = await getFeed();
  const next = feed.map((n) => (n.id === id ? { ...n, read: true } : n));
  await AsyncStorage.setItem(FEED_KEY, JSON.stringify(next));
  return next;
}

export async function sendImmediateNotification(
  type: NotificationType, title: string, body: string, important = false,
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type, important } },
    trigger: null,
  });
}

// ── Training-start reminders (1 hour / 30 minutes before) ───────────────────

async function getSessionNotifMap(): Promise<Record<string, string[]>> {
  const raw = await AsyncStorage.getItem(SESSION_NOTIF_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

async function setSessionNotifMap(map: Record<string, string[]>) {
  await AsyncStorage.setItem(SESSION_NOTIF_KEY, JSON.stringify(map));
}

export async function cancelSessionReminders(sessionId: string) {
  const map = await getSessionNotifMap();
  const ids = map[sessionId] ?? [];
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {})));
  delete map[sessionId];
  await setSessionNotifMap(map);
}

export async function scheduleSessionReminders(
  sessionId: string, planName: string, sessionDate: string, sessionTime?: string | null,
) {
  await cancelSessionReminders(sessionId);
  if (!sessionTime) return;

  const [y, m, d] = sessionDate.slice(0, 10).split('-').map(Number);
  const [hh, mm] = sessionTime.split(':').map(Number);
  const start = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);

  const offsets = [
    { minutesBefore: 60, label: '1 saat' },
    { minutesBefore: 30, label: '30 dakika' },
  ];

  const ids: string[] = [];
  for (const { minutesBefore, label } of offsets) {
    const fireAt = new Date(start.getTime() - minutesBefore * 60 * 1000);
    if (fireAt.getTime() <= Date.now()) continue;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Antrenman Hatırlatması',
        body: `"${planName}" antrenmanın ${label} sonra başlıyor.`,
        data: { type: 'reminder', important: false },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireAt },
    });
    ids.push(id);
  }

  const map = await getSessionNotifMap();
  map[sessionId] = ids;
  await setSessionNotifMap(map);
}

// ── Weekly goal reached (fires once per ISO week) ────────────────────────────

function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

const GOAL_NOTIF_KEY = 'voleypro_goal_notified_week';

export async function maybeNotifyWeeklyGoal(weeklyDone: number, weeklyTarget?: number) {
  if (!weeklyTarget || weeklyDone < weeklyTarget) return;
  const key = isoWeekKey(new Date());
  const lastNotified = await AsyncStorage.getItem(GOAL_NOTIF_KEY);
  if (lastNotified === key) return;
  await AsyncStorage.setItem(GOAL_NOTIF_KEY, key);
  await sendImmediateNotification(
    'goal',
    'Hedefe Ulaştın',
    `Bu haftaki antrenman hedefini (${weeklyTarget}) tamamladın! Harika iş.`,
    true,
  );
}

// ── Motivational message (max once per calendar day) ─────────────────────────

const MOTIVATION_KEY = 'voleypro_last_motivation_date';
const MOTIVATION_CHANCE = 0.35;

const MOTIVATION_MESSAGES = [
  'Bugün attığın her adım seni hedeflerine yaklaştırıyor.',
  'Küçük ilerlemeler, büyük sonuçlar doğurur. Devam et!',
  'Bugün antrenman yapmasan bile, formda kalmayı düşünmen bile bir kazanım.',
  'Disiplin, motivasyon bittiğinde de devam etmektir.',
  'En iyi versiyonun, bugünkü çabanla şekilleniyor.',
];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Dashboard remounts on every tab focus, re-running the effect that calls this.
// The AsyncStorage guard below is async, so back-to-back mounts can both read
// "not sent today" before either finishes writing — guard synchronously first.
let motivationCheckedThisSession = false;

export async function maybeSendMotivation() {
  if (motivationCheckedThisSession) return;
  motivationCheckedThisSession = true;

  const last = await AsyncStorage.getItem(MOTIVATION_KEY);
  const key = todayKey();
  if (last === key) return;
  if (Math.random() > MOTIVATION_CHANCE) return;
  await AsyncStorage.setItem(MOTIVATION_KEY, key);
  const msg = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
  await sendImmediateNotification('motivation', 'Motivasyon Zamanı', msg, false);
}
