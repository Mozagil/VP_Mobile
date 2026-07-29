import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';

type PlatformParamList = {
  PlatformMain: undefined;
  AIWizard: undefined;
  VoIleybolOkulu: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<PlatformParamList, 'PlatformMain'>;
};

const STATS = [
  { value: '100+', label: 'Drill' },
  { value: '20+',  label: 'Modül' },
  { value: '4',    label: 'Seviye' },
  { value: '∞',   label: 'Plan' },
];

type Feature = {
  icon: string;
  title: string;
  desc: string;
  color: string;
  tag?: string;        // optional "active" tag label
  dest?: 'ai' | 'library' | 'gelisim' | 'sozluk' | 'dashboard' | 'okul' | 'wizard';
};

const FEATURES: Feature[] = [
  {
    icon: '🤖', color: colors.accent, tag: 'BAŞLAT',
    title: 'AI Antrenman Sihirbazı',
    desc: 'Seviyenize ve hedeflerinize göre saniyeler içinde kişiselleştirilmiş antrenman planı oluşturun.',
    dest: 'wizard',
  },
  {
    icon: '🎓', color: colors.blue, tag: 'YENİ',
    title: 'Voleybol Okulu',
    desc: 'Temel ve ileri teknikler, modüller ve favorilere ekleme. Voleybol öğrenmenin en kolay yolu.',
    dest: 'okul',
  },
  {
    icon: '📚', color: colors.blue,
    title: '100+ Drill Kütüphanesi',
    desc: 'Isınma, servis, manşet, smaç, blok ve daha fazlası. Her drill için detaylı açıklama, süre ve oyuncu bilgisi.',
    dest: 'library',
  },
  {
    icon: '📈', color: colors.green,
    title: 'Gelişim Modülleri',
    desc: 'Bireysel performans, teknik ve takım organizasyonu modülleri. Haftalık ilerleme takibi.',
    dest: 'gelisim',
  },
  {
    icon: '🏆', color: colors.warning,
    title: 'İlerleme Takibi',
    desc: 'Tamamlanan drill ve oturumlarla performans analizi. Hedeflerinize ne kadar yaklaştığınızı görün.',
    dest: 'dashboard',
  },
  {
    icon: '📖', color: colors.purple,
    title: 'Voleybol Sözlüğü',
    desc: '100\'den fazla voleybol terimi ve açıklaması. Teknik kavramları kolayca öğrenin.',
    dest: 'sozluk',
  },
  {
    icon: '⭐', color: colors.warning,
    title: 'Favori Drill\'ler',
    desc: 'Beğendiğiniz drill\'leri favorilerinize ekleyin, hızlıca erişin.',
    dest: 'library',
  },
  {
    icon: '📅', color: colors.indigo,
    title: 'Antrenman Takvimi',
    desc: 'Planlarınızı takvime ekleyin, yaklaşan antrenmanları kaçırmayın. Haftalık program oluşturun.',
  },
  {
    icon: '👥', color: colors.green,
    title: 'Takım Yönetimi',
    desc: 'Takımınız için özel planlar oluşturun. U18, U16 gibi kategorilere göre antrenman programları.',
  },
];

export default function PlatformScreen({ navigation }: Props) {
  const tabNav = navigation.getParent();

  const handleFeaturePress = (dest?: Feature['dest']) => {
    if (!dest) return;
    switch (dest) {
      case 'wizard':    navigation.navigate('AIWizard');         break;
      case 'okul':      navigation.navigate('VoIleybolOkulu');   break;
      case 'library':   tabNav?.navigate('AntrenmanStack' as any, { screen: 'DrillList' });     break;
      case 'gelisim':   tabNav?.navigate('AntrenmanStack' as any, { screen: 'GelisimMain' });   break;
      case 'sozluk':    tabNav?.navigate('Sözlük' as any);                                       break;
      case 'dashboard': tabNav?.navigate('Panel' as any);                                        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🏐 Platform Özellikleri</Text>
          </View>
          <Text style={styles.heroTitle}>VOLEYBOLda{'\n'}YENİ DÖNEM</Text>
          <Text style={styles.heroDesc}>
            AI destekli antrenman planları, 100+ drill kütüphanesi, gelişim modülleri ve
            ilerleme takibi ile voleybol performansınızı üst seviyeye taşıyın.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Tüm Özellikler</Text>
        {FEATURES.map(f => {
          const tappable = !!f.dest;
          const Wrapper = tappable ? TouchableOpacity : View;
          const wrapperProps = tappable
            ? { activeOpacity: 0.75, onPress: () => handleFeaturePress(f.dest) }
            : {};
          return (
            <Wrapper key={f.title} style={[styles.featureCard, tappable && styles.featureCardTappable]} {...wrapperProps}>
              <View style={[styles.featureIconBox, { backgroundColor: f.color + '20' }]}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  {f.tag && (
                    <View style={[styles.featureTag, { backgroundColor: f.color + '25', borderColor: f.color + '60' }]}>
                      <Text style={[styles.featureTagTxt, { color: f.color }]}>{f.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              {tappable && <Text style={styles.featureArrow}>›</Text>}
            </Wrapper>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>VoleyPro — Voleybol antrenmanında yeni dönem</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 32 },

  hero: {
    alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 32,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  heroBadge: {
    backgroundColor: colors.accent + '25', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6, marginBottom: 16,
    borderWidth: 1, borderColor: colors.accent + '40',
  },
  heroBadgeText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  heroTitle: {
    color: colors.foreground, fontSize: 28, fontWeight: '800',
    textAlign: 'center', marginBottom: 12, lineHeight: 34,
  },
  heroDesc: { color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 },

  statsRow: {
    flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statValue: { color: colors.accent, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: colors.muted, fontSize: 11, fontWeight: '600' },

  sectionTitle: {
    color: colors.foreground, fontSize: 18, fontWeight: '700',
    paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12,
  },

  featureCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: colors.card,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border, gap: 12,
  },
  featureCardTappable: { borderColor: colors.border },
  featureIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureIcon:    { fontSize: 22 },
  featureText:    { flex: 1 },
  featureTitleRow:{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  featureTitle:   { color: colors.foreground, fontSize: 15, fontWeight: '700', flex: 1 },
  featureTag:     { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 },
  featureTagTxt:  { fontSize: 9, fontWeight: '800' },
  featureDesc:    { color: colors.muted, fontSize: 13, lineHeight: 18 },
  featureArrow:   { color: colors.muted, fontSize: 22, alignSelf: 'center' },

  footer:     { alignItems: 'center', paddingTop: 24 },
  footerText: { color: colors.border, fontSize: 12 },

  indigo: {},
});
