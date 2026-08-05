import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

const PREFS_KEY = 'voleypro_notification_preferences';

type Prefs = {
  allowNotifications: boolean;
  trainingReminders: boolean;
  dailyGoalReminders: boolean;
  programReminders: boolean;
  activityReminders: boolean;
  newFeatures: boolean;
  appUpdates: boolean;
  specialOffers: boolean;
  surveys: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
};

const DEFAULT_PREFS: Prefs = {
  allowNotifications: true,
  trainingReminders: true,
  dailyGoalReminders: true,
  programReminders: true,
  activityReminders: false,
  newFeatures: true,
  appUpdates: true,
  specialOffers: false,
  surveys: false,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
};

type Styles = ReturnType<typeof makeStyles>;

function Toggle({
  label, value, onValueChange, disabled, first, colors, s,
}: {
  label: string; value: boolean; onValueChange: (v: boolean) => void; disabled?: boolean; first?: boolean;
  colors: Colors; s: Styles;
}) {
  return (
    <View style={[s.row, !first && s.rowBorder]}>
      <Text style={[s.rowLabel, disabled && s.rowLabelDisabled]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.accent + '90' }}
        thumbColor={value ? colors.accent : colors.muted}
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then((raw) => {
      if (raw) {
        try { setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) }); } catch {}
      }
    });
  }, []);

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
  };

  const disabled = !prefs.allowNotifications;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <Toggle
            label="Bildirimlere İzin Ver"
            value={prefs.allowNotifications}
            onValueChange={(v) => update({ allowNotifications: v })}
            first
            colors={colors} s={s} />
        </View>

        <Text style={s.sectionTitle}>Hatırlatıcılar</Text>
        <View style={s.card}>
          <Toggle label="Antrenman Hatırlatıcıları" value={prefs.trainingReminders} disabled={disabled} onValueChange={(v) => update({ trainingReminders: v })} first  colors={colors} s={s} />
          <Toggle label="Günlük Hedef Hatırlatıcıları" value={prefs.dailyGoalReminders} disabled={disabled} onValueChange={(v) => update({ dailyGoalReminders: v })}  colors={colors} s={s} />
          <Toggle label="Program Hatırlatıcıları" value={prefs.programReminders} disabled={disabled} onValueChange={(v) => update({ programReminders: v })}  colors={colors} s={s} />
          <Toggle label="Aktivite Hatırlatıcıları" value={prefs.activityReminders} disabled={disabled} onValueChange={(v) => update({ activityReminders: v })}  colors={colors} s={s} />
        </View>

        <Text style={s.sectionTitle}>Güncellemeler</Text>
        <View style={s.card}>
          <Toggle label="Yeni Özellikler" value={prefs.newFeatures} disabled={disabled} onValueChange={(v) => update({ newFeatures: v })} first  colors={colors} s={s} />
          <Toggle label="Uygulama Güncellemeleri" value={prefs.appUpdates} disabled={disabled} onValueChange={(v) => update({ appUpdates: v })}  colors={colors} s={s} />
          <Toggle label="Özel Kampanyalar" value={prefs.specialOffers} disabled={disabled} onValueChange={(v) => update({ specialOffers: v })}  colors={colors} s={s} />
          <Toggle label="Anket ve Geri Bildirim" value={prefs.surveys} disabled={disabled} onValueChange={(v) => update({ surveys: v })}  colors={colors} s={s} />
        </View>

        <Text style={s.sectionTitle}>Diğer</Text>
        <View style={s.card}>
          <Toggle label="E-posta Bildirimleri" value={prefs.emailNotifications} disabled={disabled} onValueChange={(v) => update({ emailNotifications: v })} first  colors={colors} s={s} />
          <Toggle label="Push Bildirimleri" value={prefs.pushNotifications} disabled={disabled} onValueChange={(v) => update({ pushNotifications: v })}  colors={colors} s={s} />
          <Toggle label="SMS Bildirimleri" value={prefs.smsNotifications} disabled={disabled} onValueChange={(v) => update({ smsNotifications: v })}  colors={colors} s={s} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 32 },

  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowLabel: { color: colors.foreground, fontSize: 14, fontWeight: '500', flex: 1, marginRight: 10 },
  rowLabelDisabled: { color: colors.muted },
  });
}
