import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useUpdatePlanStatus } from '../../hooks/useTrainingPlans';
import { useScheduledSessions, useCreateScheduledSession, useUpdateScheduledSessionTime } from '../../hooks/useScheduledSessions';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import {
  buildPhaseBreakdown, findNextSession, formatSessionBadge, planTotalMinutes,
} from '../../utils/trainingPlan';
import ScheduleStep, { getRoundedCurrentTime } from '../../components/ui/ScheduleStep';
import { scheduleSessionReminders } from '../../utils/notifications';
import Icon, { IconName } from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';
import { useI18n } from '../../i18n';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'StartTraining'>;
type Styles = ReturnType<typeof makeStyles>;

export default function StartTrainingScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { planId } = route.params;
  const { data: plans = [], isLoading } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();
  const updateStatus = useUpdatePlanStatus();
  const createSession = useCreateScheduledSession();
  const updateSessionTime = useUpdateScheduledSessionTime();
  const [showSchedule, setShowSchedule] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [editTime, setEditTime] = useState(getRoundedCurrentTime());

  const plan = plans.find((p) => p.id === planId);

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  }
  if (!plan) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>{t('training.notFound')}</Text></View>;
  }

  const total = plan.drills.length;
  const minutes = planTotalMinutes(plan, colors);
  const nextSession = findNextSession(sessions, plan.id);
  const dayLabel = formatSessionBadge(nextSession?.session_date, nextSession?.session_time, lang)
    ?? formatSessionBadge(plan.start_date, null, lang)
    ?? t('common.notScheduled');
  const phaseBreakdown = buildPhaseBreakdown(plan, colors, lang);

  const goToPhase = (phase: string) => navigation.navigate('PhaseSequence', { planId: plan.id, phase });

  const openScheduleEditor = () => {
    setEditDate(nextSession?.session_date ? nextSession.session_date.slice(0, 10) : null);
    setEditTime(nextSession?.session_time ?? getRoundedCurrentTime());
    setShowSchedule(true);
  };

  const saveSchedule = () => {
    if (!editDate) { setShowSchedule(false); return; }
    const time = editTime.trim() || undefined;
    if (nextSession) {
      updateSessionTime.mutate(
        { sessionId: nextSession.id, session_date: editDate, session_time: time },
        {
          onSuccess: () => {
            scheduleSessionReminders(plan.id, plan.name, editDate, time ?? null);
            setShowSchedule(false);
          },
          onError: () => Alert.alert(t('common.error'), t('start.updateError')),
        },
      );
    } else {
      createSession.mutate(
        { plan_id: plan.id, session_date: editDate, session_time: time },
        {
          onSuccess: () => {
            scheduleSessionReminders(plan.id, plan.name, editDate, time ?? null);
            setShowSchedule(false);
          },
          onError: () => Alert.alert(t('common.error'), t('start.saveError')),
        },
      );
    }
  };

  const start = () => {
    updateStatus.mutate(
      { id: plan.id, status: 'active' },
      { onSuccess: () => goToPhase(phaseBreakdown[0]?.phase ?? 'Isınma') },
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('start.title')}</Text>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.navigate('ProgramDetail', { planId: plan.id })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.backTxt}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <View style={s.iconBox}>
              <Icon name="antrenmanlar" size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.planName} numberOfLines={2}>{plan.name}</Text>
              <Text style={s.planMeta}>
                {minutes > 0 ? t('start.drillCountDuration', { n: total, min: minutes }) : t('start.drillCount', { n: total })}
              </Text>
              {plan.status === 'active' && <Text style={s.activeTag}>{t('start.activeTag')}</Text>}
            </View>
          </View>
        </View>

        <View style={s.infoCard}>
          <TouchableOpacity activeOpacity={0.7} onPress={openScheduleEditor}>
            <InfoRow iconName="takvim" label={t('start.day')} value={dayLabel} editable s={s} />
          </TouchableOpacity>
        </View>

        <Text style={s.sectionTitle}>{t('start.sections')}</Text>
        {phaseBreakdown.map((p) => (
          <TouchableOpacity key={p.phase} style={s.phaseRow} activeOpacity={0.78} onPress={() => goToPhase(p.phase)}>
            <View style={[s.dot, { backgroundColor: p.color }]} />
            <PhaseIcon phase={p.phase} size={15} />
            <View style={{ flex: 1 }}>
              <Text style={s.phaseLabel}>{p.label}</Text>
              <Text style={s.phaseMeta}>{t('start.drillCountDuration', { n: p.count, min: p.minutes })}</Text>
            </View>
            <Text style={s.phaseArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, updateStatus.isPending && { opacity: 0.6 }]}
          activeOpacity={0.85}
          onPress={start}
          disabled={updateStatus.isPending}
        >
          <Text style={s.primaryBtnTxt}>{updateStatus.isPending ? t('common.starting') : t('start.startButton')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSchedule} animationType="slide" transparent onRequestClose={() => setShowSchedule(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('start.pickDateTime')}</Text>
              <TouchableOpacity onPress={() => setShowSchedule(false)} style={s.modalCloseBtn}>
                <Text style={s.modalCloseTxt}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '80%' }}>
              <ScheduleStep
                selectedDate={editDate}
                onSelectDate={setEditDate}
                time={editTime}
                onTimeChange={setEditTime}
                durationMinutes={minutes}
              />
              <TouchableOpacity
                style={[s.primaryBtn, { marginTop: 16 }, (updateSessionTime.isPending || createSession.isPending) && { opacity: 0.6 }]}
                activeOpacity={0.85}
                onPress={saveSchedule}
                disabled={updateSessionTime.isPending || createSession.isPending}
              >
                <Text style={s.primaryBtnTxt}>{t('common.save')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({
  iconName, label, value, editable, s,
}: { iconName: IconName; label: string; value: string; editable?: boolean; s: Styles }) {
  return (
    <View style={s.infoRow}>
      <Icon name={iconName} size={15} />
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue} numberOfLines={1}>{value}</Text>
      {editable && <Text style={s.editArrow}>›</Text>}
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },

  container: { padding: 16, paddingBottom: 32 },

  card: { backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  planName: { color: colors.foreground, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  planMeta: { color: colors.muted, fontSize: 12 },
  activeTag: { color: colors.success, fontSize: 12, fontWeight: '700', marginTop: 4 },

  infoCard: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon: { fontSize: 14, width: 20 },
  infoLabel: { color: colors.muted, fontSize: 13, width: 70 },
  infoValue: { color: colors.foreground, fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' },
  editArrow: { color: colors.muted, fontSize: 16, marginLeft: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800' },
  modalCloseBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  modalCloseTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  sectionTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 10 },
  phaseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  phaseLabel: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  phaseMeta: { color: colors.muted, fontSize: 12 },
  phaseArrow: { color: colors.muted, fontSize: 18 },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
