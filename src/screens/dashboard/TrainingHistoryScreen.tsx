import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { parseLocalDate } from '../../utils/trainingPlan';

export default function TrainingHistoryScreen() {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { data: sessions = [], isLoading } = useScheduledSessions();
  const { data: plans = [] } = useTrainingPlans();

  const completed = useMemo(() => {
    return [...sessions]
      .filter((s) => s.completed)
      .sort((a, b) => parseLocalDate(b.session_date).getTime() - parseLocalDate(a.session_date).getTime());
  }, [sessions]);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Text style={s.empty}>Yükleniyor…</Text>
        ) : completed.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyIcon}>🏐</Text>
            <Text style={s.emptyTitle}>Henüz tamamlanmış antrenman yok</Text>
            <Text style={s.emptyDesc}>Antrenmanlarını tamamladıkça burada listelenecek.</Text>
          </View>
        ) : (
          completed.map((session) => {
            const plan = plans.find((p) => p.id === session.plan_id);
            return (
              <View key={session.id} style={s.row}>
                <View style={s.checkIcon}>
                  <Text style={s.checkTxt}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowName} numberOfLines={1}>{plan?.name ?? 'Antrenman'}</Text>
                  <Text style={s.rowDate}>
                    {parseLocalDate(session.session_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {session.session_time ? ` • ${session.session_time}` : ''}
                  </Text>
                </View>
              </View>
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
  container: { padding: 16, paddingBottom: 32 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  checkIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.success + '25',
    alignItems: 'center', justifyContent: 'center',
  },
  checkTxt: { color: colors.success, fontSize: 14, fontWeight: '800' },
  rowName: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  rowDate: { color: colors.muted, fontSize: 12 },

  emptyCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, marginTop: 20,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  });
}
