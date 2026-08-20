import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { SOZLUK_TERMS, categoryColor } from '../../data/sozlukTerms';
import { useSozlukFavorites } from '../../hooks/useSozlukFavorites';
import { SozlukStackParamList } from '../../navigation/SozlukStack';
import Icon from '../../components/ui/Icon';
import { useI18n, LOCALE, sozlukCategoryLabel } from '../../i18n';

type Props = NativeStackScreenProps<SozlukStackParamList, 'FavoriTerimler'>;

export default function FavoriTerimlerScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang, pick } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { favorites, isFavorite, toggleFavorite } = useSozlukFavorites();

  const favoriteTerms = useMemo(() => {
    const locale = LOCALE[lang];
    return SOZLUK_TERMS
      .filter((item) => favorites.includes(item.id))
      .sort((a, b) => pick(a.term, a.termEn).localeCompare(pick(b.term, b.termEn), locale));
  }, [favorites, lang]);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('sozluk.favTitle')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={s.count}>{t('sozluk.favCount', { n: favoriteTerms.length })}</Text>

      {favoriteTerms.length === 0 ? (
        <View style={s.emptyCard}>
          <Icon name="favori" size={36} opacity={1} style={{ marginBottom: 12 }} />
          <Text style={s.emptyTitle}>{t('sozluk.favEmptyTitle')}</Text>
          <Text style={s.emptyDesc}>{t('sozluk.favEmptyDesc')}</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteTerms}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const accent = categoryColor[item.category] ?? colors.accent;
            return (
              <TouchableOpacity
                style={s.row}
                activeOpacity={0.78}
                onPress={() => navigation.navigate('TermDetail', { term: item })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.termName}>{pick(item.term, item.termEn)}</Text>
                  <Text style={[s.termCategory, { color: accent }]}>{sozlukCategoryLabel(item.category, lang)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon name="favori" size={18} opacity={isFavorite(item.id) ? 1 : 0.3} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },

  count: { color: colors.muted, fontSize: 12, paddingHorizontal: 16, marginTop: 8, marginBottom: 10 },

  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  termName: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  termCategory: { fontSize: 12, fontWeight: '600' },
  starTxt: { fontSize: 20, color: colors.muted },

  emptyCard: {
    marginHorizontal: 16, marginTop: 24, backgroundColor: colors.card, borderRadius: 14, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  });
}
