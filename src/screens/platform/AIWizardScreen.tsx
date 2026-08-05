import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useCreatePlan } from '../../hooks/useTrainingPlans';
import { useCreateScheduledSession } from '../../hooks/useScheduledSessions';
import Slider from '../../components/ui/Slider';
import ScheduleStep, { getRoundedCurrentTime } from '../../components/ui/ScheduleStep';
import { scheduleSessionReminders } from '../../utils/notifications';
import Icon from '../../components/ui/Icon';

// ─── Drill databases (ported from web AIWizard.tsx) ──────────────────────────
type DrillEntry = { name: string; skill: string; minPlayers: number; environments: string[] };

const warmupDB: DrillEntry[] = [
  { name: 'Hafif koşu + kol çemberleri', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Dinamik bacak germe', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Core aktivasyonu + plank', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Atlama ipi', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Duvara manşet çalışması', skill: 'Manşet', minPlayers: 1, environments: ['Salon', 'Ev'] },
];

const techDB: DrillEntry[] = [
  { name: 'Duvara parmak pas tekrarı', skill: 'Pas', minPlayers: 1, environments: ['Salon', 'Ev'] },
  { name: 'Duvara manşet tekrarı', skill: 'Manşet', minPlayers: 1, environments: ['Salon', 'Ev'] },
  { name: 'Kendi kendine top fırlatıp servis mekaniği', skill: 'Servis', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev'] },
  { name: 'Gölge blok atlayışları', skill: 'Blok', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Tek kişi savunma refleks drili', skill: 'Savunma', minPlayers: 1, environments: ['Salon', 'Ev'] },
  { name: 'Atak kolu salınım tekniği', skill: 'Atak', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev'] },
  { name: 'Pasörlük el pozisyonu drili', skill: 'Pasörlük', minPlayers: 1, environments: ['Salon', 'Ev'] },
  { name: 'Çift kişi manşet pas çalışması', skill: 'Manşet', minPlayers: 2, environments: ['Salon', 'Açık Alan'] },
  { name: 'Çift kişi parmak pas çalışması', skill: 'Pas', minPlayers: 2, environments: ['Salon', 'Açık Alan'] },
  { name: 'Servis-karşılama çalışması', skill: 'Servis', minPlayers: 2, environments: ['Salon', 'Açık Alan'] },
  { name: 'Blok zamanlama drili (partnerli)', skill: 'Blok', minPlayers: 2, environments: ['Salon'] },
  { name: 'Savunma pozisyon alma drili', skill: 'Savunma', minPlayers: 2, environments: ['Salon', 'Açık Alan'] },
];

const gameDB: DrillEntry[] = [
  { name: 'Tek kişi hayali atak simülasyonu', skill: 'Atak', minPlayers: 1, environments: ['Salon', 'Ev'] },
  { name: "2'ye 2 mini oyun", skill: 'Taktik', minPlayers: 4, environments: ['Salon', 'Açık Alan'] },
  { name: "3'e 3 yarım saha oyun", skill: 'Taktik', minPlayers: 6, environments: ['Salon', 'Açık Alan'] },
  { name: 'Servis-karşılama rallisi', skill: 'Servis', minPlayers: 4, environments: ['Salon', 'Açık Alan'] },
  { name: 'Kondisyon tabanlı devre antrenmanı', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Hedef bölge atak yarışması', skill: 'Atak', minPlayers: 2, environments: ['Salon', 'Açık Alan'] },
];

const cooldownDB: DrillEntry[] = [
  { name: 'Hafif koşu', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Statik germe - üst vücut', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Statik germe - alt vücut', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
  { name: 'Nefes egzersizi + gevşeme', skill: 'Kondisyon', minPlayers: 1, environments: ['Salon', 'Açık Alan', 'Ev', 'Fitness'] },
];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function filterDrills(db: DrillEntry[], env: string, skills: string[]): DrillEntry[] {
  const valid = db.filter((d) => d.environments.includes(env));
  if (skills.length > 0) {
    const pref = valid.filter((d) => skills.includes(d.skill));
    if (pref.length >= 2) return pref;
  }
  return valid;
}

function pickN(db: DrillEntry[], n: number, skills: string[]): DrillEntry[] {
  const pool = [...db];
  if (skills.length > 0) {
    pool.sort((a, b) => (skills.includes(a.skill) ? 0 : 1) - (skills.includes(b.skill) ? 0 : 1));
  }
  return pool.slice(0, n);
}

type PlanSection = { phase: string; minutes: number; drills: { name: string; skill: string }[] };

function buildPlan(totalMinutes: number, goalSkills: string[]): PlanSection[] {
  const env = 'Salon';
  let wu: number, te: number, ga: number, co: number;
  if (totalMinutes <= 45) { wu = 8; te = 17; ga = 15; co = 5; }
  else if (totalMinutes <= 60) { wu = 10; te = 20; ga = 20; co = 5; }
  else if (totalMinutes <= 90) { wu = 10; te = 25; ga = 25; co = 8; }
  else { wu = 12; te = 30; ga = 30; co = 10; }

  // Technique and game/tactic drills both belong to the single "Ana Antrenman" phase.
  const mainDrills = [
    ...pickN(filterDrills(techDB, env, goalSkills), te <= 20 ? 3 : 4, goalSkills),
    ...pickN(filterDrills(gameDB, env, goalSkills), ga <= 20 ? 2 : 3, goalSkills),
  ].map((d) => ({ name: d.name, skill: d.skill }));

  return [
    { phase: 'Isınma', minutes: wu, drills: pickN(filterDrills(warmupDB, env, []), wu <= 8 ? 2 : 3, []).map((d) => ({ name: d.name, skill: d.skill })) },
    { phase: 'Ana Antrenman', minutes: te + ga, drills: mainDrills },
    { phase: 'Soğuma', minutes: co, drills: pickN(filterDrills(cooldownDB, env, []), 2, []).map((d) => ({ name: d.name, skill: d.skill })) },
  ].filter((sec) => sec.drills.length > 0);
}

const GOALS = [
  { key: 'teknik', title: 'Teknik Gelişim', desc: 'Pas, smaç, servis, blok gibi teknik becerilerini geliştirmek.', skills: ['Pas', 'Manşet', 'Servis', 'Atak', 'Blok'], type: 'Teknik' },
  { key: 'kondisyon', title: 'Kondisyon Gelişimi', desc: 'Dayanıklılık, güç ve çeviklik kazanmak.', skills: ['Kondisyon'], type: 'Kondisyon' },
  { key: 'mac', title: 'Maça Hazırlık', desc: 'Maç performansını artırmak için özel çalışma.', skills: ['Taktik'], type: 'Maç Simülasyonu' },
  { key: 'genel', title: 'Genel Gelişim', desc: 'Tüm becerileri dengeli şekilde geliştirmek.', skills: [] as string[], type: 'Karışık' },
] as const;

const LEVELS = ['Başlangıç', 'Orta', 'İleri'];
const FOCUS_OPTIONS = ['Pas', 'Servis', 'Smaç', 'Blok', 'Defans', 'Kondisyon'];
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
      const sections = buildPlan(duration, skills);

      const drills = sections.flatMap((sec, si) =>
        sec.drills.map((d, i) => ({
          drill_id: -1,
          phase: sec.phase,
          sort_order: si * 10 + i,
          completed: false,
          custom_name: d.name,
          custom_skill: d.skill,
        })),
      );

      const planName = customName.trim() || `AI - ${goal.title}`;
      const plan = await createPlan.mutateAsync({
        name: planName,
        goal: goal.desc,
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
          drillName: sections[0]?.drills[0]?.name ?? planName,
        },
      });
    } catch {
      Alert.alert('Hata', 'Antrenman oluşturulurken bir sorun oluştu.');
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
        <Text style={s.headerTitle}>{step === 0 ? 'AI ile Antreman Oluştur' : step === 1 ? 'Seviye ve Süre' : 'Zaman ve Gün'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <StepBar step={step} s={s} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <Text style={s.fieldLabel}>Antrenmanına bir ad ver (opsiyonel)</Text>
            <TextInput
              style={s.input}
              placeholder="Ör: Pazartesi Teknik Antrenman"
              placeholderTextColor={colors.muted}
              value={customName}
              onChangeText={setCustomName}
            />

            <Text style={s.question}>Hedefini seç</Text>
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
                    <Text style={s.goalTitle}>{g.title}</Text>
                    <Text style={s.goalDesc}>{g.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={() => setStep(1)}>
              <Text style={s.primaryBtnTxt}>Devam Et</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={s.fieldLabel}>Seviye</Text>
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
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{l}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.fieldLabel}>Tahmini Süre</Text>
            <Slider min={30} max={120} step={5} value={duration} onChange={setDuration} formatValue={(v) => `${v} dk`} />
            <Text style={s.durationValue}>{duration} dk</Text>

            <Text style={s.fieldLabel}>Odaklanılacak alanlar (Opsiyonel)</Text>
            <View style={s.chipsRow}>
              {FOCUS_OPTIONS.map((f) => {
                const active = focus.includes(f);
                return (
                  <TouchableOpacity
                    key={f}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => toggleFocus(f)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipTxt, active && s.chipTxtActive]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={s.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setStep(2)}
            >
              <Text style={s.primaryBtnTxt}>Devam Et</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <ScheduleStep
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              time={sessionTime}
              onTimeChange={setSessionTime}
              durationMinutes={duration}
            />

            <TouchableOpacity
              style={[s.primaryBtn, saving && s.primaryBtnDisabled]}
              activeOpacity={0.85}
              onPress={save}
              disabled={saving}
            >
              <Text style={s.primaryBtnTxt}>{saving ? 'Oluşturuluyor…' : 'Kaydet'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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

  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
