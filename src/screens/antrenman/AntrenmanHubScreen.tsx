import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';

type Props = { navigation: NativeStackNavigationProp<AntrenmanStackParamList, 'AntrenmanMenu'> };

function getItems(colors: Colors): Array<{ icon: string; title: string; desc: string; color: string; screen: keyof AntrenmanStackParamList }> {
  return [
    { icon: '📚', color: colors.blue, title: 'Drill Kütüphanesi', desc: '100+ dril keşfet, favorilerine ekle.', screen: 'DrillList' },
    { icon: '📈', color: colors.green, title: 'Gelişim Modülleri', desc: 'Modül ve teknikleri incele.', screen: 'GelisimMain' },
    { icon: '👤', color: colors.purple, title: 'Profilim', desc: 'Seviye, mevki ve hedeflerini düzenle.', screen: 'Profil' },
    { icon: '⚙️', color: colors.muted, title: 'Ayarlar', desc: 'Hesap ve şifre ayarları.', screen: 'Ayarlar' },
  ];
}

export default function AntrenmanHubScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const ITEMS = useMemo(() => getItems(colors), [colors]);
  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Diğer</Text>
        <Text style={s.subtitle}>Dril kütüphanen, gelişimin ve hesap ayarların.</Text>

        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={s.card}
            activeOpacity={0.78}
            onPress={() => navigation.navigate(item.screen as any)}
          >
            <View style={[s.iconBox, { backgroundColor: item.color + '20' }]}>
              <Text style={s.icon}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardDesc}>{item.desc}</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 16, paddingBottom: 32 },
    title: { color: colors.foreground, fontSize: 24, fontWeight: '800', marginBottom: 4 },
    subtitle: { color: colors.muted, fontSize: 14, marginBottom: 20 },
    card: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10,
      borderWidth: 1, borderColor: colors.border,
    },
    iconBox: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    icon: { fontSize: 22 },
    cardTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 3 },
    cardDesc: { color: colors.muted, fontSize: 12, lineHeight: 17 },
    arrow: { color: colors.muted, fontSize: 22 },
  });
}
