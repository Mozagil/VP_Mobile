import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n, profileLevelLabel } from '../../i18n';

type PanelStackParamList = {
  ProfileShortcuts: undefined;
  Logout: undefined;
  DeleteAccount: undefined;
  HelpSupport: undefined;
  Ayarlar: undefined;
  Profil: undefined;
  Legal: { doc: 'kvkk' | 'privacy' | 'faq' };
};

type Props = { navigation: NativeStackNavigationProp<PanelStackParamList, 'ProfileShortcuts'> };

export default function ProfileShortcutsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { user } = useAuth() as any;
  const { data: profile } = useProfile();

  const firstName = profile?.first_name || user?.email?.split('@')[0] || t('profile.defaultName');
  const lastName = profile?.last_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const initials = (firstName[0] || '🏐').toUpperCase();
  const username = user?.email?.split('@')[0];
  const levelLabel = profileLevelLabel(profile?.level, lang);


  // Ayarlar/Profil bu stack icinde acilir; boylece geri tusu her zaman bu
  // ekrana doner (once Antrenman sekmesine atlandigi icin geri tusu yanlis
  // ekrana gidiyordu).
  const ITEMS: Array<{ title: string; onPress: () => void; destructive?: boolean }> = [
    { title: t('shortcuts.appSettings'), onPress: () => navigation.navigate('Ayarlar') },
    { title: t('shortcuts.myTrainingPreferences'), onPress: () => navigation.navigate('Profil') },
    { title: t('shortcuts.privacyPolicy'), onPress: () => navigation.navigate('Legal', { doc: 'privacy' }) },
    { title: t('shortcuts.kvkk'), onPress: () => navigation.navigate('Legal', { doc: 'kvkk' }) },
    { title: t('shortcuts.helpSupport'), onPress: () => navigation.navigate('HelpSupport') },
    { title: t('shortcuts.deleteAccount'), onPress: () => navigation.navigate('DeleteAccount'), destructive: true },
    { title: t('shortcuts.logout'), onPress: () => navigation.navigate('Logout'), destructive: true },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{initials}</Text>
          </View>
          <Text style={s.name} numberOfLines={1}>{fullName || t('profile.defaultName')}</Text>
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

function makeStyles(colors: Colors) {
  return StyleSheet.create({
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
    width: '47.8%', minHeight: 76,
    backgroundColor: colors.card, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 10,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  cardDestructive: { borderColor: colors.error + '70', backgroundColor: colors.error + '15' },
  cardTitle: { color: colors.foreground, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  cardTitleDestructive: { color: colors.error },
  });
}
