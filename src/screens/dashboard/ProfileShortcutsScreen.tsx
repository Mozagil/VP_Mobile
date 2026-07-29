import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { apiClient } from '../../api/client';
import { colors } from '../../theme/colors';

const levelLabels: Record<string, string> = {
  başlangıç: 'Başlangıç', baslangic: 'Başlangıç',
  orta: 'Orta', ileri: 'İleri', profesyonel: 'Profesyonel',
};

type PanelStackParamList = {
  ProfileShortcuts: undefined;
  NotificationSettings: undefined;
};

type Props = { navigation: NativeStackNavigationProp<PanelStackParamList, 'ProfileShortcuts'> };

export default function ProfileShortcutsScreen({ navigation }: Props) {
  const { user, signOut } = useAuth() as any;
  const { data: profile } = useProfile();
  const [deleting, setDeleting] = useState(false);

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'Oyuncu';
  const lastName = profile?.last_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const initials = (firstName[0] || '🏐').toUpperCase();
  const username = user?.email?.split('@')[0];
  const levelLabel = profile?.level ? (levelLabels[profile.level] ?? profile.level) : null;

  const goToParent = (screen: string) =>
    navigation.getParent()?.navigate('AntrenmanStack' as any, { screen } as any);

  const comingSoon = () => Alert.alert('Yakında', 'Bu bölüm yakında eklenecek.');

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: () => signOut?.() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz (planlar, oturumlar, profil) kalıcı olarak silinecek. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await apiClient.delete('/auth/me');
              await signOut?.();
            } catch {
              Alert.alert('Hata', 'Hesap silinirken bir sorun oluştu.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const ITEMS: Array<{ title: string; onPress: () => void; destructive?: boolean }> = [
    { title: 'Uygulama Ayarları', onPress: () => goToParent('Ayarlar') },
    { title: 'Antrenman Tercihlerim', onPress: () => goToParent('Profil') },
    { title: 'Bildirim Ayarları', onPress: () => navigation.navigate('NotificationSettings') },
    { title: 'Gizlilik Politikası', onPress: comingSoon },
    { title: 'KVKK Metni', onPress: comingSoon },
    { title: 'Yardım & Destek', onPress: comingSoon },
    { title: 'Hesabı Sil', onPress: handleDeleteAccount, destructive: true },
    { title: 'Çıkış Yap', onPress: handleSignOut, destructive: true },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{initials}</Text>
          </View>
          <Text style={s.name} numberOfLines={1}>{fullName || 'Oyuncu'}</Text>
          <Text style={s.meta} numberOfLines={1}>
            {username ? `@${username}` : ''}{username && levelLabel ? '  ·  ' : ''}{levelLabel ?? ''}
          </Text>
        </View>

        <View style={s.grid}>
          {ITEMS.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[s.card, item.destructive && s.cardDestructive]}
              activeOpacity={0.78}
              disabled={deleting}
              onPress={item.onPress}
            >
              <Text style={[s.cardTitle, item.destructive && s.cardTitleDestructive]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 32 },

  header: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.accent + '30', borderWidth: 2, borderColor: colors.accent + '70',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  avatarTxt: { color: colors.accent, fontSize: 22, fontWeight: '800' },
  name: { color: colors.foreground, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  meta: { color: colors.muted, fontSize: 13 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '47.8%',
    backgroundColor: colors.card, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 10,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  cardDestructive: { borderColor: colors.error + '70', backgroundColor: colors.error + '15' },
  cardTitle: { color: colors.foreground, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  cardTitleDestructive: { color: colors.error },
});
