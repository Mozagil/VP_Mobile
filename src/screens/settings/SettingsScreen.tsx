import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { colors } from '../../theme/colors';

const APP_VERSION = '1.0.0';
const PREFS_KEY = 'voleypro_app_preferences';

type Prefs = {
  animations: boolean;
  haptics: boolean;
  sound: boolean;
  dataSaver: boolean;
};

const DEFAULT_PREFS: Prefs = { animations: true, haptics: true, sound: true, dataSaver: false };

function Toggle({
  label, value, onValueChange, disabled, first,
}: { label: string; value: boolean; onValueChange?: (v: boolean) => void; disabled?: boolean; first?: boolean }) {
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

function LinkRow({ label, value, onPress, first }: { label: string; value?: string; onPress: () => void; first?: boolean }) {
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

export default function SettingsScreen() {
  const { user } = useAuth();
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
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Genel</Text>
        <View style={s.card}>
          <Toggle label="Karanlık Mod" value disabled first />
          <Toggle label="Animasyonlar" value={prefs.animations} onValueChange={(v) => update({ animations: v })} />
          <Toggle label="Haptik Geri Bildirim" value={prefs.haptics} onValueChange={(v) => update({ haptics: v })} />
          <Toggle label="Uygulama Sesi" value={prefs.sound} onValueChange={(v) => update({ sound: v })} />
          <Toggle label="Veri Tasarrufu Modu" value={prefs.dataSaver} onValueChange={(v) => update({ dataSaver: v })} />
        </View>

        <Text style={s.sectionTitle}>İçerik</Text>
        <View style={s.card}>
          <LinkRow label="Video Oynatma Kalitesi" value="Yüksek" onPress={comingSoon} first />
          <LinkRow label="Antrenman Hatırlatıcıları" onPress={comingSoon} />
        </View>

        <Text style={s.sectionTitle}>Diğer</Text>
        <View style={s.card}>
          <LinkRow label="Uygulamayı Değerlendir" onPress={comingSoon} first />
          <LinkRow label="Arkadaşını Davet Et" onPress={inviteFriend} />
          <LinkRow label="Sürüm" value={APP_VERSION} onPress={() => {}} />
        </View>

        <Text style={s.sectionTitle}>Hesap</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.rowLabel}>E-posta</Text>
            <Text style={s.rowValue}>{user?.email}</Text>
          </View>
          <LinkRow label="Şifre Değiştir" onPress={() => setShowPwForm((v) => !v)} />
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

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
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
