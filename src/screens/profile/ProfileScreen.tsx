import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import Button from '../../components/ui/Button';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { WEEKDAY_LABELS, weekdayLabels } from '../../utils/trainingPlan';
import { useI18n } from '../../i18n';
import type { TranslationKey } from '../../i18n';

// Every `value` below is what gets stored on the profile, so it stays Turkish
// in both languages; only the catalog key decides what the user reads.
type Option = { value: string; labelKey: TranslationKey };

const LEVELS: Option[] = [
  { value: 'başlangıç', labelKey: 'level.beginner' },
  { value: 'orta', labelKey: 'level.intermediate' },
  { value: 'ileri', labelKey: 'level.advanced' },
  { value: 'profesyonel', labelKey: 'level.pro' },
];
const GOAL_OPTIONS: Option[] = [
  { value: 'Teknik Gelişim', labelKey: 'profile.goal.technical' },
  { value: 'Fiziksel Gelişim', labelKey: 'profile.goal.physical' },
  { value: 'Taktik Gelişim', labelKey: 'profile.goal.tactical' },
  { value: 'Zihinsel Gelişim', labelKey: 'profile.goal.mental' },
  { value: 'Kuvvet & Kondisyon', labelKey: 'profile.goal.strength' },
  { value: 'Esneklik & Çeviklik', labelKey: 'profile.goal.flexibility' },
  { value: 'Takım Oyunu', labelKey: 'profile.goal.teamPlay' },
];
const DURATION_OPTIONS: Option[] = [
  { value: '30 dk altı', labelKey: 'profile.duration.under30' },
  { value: '30-45 dk', labelKey: 'profile.duration.30to45' },
  { value: '45-60 dk', labelKey: 'profile.duration.45to60' },
  { value: '60-90 dk', labelKey: 'profile.duration.60to90' },
  { value: '90 dk üzeri', labelKey: 'profile.duration.over90' },
];
const INTENSITY_OPTIONS: Option[] = [
  { value: 'Düşük', labelKey: 'profile.intensity.low' },
  { value: 'Orta', labelKey: 'profile.intensity.medium' },
  { value: 'Yüksek', labelKey: 'profile.intensity.high' },
];
const FOCUS_OPTIONS: Option[] = [
  { value: 'Pas', labelKey: 'profile.focus.pass' },
  { value: 'Manşet', labelKey: 'profile.focus.forearmPass' },
  { value: 'Servis', labelKey: 'profile.focus.serve' },
  { value: 'Hücum', labelKey: 'profile.focus.attack' },
  { value: 'Blok', labelKey: 'profile.focus.block' },
  { value: 'Savunma', labelKey: 'profile.focus.defense' },
  { value: 'Zıplama', labelKey: 'profile.focus.jump' },
  { value: 'Çeviklik', labelKey: 'profile.focus.agility' },
];
type Styles = ReturnType<typeof makeStyles>;
type ModalStyles = ReturnType<typeof makeModalStyles>;

function PickerModal({
  visible, title, options, value, onSelect, onClose, m,
}: {
  visible: boolean; title: string; options: Option[]; value: string;
  onSelect: (v: string) => void; onClose: () => void; m: ModalStyles;
}) {
  const { t } = useI18n();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={m.overlay}>
        <View style={m.sheet}>
          <View style={m.header}>
            <Text style={m.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={m.closeBtn}>
              <Text style={m.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[m.option, active && m.optionActive]}
                onPress={() => { onSelect(opt.value); onClose(); }}
                activeOpacity={0.75}
              >
                <Text style={[m.optionTxt, active && m.optionTxtActive]}>{t(opt.labelKey)}</Text>
                {active && <Text style={m.optionCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

function ValueRow({ label, value, onPress, s }: { label: string; value: string; onPress: () => void; s: Styles }) {
  const { t } = useI18n();
  const placeholder = t('common.select');
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.7} onPress={onPress}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={s.rowValue} numberOfLines={1}>{value || placeholder}</Text>
        <Text style={s.rowArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();

  // Stored values stay Turkish; look up their label in the active language.
  const optionLabel = (options: Option[], value: string) => {
    const match = options.find((o) => o.value === value);
    return match ? t(match.labelKey) : value;
  };
  const s = useMemo(() => makeStyles(colors), [colors]);
  const m = useMemo(() => makeModalStyles(colors), [colors]);
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();

  const [level, setLevel] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [secondaryGoal, setSecondaryGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [focus, setFocus] = useState<string[]>([]);
  const [activePicker, setActivePicker] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setLevel(profile.level ?? '');
    setPrimaryGoal(profile.primary_goal ?? '');
    setSecondaryGoal(profile.secondary_goal ?? '');
    setDuration(profile.session_duration ?? '');
    setIntensity(profile.intensity ?? '');
    setDays(profile.preferred_days ?? []);
    setFocus(profile.goals ?? []);
  }, [profile]);

  const toggleDay = (d: string) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const toggleFocus = (f: string) =>
    setFocus((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const save = async () => {
    try {
      await update.mutateAsync({
        level, primary_goal: primaryGoal, secondary_goal: secondaryGoal,
        session_duration: duration, intensity,
        preferred_days: days, goals: focus,
      });
      Alert.alert(t('profile.saved'), t('profile.savedBody'));
    } catch {
      Alert.alert(t('common.error'), t('profile.saveError'));
    }
  };

  if (isLoading) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>{t('common.loading')}</Text></View>;
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>{t('profile.goalsSection')}</Text>
        <View style={s.card}>
          <ValueRow label={t('profile.mainGoal')} value={optionLabel(GOAL_OPTIONS, primaryGoal)} onPress={() => setActivePicker('primaryGoal')} s={s} />
          <ValueRow label={t('profile.secondaryGoal')} value={optionLabel(GOAL_OPTIONS, secondaryGoal)} onPress={() => setActivePicker('secondaryGoal')} s={s} />
          <ValueRow label={t('profile.trainingLevel')} value={optionLabel(LEVELS, level)} onPress={() => setActivePicker('level')} s={s} />
        </View>

        <Text style={s.sectionTitle}>{t('profile.preferencesSection')}</Text>
        <View style={s.card}>
          <ValueRow label={t('profile.sessionDuration')} value={optionLabel(DURATION_OPTIONS, duration)} onPress={() => setActivePicker('duration')} s={s} />
          <ValueRow label={t('profile.intensity')} value={optionLabel(INTENSITY_OPTIONS, intensity)} onPress={() => setActivePicker('intensity')} s={s} />
        </View>

        <View style={[s.card, { marginTop: 10, padding: 16 }]}>
          <Text style={s.fieldLabel}>{t('profile.trainingDays')}</Text>
          <View style={s.daysRow}>
            {WEEKDAY_LABELS.map((d, i) => {
              const active = days.includes(d);
              return (
                <TouchableOpacity key={d} onPress={() => toggleDay(d)} activeOpacity={0.75} style={s.dayCol}>
                  <View style={[s.dayDot, active && s.dayDotActive]}>
                    {active && <Text style={s.dayCheck}>✓</Text>}
                  </View>
                  <Text style={s.dayLabel}>{weekdayLabels(lang)[i]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={s.sectionTitle}>{t('profile.focusAreas')}</Text>
        <View style={s.chipsRow}>
          {FOCUS_OPTIONS.map((opt) => {
            const active = focus.includes(opt.value);
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.chip, active && s.chipActive]}
                onPress={() => toggleFocus(opt.value)}
                activeOpacity={0.75}
              >
                <Text style={[s.chipTxt, active && s.chipTxtActive]}>{t(opt.labelKey)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button title={t('common.save')} onPress={save} loading={update.isPending} style={{ marginTop: 24 }} />
      </ScrollView>

      <PickerModal
        visible={activePicker === 'primaryGoal'} title={t('profile.mainGoal')}
        options={GOAL_OPTIONS} value={primaryGoal} onSelect={setPrimaryGoal} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'secondaryGoal'} title={t('profile.secondaryGoal')}
        options={GOAL_OPTIONS} value={secondaryGoal} onSelect={setSecondaryGoal} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'level'} title={t('profile.trainingLevel')}
        options={LEVELS} value={level}
        onSelect={setLevel}
        onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'duration'} title={t('profile.sessionDuration')}
        options={DURATION_OPTIONS} value={duration} onSelect={setDuration} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'intensity'} title={t('profile.intensity')}
        options={INTENSITY_OPTIONS} value={intensity} onSelect={setIntensity} onClose={() => setActivePicker(null)} m={m}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, paddingBottom: 32 },

  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border,
  },
  rowLabel: { color: colors.foreground, fontSize: 14, fontWeight: '500' },
  rowValue: { color: colors.muted, fontSize: 13, maxWidth: 160 },
  rowArrow: { color: colors.muted, fontSize: 18 },

  fieldLabel: { color: colors.foreground, fontSize: 14, fontWeight: '600', marginBottom: 12 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 6 },
  dayDot: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dayDotActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayCheck: { color: '#fff', fontSize: 13, fontWeight: '800' },
  dayLabel: { color: colors.muted, fontSize: 11, fontWeight: '600' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  chipTxt: { color: colors.foreground, fontSize: 13, fontWeight: '600' },
  chipTxtActive: { color: colors.accent },
  });
}

function makeModalStyles(colors: Colors) {
  return StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { color: colors.foreground, fontSize: 16, fontWeight: '700' },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  closeTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  optionActive: { backgroundColor: colors.accent + '15' },
  optionTxt: { color: colors.foreground, fontSize: 14 },
  optionTxtActive: { color: colors.accent, fontWeight: '700' },
  optionCheck: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  });
}
