import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useCreatePlan } from '../../hooks/useTrainingPlans';
import { useCreateScheduledSession } from '../../hooks/useScheduledSessions';
import Slider from '../../components/ui/Slider';
import { useI18n, useContent, levelLabel } from '../../i18n';
import ScheduleStep, { getRoundedCurrentTime } from '../../components/ui/ScheduleStep';
import { scheduleSessionReminders } from '../../utils/notifications';
import Icon from '../../components/ui/Icon';
import { allDrills } from '../../data/drills';
import { fillToBudget, parseDurationMinutes } from '../../utils/trainingPlan';
import { Drill } from '../../data/types';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks n real catalog drills for one phase, preferring drills whose skill
// matches the selected goal/focus, without ever inventing a drill that isn't
// in our video library. When a level is given, only drills of that level are
// used — unless the level pool is too small to fill the section, in which case
// the whole pool is used again so a plan is never left short.
function pickRealDrills(pool: Drill[], budgetMinutes: number, skills: string[], usedIds: Set<number>, level?: string): Drill[] {
  const all = pool.filter((d) => !usedIds.has(d.id));
  const levelPool = level ? all.filter((d) => d.level === level) : [];
  // Seviye havuzu bölümü dolduramayacak kadar kısaysa tüm havuza dönülür.
  const levelTotal = levelPool.reduce((sum, d) => sum + parseDurationMinutes(d.duration), 0);
  const available = levelTotal >= budgetMinutes ? levelPool : all;
  const preferred = skills.length > 0 ? available.filter((d) => skills.includes(d.skill)) : [];
  const rest = available.filter((d) => !preferred.includes(d));
  const ordered = [...shuffle(preferred), ...shuffle(rest)];
  const picked = fillToBudget(ordered, budgetMinutes);
  picked.forEach((d) => usedIds.add(d.id));
  return picked;
}

type PlanSection = { phase: string; minutes: number; drills: Drill[] };

function buildPlan(totalMinutes: number, goalSkills: string[], level: string): PlanSection[] {
  // Bölüm süreleri seçilen toplam süreye göre dağıtılır ve toplamları her zaman
  // istenen süreyi verir; böylece oluşan program vaat edilen süreye yakın çıkar.
  const wu = Math.max(6, Math.min(12, Math.round(totalMinutes * 0.18)));
  const co = Math.max(4, Math.min(10, Math.round(totalMinutes * 0.11)));
  const main = Math.max(10, totalMinutes - wu - co);

  const warmupPool = allDrills.filter((d) => d.phase === 'Isınma');
  const mainPool = allDrills.filter((d) => d.phase === 'Ana Antrenman');
  const cooldownPool = allDrills.filter((d) => d.phase === 'Soğuma');

  const usedIds = new Set<number>();

  return [
    { phase: 'Isınma', minutes: wu, drills: pickRealDrills(warmupPool, wu, [], usedIds) },
    // Isınma/Soğuma havuzunun tamami "Başlangıç" oldugu icin seviye yalnizca
    // ana antrenman driller'ine uygulanir.
    { phase: 'Ana Antrenman', minutes: main, drills: pickRealDrills(mainPool, main, goalSkills, usedIds, level) },
    { phase: 'Soğuma', minutes: co, drills: pickRealDrills(cooldownPool, co, [], usedIds) },
  ].filter((sec) => sec.drills.length > 0);
}

// `skills` and `type` are canonical values used to pick drills and to tag the
// created plan; only titleKey/descKey decide what the user reads.
const GOALS = [
  { key: 'teknik', titleKey: 'ai.goal.technique', descKey: 'ai.goal.technique.desc', skills: ['Pas', 'Manşet', 'Servis', 'Atak', 'Blok'], type: 'Teknik' },
  { key: 'kondisyon', titleKey: 'ai.goal.conditioning', descKey: 'ai.goal.conditioning.desc', skills: ['Kondisyon'], type: 'Kondisyon' },
  { key: 'mac', titleKey: 'ai.goal.match', descKey: 'ai.goal.match.desc', skills: ['Taktik'], type: 'Maç Simülasyonu' },
  { key: 'genel', titleKey: 'ai.goal.general', descKey: 'ai.goal.general.desc', skills: [] as string[], type: 'Karışık' },
] as const;

const LEVELS = ['Başlangıç', 'Orta', 'İleri'];

// Canonical focus values kept as-is so FOCUS_TO_SKILL and drill matching work.
const FOCUS_OPTIONS = [
  { value: 'Pas', labelKey: 'ai.focus.pass' },
  { value: 'Servis', labelKey: 'ai.focus.serve' },
  { value: 'Smaç', labelKey: 'ai.focus.spike' },
  { value: 'Blok', labelKey: 'ai.focus.block' },
  { value: 'Defans', labelKey: 'ai.focus.defense' },
  { value: 'Kondisyon', labelKey: 'ai.focus.conditioning' },
] as const;
const FOCUS_TO_SKILL: Record<string, string> = { Smaç: 'Atak', Defans: 'Savunma' };

type Styles = ReturnType<typeof makeStyles>;

function StepBar({ step, s }: { step: number; s: Styles }) {
  return (
    <View style={s.stepBar}>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <View style={[s.stepCircle, i <= step && s.stepCircleActive]}>
            <Text style={[s.stepCircleTxt, i <= step && s.stepCircleTxtActive]}>{i + 1}</Text>
          </View>
          {i < 2 && <View style={[s.stepConnector, i < step && s.stepConnectorActive]} />}
        </React.Fragment>
      ))}
    </View>
  );
}

type Props = { navigation: any };

export default function AIWizardScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { drillName } = useContent();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const createPlan = useCreatePlan();
  const createSession = useCreateScheduledSession();
  const [step, setStep] = useState(0);
  const [goalKey, setGoalKey] = useState<typeof GOALS[number]['key']>('teknik');
  const [customName, setCustomName] = useState('');
  const [level, setLevel] = useState('Orta');
  const [duration, setDuration] = useState(60);
  const [focus, setFocus] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayKey());
  const [sessionTime, setSessionTime] = useState(getRoundedCurrentTime());
  const [saving, setSaving] = useState(false);

  const toggleFocus = (f: string) =>
    setFocus((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const goBackStep = () => (step === 0 ? navigation.goBack() : setStep(step - 1));

  const save = async () => {
    setSaving(true);
    try {
      const goal = GOALS.find((g) => g.key === goalKey)!;
      const focusSkills = focus.map((f) => FOCUS_TO_SKILL[f] ?? f);
      const skills = Array.from(new Set([...goal.skills, ...focusSkills]));
      const sections = buildPlan(duration, skills, level);

      const drills = sections.flatMap((sec, si) =>
        sec.drills.map((d, i) => ({
          drill_id: d.id,
          phase: sec.phase,
          sort_order: si * 10 + i,
          completed: false,
        })),
      );

      const planName = customName.trim() || `AI - ${t(goal.titleKey)}`;
      const plan = await createPlan.mutateAsync({
        name: planName,
        goal: t(goal.descKey),
        plan_type: goal.type,
        level: level.toLowerCase(),
        target_duration: duration,
        drills: drills as any,
      });
      const planId = (plan as any)?.id;

      if (selectedDate && planId) {
        await createSession.mutateAsync({ plan_id: planId, session_date: selectedDate, session_time: sessionTime.trim() || undefined });
        scheduleSessionReminders(planId, planName, selectedDate, sessionTime.trim() || null);
      }

      navigation.getParent()?.navigate('AntrenmanStack', {
        screen: 'TrainingSuccess',
        params: {
          planId,
          planName,
          drillName: sections[0]?.drills[0] ? drillName(sections[0].drills[0]) : planName,
        },
      });
    } catch {
      Alert.alert(t('common.error'), t('ai.createError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={goBackStep} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{step === 0 ? t('ai.step0') : step === 1 ? t('ai.step1') : t('ai.step2')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <StepBar step={step} s={s} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <Text style={s.fieldLabel}>{t('ai.nameLabel')}</Text>
            <TextInput
              style={s.input}
              placeholder={t('ai.namePlaceholder')}
              placeholderTextColor={colors.muted}
              value={customName}
              onChangeText={setCustomName}
            />

            <Text style={s.question}>{t('ai.goalQuestion')}</Text>
            {GOALS.map((g) => {
              const active = goalKey === g.key;
              return (
                <TouchableOpacity
                  key={g.key}
                  style={[s.goalRow, active && s.goalRowActive]}
                  activeOpacity={0.8}
                  onPress={() => setGoalKey(g.key)}
                >
                  <View style={[s.radio, active && s.radioActive]}>
                    {active && <View style={s.radioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.goalTitle}>{t(g.titleKey)}</Text>
                    <Text style={s.goalDesc}>{t(g.descKey)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {step === 1 && (
          <>
            <Text style={s.fieldLabel}>{t('ai.levelLabel')}</Text>
            <View style={s.chipsRow}>
              {LEVELS.map((l) => {
                const active = level === l;
                return (
                  <TouchableOpacity
                    key={l}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => setLevel(l)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{levelLabel(l, lang)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.fieldLabel}>{t('ai.durationLabel')}</Text>
            <Slider min={30} max={120} step={5} value={duration} onChange={setDuration} formatValue={(v) => t('ai.duration', { n: v })} />
            <Text style={s.durationValue}>{t('ai.duration', { n: duration })}</Text>

            <Text style={s.fieldLabel}>{t('ai.focusLabel')}</Text>
            <View style={s.chipsRow}>
              {FOCUS_OPTIONS.map((opt) => {
                const active = focus.includes(opt.value);
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => toggleFocus(opt.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{t(opt.labelKey)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {step === 2 && (
          <ScheduleStep
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            time={sessionTime}
            onTimeChange={setSessionTime}
            durationMinutes={duration}
          />
        )}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, step === 2 && saving && s.primaryBtnDisabled]}
          activeOpacity={0.85}
          onPress={step === 0 ? () => setStep(1) : step === 1 ? () => setStep(2) : save}
          disabled={step === 2 && saving}
        >
          <Text style={s.primaryBtnTxt}>
            {step === 2 ? (saving ? t('common.creating') : t('common.save')) : t('common.continue')}
          </Text>
        </TouchableOpacity>
      </View>
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

  body: { padding: 16, paddingBottom: 40 },
  question: { color: colors.foreground, fontSize: 16, fontWeight: '700', marginBottom: 16 },

  goalRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  goalRowActive: { borderColor: colors.accent, backgroundColor: colors.accent + '10' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.accent },
  goalTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  goalDesc: { color: colors.muted, fontSize: 12, lineHeight: 17 },

  fieldLabel: { color: colors.foreground, fontSize: 13, fontWeight: '600', marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: colors.card, color: colors.foreground, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },
  durationValue: { color: colors.accent, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: -6, marginBottom: 4 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipTxt: { color: colors.foreground, fontSize: 13, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },

  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  footer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.border },
  });
}
