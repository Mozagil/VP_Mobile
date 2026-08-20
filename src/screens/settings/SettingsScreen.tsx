import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import type { Lang } from '../../i18n';

const APP_VERSION = '1.0.0';

type Styles = ReturnType<typeof makeStyles>;

function Toggle({
  label, value, onValueChange, disabled, first, colors, s,
}: {
  label: string; value: boolean; onValueChange?: (v: boolean) => void; disabled?: boolean; first?: boolean;
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

/** Two-option segmented control used for the language picker. */
function SegmentedRow<T extends string>({
  label, value, options, onChange, first, colors, s,
}: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
  first?: boolean; colors: Colors; s: Styles;
}) {
  return (
    <View style={[s.row, !first && s.rowBorder]}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={s.segment}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[s.segmentBtn, active && { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
              onPress={() => onChange(opt.value)}
            >
              <Text style={[s.segmentTxt, active && s.segmentTxtActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function LinkRow({
  label, value, onPress, first, s,
}: { label: string; value?: string; onPress: () => void; first?: boolean; s: Styles }) {
  return (
    <TouchableOpacity style={[s.row, !first && s.rowBorder]} activeOpacity={0.7} onPress={onPress}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && <Text style={s.rowValue}>{value}</Text>}
        <Text style={s.rowArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

type Props = { navigation: NativeStackNavigationProp<any> };

export default function SettingsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { colors, mode, setMode } = useTheme();
  const { t, lang, setLang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const changePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert(t('common.error'), t('settings.fillAllFields'));
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert(t('common.error'), t('settings.passwordMismatch'));
      return;
    }
    if (newPw.length < 6) {
      Alert.alert(t('common.error'), t('settings.passwordTooShort'));
      return;
    }
    setPwLoading(true);
    try {
      await apiClient.patch('/auth/password', { current_password: currentPw, new_password: newPw });
      Alert.alert(t('common.success'), t('settings.passwordUpdated'));
      setCurrentPw(''); setNewPw(''); setConfirmPw(''); setShowPwForm(false);
    } catch {
      Alert.alert(t('common.error'), t('settings.passwordUpdateFailed'));
    } finally {
      setPwLoading(false);
    }
  };

  const comingSoon = () => Alert.alert(t('common.comingSoonTitle'), t('common.comingSoonBody'));

  const inviteFriend = () => {
    Share.share({ message: t('settings.inviteMessage') });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="geri" size={20} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>{t('settings.section.general')}</Text>
        <View style={s.card}>
          <SegmentedRow<Lang>
            label={t('settings.language')}
            value={lang}
            options={[
              { value: 'tr', label: t('settings.language.tr') },
              { value: 'en', label: t('settings.language.en') },
            ]}
            onChange={setLang}
            first colors={colors} s={s}
          />
          <Toggle
            label={t('settings.darkMode')}
            value={mode === 'dark'}
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            colors={colors} s={s}
          />
          <LinkRow label={t('settings.rateApp')} onPress={comingSoon} s={s} />
          <LinkRow label={t('settings.inviteFriend')} onPress={inviteFriend} s={s} />
          <LinkRow label={t('settings.version')} value={APP_VERSION} onPress={() => {}} s={s} />
        </View>

        <Text style={s.sectionTitle}>{t('settings.section.account')}</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.rowLabel}>{t('auth.email')}</Text>
            <Text style={s.rowValue}>{user?.email}</Text>
          </View>
          <LinkRow label={t('settings.changePassword')} onPress={() => setShowPwForm((v) => !v)} s={s} />
        </View>

        {showPwForm && (
          <View style={[s.card, { marginTop: 10, padding: 16 }]}>
            <Input label={t('settings.currentPassword')} placeholder="••••••••" secureTextEntry value={currentPw} onChangeText={setCurrentPw} />
            <Input label={t('settings.newPassword')} placeholder={t('auth.register.passwordPlaceholder')} secureTextEntry value={newPw} onChangeText={setNewPw} />
            <Input label={t('settings.confirmPassword')} placeholder="••••••••" secureTextEntry value={confirmPw} onChangeText={setConfirmPw} />
            <Button title={t('settings.updatePassword')} onPress={changePassword} loading={pwLoading} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
    },
    headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },
    container: { padding: 16, paddingBottom: 32 },

    sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
    card: {
      backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    },
    row: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
    },
    rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    rowLabel: { color: colors.foreground, fontSize: 14, fontWeight: '500' },
    rowLabelDisabled: { color: colors.muted },
    rowValue: { color: colors.muted, fontSize: 13 },
    rowArrow: { color: colors.muted, fontSize: 18 },

    segment: {
      flexDirection: 'row', borderRadius: 8, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background,
    },
    segmentBtn: { paddingHorizontal: 12, paddingVertical: 6 },
    segmentTxt: { color: colors.muted, fontSize: 12, fontWeight: '700' },
    segmentTxtActive: { color: '#fff' },
  });
}
