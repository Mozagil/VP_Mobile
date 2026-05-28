import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useCreatePlan } from '../../hooks/useTrainingPlans';

// ─── Types ──────────────────────────────────────────────────────────────────
type Step1Data = { name: string; duration: string; environment: string; players: string; level: string };
type Step2Data = { goals: string[]; type: string; tempo: string; position: string };

// ─── Options ─────────────────────────────────────────────────────────────────
const DURATIONS    = ['45 dk', '60 dk', '75 dk', '90 dk'];
const ENVIRONMENTS = ['Salon', 'Açık Alan', 'Ev', 'Fitness'];
const PLAYERS      = ['1', '2–6', '7–12', '12+'];
const LEVELS       = ['Başlangıç', 'Orta', 'İleri', 'Profesyonel'];
const GOALS        = ['Servis', 'Pas', 'Atak', 'Manşet', 'Blok', 'Savunma', 'Pasörlük', 'Kondisyon'];
const TYPES        = ['Teknik', 'Taktik', 'Maç Simülasyonu', 'Kondisyon', 'Isınma+Teknik', 'Karışık'];
const TEMPOS       = ['Düşük', 'Orta', 'Yüksek', 'Maç'];
const POSITIONS    = ['Tüm Takım', 'Pasör', 'Smaçör', 'Orta', 'Libero', 'Pasör Çaprazı'];

// ─── Drill databases (ported from web AIWizard.tsx) ──────────────────────────
type DrillEntry = { name: string; skill: string; minPlayers: number; environments: string[] };

const warmupDB: DrillEntry[] = [
  { name: 'Hafif koşu + kol çemberleri',    skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Dinamik bacak germe',            skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Core aktivasyonu + plank',       skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Atlama ipi',                     skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Duvara manşet çalışması',        skill: 'Manşet',    minPlayers: 1, environments: ['Salon','Ev'] },
  { name: 'Shuttle run (mekik koşusu)',     skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan'] },
  { name: 'Partner ile top sekme',          skill: 'Kondisyon', minPlayers: 2, environments: ['Salon','Açık Alan'] },
  { name: 'Çift kişi koşu + germe',        skill: 'Kondisyon', minPlayers: 2, environments: ['Salon','Açık Alan','Fitness'] },
];

const techDB: DrillEntry[] = [
  { name: 'Duvara parmak pas tekrarı',                  skill: 'Pas',      minPlayers: 1, environments: ['Salon','Ev'] },
  { name: 'Duvara manşet tekrarı',                      skill: 'Manşet',   minPlayers: 1, environments: ['Salon','Ev'] },
  { name: 'Kendi kendine top fırlatıp servis mekaniği', skill: 'Servis',   minPlayers: 1, environments: ['Salon','Açık Alan','Ev'] },
  { name: 'Gölge blok atlayışları',                     skill: 'Blok',     minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Tek kişi savunma refleks drili',             skill: 'Savunma',  minPlayers: 1, environments: ['Salon','Ev'] },
  { name: 'Ayak hareketleri çalışması (footwork)',      skill: 'Kondisyon',minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Atak kolu salınım tekniği',                  skill: 'Atak',     minPlayers: 1, environments: ['Salon','Açık Alan','Ev'] },
  { name: 'Pasörlük el pozisyonu drili',                skill: 'Pasörlük', minPlayers: 1, environments: ['Salon','Ev'] },
  { name: 'Çift kişi manşet pas çalışması',            skill: 'Manşet',   minPlayers: 2, environments: ['Salon','Açık Alan'] },
  { name: 'Çift kişi parmak pas çalışması',            skill: 'Pas',      minPlayers: 2, environments: ['Salon','Açık Alan'] },
  { name: 'Servis-karşılama çalışması',                skill: 'Servis',   minPlayers: 2, environments: ['Salon','Açık Alan'] },
  { name: 'Hedef isabetlilik servis drili',             skill: 'Servis',   minPlayers: 1, environments: ['Salon','Açık Alan'] },
  { name: 'Blok zamanlama drili (partnerli)',           skill: 'Blok',     minPlayers: 2, environments: ['Salon'] },
  { name: 'Savunma pozisyon alma drili',                skill: 'Savunma',  minPlayers: 2, environments: ['Salon','Açık Alan'] },
  { name: 'Pasör set dağıtım drili',                   skill: 'Pasörlük', minPlayers: 3, environments: ['Salon'] },
  { name: 'Grup halinde atak-savunma döngüsü',         skill: 'Atak',     minPlayers: 6, environments: ['Salon','Açık Alan'] },
  { name: 'Takım servis karşılama formasyonu',          skill: 'Savunma',  minPlayers: 6, environments: ['Salon','Açık Alan'] },
  { name: "3'lü blok geçiş drili",                     skill: 'Blok',     minPlayers: 6, environments: ['Salon'] },
];

const gameDB: DrillEntry[] = [
  { name: 'Tek kişi hayali atak simülasyonu',    skill: 'Atak',     minPlayers: 1,  environments: ['Salon','Ev'] },
  { name: "2'ye 2 mini oyun",                    skill: 'Taktik',   minPlayers: 4,  environments: ['Salon','Açık Alan'] },
  { name: "3'e 3 yarım saha oyun",               skill: 'Taktik',   minPlayers: 6,  environments: ['Salon','Açık Alan'] },
  { name: "4'e 4 kontrollü oyun",                skill: 'Taktik',   minPlayers: 8,  environments: ['Salon','Açık Alan'] },
  { name: "6'ya 6 tam saha maç simülasyonu",     skill: 'Taktik',   minPlayers: 12, environments: ['Salon','Açık Alan'] },
  { name: 'Wash drill (kazanan kalır)',           skill: 'Taktik',   minPlayers: 8,  environments: ['Salon'] },
  { name: 'Servis-karşılama rallisi',            skill: 'Servis',   minPlayers: 4,  environments: ['Salon','Açık Alan'] },
  { name: 'Transition serbest oyun',             skill: 'Taktik',   minPlayers: 6,  environments: ['Salon'] },
  { name: 'Kondisyon tabanlı devre antrenmanı',  skill: 'Kondisyon',minPlayers: 1,  environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Hedef bölge atak yarışması',          skill: 'Atak',     minPlayers: 2,  environments: ['Salon','Açık Alan'] },
];

const cooldownDB: DrillEntry[] = [
  { name: 'Hafif koşu',                          skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Statik germe - üst vücut',            skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Statik germe - alt vücut',            skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Nefes egzersizi + gevşeme',           skill: 'Kondisyon', minPlayers: 1, environments: ['Salon','Açık Alan','Ev','Fitness'] },
  { name: 'Foam roller ile miyofasiyal gevşetme', skill: 'Kondisyon', minPlayers: 1, environments: ['Fitness','Ev'] },
];

// ─── Plan generation logic ───────────────────────────────────────────────────
function getMaxPlayers(p: string): number {
  if (p === '1') return 1;
  if (p === '2–6') return 6;
  if (p === '7–12') return 12;
  return 24;
}

function filterDrills(db: DrillEntry[], env: string, maxP: number, skills?: string[]): DrillEntry[] {
  let valid = db.filter(d => d.environments.includes(env) && d.minPlayers <= maxP);
  if (skills && skills.length > 0) {
    const pref = valid.filter(d => skills.includes(d.skill));
    if (pref.length >= 2) return pref;
  }
  return valid;
}

function pickN(db: DrillEntry[], n: number, skills?: string[]): DrillEntry[] {
  const pool = [...db];
  if (skills && skills.length > 0) {
    pool.sort((a, b) => {
      const aM = skills.includes(a.skill) ? 0 : 1;
      const bM = skills.includes(b.skill) ? 0 : 1;
      return aM - bM;
    });
  }
  return pool.slice(0, n);
}

type PlanSection = { phase: string; duration: string; drills: { name: string; skill: string }[] };

function buildPlan(s1: Step1Data, s2: Step2Data): PlanSection[] {
  const total = parseInt(s1.duration);
  const maxP  = getMaxPlayers(s1.players);
  const env   = s1.environment;
  const goals = s2.goals;

  let wu: number, te: number, ga: number, co: number;
  if (total <= 45)      { wu = 8;  te = 17; ga = 15; co = 5; }
  else if (total <= 60) { wu = 10; te = 20; ga = 20; co = 5; }
  else if (total <= 75) { wu = 10; te = 25; ga = 25; co = 5; }
  else                  { wu = 12; te = 30; ga = 30; co = 8; }

  const alloc = wu + te + ga + co;
  if (alloc < total) {
    te += Math.floor((total - alloc) / 2);
    ga += Math.ceil((total - alloc) / 2);
  } else if (alloc > total) {
    ga = Math.max(5, ga - (alloc - total));
  }

  return [
    {
      phase: 'Isınma',
      duration: `${wu} dk`,
      drills: pickN(filterDrills(warmupDB, env, maxP), wu <= 8 ? 2 : 3)
               .map(d => ({ name: d.name, skill: d.skill })),
    },
    {
      phase: 'Teknik Çalışma',
      duration: `${te} dk`,
      drills: pickN(filterDrills(techDB, env, maxP, goals), te <= 17 ? 2 : te <= 25 ? 3 : 4, goals)
               .map(d => ({ name: d.name, skill: d.skill })),
    },
    {
      phase: 'Uygulama / Oyun',
      duration: `${ga} dk`,
      drills: pickN(filterDrills(gameDB, env, maxP, goals), ga <= 15 ? 2 : ga <= 25 ? 3 : 4, goals)
               .map(d => ({ name: d.name, skill: d.skill })),
    },
    {
      phase: 'Soğuma',
      duration: `${co} dk`,
      drills: pickN(filterDrills(cooldownDB, env, maxP), co <= 5 ? 2 : 3)
               .map(d => ({ name: d.name, skill: d.skill })),
    },
  ];
}

const PHASE_MAP: Record<string, string> = {
  'Isınma':          'Isınma',
  'Teknik Çalışma':  'Ana Antrenman',
  'Uygulama / Oyun': 'Oyun',
  'Soğuma':          'Soğuma',
};
const PHASE_ICON: Record<string, string> = {
  'Isınma': '🔥', 'Teknik Çalışma': '⚡', 'Uygulama / Oyun': '🏐', 'Soğuma': '❄️',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

// Android-safe chip: outer View owns borderRadius, inner TO owns padding
function Chip({ label, active, onPress, showCheck }: {
  label: string; active: boolean; onPress: () => void; showCheck?: boolean;
}) {
  return (
    <View style={[s.chipWrap, active && s.chipWrapActive]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={s.chipInner}>
        <Text style={[s.chipText, active && s.chipTextActive]}>
          {showCheck && active ? '✓ ' : ''}{label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function StepBar({ step }: { step: number }) {
  const labels = ['Temel Bilgiler', 'Hedefler', 'Planınız'];
  return (
    <View style={s.stepBar}>
      {labels.map((l, i) => (
        <View key={i} style={s.stepItem}>
          <View style={[s.stepLine, { backgroundColor: i <= step ? colors.accent : colors.border }]} />
          <Text style={[s.stepLbl, { color: i <= step ? colors.accent : colors.muted }]}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────
type Props = { navigation: any };

export default function AIWizardScreen({ navigation }: Props) {
  const createPlan = useCreatePlan();

  const [step, setStep] = useState(0);
  const [s1, setS1] = useState<Step1Data>({
    name: '', duration: '60 dk', environment: 'Salon', players: '7–12', level: 'Orta',
  });
  const [s2, setS2] = useState<Step2Data>({
    goals: [], type: 'Teknik', tempo: 'Orta', position: 'Tüm Takım',
  });
  const [sections, setSections] = useState<PlanSection[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleGoal = (g: string) =>
    setS2(prev => ({
      ...prev,
      goals: prev.goals.includes(g)
        ? prev.goals.filter(x => x !== g)
        : prev.goals.length < 2 ? [...prev.goals, g] : prev.goals,
    }));

  const handleGenerate = () => {
    setSections(buildPlan(s1, s2));
    setStep(2);
  };

  const totalMin = sections.reduce((acc, sec) => acc + parseInt(sec.duration), 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      const drills = sections.flatMap((sec, si) =>
        sec.drills.map((d, i) => ({
          drill_id: -1,
          phase: PHASE_MAP[sec.phase] ?? 'Ana Antrenman',
          sort_order: si * 10 + i,
          completed: false,
          custom_name: d.name,
          custom_skill: d.skill,
        }))
      );
      const planName = s1.name.trim() || 'AI Antrenman Planı';
      await createPlan.mutateAsync({ name: planName, drills: drills as any });
      Alert.alert(
        '✅ Plan Kaydedildi',
        `"${planName}" başarıyla oluşturuldu. Gelişim sekmesinden planlarınıza ulaşabilirsiniz.`,
        [{ text: 'Tamam' }],
      );
    } catch {
      Alert.alert('Hata', 'Plan kaydedilirken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setS1({ name: '', duration: '60 dk', environment: 'Salon', players: '7–12', level: 'Orta' });
    setS2({ goals: [], type: 'Teknik', tempo: 'Orta', position: 'Tüm Takım' });
    setSections([]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StepBar step={step} />
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── STEP 0: Temel Bilgiler ───────────────────────────────────── */}
          {step === 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>🎯 Temel Bilgiler</Text>

              <Text style={s.fieldLabel}>Antrenman Adı (opsiyonel)</Text>
              <TextInput
                style={s.textInput}
                placeholder="örn. Cuma Teknik Antrenmanı"
                placeholderTextColor={colors.muted}
                value={s1.name}
                onChangeText={v => setS1({ ...s1, name: v })}
              />

              <Text style={s.fieldLabel}>⏱ Süre</Text>
              <View style={s.chipsRow}>
                {DURATIONS.map(d => (
                  <Chip key={d} label={d} active={s1.duration === d} onPress={() => setS1({ ...s1, duration: d })} />
                ))}
              </View>

              <Text style={s.fieldLabel}>📍 Ortam</Text>
              <View style={s.chipsRow}>
                {ENVIRONMENTS.map(e => (
                  <Chip key={e} label={e} active={s1.environment === e} onPress={() => setS1({ ...s1, environment: e })} />
                ))}
              </View>

              <Text style={s.fieldLabel}>👥 Oyuncu Sayısı</Text>
              <View style={s.chipsRow}>
                {PLAYERS.map(p => (
                  <Chip key={p} label={p} active={s1.players === p} onPress={() => setS1({ ...s1, players: p })} />
                ))}
              </View>

              <Text style={s.fieldLabel}>📊 Seviye</Text>
              <View style={s.chipsRow}>
                {LEVELS.map(l => (
                  <Chip key={l} label={l} active={s1.level === l} onPress={() => setS1({ ...s1, level: l })} />
                ))}
              </View>

              <TouchableOpacity style={s.primaryBtn} onPress={() => setStep(1)} activeOpacity={0.85}>
                <Text style={s.primaryBtnTxt}>Devam Et  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── STEP 1: Hedefler ──────────────────────────────────────────── */}
          {step === 1 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>🏹 Hedefler</Text>

              <View style={s.labelRow}>
                <Text style={s.fieldLabel}>Ana Hedefler</Text>
                <Text style={s.hint}>En fazla 2 seçin</Text>
              </View>
              <View style={s.chipsRow}>
                {GOALS.map(g => (
                  <Chip key={g} label={g} active={s2.goals.includes(g)} onPress={() => toggleGoal(g)} showCheck />
                ))}
              </View>

              <Text style={s.fieldLabel}>🎯 Antrenman Tipi</Text>
              <View style={s.chipsRow}>
                {TYPES.map(t => (
                  <Chip key={t} label={t} active={s2.type === t} onPress={() => setS2({ ...s2, type: t })} />
                ))}
              </View>

              <Text style={s.fieldLabel}>⚡ Tempo</Text>
              <View style={s.chipsRow}>
                {TEMPOS.map(t => (
                  <Chip key={t} label={t} active={s2.tempo === t} onPress={() => setS2({ ...s2, tempo: t })} />
                ))}
              </View>

              <Text style={s.fieldLabel}>👤 Pozisyon Odağı</Text>
              <View style={s.chipsRow}>
                {POSITIONS.map(p => (
                  <Chip key={p} label={p} active={s2.position === p} onPress={() => setS2({ ...s2, position: p })} />
                ))}
              </View>

              <View style={s.btnRow}>
                <TouchableOpacity style={s.outlineBtn} onPress={() => setStep(0)} activeOpacity={0.85}>
                  <Text style={s.outlineBtnTxt}>← Geri</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.primaryBtn, s.btnFlex, s2.goals.length === 0 && s.btnDisabled]}
                  onPress={handleGenerate}
                  disabled={s2.goals.length === 0}
                  activeOpacity={0.85}
                >
                  <Text style={s.primaryBtnTxt}>✨ Plan Oluştur</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── STEP 2: Generated Plan ────────────────────────────────────── */}
          {step === 2 && sections.length > 0 && (
            <>
              {/* Summary header */}
              <View style={s.card}>
                <Text style={s.planName}>✅ {s1.name.trim() || 'AI Antrenman Planı'}</Text>
                <View style={s.tagsRow}>
                  {[s1.duration, s1.environment, `${s1.players} kişi`, s1.level, s2.type, ...s2.goals].map((tag, i) => (
                    <View key={i} style={s.tag}>
                      <Text style={s.tagTxt}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <Text style={s.totalDur}>Toplam süre: {totalMin} dk</Text>
              </View>

              {/* Phase sections */}
              {sections.map(sec => (
                <View key={sec.phase} style={s.sectionCard}>
                  <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>{PHASE_ICON[sec.phase] ?? '🏐'} {sec.phase}</Text>
                    <View style={s.durBadge}>
                      <Text style={s.durBadgeTxt}>{sec.duration}</Text>
                    </View>
                  </View>
                  {sec.drills.map((d, i) => (
                    <View key={i} style={s.drillRow}>
                      <View style={s.drillDot} />
                      <Text style={s.drillName} numberOfLines={2}>{d.name}</Text>
                      <Text style={s.drillSkill}>{d.skill}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {/* Action buttons */}
              <View style={[s.btnRow, { marginBottom: 8 }]}>
                <TouchableOpacity style={s.outlineBtn} onPress={handleReset} activeOpacity={0.85}>
                  <Text style={s.outlineBtnTxt}>🔄 Yeni Plan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.primaryBtn, s.btnFlex, saving && s.btnDisabled]}
                  onPress={handleSave}
                  disabled={saving}
                  activeOpacity={0.85}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.primaryBtnTxt}>💾 Planı Kaydet</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 48 },

  // Step progress bar
  stepBar:  { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  stepItem: { flex: 1, marginRight: 6 },
  stepLine: { height: 3, borderRadius: 2, marginBottom: 5 },
  stepLbl:  { fontSize: 10, fontWeight: '600' },

  // Card
  card: {
    backgroundColor: colors.card, borderRadius: 16,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  cardTitle: { color: colors.foreground, fontSize: 18, fontWeight: '700', marginBottom: 14 },

  // Field labels
  fieldLabel: { color: colors.foreground, fontSize: 13, fontWeight: '600', marginTop: 14, marginBottom: 8 },
  labelRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 8 },
  hint:       { color: colors.muted, fontSize: 11 },

  textInput: {
    backgroundColor: colors.background,
    color: colors.foreground,
    borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border,
    fontSize: 14,
  },

  // Chips (Android-safe: outer View owns borderRadius)
  chipsRow:    { flexDirection: 'row', flexWrap: 'wrap' },
  chipWrap:    { alignSelf: 'flex-start', marginRight: 8, marginBottom: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#4a6090', backgroundColor: '#1a2a5e', overflow: 'hidden' },
  chipWrapActive: { borderColor: '#f97316', backgroundColor: '#3d1800' },
  chipInner:   { paddingHorizontal: 12, paddingVertical: 6 },
  chipText:    { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#f97316' },

  // Buttons
  primaryBtn:    { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  outlineBtn:    { borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', marginTop: 20 },
  outlineBtnTxt: { color: colors.foreground, fontSize: 15, fontWeight: '600' },
  btnRow:        { flexDirection: 'row', alignItems: 'flex-end' },
  btnFlex:       { flex: 1, marginLeft: 10 },
  btnDisabled:   { opacity: 0.45 },

  // Plan result header
  planName:  { color: colors.foreground, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  tagsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag:       { backgroundColor: colors.accent + '20', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.accent + '40' },
  tagTxt:    { color: colors.accent, fontSize: 11, fontWeight: '600' },
  totalDur:  { color: colors.muted, fontSize: 12, marginTop: 2 },

  // Phase section card
  sectionCard:   { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle:  { color: colors.foreground, fontSize: 15, fontWeight: '700' },
  durBadge:      { backgroundColor: colors.border, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  durBadgeTxt:   { color: colors.muted, fontSize: 11, fontWeight: '600' },

  drillRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  drillDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, marginRight: 10, flexShrink: 0 },
  drillName:  { color: colors.foreground, fontSize: 13, flex: 1, lineHeight: 18 },
  drillSkill: { color: colors.accent + 'bb', fontSize: 11, fontWeight: '600', marginLeft: 6 },
});
