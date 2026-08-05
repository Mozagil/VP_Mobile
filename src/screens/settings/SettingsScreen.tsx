import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

const APP_VERSION = '1.0.0';
const PREFS_KEY = 'voleypro_app_preferences';

type Prefs = {
  animations: boolean;
  haptics: boolean;
  sound: boolean;
  dataSaver: boolean;
};

const DEFAULT_PREFS: Prefs = { animations: true, haptics: true, sound: true, dataSaver: false };

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
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const changePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setPwLoading(true);
    try {
      await apiClient.patch('/auth/password', { current_password: currentPw, new_password: newPw });
      Alert.alert('Başarılı', 'Şifreniz güncellendi.');
      setCurrentPw(''); setNewPw(''); setConfirmPw(''); setShowPwForm(false);
    } catch {
      Alert.alert('Hata', 'Mevcut şifre hatalı veya işlem başarısız.');
    } finally {
      setPwLoading(false);
    }
  };

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

  const comingSoon = () => Alert.alert('Yakında', 'Bu bölüm yakında eklenecek.');

  const inviteFriend = () => {
    Share.share({ message: 'VoleyPro ile antrenmanlarını planla, gelişimini takip et! 🏐' });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="geri" size={20} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Ayarlar</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Genel</Text>
        <View style={s.card}>
          <Toggle
            label="Karanlık Mod"
            value={mode === 'dark'}
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            first colors={colors} s={s}
          />
          <Toggle label="Animasyonlar" value={prefs.animations} onValueChange={(v) => update({ animations: v })} colors={colors} s={s} />
          <Toggle label="Haptik Geri Bildirim" value={prefs.haptics} onValueChange={(v) => update({ haptics: v })} colors={colors} s={s} />
          <Toggle label="Uygulama Sesi" value={prefs.sound} onValueChange={(v) => update({ sound: v })} colors={colors} s={s} />
          <Toggle label="Veri Tasarrufu Modu" value={prefs.dataSaver} onValueChange={(v) => update({ dataSaver: v })} colors={colors} s={s} />
        </View>

        <Text style={s.sectionTitle}>İçerik</Text>
        <View style={s.card}>
          <LinkRow label="Video Oynatma Kalitesi" value="Yüksek" onPress={comingSoon} first s={s} />
          <LinkRow label="Antrenman Hatırlatıcıları" onPress={comingSoon} s={s} />
        </View>

        <Text style={s.sectionTitle}>Diğer</Text>
        <View style={s.card}>
          <LinkRow label="Uygulamayı Değerlendir" onPress={comingSoon} first s={s} />
          <LinkRow label="Arkadaşını Davet Et" onPress={inviteFriend} s={s} />
          <LinkRow label="Sürüm" value={APP_VERSION} onPress={() => {}} s={s} />
        </View>

        <Text style={s.sectionTitle}>Hesap</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.rowLabel}>E-posta</Text>
            <Text style={s.rowValue}>{user?.email}</Text>
          </View>
          <LinkRow label="Şifre Değiştir" onPress={() => setShowPwForm((v) => !v)} s={s} />
        </View>

        {showPwForm && (
          <View style={[s.card, { marginTop: 10, padding: 16 }]}>
            <Input label="Mevcut Şifre" placeholder="••••••••" secureTextEntry value={currentPw} onChangeText={setCurrentPw} />
            <Input label="Yeni Şifre" placeholder="En az 6 karakter" secureTextEntry value={newPw} onChangeText={setNewPw} />
            <Input label="Yeni Şifre (Tekrar)" placeholder="••••••••" secureTextEntry value={confirmPw} onChangeText={setConfirmPw} />
            <Button title="Şifreyi Güncelle" onPress={changePassword} loading={pwLoading} />
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
  });
}
