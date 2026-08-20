import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import {
  buildPhaseBreakdown, buildPhaseCompletionBreakdown, buildWeekDays, findActivePlan, findNextUpcomingSession,
  formatSessionBadge, locationLabel, overallCompletionPct, planTotalMinutes, weekSessionsOf,
} from '../../utils/trainingPlan';
import { useI18n, profileLevelLabel } from '../../i18n';
import { maybeNotifyWeeklyGoal } from '../../utils/notifications';
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

export default function DashboardScreen({ navigation }: Props) {
  const { colors, mode } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { user } = useAuth() as any;
  const { data: profile } = useProfile();
  const { data: plans = [] } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();

  const firstName = profile?.first_name || user?.email?.split('@')[0] || t('profile.defaultName');
  const lastName = profile?.last_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const initials = (firstName[0] || '🏐').toUpperCase();
  const username = user?.email?.split('@')[0];
  const levelLabel = profileLevelLabel(profile?.level, lang);

  const weekDays = buildWeekDays(sessions, lang);
  const weekSessions = weekSessionsOf(sessions);
  const weeklyDone = weekSessions.filter((s) => s.completed).length;
  const weeklyTarget = profile?.frequency ?? (weekSessions.length || undefined);

  const nextSession = findNextUpcomingSession(sessions, plans);
  const nextSessionPlan = nextSession ? plans.find((p) => p.id === nextSession.plan_id) : undefined;
  const activePlan = nextSessionPlan ?? findActivePlan(plans, sessions);
  const phaseBreakdown = activePlan ? buildPhaseBreakdown(activePlan, colors, lang) : [];
  const totalMinutes = activePlan ? planTotalMinutes(activePlan, colors) : 0;
  const nextDateLabel = formatSessionBadge(nextSession?.session_date, nextSession?.session_time, lang)
    ?? formatSessionBadge(activePlan?.start_date, null, lang);
  const activeLocation = locationLabel(activePlan?.location, lang);
  const overallPct = overallCompletionPct(plans);
  const phaseCompletion = buildPhaseCompletionBreakdown(plans, colors, lang);

  useEffect(() => {
    maybeNotifyWeeklyGoal(weeklyDone, weeklyTarget);
  }, [weeklyDone, weeklyTarget]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <View style={s.logoRow}>
            <Image
              source={require('../../assets/logo-voleypro-mark.png')}
              style={s.logoMark}
              resizeMode="contain"
            />
            <Text style={[s.logoTxt, { color: mode === 'light' ? '#0d1b3e' : '#ffffff' }]}>VoleyPro</Text>
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
          <Text style={s.greetTitle}>{t('dashboard.greeting', { name: firstName })}</Text>
          <Text style={s.greetSub}>{t('dashboard.greetSub')}</Text>
        </View>

        {/* ── Profil kısayolu kartı ── */}
        <View style={s.section}>
          <View style={[s.card, s.profileCard]}>
            <View style={s.profileAvatar}>
              <Text style={s.profileAvatarTxt}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName} numberOfLines={1}>{fullName || t('profile.defaultName')}</Text>
              <Text style={s.profileMeta} numberOfLines={1}>
                {username ? `@${username}` : ''}{username && levelLabel ? '  ·  ' : ''}{levelLabel ?? ''}
              </Text>
            </View>
            <TouchableOpacity
              style={s.profileBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProfileShortcuts')}
            >
              <Text style={s.profileBtnTxt}>{t('dashboard.profileAndSettings')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bu Hafta + Genel İlerleme ── */}
        <View style={s.section}>
          <View style={s.card}>
            <View style={s.cardHeaderRow}>
              <Text style={s.cardTitle}>{t('dashboard.thisWeek')}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.goalLabel}>{t('dashboard.yourGoal')}</Text>
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

            <Text style={s.cardTitle}>{t('dashboard.overallProgress')}</Text>
            <View style={s.ring}>
              <Text style={s.ringPct}>{overallPct}%</Text>
            </View>
            <Text style={s.ringCaption}>{t('dashboard.overallScore')}</Text>

            {phaseCompletion.map((ph) => (
              <View key={ph.phase} style={s.skillRow}>
                <PhaseIcon phase={ph.phase} size={14} />
                <Text style={s.skillLabel} numberOfLines={1}>{ph.label}</Text>
                <Text style={s.skillPct}>{ph.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Sıradaki Antrenman ── */}
        <View style={s.section}>
          {activePlan ? (
            <View style={s.card}>
              <View style={s.cardHeaderRow}>
                <Text style={s.cardTitle}>{t('dashboard.nextTraining')}</Text>
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
                {totalMinutes > 0 ? t('common.minutes', { n: totalMinutes }) : t('common.durationUnset')}
                {activeLocation ? `  ·  ${activeLocation}` : ''}
                {activePlan.team ? `  ·  ${activePlan.team}` : ''}
              </Text>

              {phaseBreakdown.length > 0 ? (
                phaseBreakdown.map((p) => (
                  <View key={p.phase} style={s.phaseRow}>
                    <PhaseIcon phase={p.phase} size={14} />
                    <Text style={s.phaseLabel}>{p.label}</Text>
                    <Text style={s.phaseMinutes}>{t('common.minShort', { n: p.minutes })}</Text>
                  </View>
                ))
              ) : (
                <Text style={s.noDrills}>{t('dashboard.noDrillsInPlan')}</Text>
              )}

              <TouchableOpacity
                style={s.goBtn}
                activeOpacity={0.85}
                onPress={() => navigation.getParent()?.navigate('AntrenmanStack' as any, { screen: 'AntrenmanHub' } as any)}
              >
                <Text style={s.goBtnTxt}>{t('dashboard.viewTrainings')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.emptyCard}>
              <Icon name="antrenmanlar" size={36} style={{ marginBottom: 12 }} />
              <Text style={s.emptyTitle}>{t('dashboard.noPlanTitle')}</Text>
              <Text style={s.emptyDesc}>{t('dashboard.noPlanDesc')}</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },

  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  // Source art is 548x132; keep that ratio so the wordmark never distorts.
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: { height: 26, width: 26 },
  logoTxt: { fontSize: 18, fontWeight: '800' },
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
}
