import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import type { TranslationKey } from '../../i18n';

type PlatformParamList = {
  PlatformMain: undefined;
  AIWizard: undefined;
  VoIleybolOkulu: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<PlatformParamList, 'PlatformMain'>;
};

const STATS = [
  { value: '100+', labelKey: 'platform.stat.drills' },
  { value: '20+',  labelKey: 'platform.stat.modules' },
  { value: '4',    labelKey: 'platform.stat.levels' },
  { value: '∞',   labelKey: 'platform.stat.plans' },
] as const;

type Feature = {
  icon: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
  tagKey?: TranslationKey;   // optional "active" tag label
  dest?: 'ai' | 'library' | 'sozluk' | 'dashboard' | 'okul' | 'wizard';
};

function getFeatures(colors: Colors): Feature[] {
  return [
  {
    icon: '🤖', color: colors.accent, tagKey: 'platform.tag.start',
    titleKey: 'platform.feature.ai', descKey: 'platform.feature.ai.desc',
    dest: 'wizard',
  },
  {
    icon: '🎓', color: colors.blue, tagKey: 'platform.tag.new',
    titleKey: 'platform.feature.school', descKey: 'platform.feature.school.desc',
    dest: 'okul',
  },
  {
    icon: '📚', color: colors.blue,
    titleKey: 'platform.feature.library', descKey: 'platform.feature.library.desc',
    dest: 'library',
  },
  {
    icon: '🏆', color: colors.warning,
    titleKey: 'platform.feature.progress', descKey: 'platform.feature.progress.desc',
    dest: 'dashboard',
  },
  {
    icon: '📖', color: colors.purple,
    titleKey: 'platform.feature.glossary', descKey: 'platform.feature.glossary.desc',
    dest: 'sozluk',
  },
  {
    icon: '⭐', color: colors.warning,
    titleKey: 'platform.feature.favorites', descKey: 'platform.feature.favorites.desc',
    dest: 'library',
  },
  {
    icon: '📅', color: colors.indigo,
    titleKey: 'platform.feature.calendar', descKey: 'platform.feature.calendar.desc',
  },
  {
    icon: '👥', color: colors.green,
    titleKey: 'platform.feature.team', descKey: 'platform.feature.team.desc',
  },
  ];
}

export default function PlatformScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const FEATURES = useMemo(() => getFeatures(colors), [colors]);
  const tabNav = navigation.getParent();

  const handleFeaturePress = (dest?: Feature['dest']) => {
    if (!dest) return;
    switch (dest) {
      case 'wizard':    navigation.navigate('AIWizard');         break;
      case 'okul':      navigation.navigate('VoIleybolOkulu');   break;
      case 'library':   tabNav?.navigate('AntrenmanStack' as any, { screen: 'DrillList' });     break;
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
            <Text style={styles.heroBadgeText}>{t('platform.heroBadge')}</Text>
          </View>
          <Text style={styles.heroTitle}>{t('platform.heroTitle')}</Text>
          <Text style={styles.heroDesc}>{t('platform.heroDesc')}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(stat => (
            <View key={stat.labelKey} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>{t('platform.allFeatures')}</Text>
        {FEATURES.map(f => {
          const tappable = !!f.dest;
          const Wrapper = tappable ? TouchableOpacity : View;
          const wrapperProps = tappable
            ? { activeOpacity: 0.75, onPress: () => handleFeaturePress(f.dest) }
            : {};
          return (
            <Wrapper key={f.titleKey} style={[styles.featureCard, tappable && styles.featureCardTappable]} {...wrapperProps}>
              <View style={[styles.featureIconBox, { backgroundColor: f.color + '20' }]}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
                  {f.tagKey && (
                    <View style={[styles.featureTag, { backgroundColor: f.color + '25', borderColor: f.color + '60' }]}>
                      <Text style={[styles.featureTagTxt, { color: f.color }]}>{t(f.tagKey)}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
              </View>
              {tappable && <Text style={styles.featureArrow}>›</Text>}
            </Wrapper>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('platform.footer')}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
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
}
