import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import Button from '../../components/ui/Button';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { WEEKDAY_LABELS } from '../../utils/trainingPlan';

const LEVELS = ['başlangıç', 'orta', 'ileri', 'profesyonel'];
const levelLabels: Record<string, string> = {
  başlangıç: 'Başlangıç', orta: 'Orta', ileri: 'İleri', profesyonel: 'Profesyonel',
};
const GOAL_OPTIONS = [
  'Teknik Gelişim', 'Fiziksel Gelişim', 'Taktik Gelişim', 'Zihinsel Gelişim',
  'Kuvvet & Kondisyon', 'Esneklik & Çeviklik', 'Takım Oyunu',
];
const DURATION_OPTIONS = ['30 dk altı', '30-45 dk', '45-60 dk', '60-90 dk', '90 dk üzeri'];
const INTENSITY_OPTIONS = ['Düşük', 'Orta', 'Yüksek'];
const FOCUS_OPTIONS = ['Pas', 'Manşet', 'Servis', 'Hücum', 'Blok', 'Savunma', 'Zıplama', 'Çeviklik'];
const EQUIPMENT_OPTIONS = ['Salon ekipmanı mevcut', 'Kısıtlı ekipman', 'Ekipman yok'];

type Styles = ReturnType<typeof makeStyles>;
type ModalStyles = ReturnType<typeof makeModalStyles>;

function PickerModal({
  visible, title, options, value, onSelect, onClose, m,
}: {
  visible: boolean; title: string; options: string[]; value: string;
  onSelect: (v: string) => void; onClose: () => void; m: ModalStyles;
}) {
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
            const active = opt === value;
            return (
              <TouchableOpacity
                key={opt}
                style={[m.option, active && m.optionActive]}
                onPress={() => { onSelect(opt); onClose(); }}
                activeOpacity={0.75}
              >
                <Text style={[m.optionTxt, active && m.optionTxtActive]}>{opt}</Text>
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
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.7} onPress={onPress}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={s.rowValue} numberOfLines={1}>{value || 'Seç'}</Text>
        <Text style={s.rowArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const m = useMemo(() => makeModalStyles(colors), [colors]);
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();

  const [level, setLevel] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [secondaryGoal, setSecondaryGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [equipment, setEquipment] = useState('');
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
    setEquipment(profile.equipment_status ?? '');
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
        session_duration: duration, intensity, equipment_status: equipment,
        preferred_days: days, goals: focus,
      });
      Alert.alert('Kaydedildi', 'Antrenman tercihleriniz güncellendi.');
    } catch {
      Alert.alert('Hata', 'Tercihler kaydedilirken bir sorun oluştu.');
    }
  };

  if (isLoading) {
    return <View style={s.center}><Text style={{ color: colors.muted }}>Yükleniyor…</Text></View>;
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Hedeflerin</Text>
        <View style={s.card}>
          <ValueRow label="Ana Hedef" value={primaryGoal} onPress={() => setActivePicker('primaryGoal')} s={s} />
          <ValueRow label="İkincil Hedef" value={secondaryGoal} onPress={() => setActivePicker('secondaryGoal')} s={s} />
          <ValueRow label="Antrenman Seviyen" value={levelLabels[level] ?? level} onPress={() => setActivePicker('level')} s={s} />
        </View>

        <Text style={s.sectionTitle}>Tercihlerin</Text>
        <View style={s.card}>
          <ValueRow label="Antrenman Süresi" value={duration} onPress={() => setActivePicker('duration')} s={s} />
          <ValueRow label="Antrenman Yoğunluğu" value={intensity} onPress={() => setActivePicker('intensity')} s={s} />
        </View>

        <View style={[s.card, { marginTop: 10, padding: 16 }]}>
          <Text style={s.fieldLabel}>Antrenman Günleri</Text>
          <View style={s.daysRow}>
            {WEEKDAY_LABELS.map((d) => {
              const active = days.includes(d);
              return (
                <TouchableOpacity key={d} onPress={() => toggleDay(d)} activeOpacity={0.75} style={s.dayCol}>
                  <View style={[s.dayDot, active && s.dayDotActive]}>
                    {active && <Text style={s.dayCheck}>✓</Text>}
                  </View>
                  <Text style={s.dayLabel}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={s.sectionTitle}>Odaklandığın Alanlar</Text>
        <View style={s.chipsRow}>
          {FOCUS_OPTIONS.map((f) => {
            const active = focus.includes(f);
            return (
              <TouchableOpacity
                key={f}
                style={[s.chip, active && s.chipActive]}
                onPress={() => toggleFocus(f)}
                activeOpacity={0.75}
              >
                <Text style={[s.chipTxt, active && s.chipTxtActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={s.sectionTitle}>Ekipman Durumu</Text>
        <View style={s.card}>
          <ValueRow label="Ekipman" value={equipment} onPress={() => setActivePicker('equipment')} s={s} />
        </View>

        <Button title="Kaydet" onPress={save} loading={update.isPending} style={{ marginTop: 24 }} />
      </ScrollView>

      <PickerModal
        visible={activePicker === 'primaryGoal'} title="Ana Hedef"
        options={GOAL_OPTIONS} value={primaryGoal} onSelect={setPrimaryGoal} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'secondaryGoal'} title="İkincil Hedef"
        options={GOAL_OPTIONS} value={secondaryGoal} onSelect={setSecondaryGoal} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'level'} title="Antrenman Seviyen"
        options={LEVELS.map((l) => levelLabels[l])} value={levelLabels[level] ?? ''}
        onSelect={(v) => setLevel(LEVELS.find((l) => levelLabels[l] === v) ?? v)}
        onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'duration'} title="Antrenman Süresi"
        options={DURATION_OPTIONS} value={duration} onSelect={setDuration} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'intensity'} title="Antrenman Yoğunluğu"
        options={INTENSITY_OPTIONS} value={intensity} onSelect={setIntensity} onClose={() => setActivePicker(null)} m={m}
      />
      <PickerModal
        visible={activePicker === 'equipment'} title="Ekipman Durumu"
        options={EQUIPMENT_OPTIONS} value={equipment} onSelect={setEquipment} onClose={() => setActivePicker(null)} m={m}
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
