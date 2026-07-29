import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { colors } from '../../theme/colors';
import {
  buildPhaseBreakdown, buildPhaseCompletionBreakdown, buildWeekDays, findActivePlan, findNextUpcomingSession,
  formatSessionBadge, locationLabel, overallCompletionPct, planTotalMinutes, weekSessionsOf,
} from '../../utils/trainingPlan';
import { maybeNotifyWeeklyGoal, maybeSendMotivation } from '../../utils/notifications';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';

type PanelStackParamList = {
  PanelMain: undefined;
  AllTrainings: undefined;
  NextTrainingDetail: { planId: string };
  TrainingCalendar: undefined;
  ProfileShortcuts: undefined;
  Bildirimler: undefined;
};

type Props = { navigation: NativeStackNavigationProp<PanelStackParamList, 'PanelMain'> };

const levelLabels: Record<string, string> = {
  başlangıç: 'Başlangıç', baslangic: 'Başlangıç',
  orta: 'Orta', ileri: 'İleri', profesyonel: 'Profesyonel',
};

function CourtPlaceholder() {
  return (
    <View style={s.court}>
      <View style={s.courtNet} />
      <Icon name="voleybol-topu" size={34} style={s.courtIcon} />
      <Text style={s.courtCaption}>taktik şeması</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }: Props) {
  const { user } = useAuth() as any;
  const { data: profile } = useProfile();
  const { data: plans = [] } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'Oyuncu';
  const lastName = profile?.last_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const initials = (firstName[0] || '🏐').toUpperCase();
  const username = user?.email?.split('@')[0];
  const levelLabel = profile?.level ? (levelLabels[profile.level] ?? profile.level) : null;

  const weekDays = buildWeekDays(sessions);
  const weekSessions = weekSessionsOf(sessions);
  const weeklyDone = weekSessions.filter((s) => s.completed).length;
  const weeklyTarget = profile?.frequency ?? (weekSessions.length || undefined);

  const nextSession = findNextUpcomingSession(sessions, plans);
  const nextSessionPlan = nextSession ? plans.find((p) => p.id === nextSession.plan_id) : undefined;
  const activePlan = nextSessionPlan ?? findActivePlan(plans);
  const phaseBreakdown = activePlan ? buildPhaseBreakdown(activePlan) : [];
  const totalMinutes = activePlan ? planTotalMinutes(activePlan) : 0;
  const nextDateLabel = formatSessionBadge(nextSession?.session_date, nextSession?.session_time)
    ?? formatSessionBadge(activePlan?.start_date);
  const activeLocation = locationLabel(activePlan?.location);
  const overallPct = overallCompletionPct(plans);
  const phaseCompletion = buildPhaseCompletionBreakdown(plans);

  useEffect(() => {
    maybeNotifyWeeklyGoal(weeklyDone, weeklyTarget);
  }, [weeklyDone, weeklyTarget]);

  useEffect(() => {
    maybeSendMotivation();
  }, []);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <View style={s.logoRow}>
            <Icon name="voleybol-topu" size={28} />
            <Text style={s.logoTxt}>VoleyPro</Text>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() => navigation.navigate('TrainingCalendar')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="takvim" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() => navigation.navigate('Bildirimler')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="bildirim" size={18} />
          </TouchableOpacity>
        </View>

        {/* ── Greeting ── */}
        <View style={s.greetWrap}>
          <Text style={s.greetTitle}>Merhaba, {firstName}! 👋</Text>
          <Text style={s.greetSub}>Bugün daha iyi bir sen olmak için hazır mısın?</Text>
        </View>

        {/* ── Profil kısayolu kartı ── */}
        <View style={s.section}>
          <View style={[s.card, s.profileCard]}>
            <View style={s.profileAvatar}>
              <Text style={s.profileAvatarTxt}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName} numberOfLines={1}>{fullName || 'Oyuncu'}</Text>
              <Text style={s.profileMeta} numberOfLines={1}>
                {username ? `@${username}` : ''}{username && levelLabel ? '  ·  ' : ''}{levelLabel ?? ''}
              </Text>
            </View>
            <TouchableOpacity
              style={s.profileBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProfileShortcuts')}
            >
              <Text style={s.profileBtnTxt}>Profil ve Ayarlar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bu Hafta + Genel İlerleme ── */}
        <View style={s.section}>
          <View style={s.card}>
            <View style={s.cardHeaderRow}>
              <Text style={s.cardTitle}>Bu Hafta</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.goalLabel}>Hedefin</Text>
                <Text style={s.goalValue}>
                  {weeklyTarget ? `${weeklyDone}/${weeklyTarget}` : `${weeklyDone}`}
                </Text>
              </View>
            </View>

            <View style={s.daysRow}>
              {weekDays.map((d) => (
                <View key={d.key} style={s.dayCol}>
                  <View
                    style={[
                      s.dayDotSmall,
                      d.status === 'scheduled' && s.dayDotScheduled,
                      d.status === 'done' && s.dayDotDone,
                      d.isToday && s.dayDotToday,
                    ]}
                  >
                    {d.status === 'done' && <Text style={s.dayCheckSmall}>✓</Text>}
                    {d.status === 'scheduled' && <Text style={s.dayCheckSmall}>–</Text>}
                  </View>
                  <Text style={s.dayLabelSmall}>{d.label}</Text>
                </View>
              ))}
            </View>

            <View style={s.divider} />

            <Text style={s.cardTitle}>Genel İlerleme</Text>
            <View style={s.ring}>
              <Text style={s.ringPct}>{overallPct}%</Text>
            </View>
            <Text style={s.ringCaption}>Genel Puan</Text>

            {phaseCompletion.map((ph) => (
              <View key={ph.phase} style={s.skillRow}>
                <PhaseIcon phase={ph.phase} size={14} />
                <Text style={s.skillLabel} numberOfLines={1}>{ph.label}</Text>
                <Text style={s.skillPct}>{ph.pct}%</Text>
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.getParent()?.navigate('AntrenmanStack' as any, { screen: 'GelisimMain' } as any)}
            >
              <Text style={s.detailLink}>Detaylı Analiz  ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Sıradaki Antrenman ── */}
        <View style={s.section}>
          {activePlan ? (
            <View style={s.card}>
              <View style={s.cardHeaderRow}>
                <Text style={s.cardTitle}>Sıradaki Antrenman</Text>
                {nextDateLabel && (
                  <View style={s.nextDateRow}>
                    <Icon name="sure" size={12} />
                    <Text style={s.nextDate}>{nextDateLabel}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={s.planTitleCard}
                activeOpacity={0.75}
                onPress={() => navigation.getParent()?.navigate('AntrenmanStack' as any, { screen: 'StartTraining', params: { planId: activePlan.id } } as any)}
              >
                <Text style={s.planTitle} numberOfLines={1}>{activePlan.name}</Text>
                <Text style={s.planTitleArrow}>›</Text>
              </TouchableOpacity>
              <Text style={s.planMeta}>
                {totalMinutes > 0 ? `${totalMinutes} dakika` : 'Süre belirtilmedi'}
                {activeLocation ? `  ·  ${activeLocation}` : ''}
                {activePlan.team ? `  ·  ${activePlan.team}` : ''}
              </Text>

              <CourtPlaceholder />

              {phaseBreakdown.length > 0 ? (
                phaseBreakdown.map((p) => (
                  <View key={p.phase} style={s.phaseRow}>
                    <PhaseIcon phase={p.phase} size={14} />
                    <Text style={s.phaseLabel}>{p.label}</Text>
                    <Text style={s.phaseMinutes}>{p.minutes} dk</Text>
                  </View>
                ))
              ) : (
                <Text style={s.noDrills}>Bu planda henüz dril yok.</Text>
              )}

              <TouchableOpacity
                style={s.goBtn}
                activeOpacity={0.85}
                onPress={() => navigation.getParent()?.navigate('AntrenmanStack' as any, { screen: 'AntrenmanHub' } as any)}
              >
                <Text style={s.goBtnTxt}>Antrenmanları Gör  ›</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.emptyCard}>
              <Text style={s.emptyIcon}>📋</Text>
              <Text style={s.emptyTitle}>Henüz antrenman planınız yok</Text>
              <Text style={s.emptyDesc}>Antrenman sekmesinden yeni bir plan oluşturun.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },

  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  logoTxt: { color: colors.foreground, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  iconBtnTxt: { fontSize: 16 },

  greetWrap: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
  greetTitle: { color: colors.foreground, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  greetSub: { color: colors.muted, fontSize: 14, lineHeight: 20 },

  section: { paddingHorizontal: 16, marginTop: 16 },

  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },

  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.accent + '30', borderWidth: 2, borderColor: colors.accent + '70',
    alignItems: 'center', justifyContent: 'center',
  },
  profileAvatarTxt: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  profileName: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  profileMeta: { color: colors.muted, fontSize: 12 },
  profileBtn: {
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardAlt,
  },
  profileBtnTxt: { color: colors.foreground, fontSize: 12, fontWeight: '700' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700' },

  goalLabel: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  goalValue: { color: colors.accent, fontSize: 18, fontWeight: '800' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },

  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 4 },
  dayDotSmall: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dayDotScheduled: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayDotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dayDotToday: { borderColor: colors.blue, borderWidth: 2 },
  dayCheckSmall: { color: '#fff', fontSize: 10, fontWeight: '800' },
  dayLabelSmall: { color: colors.muted, fontSize: 8, fontWeight: '600' },

  ring: {
    width: 96, height: 96, borderRadius: 48, borderWidth: 8, borderColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 8,
  },
  ringPct: { color: colors.foreground, fontSize: 20, fontWeight: '800' },
  ringCaption: { color: colors.muted, fontSize: 12, textAlign: 'center', marginBottom: 14 },

  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  skillIcon: { fontSize: 14 },
  skillLabel: { color: colors.foreground, fontSize: 13, flex: 1 },
  skillPct: { color: colors.muted, fontSize: 13, fontWeight: '700' },

  detailLink: { color: colors.accent, fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 10 },

  nextDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nextDate: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  planTitleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.cardAlt, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8,
  },
  planTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, marginRight: 8 },
  planTitleArrow: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  planMeta: { color: colors.muted, fontSize: 13, marginBottom: 4 },

  court: {
    height: 110, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border,
    backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center',
    marginVertical: 14, overflow: 'hidden', position: 'relative',
  },
  courtNet: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: colors.border },
  courtIcon: { marginBottom: 4 },
  courtCaption: { color: colors.muted, fontSize: 10, fontFamily: 'monospace', letterSpacing: 0.5 },

  phaseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  phaseIcon: { fontSize: 14, width: 20 },
  phaseLabel: { color: colors.foreground, fontSize: 13, flex: 1 },
  phaseMinutes: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  noDrills: { color: colors.muted, fontSize: 13, paddingVertical: 6 },

  goBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  goBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  emptyCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
