import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useUpdatePlanStatus } from '../../hooks/useTrainingPlans';
import { useScheduledSessions, useCompleteScheduledSession } from '../../hooks/useScheduledSessions';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import { estimateCalories, findNextSession, planTotalMinutes } from '../../utils/trainingPlan';
import { cancelSessionReminders, sendImmediateNotification } from '../../utils/notifications';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'WorkoutComplete'>;

export default function WorkoutCompleteScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { planId } = route.params;
  const { data: plans = [], isLoading } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();
  const updateStatus = useUpdatePlanStatus();
  const completeSession = useCompleteScheduledSession();
  const marked = useRef(false);

  const plan = plans.find((p) => p.id === planId);

  useEffect(() => {
    if (plan && !marked.current) {
      marked.current = true;
      updateStatus.mutate({ id: plan.id, status: 'completed' });
      const session = findNextSession(sessions, plan.id);
      if (session) completeSession.mutate(session.id);
      cancelSessionReminders(plan.id);
      sendImmediateNotification(
        'completed',
        t('notifications.programCompleteTitle'),
        t('notifications.programCompleteBody', { plan: plan.name }),
        true,
      );
    }
  }, [plan]);

  if (isLoading || !plan) {
    return <View style={s.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  }

  const minutes = planTotalMinutes(plan, colors);
  const totalDrills = plan.drills.length;
  const calories = estimateCalories(minutes);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.body}>
        <Icon name="basarilar" size={64} style={s.trophy} />
        <Text style={s.title}>{t('complete.congrats')}</Text>
        <Text style={s.subtitle}>{t('complete.subtitle')}</Text>

        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>{t('complete.summaryTitle')}</Text>
          <View style={s.summaryRow}>
            <View style={s.summaryLabelRow}>
              <Icon name="sure" size={14} />
              <Text style={s.summaryLabel}>{t('complete.totalDuration')}</Text>
            </View>
            <Text style={s.summaryValue}>{t('common.minShort', { n: minutes })}</Text>
          </View>
          <View style={s.summaryRow}>
            <View style={s.summaryLabelRow}>
              <Icon name="hareketler" size={14} />
              <Text style={s.summaryLabel}>{t('complete.totalDrills')}</Text>
            </View>
            <Text style={s.summaryValue}>{totalDrills}</Text>
          </View>
          <View style={s.summaryRow}>
            <View style={s.summaryLabelRow}>
              <Icon name="kalori" size={14} />
              <Text style={s.summaryLabel}>{t('complete.estimatedCalories')}</Text>
            </View>
            <Text style={s.summaryValue}>{calories} kcal</Text>
          </View>
        </View>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AntrenmanHub')}
        >
          <Text style={s.primaryBtnTxt}>{t('complete.myTrainings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.secondaryBtn}
          activeOpacity={0.8}
          onPress={() => navigation.getParent()?.navigate('Panel' as any)}
        >
          <Text style={s.secondaryBtnTxt}>{t('nav.tab.home')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  trophy: { fontSize: 64, marginBottom: 16 },
  title: { color: colors.foreground, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.muted, fontSize: 14, marginBottom: 24, textAlign: 'center' },

  summaryCard: {
    width: '100%', backgroundColor: colors.card, borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: colors.border,
  },
  summaryTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryLabel: { color: colors.muted, fontSize: 13 },
  summaryValue: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  footer: { padding: 16 },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryBtnTxt: { color: colors.muted, fontSize: 15, fontWeight: '600' },
  });
}
