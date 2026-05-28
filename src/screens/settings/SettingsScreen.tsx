import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { colors } from '../../theme/colors';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
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
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch {
      Alert.alert('Hata', 'Mevcut şifre hatalı veya işlem başarısız.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesap</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-posta</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
            <Input
              label="Mevcut Şifre"
              placeholder="••••••••"
              secureTextEntry
              value={currentPw}
              onChangeText={setCurrentPw}
            />
            <Input
              label="Yeni Şifre"
              placeholder="En az 6 karakter"
              secureTextEntry
              value={newPw}
              onChangeText={setNewPw}
            />
            <Input
              label="Yeni Şifre (Tekrar)"
              placeholder="••••••••"
              secureTextEntry
              value={confirmPw}
              onChangeText={setConfirmPw}
            />
            <Button title="Şifreyi Güncelle" onPress={changePassword} loading={pwLoading} />
          </View>

          <View style={[styles.section, { marginTop: 20 }]}>
            <Button title="Çıkış Yap" onPress={handleSignOut} variant="outline" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { color: colors.foreground, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { color: colors.muted, fontSize: 14 },
  infoValue: { color: colors.foreground, fontSize: 14 },
});
