import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useToggleDrillComplete, useRemoveDrillFromPlan } from '../../hooks/useTrainingPlans';
import { allDrills } from '../../data/drills';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import PhaseIcon from '../../components/ui/PhaseIcon';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'ProgramDetail'>;

const TABS = [
  { key: 'programlarim', label: 'Programlarım' },
  { key: 'onerilen', label: 'Önerilen' },
  { key: 'tamamlanan', label: 'Tamamlanan' },
] as const;

export default function ProgramDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { planId } = route.params;
  const { data: plans = [], isLoading } = useTrainingPlans();
  const toggle = useToggleDrillComplete();
  const removeDrill = useRemoveDrillFromPlan();
  const [editMode, setEditMode] = useState(false);

  const plan = plans.find((p) => p.id === planId);

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  }
  if (!plan) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>Program bulunamadı</Text></View>;
  }

  const total = plan.drills.length;
  const done = plan.drills.filter((d) => d.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const sortedDrills = [...plan.drills].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => navigation.navigate('AntrenmanMenu')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.iconBtnTxt}>☰</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Antrenmanlar</Text>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => Alert.alert('Ara', 'Arama yakında eklenecek.')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.iconBtnTxt}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={s.tabRow}>
        {TABS.map((t) => {
          const active = t.key === 'programlarim';
          return (
            <TouchableOpacity
              key={t.key}
              style={[s.tab, active && s.tabActive]}
              activeOpacity={0.8}
              onPress={() => {
                if (t.key === 'programlarim') navigation.navigate('AntrenmanHub');
                else Alert.alert('Yakında', 'Bu bölüm yakında eklenecek.');
              }}
            >
              <Text style={[s.tabTxt, active && s.tabTxtActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <Text style={[s.eyebrow, plan.status === 'active' && s.eyebrowActive]}>
          {plan.status === 'active' ? '● AKTİF PROGRAM' : 'PROGRAM'}
        </Text>
        <View style={s.hero}>
          <View style={s.heroThumb}>
            <Text style={s.heroThumbIcon}>🏐</Text>
          </View>
          <View style={s.heroNameRow}>
            <Text style={s.heroName} numberOfLines={2}>{plan.name}</Text>
            <TouchableOpacity
              style={s.editBtn}
              activeOpacity={0.8}
              onPress={() => setEditMode((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.editBtnTxt}>{editMode ? 'Bitti' : '✎ Düzenle'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.heroMeta}>
            {plan.duration_weeks ? `${plan.duration_weeks} Hafta` : ''}
            {plan.duration_weeks && total > 0 ? ' • ' : ''}
            {total > 0 ? `${total} Antrenman` : ''}
          </Text>
          <View style={s.heroProgressRow}>
            <View style={s.barBg}>
              <View style={[s.barFill, { width: `${pct}%` }]} />
            </View>
            <Text style={s.pctTxt}>{pct}% Tamamlandı</Text>
          </View>
        </View>

        {sortedDrills.length === 0 ? (
          <Text style={s.noDrills}>Bu programda henüz dril yok.</Text>
        ) : (
          sortedDrills.map((pd) => {
            const drill = allDrills.find((d) => d.id === pd.drill_id);
            const name = pd.custom_name ?? drill?.name ?? `Dril #${pd.drill_id}`;
            return (
              <View key={pd.id} style={s.row}>
                <PhaseIcon phase={pd.phase} size={17} />
                <View style={{ flex: 1 }}>
                  <Text style={s.rowName} numberOfLines={1}>{name}</Text>
                  <Text style={s.rowMeta}>{drill?.duration ?? ''}</Text>
                </View>
                {editMode ? (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Hareketi Kaldır', `"${name}" bu antrenmandan kaldırılsın mı?`, [
                        { text: 'İptal', style: 'cancel' },
                        { text: 'Kaldır', style: 'destructive', onPress: () => removeDrill.mutate(pd.id) },
                      ]);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={s.removeBtn}
                  >
                    <Text style={s.removeBtnTxt}>✕</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => toggle.mutate({ drillRowId: pd.id, completed: !pd.completed })}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={[s.statusCircle, pd.completed && s.statusCircleDone]}
                  >
                    {pd.completed && <Text style={s.statusCheck}>✓</Text>}
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

        {editMode && (
          <TouchableOpacity
            style={s.addDrillBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DrillList')}
          >
            <Text style={s.addDrillBtnTxt}>+ Hareket Ekle</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 32 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  iconBtnTxt: { fontSize: 18, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 18, fontWeight: '800' },

  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
  },
  tabActive: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  tabTxt: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  tabTxtActive: { color: colors.accent },

  eyebrow: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 12, marginBottom: 8 },
  eyebrowActive: { color: colors.success },
  hero: { backgroundColor: colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  heroThumb: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroThumbIcon: { fontSize: 28 },
  heroNameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 },
  heroName: { color: colors.foreground, fontSize: 20, fontWeight: '800', flex: 1 },
  editBtn: {
    borderWidth: 1, borderColor: colors.accent, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  editBtnTxt: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  heroMeta: { color: colors.muted, fontSize: 13, marginBottom: 12 },
  heroProgressRow: { gap: 6 },
  barBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.accent, borderRadius: 4 },
  pctTxt: { color: colors.accent, fontSize: 13, fontWeight: '700' },

  noDrills: { color: colors.muted, fontSize: 13, paddingVertical: 6 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  rowIcon: { fontSize: 18, width: 24 },
  rowName: { color: colors.foreground, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  rowMeta: { color: colors.muted, fontSize: 12 },
  removeBtn: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: colors.error,
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtnTxt: { color: colors.error, fontSize: 13, fontWeight: '800' },
  addDrillBtn: {
    borderRadius: 12, borderWidth: 1.5, borderColor: colors.accent, borderStyle: 'dashed',
    paddingVertical: 12, alignItems: 'center', marginBottom: 8,
  },
  addDrillBtnTxt: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  statusCircle: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  statusCircleDone: { backgroundColor: colors.success, borderColor: colors.success },
  statusCheck: { color: '#fff', fontSize: 13, fontWeight: '800' },

  newBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  newBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  });
}
