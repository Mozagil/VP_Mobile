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
import { useI18n, useContent, phaseLabel, skillLabel } from '../../i18n';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'CreatePlan'>;

// Canonical plan_type values sent to the API, with their display keys.
const PLAN_TYPES = [
  { value: 'Teknik', labelKey: 'createPlan.type.technique' },
  { value: 'Kondisyon', labelKey: 'createPlan.type.conditioning' },
  { value: 'Kombinasyon', labelKey: 'createPlan.type.combination' },
  { value: 'Diğer', labelKey: 'createPlan.type.other' },
] as const;
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
  const { t, lang } = useI18n();
  const { drillName } = useContent();
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
      const q = drillSearch.toLowerCase();
      const matchSearch =
        drillSearch.length === 0 ||
        drillName(d).toLowerCase().includes(q) ||
        skillLabel(d.skill, lang).toLowerCase().includes(q);
      const matchPhase = phaseFilter === 'Tümü' || phaseFilter === 'Favoriler' || d.phase === phaseFilter;
      const matchFavorite = phaseFilter !== 'Favoriler' || isFavorite(d.id);
      return matchSearch && matchPhase && matchFavorite;
    });
  }, [drillSearch, phaseFilter, isFavorite, lang]);

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

  // 'Tümü' and 'Favoriler' are UI-only filter values, the rest are real phases.
  const phaseFilterLabel = (value: string) =>
    value === 'Tümü' ? t('common.all')
      : value === 'Favoriler' ? t('createPlan.phase.favorites')
      : phaseLabel(value, lang);

  const openRowMenu = (sd: SelectedDrill) => {
    Alert.alert(drillName(sd.drill), undefined, [
      { text: t('createPlan.moveUp'), onPress: () => moveDrill(sd.drill.id, -1) },
      { text: t('createPlan.moveDown'), onPress: () => moveDrill(sd.drill.id, 1) },
      { text: t('common.remove'), style: 'destructive', onPress: () => removeDrill(sd.drill.id) },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const save = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('createPlan.nameRequired'));
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
      Alert.alert(t('common.error'), t('createPlan.createFailed'));
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
          {step === 0 ? t('createPlan.step0')
            : step === 1 ? t('createPlan.step1')
            : step === 2 ? t('createPlan.step2')
            : t('createPlan.step3')}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <StepBar step={step} s={s} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 0 && (
          <View style={s.body}>
            <Text style={s.fieldLabel}>{t('createPlan.nameLabel')}</Text>
            <TextInput
              style={s.input}
              placeholder={t('createPlan.namePlaceholder')}
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />

            <Text style={s.fieldLabel}>{t('createPlan.typeLabel')}</Text>
            <View style={s.chipsRow}>
              {PLAN_TYPES.map((opt) => {
                const active = planType === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => setPlanType(opt.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{t(opt.labelKey)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.fieldLabel}>{t('createPlan.durationLabel')}</Text>
            <Slider
              min={30} max={120} step={5}
              value={targetDuration}
              onChange={setTargetDuration}
              formatValue={(v) => t('createPlan.duration', { n: v })}
            />
            <Text style={s.durationValue}>{t('createPlan.duration', { n: targetDuration })}</Text>

            <TouchableOpacity
              style={s.primaryBtn}
              onPress={() => {
                if (!name.trim()) {
                  Alert.alert(t('common.error'), t('createPlan.nameRequiredStep'));
                  return;
                }
                setStep(1);
              }}
              activeOpacity={0.85}
            >
              <Text style={s.primaryBtnTxt}>{t('common.continue')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View style={{ flex: 1 }}>
            <View style={s.searchRow}>
              <View style={s.searchBox}>
                <TextInput
                  style={s.searchInput}
                  placeholder={t('createPlan.drillSearchPlaceholder')}
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
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{phaseFilterLabel(p)}</Text>
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
                      <Text style={s.drillName} numberOfLines={1}>{drillName(item)}</Text>
                      <Text style={s.drillMeta}>{phaseLabel(item.phase, lang)} • {item.duration}</Text>
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
                <Text style={s.primaryBtnTxt}>{t('createPlan.continueCount', { n: selected.length })}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ flex: 1 }}>
            <Text style={s.reviewHint}>
              {t('createPlan.reorderHint')}
            </Text>
            <FlatList
              data={grouped}
              keyExtractor={(g) => g.phase}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: group }) => (
                <View style={{ marginBottom: 16 }}>
                  <Text style={s.groupTitle}>{phaseLabel(group.phase, lang).toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US')}</Text>
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
                        <Text style={s.drillName} numberOfLines={1}>{drillName(sd.drill)}</Text>
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
                <Text style={s.primaryBtnTxt}>{t('common.continue')}</Text>
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
                <Text style={s.primaryBtnTxt}>{createPlan.isPending ? t('common.saving') : t('common.save')}</Text>
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
