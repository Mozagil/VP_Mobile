import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { getFeed, markAllRead, markRead, NotificationEntry, NotificationType } from '../../utils/notifications';
import Icon, { IconName } from '../../components/ui/Icon';
import { useI18n } from '../../i18n';

const notificationIconNames: Record<NotificationType, IconName | null> = {
  reminder: 'takvim',
  completed: 'tamamlandi',
  goal: 'hedefler',
  motivation: null,
};
const notificationEmojiFallback: Record<NotificationType, string> = {
  reminder: '📅', completed: '✅', goal: '🎯', motivation: '💬',
};

type PanelStackParamList = { Bildirimler: undefined };
type Props = NativeStackScreenProps<PanelStackParamList, 'Bildirimler'>;

const TABS = [
  { key: 'all', labelKey: 'notifications.filter.all' },
  { key: 'unread', labelKey: 'notifications.filter.unread' },
  { key: 'read', labelKey: 'notifications.filter.read' },
] as const;
type TabKey = typeof TABS[number]['key'];

type Translate = ReturnType<typeof useI18n>['t'];

function relativeTime(iso: string, t: Translate): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return t('common.justNow');
  if (diffMin < 60) return t('common.minutesAgo', { n: diffMin });
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return t('common.hoursAgo', { n: diffHour });
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return t('common.yesterday');
  return t('common.daysAgo', { n: diffDay });
}

export default function BildirimlerScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [tab, setTab] = useState<TabKey>('all');
  const [feed, setFeed] = useState<NotificationEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFeed().then(setFeed);
    }, []),
  );

  const filtered = feed.filter((n) => {
    if (tab === 'unread') return !n.read;
    if (tab === 'read') return n.read;
    return true;
  });

  const onMarkAllRead = async () => {
    const next = await markAllRead();
    setFeed(next);
  };

  const onPressRow = async (n: NotificationEntry) => {
    if (!n.read) {
      const next = await markRead(n.id);
      setFeed(next);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('notifications.title')}</Text>
        <TouchableOpacity onPress={onMarkAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.markAllTxt}>{t('notifications.markAllRead')}</Text>
        </TouchableOpacity>
      </View>

      <View style={s.tabRow}>
        {TABS.map((tab_) => {
          const active = tab === tab_.key;
          return (
            <TouchableOpacity
              key={tab_.key}
              style={[s.tab, active && s.tabActive]}
              activeOpacity={0.8}
              onPress={() => setTab(tab_.key)}
            >
              <Text style={[s.tabTxt, active && s.tabTxtActive]}>{t(tab_.labelKey)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyCard}>
            <Text style={s.emptyIcon}>🔔</Text>
            <Text style={s.emptyTitle}>{t('notifications.emptyTitle')}</Text>
            <Text style={s.emptyDesc}>{t('notifications.emptyDesc')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.row, !item.read && s.rowUnread]}
            activeOpacity={0.78}
            onPress={() => onPressRow(item)}
          >
            {notificationIconNames[item.type] ? (
              <Icon name={notificationIconNames[item.type]!} size={18} />
            ) : (
              <Text style={s.rowIcon}>{notificationEmojiFallback[item.type]}</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{item.title}</Text>
              <Text style={s.rowBody}>{item.body}</Text>
            </View>
            <Text style={s.rowTime}>{relativeTime(item.timestamp, t)}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },
  markAllTxt: { color: colors.accent, fontSize: 11, fontWeight: '700' },

  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
  },
  tabActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  tabTxt: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  tabTxtActive: { color: '#fff' },

  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  rowUnread: { borderColor: colors.accent + '60', backgroundColor: colors.accent + '10' },
  rowIcon: { fontSize: 18 },
  rowTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  rowBody: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  rowTime: { color: colors.muted, fontSize: 10, fontWeight: '600' },

  emptyCard: {
    marginTop: 40, backgroundColor: colors.card, borderRadius: 14, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  });
}
