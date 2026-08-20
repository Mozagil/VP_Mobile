import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { CATEGORIES, KEYWORD_FILTERS } from '../../data/sozlukTerms';
import { SozlukStackParamList, SortBy } from '../../navigation/SozlukStack';
import Icon from '../../components/ui/Icon';
import { useI18n, sozlukCategoryLabel, sozlukKeywordLabel } from '../../i18n';

type Props = NativeStackScreenProps<SozlukStackParamList, 'SozlukFilter'>;

const SORT_KEYS: SortBy[] = ['az', 'za'];

export default function SozlukFilterScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { current, onApply } = route.params;
  const [category, setCategory] = useState(current.category);
  const [keywords, setKeywords] = useState<string[]>(current.keywords);
  const [sortBy, setSortBy] = useState<SortBy>(current.sortBy);

  const toggleKeyword = (k: string) => {
    setKeywords((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  const clear = () => {
    setCategory('Tümü');
    setKeywords([]);
    setSortBy('az');
  };

  const apply = () => {
    onApply({ category, keywords, sortBy });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('sozluk.filterTitle')}</Text>
        <TouchableOpacity onPress={clear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.clearTxt}>{t('sozluk.filter.clear')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <Text style={s.fieldLabel}>{t('sozluk.filter.category')}</Text>
        <View style={s.chipsRow}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <TouchableOpacity
                key={c}
                style={[s.chip, active && s.chipActive]}
                activeOpacity={0.8}
                onPress={() => setCategory(c)}
              >
                <Text style={[s.chipTxt, active && s.chipTxtActive]}>{sozlukCategoryLabel(c, lang)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={s.fieldLabel}>{t('sozluk.filter.keywords')}</Text>
        <View style={s.chipsRow}>
          {KEYWORD_FILTERS.map((k) => {
            const active = keywords.includes(k);
            return (
              <TouchableOpacity
                key={k}
                style={[s.chip, active && s.chipActive]}
                activeOpacity={0.8}
                onPress={() => toggleKeyword(k)}
              >
                <Text style={[s.chipTxt, active && s.chipTxtActive]}>{sozlukKeywordLabel(k, lang)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={s.fieldLabel}>{t('sozluk.filter.sort')}</Text>
        {SORT_KEYS.map((key) => {
          const active = sortBy === key;
          return (
            <TouchableOpacity
              key={key}
              style={s.radioRow}
              activeOpacity={0.8}
              onPress={() => setSortBy(key)}
            >
              <View style={[s.radio, active && s.radioActive]}>
                {active && <View style={s.radioDot} />}
              </View>
              <Text style={s.radioLabel}>
                {key === 'az' ? t('sozluk.filter.sortAz') : t('sozluk.filter.sortZa')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.applyBtn} activeOpacity={0.85} onPress={apply}>
          <Text style={s.applyBtnTxt}>{t('sozluk.filter.apply')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },
  clearTxt: { color: colors.accent, fontSize: 13, fontWeight: '700' },

  body: { padding: 16, paddingBottom: 24 },
  fieldLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 18, marginBottom: 10 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipTxt: { color: colors.foreground, fontSize: 13, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },

  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.accent },
  radioLabel: { color: colors.foreground, fontSize: 14, fontWeight: '600' },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  applyBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  applyBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
