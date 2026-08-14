import React, { useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { SOZLUK_TERMS, CATEGORIES, categoryColor, SozlukTerm } from '../../data/sozlukTerms';
import { useSozlukFavorites } from '../../hooks/useSozlukFavorites';
import { SozlukStackParamList, SozlukFilterState } from '../../navigation/SozlukStack';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SozlukStackParamList, 'SozlukList'>;

const ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

export default function SozlukScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [search, setSearch] = useState('');
  const [quickCategory, setQuickCategory] = useState('Tümü');
  const [filter, setFilter] = useState<SozlukFilterState>({ category: 'Tümü', keywords: [], sortBy: 'az' });
  const { isFavorite, toggleFavorite } = useSozlukFavorites();
  const listRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  const effectiveCategory = filter.category !== 'Tümü' ? filter.category : quickCategory;

  const filtered = useMemo(() => {
    let items = SOZLUK_TERMS.filter((t) => {
      const matchSearch =
        search.length === 0 ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = effectiveCategory === 'Tümü' || t.category === effectiveCategory;
      const matchKeywords = filter.keywords.length === 0 || filter.keywords.some((k) => t.keywords.includes(k));
      return matchSearch && matchCat && matchKeywords;
    });
    items = items.sort((a, b) =>
      filter.sortBy === 'za' ? b.term.localeCompare(a.term, 'tr') : a.term.localeCompare(b.term, 'tr'),
    );
    return items;
  }, [search, effectiveCategory, filter]);

  const sections = useMemo(() => {
    const byLetter = new Map<string, SozlukTerm[]>();
    filtered.forEach((t) => {
      const letter = t.term.substring(0, 1).toUpperCase();
      (byLetter.get(letter) ?? byLetter.set(letter, []).get(letter)!).push(t);
    });
    const order = filter.sortBy === 'za' ? [...ALPHABET].reverse() : ALPHABET;
    return order
      .filter((l) => byLetter.has(l))
      .map((l) => ({ title: l, data: byLetter.get(l)! }));
  }, [filtered, filter.sortBy]);

  const availableLetters = useMemo(() => new Set(sections.map((s) => s.title)), [sections]);

  const scrollToLetter = (letter: string) => {
    const y = sectionOffsets.current[letter];
    if (y == null) return;
    listRef.current?.scrollTo({ y, animated: true });
  };

  const openFilter = () => {
    navigation.navigate('SozlukFilter', {
      current: filter,
      onApply: (next) => setFilter(next),
    });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => navigation.getParent()?.navigate('Panel' as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Voleybol Sözlüğü</Text>
        <View style={s.headerIcons}>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() => navigation.navigate('FavoriTerimler')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="favori" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={openFilter} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="filtre" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.searchRow}>
        <TextInput
          style={s.search}
          placeholder="Terim ara..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={s.chipsRow}>
        {CATEGORIES.map((c) => {
          const active = quickCategory === c;
          return (
            <TouchableOpacity
              key={c}
              style={[s.chip, active && s.chipActive]}
              activeOpacity={0.8}
              onPress={() => { setQuickCategory(c); setFilter((f) => ({ ...f, category: 'Tümü' })); }}
            >
              <Text style={[s.chipTxt, active && s.chipTxtActive]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.countRow}>
        <Text style={s.count}>Toplam {filtered.length} terim</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReportMissingTerm')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.reportLink}>Eksik terim bildir</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ScrollView
          ref={listRef}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        >
          {sections.length === 0 && <Text style={s.empty}>Aramanla eşleşen terim bulunamadı.</Text>}
          {sections.map((section) => (
            <React.Fragment key={section.title}>
              <Text
                style={s.sectionHeader}
                onLayout={(e) => { sectionOffsets.current[section.title] = e.nativeEvent.layout.y; }}
              >
                {section.title}
              </Text>
              {section.data.map((item) => {
                const accent = categoryColor[item.category] ?? colors.accent;
                const fav = isFavorite(item.id);
                return (
                  <TouchableOpacity
                    key={item.term}
                    style={s.row}
                    activeOpacity={0.78}
                    onPress={() => navigation.navigate('TermDetail', { term: item })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={s.termName}>{item.term}</Text>
                      <Text style={[s.termCategory, { color: accent }]}>{item.category}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Icon name="favori" size={17} opacity={fav ? 1 : 0.3} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </React.Fragment>
          ))}
        </ScrollView>

        <View style={s.indexRail}>
          {ALPHABET.map((letter) => (
            <TouchableOpacity
              key={letter}
              onPress={() => scrollToLetter(letter)}
              disabled={!availableLetters.has(letter)}
              hitSlop={{ top: 1, bottom: 1, left: 4, right: 4 }}
            >
              <Text style={[s.indexLetter, !availableLetters.has(letter) && s.indexLetterDisabled]}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },
  headerIcons: { flexDirection: 'row' },
  starTxt: { fontSize: 18, color: colors.accent },
  filterTxt: { fontSize: 18 },

  searchRow: { paddingHorizontal: 16, paddingBottom: 8 },
  search: {
    backgroundColor: colors.card, color: colors.foreground,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },

  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8, marginBottom: 4 },
  count: { color: colors.muted, fontSize: 12 },
  reportLink: { color: colors.accent, fontSize: 12, fontWeight: '600' },

  list: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: { color: colors.accent, fontSize: 13, fontWeight: '800', backgroundColor: colors.background, paddingVertical: 6 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  termName: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  termCategory: { fontSize: 11, fontWeight: '600' },
  rowStar: { fontSize: 17, color: colors.muted },

  empty: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 40 },

  indexRail: { justifyContent: 'center', paddingRight: 6, paddingLeft: 2, gap: 1 },
  indexLetter: { color: colors.accent, fontSize: 10, fontWeight: '700', textAlign: 'center', width: 14 },
  indexLetterDisabled: { color: colors.border },
  });
}
