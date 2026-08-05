import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import {
  buildPhaseBreakdown, drillsInPhase, getPhaseDisplay, resolveDrillMinutes, resolveDrillName,
} from '../../utils/trainingPlan';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'PhaseSequence'>;

export default function PhaseSequenceScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { planId, phase, showAll } = route.params;
  const { data: plans = [], isLoading } = useTrainingPlans();
  const plan = plans.find((p) => p.id === planId);

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  }
  if (!plan) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>Antrenman bulunamadı</Text></View>;
  }

  const breakdown = buildPhaseBreakdown(plan, colors);

  if (showAll) {
    const totalDrills = breakdown.reduce((sum, p) => sum + p.count, 0);
    const doneDrills = breakdown.reduce((sum, p) => sum + drillsInPhase(plan, p.phase).filter((pd) => pd.completed).length, 0);
    let activeDrillId: string | null = null;
    for (const p of breakdown) {
      const nextPd = drillsInPhase(plan, p.phase).find((pd) => !pd.completed);
      if (nextPd) { activeDrillId = nextPd.id; break; }
    }

    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="geri" size={18} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Tüm Hareketler</Text>
          <Text style={s.headerCount}>{doneDrills}/{totalDrills}</Text>
        </View>

        <Text style={s.hint}>Başlamak istediğin hareketi seç.</Text>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {breakdown.map((p) => {
            const drills = drillsInPhase(plan, p.phase);
            return (
              <View key={p.phase} style={s.groupBlock}>
                <View style={s.groupHeaderRow}>
                  <View style={[s.groupDot, { backgroundColor: p.color }]} />
                  <PhaseIcon phase={p.phase} size={13} />
                  <Text style={s.groupTitle}>{p.label}</Text>
                  <Text style={s.groupMeta}>{drills.length} hareket • {p.minutes} dk</Text>
                </View>
                {drills.map((pd, i) => (
                  <TouchableOpacity
                    key={pd.id}
                    style={[s.row, pd.completed && s.rowDone, pd.id === activeDrillId && s.rowActive]}
                    activeOpacity={0.78}
                    onPress={() => navigation.navigate('DrillPlayer', { planId, phase: p.phase, index: i })}
                  >
                    <View style={[s.numberBadge, pd.completed && s.numberBadgeDone]}>
                      <Text style={s.numberBadgeTxt}>{pd.completed ? '✓' : i + 1}</Text>
                    </View>
                    <Text style={[s.rowName, pd.completed && s.rowNameDone]} numberOfLines={1}>{resolveDrillName(pd)}</Text>
                    <Text style={s.rowDuration}>{resolveDrillMinutes(pd)} dk</Text>
                    <Text style={s.rowArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const phaseIdx = breakdown.findIndex((p) => p.phase === phase);
  const phaseIndex = phaseIdx + 1;
  const drills = drillsInPhase(plan, phase);
  const activeDrillId = drills.find((pd) => !pd.completed)?.id ?? null;
  const totalMinutes = drills.reduce((sum, pd) => sum + resolveDrillMinutes(pd), 0);
  const doneCount = drills.filter((pd) => pd.completed).length;
  const pct = drills.length > 0 ? Math.round((doneCount / drills.length) * 100) : 0;
  const display = getPhaseDisplay(colors)[phase] ?? { label: phase, icon: '🏐', color: colors.accent };
  const prevPhase = phaseIdx > 0 ? breakdown[phaseIdx - 1] : null;
  const nextPhase = phaseIdx >= 0 && phaseIdx < breakdown.length - 1 ? breakdown[phaseIdx + 1] : null;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{display.label}</Text>
        <Text style={s.headerCount}>{phaseIndex}/{drills.length}</Text>
      </View>

      <View style={s.progressBarBg}>
        <View style={[s.progressBarFill, { width: `${pct}%`, backgroundColor: display.color }]} />
      </View>

      <Text style={s.subtitle}>{totalMinutes} dakika · {drills.length} hareket</Text>

      <Text style={s.hint}>Başlamak istediğin hareketi seç.</Text>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {drills.map((pd, i) => (
          <TouchableOpacity
            key={pd.id}
            style={[s.row, pd.completed && s.rowDone, pd.id === activeDrillId && s.rowActive]}
            activeOpacity={0.78}
            onPress={() => navigation.navigate('DrillPlayer', { planId, phase, index: i })}
          >
            <View style={[s.numberBadge, pd.completed && s.numberBadgeDone]}>
              <Text style={s.numberBadgeTxt}>{pd.completed ? '✓' : i + 1}</Text>
            </View>
            <Text style={[s.rowName, pd.completed && s.rowNameDone]} numberOfLines={1}>{resolveDrillName(pd)}</Text>
            <Text style={s.rowDuration}>{resolveDrillMinutes(pd)} dk</Text>
            <Text style={s.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {drills.length > 0 && (
        <TouchableOpacity
          style={s.startBtn}
          activeOpacity={0.85}
          onPress={() => {
            const startIndex = drills.findIndex((pd) => !pd.completed);
            navigation.navigate('DrillPlayer', { planId, phase, index: startIndex >= 0 ? startIndex : 0 });
          }}
        >
          <Text style={s.primaryBtnTxt}>Antrenmanı Başlat</Text>
        </TouchableOpacity>
      )}

      {(prevPhase || nextPhase) && (
        <View style={s.footerRow}>
          <TouchableOpacity
            style={[s.secondaryBtn, !prevPhase && s.navBtnDisabled]}
            activeOpacity={0.8}
            disabled={!prevPhase}
            onPress={() => prevPhase && navigation.navigate('PhaseSequence', { planId, phase: prevPhase.phase })}
          >
            <Text style={s.secondaryBtnTxt} numberOfLines={1}>‹ {prevPhase ? prevPhase.label : 'Önceki'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.primaryBtn, { flex: 1 }, !nextPhase && s.navBtnDisabled]}
            activeOpacity={0.85}
            disabled={!nextPhase}
            onPress={() => nextPhase && navigation.navigate('PhaseSequence', { planId, phase: nextPhase.phase })}
          >
            <Text style={s.primaryBtnTxt} numberOfLines={1}>{nextPhase ? `${nextPhase.label} ›` : 'Son Bölüm'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },
  headerCount: { color: colors.muted, fontSize: 13, fontWeight: '700' },

  progressBarBg: { height: 4, backgroundColor: colors.border, marginHorizontal: 16, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: 4, borderRadius: 2 },

  subtitle: { color: colors.muted, fontSize: 13, paddingHorizontal: 16, marginTop: 10, marginBottom: 4 },
  hint: { color: colors.muted, fontSize: 12, paddingHorizontal: 16, marginBottom: 10 },

  scroll: { paddingHorizontal: 16, paddingBottom: 20 },

  groupBlock: { marginBottom: 16 },
  groupHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  groupDot: { width: 8, height: 8, borderRadius: 4 },
  groupTitle: { color: colors.foreground, fontSize: 13, fontWeight: '800', flex: 1 },
  groupMeta: { color: colors.muted, fontSize: 11, fontWeight: '600' },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  rowDone: { opacity: 0.6 },
  rowActive: { borderColor: colors.success, borderWidth: 2 },
  numberBadge: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  numberBadgeDone: { backgroundColor: colors.success },
  numberBadgeTxt: { color: colors.foreground, fontSize: 12, fontWeight: '800' },
  rowName: { color: colors.foreground, fontSize: 14, fontWeight: '600', flex: 1 },
  rowNameDone: { textDecorationLine: 'line-through', color: colors.muted },
  rowDuration: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  rowArrow: { color: colors.muted, fontSize: 18 },

  startBtn: {
    backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    marginHorizontal: 16, marginTop: 8,
  },
  footerRow: { flexDirection: 'row', gap: 10, padding: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  secondaryBtn: { borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  navBtnDisabled: { opacity: 0.4 },
  });
}
