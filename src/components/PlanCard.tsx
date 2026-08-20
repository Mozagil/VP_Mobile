import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { TrainingPlan } from '../data/types';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../theme/palettes';
import { useI18n } from '../i18n';

type Props = {
  plan: TrainingPlan;
  onPress: (plan: TrainingPlan) => void;
};

export default function PlanCard({ plan, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const total = plan.drills.length;
  const done = plan.drills.filter((d) => d.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(plan)} activeOpacity={0.8}>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{plan.name}</Text>
          {plan.status === 'active' && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{t('plans.activeBadge')}</Text>
            </View>
          )}
        </View>
        {plan.team && (
          <Text style={styles.team}>👥 {plan.team}</Text>
        )}
        {plan.goal && (
          <Text style={styles.goal} numberOfLines={2}>{plan.goal}</Text>
        )}
      </View>

      <View style={styles.bottom}>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>{t('plans.drillsDone', { done, total })}</Text>
          <Text style={styles.pct}>%{pct}</Text>
        </View>
        {(plan.duration_weeks || plan.sessions_per_week) && (
          <View style={styles.metaRow}>
            {plan.duration_weeks && <Text style={styles.meta}>📅 {t('plans.weeks', { n: plan.duration_weeks })}</Text>}
            {plan.sessions_per_week && <Text style={styles.meta}>⚡ {t('plans.perWeek', { n: plan.sessions_per_week })}</Text>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 14, marginBottom: 12,
      borderWidth: 1, borderColor: colors.border,
      overflow: 'hidden',
    },
    top: { padding: 16, paddingBottom: 12 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    name: { color: colors.foreground, fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 },
    activeBadge: {
      backgroundColor: colors.success + '20', borderRadius: 20,
      paddingHorizontal: 8, paddingVertical: 2,
      borderWidth: 1, borderColor: colors.success + '40',
    },
    activeBadgeText: { color: colors.success, fontSize: 11, fontWeight: '600' },
    team: { color: colors.muted, fontSize: 13, marginBottom: 4 },
    goal: { color: colors.muted, fontSize: 12, lineHeight: 18 },
    bottom: { borderTopWidth: 1, borderTopColor: colors.border, padding: 12 },
    barBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
    barFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    statsText: { color: colors.muted, fontSize: 12 },
    pct: { color: colors.accent, fontSize: 12, fontWeight: '700' },
    metaRow: { flexDirection: 'row', gap: 12 },
    meta: { color: colors.muted, fontSize: 11 },
  });
}
