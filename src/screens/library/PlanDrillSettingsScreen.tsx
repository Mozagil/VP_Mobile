import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useAddDrillsToPlan } from '../../hooks/useTrainingPlans';
import { Drill } from '../../data/types';
import { coverFor, difficultyLabel } from '../../utils/drillCovers';
import { useI18n, useContent, skillLabel, phaseLabel } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';

type LibraryStackParamList = {
  PlanDrillSettings: { drill: Drill; planId: string };
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'PlanDrillSettings'>;

function parseDefaultDuration(duration: string): number {
  const m = duration.match(/\d+/);
  return m ? parseInt(m[0], 10) : 10;
}

export default function PlanDrillSettingsScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { drillName } = useContent();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { drill, planId } = route.params;
  const { data: plans = [] } = useTrainingPlans();
  const addDrills = useAddDrillsToPlan();
  const plan = plans.find((p) => p.id === planId);

  // Hareket her zaman kendi bolumune (Isınma / Ana Antrenman / Soğuma) eklenir,
  // bu yuzden ayrica bolum secilmez.
  const phase = drill.phase;
  const [duration, setDuration] = useState(parseDefaultDuration(drill.duration));
  const [note, setNote] = useState('');

  const drillsInPhase = useMemo(
    () => (plan ? plan.drills.filter((d) => d.phase === phase).sort((a, b) => a.sort_order - b.sort_order) : []),
    [plan, phase],
  );
  const [order, setOrder] = useState(1);

  React.useEffect(() => {
    setOrder(drillsInPhase.length + 1);
  }, [drillsInPhase.length]);

  const maxOrder = drillsInPhase.length + 1;

  if (!plan) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>{t('training.programNotFound')}</Text></View>;
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
            params: { planId: plan.id, planName: plan.name, drillName: drillName(drill) },
          });
        },
        onError: () => Alert.alert(t('common.error'), t('addToTraining.addError')),
      },
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('addToTraining.settingsTitle')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.previewCard}>
          <Image source={coverFor(drill.skill, drill.phase, drill.id)} style={s.previewImg} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={s.previewName} numberOfLines={1}>{drillName(drill)}</Text>
            <Text style={s.previewMeta}>{skillLabel(drill.skill, lang)} • {t('common.playerCount', { n: drill.players })}</Text>
            <View style={s.previewMetaRow}>
              <Icon name="sure" size={12} />
              <Text style={s.previewMeta}>{drill.duration} • {difficultyLabel(drill.level, lang)}</Text>
            </View>
          </View>
        </View>

        <Text style={s.fieldLabel}>{t('addToTraining.when')}</Text>
        <View style={s.phaseRow}>
          <PhaseIcon phase={phase} size={16} />
          <Text style={s.phaseTxt}>{phaseLabel(phase, lang)}</Text>
        </View>

        <Text style={s.fieldLabel}>{t('addToTraining.orderLabel')}</Text>
        <Text style={s.hint}>{t('addToTraining.orderHint')}</Text>
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

        <Text style={s.fieldLabel}>{t('addToTraining.durationLabel')}</Text>
        <View style={s.stepperRow}>
          <TouchableOpacity
            style={s.stepperBtn}
            onPress={() => setDuration((v) => Math.max(1, v - 5))}
            activeOpacity={0.8}
          >
            <Text style={s.stepperBtnTxt}>−</Text>
          </TouchableOpacity>
          <Text style={s.stepperValue}>{t('common.minutes', { n: duration })}</Text>
          <TouchableOpacity
            style={s.stepperBtn}
            onPress={() => setDuration((v) => v + 5)}
            activeOpacity={0.8}
          >
            <Text style={s.stepperBtnTxt}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.fieldLabel}>{t('addToTraining.noteLabel')}</Text>
        <TextInput
          style={s.noteInput}
          placeholder={t('addToTraining.notePlaceholder')}
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
          <Text style={s.primaryBtnTxt}>{addDrills.isPending ? t('common.adding') : t('addToTraining.add')}</Text>
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

  phaseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  phaseTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

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
