import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Icon from '../../components/ui/Icon';
import {
  findNextSession, formatSessionBadge, locationLabel, planTotalMinutes,
} from '../../utils/trainingPlan';

type PanelStackParamList = {
  PanelMain: undefined;
  AllTrainings: undefined;
  NextTrainingDetail: { planId: string };
};

type Props = NativeStackScreenProps<PanelStackParamList, 'AllTrainings'>;

export default function AllTrainingsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { data: plans = [], isLoading } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Text style={s.loading}>Yükleniyor…</Text>
        ) : plans.length === 0 ? (
          <View style={s.emptyCard}>
            <Icon name="antrenmanlar" size={36} style={{ marginBottom: 12 }} />
            <Text style={s.emptyTitle}>Henüz antrenman planınız yok</Text>
            <Text style={s.emptyDesc}>Antrenman sekmesinden yeni bir plan oluşturun.</Text>
          </View>
        ) : (
          plans.map((plan) => {
            const nextSession = findNextSession(sessions, plan.id);
            const badge = formatSessionBadge(nextSession?.session_date, nextSession?.session_time)
              ?? formatSessionBadge(plan.start_date);
            const totalMinutes = planTotalMinutes(plan, colors);
            const loc = locationLabel(plan.location);

            return (
              <TouchableOpacity
                key={plan.id}
                style={s.card}
                activeOpacity={0.78}
                onPress={() => navigation.navigate('NextTrainingDetail', { planId: plan.id })}
              >
                <View style={s.cardHeaderRow}>
                  <Text style={s.cardTitle} numberOfLines={1}>{plan.name}</Text>
                  {badge && (
                    <View style={s.badgeRow}>
                      <Icon name="sure" size={11} />
                      <Text style={s.badge}>{badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={s.cardMeta}>
                  {totalMinutes > 0 ? `${totalMinutes} dakika` : 'Süre belirtilmedi'}
                  {loc ? `  ·  ${loc}` : ''}
                  {plan.team ? `  ·  ${plan.team}` : ''}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 32 },
  loading: { color: colors.muted, textAlign: 'center', marginTop: 40 },

  card: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  cardTitle: { color: colors.foreground, fontSize: 16, fontWeight: '700', flex: 1 },
  badge: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMeta: { color: colors.muted, fontSize: 13 },

  emptyCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, marginTop: 20,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  });
}
