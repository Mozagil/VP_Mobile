import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api/client';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = { navigation: NativeStackNavigationProp<any> };

const DELETED_ITEMS = [
  'Profil bilgileriniz',
  'Antrenman geçmişiniz',
  'İstatistik ve gelişim verileriniz',
  'Hedefleriniz',
  'Tüm kişisel ayarlarınız',
];

export default function DeleteAccountScreen({ navigation }: Props) {
  const { signOut } = useAuth() as any;
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.delete('/auth/me');
      await signOut?.();
    } catch {
      Alert.alert('Hata', 'Hesap silinirken bir sorun oluştu.');
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} disabled={deleting}>
          <Icon name="geri" size={20} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Hesabı Sil</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={s.body}>
        <View style={s.iconCircle}>
          <Icon name="sil" size={40} />
        </View>

        <Text style={s.title}>Hesabını silmek istediğine emin misin?</Text>
        <Text style={s.subtitle}>
          Hesabını silersen tüm verilerin kalıcı olarak{'\n'}silinecek. Bu işlem geri alınamaz.
        </Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Silinecek veriler:</Text>
          {DELETED_ITEMS.map((item) => (
            <View key={item} style={s.bulletRow}>
              <View style={s.bulletDot} />
              <Text style={s.bulletTxt}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, deleting && { opacity: 0.7 }]}
          activeOpacity={0.85}
          disabled={deleting}
          onPress={handleDelete}
        >
          {deleting ? <ActivityIndicator color="#ffffff" /> : <Text style={s.primaryBtnTxt}>Hesabımı Sil</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} disabled={deleting} onPress={() => navigation.goBack()}>
          <Text style={s.cancelTxt}>İptal</Text>
        </TouchableOpacity>
      </View>
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

  body: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 20 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  title: { color: colors.foreground, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 24 },

  card: {
    width: '100%', backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  cardTitle: { color: colors.foreground, fontSize: 13, fontWeight: '800', marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.error },
  bulletTxt: { color: colors.muted, fontSize: 13 },

  footer: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  primaryBtn: {
    backgroundColor: colors.error, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnTxt: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', paddingVertical: 6 },
  cancelTxt: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  });
}
