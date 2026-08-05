import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreatePlan } from '../../hooks/useTrainingPlans';
import { useCreateScheduledSession } from '../../hooks/useScheduledSessions';
import { useFavorites } from '../../hooks/useFavorites';
import { allDrills } from '../../data/drills';
import { Drill } from '../../data/types';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Slider from '../../components/ui/Slider';
import ScheduleStep, { getRoundedCurrentTime } from '../../components/ui/ScheduleStep';
import { scheduleSessionReminders } from '../../utils/notifications';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'CreatePlan'>;

const PLAN_TYPES = ['Teknik', 'Kondisyon', 'Kombinasyon', 'Diğer'];
const PHASE_FILTERS = ['Tümü', 'Isınma', 'Ana Antrenman', 'Soğuma', 'Favoriler'];
const PHASE_ORDER = ['Isınma', 'Ana Antrenman', 'Soğuma'];

type Styles = ReturnType<typeof makeStyles>;

function StepBar({ step, s }: { step: number; s: Styles }) {
  return (
    <View style={s.stepBar}>
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          <View style={[s.stepCircle, i <= step && s.stepCircleActive]}>
            <Text style={[s.stepCircleTxt, i <= step && s.stepCircleTxtActive]}>{i + 1}</Text>
          </View>
          {i < 3 && <View style={[s.stepConnector, i < step && s.stepConnectorActive]} />}
        </React.Fragment>
      ))}
    </View>
  );
}

type SelectedDrill = { drill: Drill; phase: string };

export default function CreatePlanScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const createPlan = useCreatePlan();
  const createSession = useCreateScheduledSession();
  const { isFavorite } = useFavorites();
  const [step, setStep] = useState(0);

  // Step 4
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(getRoundedCurrentTime());

  // Step 1
  const [name, setName] = useState('');
  const [planType, setPlanType] = useState('Teknik');
  const [targetDuration, setTargetDuration] = useState(60);

  // Step 2
  const [drillSearch, setDrillSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('Tümü');
  const [selected, setSelected] = useState<SelectedDrill[]>([]);

  const filteredDrills = useMemo(() => {
    return allDrills.filter((d) => {
      const matchSearch =
        drillSearch.length === 0 ||
        d.name.toLowerCase().includes(drillSearch.toLowerCase()) ||
        d.skill.toLowerCase().includes(drillSearch.toLowerCase());
      const matchPhase = phaseFilter === 'Tümü' || phaseFilter === 'Favoriler' || d.phase === phaseFilter;
      const matchFavorite = phaseFilter !== 'Favoriler' || isFavorite(d.id);
      return matchSearch && matchPhase && matchFavorite;
    });
  }, [drillSearch, phaseFilter, isFavorite]);

  const isSelected = (id: number) => selected.some((sd) => sd.drill.id === id);

  const toggleDrill = (drill: Drill) => {
    setSelected((prev) =>
      prev.some((sd) => sd.drill.id === drill.id)
        ? prev.filter((sd) => sd.drill.id !== drill.id)
        : [...prev, { drill, phase: drill.phase }],
    );
  };

  const grouped = useMemo(() => {
    return PHASE_ORDER.map((phase) => ({
      phase,
      items: selected.filter((sd) => sd.phase === phase),
    })).filter((g) => g.items.length > 0);
  }, [selected]);

  const moveDrill = (drillId: number, dir: -1 | 1) => {
    setSelected((prev) => {
      const idx = prev.findIndex((sd) => sd.drill.id === drillId);
      const swapWith = idx + dir;
      if (idx < 0 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  const removeDrill = (drillId: number) => {
    setSelected((prev) => prev.filter((sd) => sd.drill.id !== drillId));
  };

  const openRowMenu = (sd: SelectedDrill) => {
    Alert.alert(sd.drill.name, undefined, [
      { text: 'Yukarı Taşı', onPress: () => moveDrill(sd.drill.id, -1) },
      { text: 'Aşağı Taşı', onPress: () => moveDrill(sd.drill.id, 1) },
      { text: 'Kaldır', style: 'destructive', onPress: () => removeDrill(sd.drill.id) },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Antrenman adı zorunludur.');
      return;
    }
    try {
      const drillPayload = selected.map((sd, i) => ({
        drill_id: sd.drill.id, phase: sd.phase, sort_order: i, completed: false,
      }));
      const plan = await createPlan.mutateAsync({
        name: name.trim(),
        plan_type: planType,
        target_duration: targetDuration,
        drills: drillPayload as any,
      });
      const planId = (plan as any)?.id;
      if (selectedDate && planId) {
        await createSession.mutateAsync({ plan_id: planId, session_date: selectedDate, session_time: sessionTime.trim() || undefined });
        scheduleSessionReminders(planId, name.trim(), selectedDate, sessionTime.trim() || null);
      }
      navigation.replace('TrainingSuccess', {
        planId,
        planName: name.trim(),
        drillName: selected[0]?.drill.name ?? name.trim(),
      });
    } catch {
      Alert.alert('Hata', 'Antrenman oluşturulamadı.');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => (step === 0 ? navigation.goBack() : setStep(step - 1))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>
          {step === 0 ? 'Yeni Antreman (Kendin Oluştur)'
            : step === 1 ? 'Hareketleri Seç'
            : step === 2 ? 'Antremanı Oluştur'
            : 'Zaman ve Gün'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <StepBar step={step} s={s} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 0 && (
          <View style={s.body}>
            <Text style={s.fieldLabel}>Antrenmanına bir ad ver</Text>
            <TextInput
              style={s.input}
              placeholder="Yeni Antreman"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />

            <Text style={s.fieldLabel}>Antrenman türü</Text>
            <View style={s.chipsRow}>
              {PLAN_TYPES.map((t) => {
                const active = planType === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => setPlanType(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.fieldLabel}>Tahmini süre</Text>
            <Slider
              min={30} max={120} step={5}
              value={targetDuration}
              onChange={setTargetDuration}
              formatValue={(v) => `${v} dk`}
            />
            <Text style={s.durationValue}>{targetDuration} dk</Text>

            <TouchableOpacity
              style={s.primaryBtn}
              onPress={() => {
                if (!name.trim()) {
                  Alert.alert('Hata', 'Devam etmeden önce antrenmana bir ad ver.');
                  return;
                }
                setStep(1);
              }}
              activeOpacity={0.85}
            >
              <Text style={s.primaryBtnTxt}>Devam Et</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View style={{ flex: 1 }}>
            <View style={s.searchRow}>
              <View style={s.searchBox}>
                <Text style={s.searchIcon}>🔍</Text>
                <TextInput
                  style={s.searchInput}
                  placeholder="Hareket ara..."
                  placeholderTextColor={colors.muted}
                  value={drillSearch}
                  onChangeText={setDrillSearch}
                />
              </View>
            </View>

            <View style={s.filterRow}>
              {PHASE_FILTERS.map((p) => {
                const active = phaseFilter === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => setPhaseFilter(p)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{p}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <FlatList
              data={filteredDrills}
              keyExtractor={(item) => item.id.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const picked = isSelected(item.id);
                return (
                  <View style={s.drillRow}>
                    <View style={s.drillIconBox}>
                      <PhaseIcon phase={item.phase} size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.drillName} numberOfLines={1}>{item.name}</Text>
                      <Text style={s.drillMeta}>{item.phase} • {item.duration}</Text>
                    </View>
                    <TouchableOpacity
                      style={[s.addBtn, picked && s.addBtnActive]}
                      onPress={() => toggleDrill(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={[s.addBtnTxt, picked && s.addBtnTxtActive]}>{picked ? '✓' : '+'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />

            <View style={s.bottomBar}>
              <TouchableOpacity
                style={[s.primaryBtn, selected.length === 0 && s.primaryBtnDisabled]}
                onPress={() => setStep(2)}
                disabled={selected.length === 0}
                activeOpacity={0.85}
              >
                <Text style={s.primaryBtnTxt}>Devam Et ({selected.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ flex: 1 }}>
            <Text style={s.reviewHint}>
              Hareketlerin sıralamasını düzenle, eğer istersen süreleri değiştirin.
            </Text>
            <FlatList
              data={grouped}
              keyExtractor={(g) => g.phase}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: group }) => (
                <View style={{ marginBottom: 16 }}>
                  <Text style={s.groupTitle}>{group.phase.toUpperCase()}</Text>
                  {group.items.map((sd, i) => (
                    <View key={sd.drill.id} style={s.reviewRow}>
                      {group.items.length > 1 ? (
                        <View style={s.numberBadge}>
                          <Text style={s.numberBadgeTxt}>{i + 1}</Text>
                        </View>
                      ) : (
                        <View style={s.drillIconBox}>
                          <PhaseIcon phase={sd.drill.phase} size={18} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={s.drillName} numberOfLines={1}>{sd.drill.name}</Text>
                        <Text style={s.drillMeta}>{sd.drill.duration}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => openRowMenu(sd)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{ padding: 4 }}
                      >
                        <Text style={s.menuDots}>⋮</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            />

            <View style={s.bottomBar}>
              <TouchableOpacity
                style={s.primaryBtn}
                onPress={() => setStep(3)}
                activeOpacity={0.85}
              >
                <Text style={s.primaryBtnTxt}>Devam Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={s.scheduleBody} showsVerticalScrollIndicator={false}>
              <ScheduleStep
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                time={sessionTime}
                onTimeChange={setSessionTime}
                durationMinutes={targetDuration}
              />
            </ScrollView>
            <View style={s.bottomBar}>
              <TouchableOpacity
                style={[s.primaryBtn, createPlan.isPending && s.primaryBtnDisabled]}
                onPress={save}
                disabled={createPlan.isPending}
                activeOpacity={0.85}
              >
                <Text style={s.primaryBtnTxt}>{createPlan.isPending ? 'Kaydediliyor…' : 'Kaydet'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },

  stepBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 6 },
  stepCircle: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.card,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  stepCircleTxt: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  stepCircleTxtActive: { color: '#fff' },
  stepConnector: { width: 32, height: 2, backgroundColor: colors.border },
  stepConnectorActive: { backgroundColor: colors.accent },

  body: { padding: 16, flex: 1 },
  scheduleBody: { padding: 16, paddingBottom: 40 },
  fieldLabel: { color: colors.foreground, fontSize: 13, fontWeight: '600', marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: colors.card, color: colors.foreground, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },
  durationValue: { color: colors.accent, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: -6 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipTxt: { color: colors.foreground, fontSize: 13, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },

  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, color: colors.foreground, fontSize: 14, paddingVertical: 10 },

  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 10 },

  drillRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  drillIconBox: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  drillIcon: { fontSize: 18 },
  drillName: { color: colors.foreground, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  drillMeta: { color: colors.muted, fontSize: 12 },
  addBtn: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnActive: { backgroundColor: colors.accent },
  addBtnTxt: { color: colors.accent, fontSize: 15, fontWeight: '800' },
  addBtnTxtActive: { color: '#fff' },

  bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },

  reviewHint: { color: colors.muted, fontSize: 12, paddingHorizontal: 16, marginBottom: 12 },
  groupTitle: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  reviewRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  numberBadge: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  numberBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  menuDots: { color: colors.muted, fontSize: 18, fontWeight: '800' },
  });
}
