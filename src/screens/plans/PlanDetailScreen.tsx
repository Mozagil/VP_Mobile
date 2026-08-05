import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useTrainingPlans, useToggleDrillComplete,
  useRemoveDrillFromPlan, useAddDrillsToPlan,
} from '../../hooks/useTrainingPlans';
import { allDrills } from '../../data/drills';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';
import { normalizePhase } from '../../utils/trainingPlan';

type PlansStackParamList = {
  PlanList: undefined;
  PlanDetail: { planId: string };
  CreatePlan: undefined;
};

type Props = NativeStackScreenProps<PlansStackParamList, 'PlanDetail'>;

const PHASES = ['Isınma', 'Ana Antrenman', 'Soğuma'];
const PHASE_FILTER = ['Tümü', ...PHASES];

function getPhaseConfig(colors: Colors): Record<string, { color: string }> {
  return {
    'Isınma':        { color: colors.phaseIsınma },
    'Ana Antrenman': { color: colors.phaseAna },
    'Soğuma':        { color: colors.phaseSoğuma },
  };
}

type ModalStyles = ReturnType<typeof makeModalStyles>;

// Android-safe chip
function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <View style={[c.wrap, active && c.wrapActive]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={c.inner}>
        <Text style={[c.text, active && c.textActive]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Add Drills Modal ──────────────────────────────────────────────────────────
function AddDrillsModal({
  visible,
  planDrillIds,
  onClose,
  onAdd,
  colors,
  m,
}: {
  visible: boolean;
  planDrillIds: number[];
  onClose: () => void;
  onAdd: (ids: number[]) => void;
  colors: Colors;
  m: ModalStyles;
}) {
  const [search, setSearch]   = useState('');
  const [phase, setPhase]     = useState('Tümü');
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = useMemo(() => {
    return allDrills.filter(d => {
      const notInPlan = !planDrillIds.includes(d.id);
      const matchSearch = search.length === 0
        || d.name.toLowerCase().includes(search.toLowerCase());
      const matchPhase = phase === 'Tümü' || d.phase === phase;
      return notInPlan && matchSearch && matchPhase;
    });
  }, [search, phase, planDrillIds]);

  const toggle = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAdd = () => {
    if (selected.length === 0) return;
    onAdd(selected);
    setSelected([]);
    setSearch('');
    setPhase('Tümü');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={m.overlay}>
        <View style={m.sheet}>
          {/* Header */}
          <View style={m.header}>
            <Text style={m.title}>➕ Drill Ekle</Text>
            <TouchableOpacity onPress={onClose} style={m.closeBtn}>
              <Text style={m.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={m.searchRow}>
            <TextInput
              style={m.searchInput}
              placeholder="Drill ara..."
              placeholderTextColor={colors.muted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Phase filter chips */}
          <View style={m.chips}>
            {PHASE_FILTER.map(p => (
              <Chip key={p} label={p} active={phase === p} onPress={() => setPhase(p)} />
            ))}
          </View>

          {/* Drill list */}
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            style={{ flex: 1 }}
            contentContainerStyle={m.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={m.empty}>
                <Text style={m.emptyTxt}>Drill bulunamadı</Text>
              </View>
            }
            renderItem={({ item }) => {
              const sel = selected.includes(item.id);
              return (
                <TouchableOpacity
                  style={[m.drillRow, sel && m.drillRowSel]}
                  onPress={() => toggle(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[m.checkbox, sel && m.checkboxSel]}>
                    {sel && <Text style={m.checkmark}>✓</Text>}
                  </View>
                  <View style={m.drillInfo}>
                    <Text style={m.drillName} numberOfLines={1}>{item.name}</Text>
                    <Text style={m.drillMeta}>{item.phase}  ·  {item.skill}  ·  {item.duration}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Footer */}
          <View style={m.footer}>
            <Text style={m.selectedCount}>{selected.length} drill seçildi</Text>
            <View style={[m.addBtnWrap, selected.length === 0 && { opacity: 0.4 }]}>
              <TouchableOpacity
                style={m.addBtn}
                onPress={handleAdd}
                disabled={selected.length === 0}
                activeOpacity={0.85}
              >
                <Text style={m.addBtnTxt}>Ekle →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PlanDetailScreen({ route }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const m = useMemo(() => makeModalStyles(colors), [colors]);
  const phaseConfig = useMemo(() => getPhaseConfig(colors), [colors]);
  const { planId } = route.params;
  const { data: plans = [], isLoading } = useTrainingPlans();
  const toggle       = useToggleDrillComplete();
  const removeDrill  = useRemoveDrillFromPlan();
  const addDrills    = useAddDrillsToPlan();
  const [showAddModal, setShowAddModal] = useState(false);

  const plan = plans.find(p => p.id === planId);

  if (isLoading) return <View style={s.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  if (!plan)    return <View style={s.center}><Text style={{ color: colors.muted }}>Plan bulunamadı</Text></View>;

  const total   = plan.drills.length;
  const done    = plan.drills.filter(d => d.completed).length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = done === total && total > 0;

  const planDrillIds = plan.drills.map(d => d.drill_id).filter(id => id > 0);

  const markAllComplete = () => {
    if (allDone) { Alert.alert('Bilgi', 'Tüm drill\'ler zaten tamamlandı.'); return; }
    Alert.alert('Tümünü Tamamla', 'Tüm drill\'leri tamamlandı olarak işaretlemek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Evet', onPress: () => plan.drills.forEach(pd => { if (!pd.completed) toggle.mutate({ drillRowId: pd.id, completed: true }); }) },
    ]);
  };

  const handleRemoveDrill = (drillRowId: string, drillName: string) => {
    Alert.alert('Drilli Kaldır', `"${drillName}" planından kaldırılsın mı?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Kaldır', style: 'destructive', onPress: () => removeDrill.mutate(drillRowId) },
    ]);
  };

  const handleAddDrills = (ids: number[]) => {
    // Mevcut drill'leri PUT formatına çevir (row id'siz)
    const existingDrills = plan.drills.map(pd => ({
      drill_id:     pd.drill_id,
      phase:        pd.phase,
      sort_order:   pd.sort_order,
      completed:    pd.completed,
      custom_name:  pd.custom_name,
      custom_skill: pd.custom_skill,
    }));

    // Yeni seçilen drill'leri ekle
    const newDrills = ids.map((drillId, i) => {
      const drill = allDrills.find(d => d.id === drillId);
      return {
        drill_id:   drillId,
        phase:      drill?.phase ?? 'Ana Antrenman',
        sort_order: total + i,
        completed:  false,
      };
    });

    addDrills.mutate(
      { planId, name: plan.name, team: plan.team, drills: [...existingDrills, ...newDrills] },
      {
        onSuccess: () => { setShowAddModal(false); Alert.alert('✅', 'Drill\'ler plana eklendi.'); },
        onError:   () => Alert.alert('Hata', 'Drill eklenirken sorun oluştu.'),
      },
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <View style={s.headerCard}>
          <View style={s.planNameRow}>
            <Text style={s.planName}>{plan.name}</Text>
            <View style={s.addDrillWrap}>
              <TouchableOpacity
                style={s.addDrillBtn}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.8}
              >
                <Text style={s.addDrillTxt}>➕ Drill Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>

          {plan.team && (
            <View style={s.teamRow}>
              <Text style={s.teamIcon}>👥</Text>
              <Text style={s.teamText}>{plan.team}</Text>
            </View>
          )}

          {/* Progress */}
          <View style={s.progressRow}>
            <Text style={s.progressText}>{done}/{total} tamamlandı</Text>
            <Text style={s.progressPct}>%{pct}</Text>
          </View>
          <View style={s.barBg}>
            <View style={[s.barFill, { width: `${pct}%` }]} />
          </View>

          {total > 0 && (
            <TouchableOpacity
              style={[s.markAllBtn, allDone && s.markAllBtnDone]}
              onPress={markAllComplete}
              activeOpacity={0.8}
            >
              <Text style={s.markAllBtnText}>
                {allDone ? '✅ Tümü Tamamlandı' : '☑️ Tümünü Tamamla'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Drills by phase */}
        {total === 0 ? (
          <View style={s.emptyDrills}>
            <Text style={s.emptyIcon}>🏐</Text>
            <Text style={s.emptyText}>Bu planda henüz drill yok</Text>
            <View style={s.addDrillWrap}>
              <TouchableOpacity style={s.addDrillBtn} onPress={() => setShowAddModal(true)} activeOpacity={0.8}>
                <Text style={s.addDrillTxt}>➕ Drill Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          PHASES.map(ph => {
            const phaseDrills = plan.drills.filter(d => normalizePhase(d.phase) === ph);
            if (phaseDrills.length === 0) return null;
            const cfg = phaseConfig[ph] ?? { color: colors.accent };

            return (
              <View key={ph} style={s.phaseSection}>
                <View style={[s.phaseHeader, { borderLeftColor: cfg.color }]}>
                  <PhaseIcon phase={ph} size={15} />
                  <Text style={[s.phaseTitle, { color: cfg.color }]}>{ph}</Text>
                  <View style={[s.phaseBadge, { backgroundColor: cfg.color + '20' }]}>
                    <Text style={[s.phaseBadgeText, { color: cfg.color }]}>{phaseDrills.length}</Text>
                  </View>
                </View>

                {phaseDrills.map(pd => {
                  const drill = allDrills.find(d => d.id === pd.drill_id);
                  const drillName = pd.custom_name ?? drill?.name ?? `Drill #${pd.drill_id}`;

                  return (
                    <View key={pd.id} style={[s.drillRow, pd.completed && s.drillRowDone]}>
                      {/* Checkbox */}
                      <TouchableOpacity
                        onPress={() => toggle.mutate({ drillRowId: pd.id, completed: !pd.completed })}
                        activeOpacity={0.75}
                        style={[s.checkbox, pd.completed && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                      >
                        {pd.completed && <Text style={s.checkmark}>✓</Text>}
                      </TouchableOpacity>

                      {/* Drill info */}
                      <View style={s.drillInfo}>
                        <Text style={[s.drillName, pd.completed && s.drillNameDone]}>
                          {drillName}
                        </Text>
                        {drill && (
                          <View style={s.drillMetaRow}>
                            <Text style={s.drillMeta}>{drill.skill}  ·  </Text>
                            <Icon name="sure" size={11} />
                            <Text style={s.drillMeta}> {drill.duration}  ·  {drill.players} Kişi</Text>
                          </View>
                        )}
                      </View>

                      {/* Delete drill button */}
                      <TouchableOpacity
                        onPress={() => handleRemoveDrill(pd.id, drillName)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={s.removeDrillBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={s.removeDrillTxt}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Drills Modal */}
      <AddDrillsModal
        visible={showAddModal}
        planDrillIds={planDrillIds}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddDrills}
        colors={colors}
        m={m}
      />
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const c = StyleSheet.create({
  wrap:       { alignSelf: 'flex-start', marginRight: 6, borderRadius: 16, borderWidth: 1.5, borderColor: '#4a6090', backgroundColor: '#1a2a5e', overflow: 'hidden' },
  wrapActive: { borderColor: '#f97316', backgroundColor: '#3d1800' },
  inner:      { paddingHorizontal: 10, paddingVertical: 5 },
  text:       { color: '#fff', fontSize: 11, fontWeight: '600' },
  textActive: { color: '#f97316' },
});

function makeModalStyles(colors: Colors) {
  return StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    height: '88%', overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title:    { color: colors.foreground, fontSize: 17, fontWeight: '700' },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  closeTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  searchRow:   { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  searchInput: {
    backgroundColor: colors.card, color: colors.foreground,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingBottom: 8 },
  list:  { paddingHorizontal: 14, paddingBottom: 24 },

  drillRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  drillRowSel: { borderColor: colors.accent, backgroundColor: colors.accent + '15' },
  checkbox:    { width: 22, height: 22, borderRadius: 5, borderWidth: 2, borderColor: colors.border, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxSel: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkmark:   { color: '#fff', fontSize: 12, fontWeight: '700' },
  drillInfo:   { flex: 1 },
  drillName:   { color: colors.foreground, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  drillMeta:   { color: colors.muted, fontSize: 11 },

  empty:    { padding: 40, alignItems: 'center' },
  emptyTxt: { color: colors.muted, fontSize: 14 },

  footer:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderTopWidth: 1, borderTopColor: colors.border },
  selectedCount: { color: colors.muted, fontSize: 13 },
  addBtnWrap:    { borderRadius: 10, overflow: 'hidden' },
  addBtn:        { backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 10 },
  addBtnTxt:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  });
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.background },
  center:    { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, paddingBottom: 40 },

  headerCard: { backgroundColor: colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  planNameRow:{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  planName:   { color: colors.foreground, fontSize: 20, fontWeight: '700', flex: 1, marginRight: 10 },
  addDrillWrap:{ borderRadius: 10, overflow: 'hidden' },
  addDrillBtn: { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 7 },
  addDrillTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  teamRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  teamIcon: { fontSize: 14, marginRight: 6 },
  teamText: { color: colors.muted, fontSize: 14 },

  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText:{ color: colors.muted, fontSize: 13 },
  progressPct: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  barBg:   { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  barFill: { height: 8, backgroundColor: colors.accent, borderRadius: 4 },

  markAllBtn:     { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  markAllBtnDone: { backgroundColor: colors.success },
  markAllBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  phaseSection: { marginBottom: 16 },
  phaseHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderLeftWidth: 3, paddingLeft: 10 },
  phaseIcon:    { fontSize: 16, marginRight: 6 },
  phaseTitle:   { fontSize: 15, fontWeight: '700', flex: 1 },
  phaseBadge:   { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  phaseBadgeText:{ fontSize: 12, fontWeight: '700' },

  drillRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  drillRowDone: { opacity: 0.6 },
  checkbox:     { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkmark:    { color: '#fff', fontSize: 13, fontWeight: '700' },
  drillInfo:    { flex: 1 },
  drillName:    { color: colors.foreground, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  drillNameDone:{ color: colors.muted, textDecorationLine: 'line-through' },
  drillMeta:    { color: colors.muted, fontSize: 11 },
  drillMetaRow: { flexDirection: 'row', alignItems: 'center' },
  removeDrillBtn: { padding: 6, marginLeft: 6 },
  removeDrillTxt: { fontSize: 16 },

  emptyDrills: { alignItems: 'center', padding: 40 },
  emptyIcon:   { fontSize: 40, marginBottom: 12 },
  emptyText:   { color: colors.muted, fontSize: 15, marginBottom: 16 },
  });
}
