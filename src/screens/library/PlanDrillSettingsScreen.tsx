import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useAddDrillsToPlan } from '../../hooks/useTrainingPlans';
import { Drill } from '../../data/types';
import { coverFor, difficultyLabel } from '../../utils/drillCovers';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Icon from '../../components/ui/Icon';

type LibraryStackParamList = {
  PlanDrillSettings: { drill: Drill; planId: string };
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'PlanDrillSettings'>;

const PHASE_OPTIONS = [
  { phase: 'Ana Antrenman', label: 'Ana kısımda', desc: 'Antrenmanın ana bölümüne ekle' },
  { phase: 'Isınma', label: 'Isınma bölümünde', desc: 'Antrenmanın ısınma bölümüne ekle' },
  { phase: 'Soğuma', label: 'Bitiriş bölümünde (Soğuma)', desc: 'Antrenmanın bitiş bölümüne ekle' },
];

function parseDefaultDuration(duration: string): number {
  const m = duration.match(/\d+/);
  return m ? parseInt(m[0], 10) : 10;
}

export default function PlanDrillSettingsScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { drill, planId } = route.params;
  const { data: plans = [] } = useTrainingPlans();
  const addDrills = useAddDrillsToPlan();
  const plan = plans.find((p) => p.id === planId);

  const [phase, setPhase] = useState('Ana Antrenman');
  const [duration, setDuration] = useState(parseDefaultDuration(drill.duration));
  const [note, setNote] = useState('');

  const drillsInPhase = useMemo(
    () => (plan ? plan.drills.filter((d) => d.phase === phase).sort((a, b) => a.sort_order - b.sort_order) : []),
    [plan, phase],
  );
  const [order, setOrder] = useState(1);

  React.useEffect(() => {
    setOrder(drillsInPhase.length + 1);
  }, [phase]);

  const maxOrder = drillsInPhase.length + 1;

  if (!plan) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>Program bulunamadı</Text></View>;
  }

  const add = () => {
    const otherPhaseDrills = plan.drills.filter((d) => d.phase !== phase);
    const samePhaseDrills = [...drillsInPhase];
    const insertIndex = Math.max(0, Math.min(order - 1, samePhaseDrills.length));
    const newRow = {
      drill_id: drill.id, phase, completed: false,
      custom_duration: duration, note: note.trim() || undefined,
    };
    samePhaseDrills.splice(insertIndex, 0, newRow as any);

    const merged = [...otherPhaseDrills, ...samePhaseDrills].map((pd: any, i) => ({
      drill_id: pd.drill_id, phase: pd.phase, sort_order: i, completed: pd.completed ?? false,
      custom_name: pd.custom_name, custom_skill: pd.custom_skill,
      custom_duration: pd.custom_duration, note: pd.note,
    }));

    addDrills.mutate(
      { planId: plan.id, name: plan.name, team: plan.team, drills: merged },
      {
        onSuccess: () => {
          navigation.getParent()?.navigate('AntrenmanStack' as any, {
            screen: 'TrainingSuccess',
            params: { planId: plan.id, planName: plan.name, drillName: drill.name },
          });
        },
        onError: () => Alert.alert('Hata', 'Antrenmana eklenirken sorun oluştu.'),
      },
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detayları Ayarla</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.previewCard}>
          <Image source={coverFor(drill.skill, drill.phase, drill.id)} style={s.previewImg} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={s.previewName} numberOfLines={1}>{drill.name}</Text>
            <Text style={s.previewMeta}>{drill.skill} • {drill.players} Kişi</Text>
            <View style={s.previewMetaRow}>
              <Icon name="sure" size={12} />
              <Text style={s.previewMeta}>{drill.duration} • {difficultyLabel(drill.level)}</Text>
            </View>
          </View>
        </View>

        <Text style={s.fieldLabel}>Ne zaman?</Text>
        {PHASE_OPTIONS.map((opt) => {
          const active = phase === opt.phase;
          return (
            <TouchableOpacity
              key={opt.phase}
              style={[s.optionRow, active && s.optionRowActive]}
              activeOpacity={0.8}
              onPress={() => setPhase(opt.phase)}
            >
              <View style={[s.radio, active && s.radioActive]}>
                {active && <View style={s.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.optionTitle}>{opt.label}</Text>
                <Text style={s.optionDesc}>{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={s.fieldLabel}>Sıra</Text>
        <Text style={s.hint}>Bu çalışmanın antrenmandaki sırasını seç.</Text>
        <View style={s.stepperRow}>
          <TouchableOpacity
            style={s.stepperBtn}
            onPress={() => setOrder((v) => Math.max(1, v - 1))}
            activeOpacity={0.8}
          >
            <Text style={s.stepperBtnTxt}>−</Text>
          </TouchableOpacity>
          <Text style={s.stepperValue}>{order}</Text>
          <TouchableOpacity
            style={s.stepperBtn}
            onPress={() => setOrder((v) => Math.min(maxOrder, v + 1))}
            activeOpacity={0.8}
          >
            <Text style={s.stepperBtnTxt}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.fieldLabel}>Süre (opsiyonel)</Text>
        <View style={s.stepperRow}>
          <TouchableOpacity
            style={s.stepperBtn}
            onPress={() => setDuration((v) => Math.max(1, v - 5))}
            activeOpacity={0.8}
          >
            <Text style={s.stepperBtnTxt}>−</Text>
          </TouchableOpacity>
          <Text style={s.stepperValue}>{duration} dakika</Text>
          <TouchableOpacity
            style={s.stepperBtn}
            onPress={() => setDuration((v) => v + 5)}
            activeOpacity={0.8}
          >
            <Text style={s.stepperBtnTxt}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.fieldLabel}>Not (opsiyonel)</Text>
        <TextInput
          style={s.noteInput}
          placeholder="Bu çalışma ile ilgili not ekle..."
          placeholderTextColor={colors.muted}
          value={note}
          onChangeText={setNote}
          multiline
        />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, addDrills.isPending && s.primaryBtnDisabled]}
          activeOpacity={0.85}
          onPress={add}
          disabled={addDrills.isPending}
        >
          <Text style={s.primaryBtnTxt}>{addDrills.isPending ? 'Ekleniyor…' : 'Ekle'}</Text>
        </TouchableOpacity>
      </View>
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

  body: { padding: 16, paddingBottom: 20 },
  previewCard: {
    flexDirection: 'row', gap: 12, alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 14, padding: 12, marginBottom: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  previewImg: { width: 56, height: 56, borderRadius: 10 },
  previewName: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  previewMeta: { color: colors.muted, fontSize: 12 },
  previewMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  fieldLabel: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginTop: 18, marginBottom: 8 },
  hint: { color: colors.muted, fontSize: 12, marginBottom: 10, marginTop: -4 },

  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  optionRowActive: { borderColor: colors.accent },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  optionTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  optionDesc: { color: colors.muted, fontSize: 12 },

  stepperRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  stepperBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnTxt: { color: colors.foreground, fontSize: 18, fontWeight: '800' },
  stepperValue: { color: colors.foreground, fontSize: 15, fontWeight: '700' },

  noteInput: {
    backgroundColor: colors.card, color: colors.foreground, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, minHeight: 70, textAlignVertical: 'top',
  },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
