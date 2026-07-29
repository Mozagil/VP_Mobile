import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useUpdatePlanStatus } from '../../hooks/useTrainingPlans';
import { useScheduledSessions, useCreateScheduledSession } from '../../hooks/useScheduledSessions';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import PhaseIcon from '../../components/ui/PhaseIcon';
import {
  buildPhaseBreakdown, findNextSession, formatSessionBadge, locationLabel, planSkills, planTotalMinutes,
} from '../../utils/trainingPlan';

type PanelStackParamList = {
  PanelMain: undefined;
  NextTrainingDetail: { planId: string };
  TrainingCalendar: undefined;
};

type Props = NativeStackScreenProps<PanelStackParamList, 'NextTrainingDetail'>;

export default function NextTrainingDetailScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const { data: plans = [], isLoading } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();
  const createSession = useCreateScheduledSession();
  const updateStatus = useUpdatePlanStatus();
  const [sessionTime, setSessionTime] = useState('18:00');

  const plan = plans.find((p) => p.id === planId);

  if (isLoading) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>Yükleniyor…</Text></View>;
  }
  if (!plan) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>Plan bulunamadı</Text></View>;
  }

  const nextSession = findNextSession(sessions, plan.id);
  const dateLabel = formatSessionBadge(nextSession?.session_date, nextSession?.session_time)
    ?? formatSessionBadge(plan.start_date)
    ?? 'Planlanmadı';
  const phaseBreakdown = buildPhaseBreakdown(plan);
  const totalMinutes = planTotalMinutes(plan);
  const skills = planSkills(plan);
  const loc = locationLabel(plan.location);

  const handleReady = () => {
    updateStatus.mutate(
      { id: plan.id, status: 'active' },
      {
        onSuccess: () => Alert.alert('Hazırsın! 🏐', 'Antrenman aktif edildi, iyi antrenmanlar!'),
        onError: () => Alert.alert('Hata', 'Antrenman aktif edilirken sorun oluştu.'),
      },
    );
  };

  const handleAddToCalendar = () => {
    createSession.mutate(
      {
        plan_id: plan.id,
        session_date: new Date().toISOString(),
        session_time: sessionTime.trim() || undefined,
      },
      {
        onSuccess: () => Alert.alert('✅', 'Takvime eklendi.'),
        onError: () => Alert.alert('Hata', 'Takvime eklenirken sorun oluştu.'),
      },
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.headerRow}>
          <Text style={s.planName}>{plan.name}</Text>
          <Text style={s.dateLabel}>{dateLabel}</Text>
        </View>
        <Text style={s.meta}>
          {totalMinutes > 0 ? `${totalMinutes} dakika` : 'Süre belirtilmedi'}
          {loc ? `  ·  ${loc}` : ''}
          {plan.team ? `  ·  ${plan.team}` : ''}
        </Text>
        {plan.goal ? <Text style={s.goal}>{plan.goal}</Text> : null}

        <Text style={s.sectionTitle}>Antrenman İçeriği</Text>
        <View style={s.card}>
          {phaseBreakdown.length > 0 ? (
            phaseBreakdown.map((p, i) => (
              <View key={p.phase} style={[s.phaseRow, i > 0 && s.phaseRowBorder]}>
                <PhaseIcon phase={p.phase} size={14} />
                <Text style={s.phaseLabel}>{p.label}</Text>
                <Text style={s.phaseMinutes}>{p.minutes} dk</Text>
              </View>
            ))
          ) : (
            <Text style={s.noDrills}>Bu planda henüz dril yok.</Text>
          )}
        </View>

        {skills.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Hedeflenen Beceriler</Text>
            <View style={s.chipsRow}>
              {skills.map((sk) => <Badge key={sk} label={sk} color={colors.purple} />)}
            </View>
          </>
        )}

      </ScrollView>

      <View style={s.footer}>
        <Button title="+ Antrenmana Hazırım" onPress={handleReady} loading={updateStatus.isPending} />
        <View style={s.timeRow}>
          <Text style={s.timeLabel}>Saat</Text>
          <TextInput
            style={s.timeInput}
            value={sessionTime}
            onChangeText={setSessionTime}
            placeholder="18:00"
            placeholderTextColor={colors.muted}
            maxLength={5}
          />
        </View>
        <Button
          title="Takvime Ekle"
          onPress={handleAddToCalendar}
          variant="outline"
          loading={createSession.isPending}
          style={{ marginTop: 10 }}
        />
        <Button
          title="📅 Takvim"
          onPress={() => navigation.navigate('TrainingCalendar')}
          variant="ghost"
          style={{ marginTop: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 20 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 10 },
  planName: { color: colors.foreground, fontSize: 22, fontWeight: '800', flex: 1 },
  dateLabel: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 14, marginBottom: 10 },
  goal: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 20 },

  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10, marginTop: 12 },

  card: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  phaseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, gap: 10 },
  phaseRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  phaseIcon: { fontSize: 16, width: 22 },
  phaseLabel: { color: colors.foreground, fontSize: 14, flex: 1, fontWeight: '600' },
  phaseMinutes: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  noDrills: { color: colors.muted, fontSize: 13, padding: 14 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  timeLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  timeInput: {
    flex: 1, backgroundColor: colors.card, color: colors.foreground,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },
});
