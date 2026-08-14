import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { READY_PROGRAMS, buildReadyProgram } from '../../data/readyPrograms';
import { useCreatePlan } from '../../hooks/useTrainingPlans';
import { useCreateScheduledSession } from '../../hooks/useScheduledSessions';
import { scheduleSessionReminders } from '../../utils/notifications';
import ScheduleStep, { getRoundedCurrentTime } from '../../components/ui/ScheduleStep';
import Icon from '../../components/ui/Icon';

type ParamList = { ReadyProgramDetail: { programKey: string } };
type Props = NativeStackScreenProps<ParamList, 'ReadyProgramDetail'> & { navigation: NativeStackNavigationProp<any> };

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReadyProgramDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { programKey } = route.params;
  const program = READY_PROGRAMS.find((p) => p.key === programKey)!;
  const sections = useMemo(() => buildReadyProgram(program.skill), [program.skill]);

  const createPlan = useCreatePlan();
  const createSession = useCreateScheduledSession();

  const [scheduling, setScheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayKey());
  const [sessionTime, setSessionTime] = useState(getRoundedCurrentTime());
  const [saving, setSaving] = useState(false);

  const addToPlan = async () => {
    setSaving(true);
    try {
      const drills = sections.flatMap((sec, si) =>
        sec.drills.map((d, i) => ({
          drill_id: d.id,
          phase: sec.phase,
          sort_order: si * 10 + i,
          completed: false,
        })),
      );

      const plan = await createPlan.mutateAsync({
        name: program.title,
        goal: program.desc,
        plan_type: 'Teknik',
        target_duration: 45,
        drills: drills as any,
      });
      const planId = (plan as any)?.id;

      if (selectedDate && planId) {
        await createSession.mutateAsync({ plan_id: planId, session_date: selectedDate, session_time: sessionTime.trim() || undefined });
        scheduleSessionReminders(planId, program.title, selectedDate, sessionTime.trim() || null);
      }

      navigation.getParent()?.navigate('AntrenmanStack' as any, {
        screen: 'TrainingSuccess',
        params: {
          planId,
          planName: program.title,
          drillName: sections[0]?.drills[0]?.name ?? program.title,
        },
      } as any);
    } catch {
      Alert.alert('Hata', 'Antrenman planına eklenirken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => (scheduling ? setScheduling(false) : navigation.goBack())}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{program.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {!scheduling ? (
          <>
            <Text style={s.sub}>{program.desc}</Text>
            <Text style={s.meta}>Toplam ~45 dk</Text>

            {sections.map((sec) => (
              <View key={sec.phase} style={s.sectionBlock}>
                <Text style={s.sectionTitle}>{sec.phase}</Text>
                {sec.drills.map((d) => (
                  <View key={d.id} style={s.drillRow}>
                    <Text style={s.drillName}>{d.name}</Text>
                    <Text style={s.drillSkill}>{d.skill}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : (
          <ScheduleStep
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            time={sessionTime}
            onTimeChange={setSessionTime}
            durationMinutes={45}
          />
        )}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, saving && s.primaryBtnDisabled]}
          activeOpacity={0.85}
          disabled={saving}
          onPress={scheduling ? addToPlan : () => setScheduling(true)}
        >
          <Text style={s.primaryBtnTxt}>
            {scheduling ? (saving ? 'Ekleniyor…' : 'Planıma Ekle') : 'Planıma Ekle'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
    iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },
    body: { padding: 16 },
    sub: { color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 6 },
    meta: { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 16 },
    sectionBlock: { marginBottom: 18 },
    sectionTitle: { color: colors.foreground, fontSize: 14, fontWeight: '800', marginBottom: 8 },
    drillRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6,
    },
    drillName: { color: colors.foreground, fontSize: 13, fontWeight: '600', flex: 1, marginRight: 8 },
    drillSkill: { color: colors.accent, fontSize: 11, fontWeight: '700' },
    footer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.border },
    primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    primaryBtnDisabled: { opacity: 0.6 },
    primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
