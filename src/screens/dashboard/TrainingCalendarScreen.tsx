import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import Calendar from '../../components/ui/Calendar';
import { colors } from '../../theme/colors';
import { buildPhaseBreakdown, dateKeyOf, isSessionMissed, parseLocalDate, phaseDisplay } from '../../utils/trainingPlan';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';

type PanelStackParamList = { TrainingCalendar: undefined };
type Props = { navigation: NativeStackNavigationProp<PanelStackParamList, 'TrainingCalendar'> };

export default function TrainingCalendarScreen({ navigation }: Props) {
  const { data: sessions = [] } = useScheduledSessions();
  const { data: plans = [] } = useTrainingPlans();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const goToStartTraining = (planId: string) => {
    navigation.getParent()?.navigate('AntrenmanStack' as any, { screen: 'StartTraining', params: { planId } } as any);
  };

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (!Number.isNaN(new Date(s.session_date).getTime())) set.add(dateKeyOf(s.session_date));
    });
    return set;
  }, [sessions]);

  const dayDots = useMemo(() => {
    const map: Record<string, string[]> = {};
    sessions.forEach((sess) => {
      if (Number.isNaN(new Date(sess.session_date).getTime())) return;
      const key = dateKeyOf(sess.session_date);
      const plan = plans.find((p) => p.id === sess.plan_id);
      if (!plan) return;
      const colorsForPlan = buildPhaseBreakdown(plan).map((p) => p.color);
      (map[key] ??= []).push(...colorsForPlan);
    });
    return map;
  }, [sessions, plans]);

  const sessionsForDay = useMemo(() => {
    if (!selectedDay) return [];
    return sessions
      .filter((s) => dateKeyOf(s.session_date) === selectedDay)
      .sort((a, b) => (a.session_time ?? '').localeCompare(b.session_time ?? ''));
  }, [sessions, selectedDay]);

  const upcoming = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return [...sessions]
      .filter((sess) => parseLocalDate(sess.session_date) >= todayStart)
      .sort((a, b) => parseLocalDate(a.session_date).getTime() - parseLocalDate(b.session_date).getTime())
      .slice(0, 10);
  }, [sessions]);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Calendar markedDates={markedDates} dots={dayDots} onDayPress={setSelectedDay} />

        <View style={s.legend}>
          {Object.entries(phaseDisplay).map(([phase, disp]) => (
            <View key={phase} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: disp.color }]} />
              <Text style={s.legendTxt}>{disp.label}</Text>
            </View>
          ))}
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: colors.blue }]} />
            <Text style={s.legendTxt}>Bugün</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Yaklaşan Antrenmanlar</Text>
        {upcoming.length === 0 ? (
          <Text style={s.empty}>Planlanmış antrenman yok.</Text>
        ) : (
          upcoming.map((session) => {
            const plan = plans.find((p) => p.id === session.plan_id);
            const missed = isSessionMissed(session);
            return (
              <TouchableOpacity
                key={session.id}
                style={[s.row, (session.completed || missed) && s.rowDone]}
                activeOpacity={0.78}
                disabled={!plan}
                onPress={() => plan && goToStartTraining(plan.id)}
              >
                <Text style={[s.rowDate, missed && s.rowDateMissed]}>
                  {parseLocalDate(session.session_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  {session.session_time ? ` • ${session.session_time}` : ''}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                  {session.completed && <Icon name="tamamlandi" size={14} />}
                  {missed && <Icon name="tamamlanmadi" size={14} />}
                  <Text style={[s.rowName, (session.completed || missed) && s.rowNameDone]} numberOfLines={1}>
                    {plan?.name ?? 'Antrenman'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal visible={!!selectedDay} animationType="slide" transparent onRequestClose={() => setSelectedDay(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>
                {selectedDay ? parseLocalDate(selectedDay).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDay(null)} style={s.modalCloseBtn}>
                <Text style={s.modalCloseTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            {sessionsForDay.length === 0 ? (
              <Text style={s.empty}>Bu günde antrenman yok.</Text>
            ) : (
              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                {sessionsForDay.map((sess) => {
                  const plan = plans.find((p) => p.id === sess.plan_id);
                  if (!plan) return null;
                  const breakdown = buildPhaseBreakdown(plan);
                  return (
                    <TouchableOpacity
                      key={sess.id}
                      style={s.dayModalRow}
                      activeOpacity={0.78}
                      onPress={() => {
                        setSelectedDay(null);
                        goToStartTraining(plan.id);
                      }}
                    >
                      <View style={s.dayModalHeaderRow}>
                        <Text style={s.dayModalIcon}>🏐</Text>
                        <Text style={s.dayModalName} numberOfLines={1}>{plan.name}</Text>
                        {sess.completed && <Icon name="tamamlandi" size={14} />}
                        {isSessionMissed(sess) && <Icon name="tamamlanmadi" size={14} />}
                        {sess.session_time && <Text style={s.dayModalTime}>{sess.session_time}</Text>}
                      </View>
                      <View style={s.dayModalPhasesRow}>
                        {breakdown.map((p) => (
                          <View key={p.phase} style={[s.phaseChip, { borderColor: p.color }]}>
                            <PhaseIcon phase={p.phase} size={11} />
                            <Text style={[s.phaseChipTxt, { color: p.color }]}>{p.label}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 32 },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12, marginBottom: 8, paddingHorizontal: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { color: colors.muted, fontSize: 12 },

  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginTop: 20, marginBottom: 10 },
  empty: { color: colors.muted, fontSize: 13 },

  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border, gap: 10,
  },
  rowDate: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  rowName: { color: colors.foreground, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  rowDone: { opacity: 0.6 },
  rowNameDone: { textDecorationLine: 'line-through', color: colors.muted },
  rowCheck: { color: colors.success, fontSize: 13, fontWeight: '800' },
  rowMissed: { color: colors.error, fontSize: 13, fontWeight: '800' },
  rowDateMissed: { color: colors.error },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, marginRight: 10 },
  modalCloseBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  modalCloseTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  dayModalRow: {
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  dayModalHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dayModalIcon: { fontSize: 16 },
  dayModalName: { color: colors.foreground, fontSize: 14, fontWeight: '700', flex: 1 },
  dayModalTime: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  dayModalPhasesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phaseChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
  },
  phaseChipTxt: { fontSize: 11, fontWeight: '600' },
});
