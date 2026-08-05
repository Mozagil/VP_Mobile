import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = { navigation: NativeStackNavigationProp<any> };

const ITEMS = [
  { title: 'Sık Sorulan Sorular', subtitle: null },
  { title: 'Bize Ulaşın', subtitle: 'Destek ekibimizle iletişime geçin' },
  { title: 'Geri Bildirim Gönder', subtitle: 'Uygulamayı geliştirmemize yardımcı olun' },
  { title: 'Sorun Bildir', subtitle: 'Karşılaştığınız bir problemi bildirin' },
  { title: 'Eğitim Videoları', subtitle: 'Uygulama kullanım rehberleri' },
  { title: 'Topluluk Kuralları', subtitle: 'Uygulama kullanım şartları' },
];

const SUPPORT_EMAIL = 'destek@voleypro.app';

export default function HelpSupportScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const comingSoon = () => Alert.alert('Yakında', 'Bu bölüm yakında eklenecek.');

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="geri" size={20} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Yardım & Destek</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.list}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.title}
              style={[s.row, i === ITEMS.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={comingSoon}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{item.title}</Text>
                {!!item.subtitle && <Text style={s.rowSubtitle}>{item.subtitle}</Text>}
              </View>
              <Icon name="ileri" size={16} opacity={0.6} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.supportCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.supportTitle}>Destek Ekibimiz</Text>
            <Text style={s.supportLine}>7/24 hizmetinizdeyiz.</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}>
              <Text style={s.supportEmail}>{SUPPORT_EMAIL}</Text>
            </TouchableOpacity>
          </View>
          <View style={s.supportIconCircle}>
            <Icon name="destek" size={26} />
          </View>
        </View>
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
  scroll: { padding: 16, paddingBottom: 32 },

  list: {
    backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  rowSubtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },

  supportCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    padding: 16,
  },
  supportTitle: { color: colors.foreground, fontSize: 14, fontWeight: '800', marginBottom: 4 },
  supportLine: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  supportEmail: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  supportIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  });
}
