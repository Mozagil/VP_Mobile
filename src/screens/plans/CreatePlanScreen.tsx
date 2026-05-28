import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreatePlan } from '../../hooks/useTrainingPlans';
import { allDrills } from '../../data/drills';
import { Drill } from '../../data/types';
import { colors } from '../../theme/colors';

type PlansStackParamList = {
  PlanList: undefined;
  PlanDetail: { planId: string };
  CreatePlan: undefined;
};

type Props = NativeStackScreenProps<PlansStackParamList, 'CreatePlan'>;

const PHASES = ['Tüm Aşamalar', 'Isınma', 'Ana Antrenman', 'Oyun', 'Soğuma'];

export default function CreatePlanScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [drillSearch, setDrillSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('Tüm Aşamalar');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const createPlan = useCreatePlan();

  const filteredDrills = useMemo(() => {
    return allDrills.filter((d) => {
      const matchSearch =
        drillSearch.length === 0 ||
        d.name.toLowerCase().includes(drillSearch.toLowerCase()) ||
        d.skill.toLowerCase().includes(drillSearch.toLowerCase());
      const matchPhase = phaseFilter === 'Tüm Aşamalar' || d.phase === phaseFilter;
      return matchSearch && matchPhase;
    });
  }, [drillSearch, phaseFilter]);

  const toggleDrill = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Plan adı zorunludur.');
      return;
    }
    try {
      const drillPayload = selectedIds.map((drillId, i) => {
        const drill = allDrills.find((d) => d.id === drillId)!;
        return { drill_id: drillId, phase: drill.phase, sort_order: i, completed: false };
      });
      await createPlan.mutateAsync({
        name: name.trim(),
        team: team.trim() || undefined,
        drills: drillPayload as any,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Hata', 'Plan oluşturulamadı.');
    }
  };

  const renderDrill = ({ item }: { item: Drill }) => {
    const selected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.drillRow, selected && styles.drillRowSelected]}
        onPress={() => toggleDrill(item.id)}
        activeOpacity={0.75}
      >
        {/* Checkbox circle */}
        <View style={[styles.circle, selected && styles.circleSelected]}>
          {selected && <View style={styles.circleDot} />}
        </View>

        {/* Drill info */}
        <View style={styles.drillInfo}>
          <Text style={styles.drillName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.drillMeta}>{item.skill} · {item.players} oyuncu</Text>
        </View>

        {/* Phase badge + duration */}
        <View style={styles.drillRight}>
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseBadgeText}>{item.phase}</Text>
          </View>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>Yeni Antrenman Planı</Text>
          <Text style={styles.subtitle}>Drill'leri seçerek antrenman planınızı oluşturun.</Text>
        </View>

        {/* Plan Adı + Takım */}
        <View style={styles.fields}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Plan Adı *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ör: Pazartesi Antrenmanı"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Takım (opsiyonel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ör: U16 Kız"
              placeholderTextColor={colors.muted}
              value={team}
              onChangeText={setTeam}
            />
          </View>
        </View>

        {/* Dril Ekle başlığı */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dril Ekle</Text>
        </View>

        {/* Arama */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Dril ara..."
              placeholderTextColor={colors.muted}
              value={drillSearch}
              onChangeText={setDrillSearch}
            />
          </View>
        </View>

        {/* Faz filtreleri */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 8 }}>
          {PHASES.map((p) => {
            const active = phaseFilter === p;
            return (
              <View
                key={p}
                style={{
                  alignSelf: 'flex-start',
                  marginRight: 8,
                  marginBottom: 6,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: active ? '#f97316' : '#4a6090',
                  backgroundColor: active ? '#3d1800' : '#1a2a5e',
                  overflow: 'hidden',
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPhaseFilter(p)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                >
                  <Text style={{ color: active ? '#f97316' : '#ffffff', fontSize: 12, fontWeight: '600' }}>
                    {p}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Drill listesi */}
        <FlatList
          data={filteredDrills}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDrill}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Alt bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>İptal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
            onPress={submit}
            disabled={createPlan.isLoading || !name.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {createPlan.isLoading
                ? 'Kaydediliyor...'
                : `+ Kaydet (${selectedIds.length} drill)`}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.foreground, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: colors.muted, fontSize: 13 },

  fields: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldHalf: { flex: 1 },
  fieldLabel: { color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    color: colors.foreground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700' },

  searchRow: { paddingHorizontal: 12, marginBottom: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 14,
    paddingVertical: 10,
  },

  list: { flex: 1 },

  drillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  drillRowSelected: {
    backgroundColor: colors.accent + '10',
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  circleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },

  drillInfo: { flex: 1, marginRight: 8 },
  drillName: { color: colors.foreground, fontSize: 14, fontWeight: '500', marginBottom: 2 },
  drillMeta: { color: colors.muted, fontSize: 11 },

  drillRight: { alignItems: 'flex-end', gap: 4 },
  phaseBadge: {
    backgroundColor: colors.accent + '20',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  phaseBadgeText: { color: colors.accent, fontSize: 10, fontWeight: '600' },
  duration: { color: colors.muted, fontSize: 11 },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 4 },
  cancelText: { color: colors.muted, fontSize: 15 },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
