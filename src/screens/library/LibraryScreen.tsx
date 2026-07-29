import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { allDrills } from '../../data/drills';
import { Drill } from '../../data/types';
import DrillCard from '../../components/DrillCard';
import { useFavorites } from '../../hooks/useFavorites';
import { colors } from '../../theme/colors';
import { QUICK_CATEGORIES, matchesCategory, matchesPlayerCount, minDurationMinutes } from '../../utils/libraryFilters';
import { difficultyLabel } from '../../utils/drillCovers';
import LibraryFilterModal, { LibraryFilters, DEFAULT_FILTERS } from './LibraryFilterModal';
import Icon from '../../components/ui/Icon';

type LibraryStackParamList = {
  DrillList: undefined;
  DrillDetail: { drill: Drill };
};

type Props = { navigation: NativeStackNavigationProp<LibraryStackParamList, 'DrillList'> };

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[s.chip, active && s.chipActive]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[s.chipTxt, active && s.chipTxtActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LibraryScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [quickCategory, setQuickCategory] = useState<string>('Tümü');
  const [filters, setFilters] = useState<LibraryFilters>(DEFAULT_FILTERS);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filtered = useMemo(() => {
    return allDrills.filter((d) => {
      const matchSearch =
        search.length === 0 ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.skill.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchQuick = quickCategory === 'Tümü' || matchesCategory(d, quickCategory);

      const matchCategories = filters.categories.length === 0
        || filters.categories.some((c) => matchesCategory(d, c));
      const matchDifficulty = filters.difficulties.length === 0
        || filters.difficulties.includes(difficultyLabel(d.level));
      const matchPlayers = filters.playerCounts.length === 0
        || filters.playerCounts.some((p) => matchesPlayerCount(d, p));
      const matchDuration = filters.maxDuration >= 60 || minDurationMinutes(d.duration) <= filters.maxDuration;

      return matchSearch && matchQuick && matchCategories && matchDifficulty && matchPlayers && matchDuration;
    });
  }, [search, quickCategory, filters]);

  const navigateToDrill = (d: Drill) => navigation.navigate('DrillDetail', { drill: d });

  const activeFilterCount = filters.categories.length + filters.difficulties.length
    + filters.playerCounts.length + (filters.maxDuration < 60 ? 1 : 0);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <View style={s.searchRow}>
        <TextInput
          style={s.searchInput}
          placeholder="Arama yapın..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={s.chipsOuterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipsRow}
          style={{ flex: 1 }}
        >
          {QUICK_CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={quickCategory === c} onPress={() => setQuickCategory(c)} />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[s.filterBtn, activeFilterCount > 0 && s.filterBtnActive, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <Icon name="filtre" size={14} />
          {activeFilterCount > 0 && <Text style={s.filterBtnTxt}>{activeFilterCount}</Text>}
        </TouchableOpacity>
      </View>

      <View style={s.countRow}>
        <Text style={s.countLabel}>
          {quickCategory === '__favs__' ? 'Favorilerim' : 'Tüm Antrenmanlar'} ({
            quickCategory === '__favs__' ? favorites.length : filtered.length
          })
        </Text>
        <TouchableOpacity
          onPress={() => setQuickCategory((prev) => (prev === '__favs__' ? 'Tümü' : '__favs__'))}
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
        >
          <Icon name="favori" size={14} opacity={quickCategory === '__favs__' ? 1 : 0.4} />
          <Text style={s.favToggleTxt}>
            Favoriler{favorites.length > 0 ? ` (${favorites.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {(quickCategory === '__favs__' ? filtered.filter((d) => favorites.includes(d.id)) : filtered).length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>{quickCategory === '__favs__' ? '🤍' : '🔍'}</Text>
          <Text style={s.emptyTxt}>
            {quickCategory === '__favs__' ? 'Henüz favori eklemedin.' : 'Sonuç bulunamadı.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={quickCategory === '__favs__' ? filtered.filter((d) => favorites.includes(d.id)) : filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DrillCard
              drill={item}
              onPress={navigateToDrill}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={(d) => toggleFavorite(d.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <LibraryFilterModal
        visible={showFilterModal}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilterModal(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  searchRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  searchInput: {
    backgroundColor: colors.card, color: colors.foreground, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },

  chipsOuterRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 12, marginBottom: 8, gap: 8 },
  chipsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingRight: 4 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },
  filterBtn: {
    width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  filterBtnActive: { borderColor: colors.accent },
  filterBtnTxt: { fontSize: 13, color: colors.accent, fontWeight: '800' },

  countRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 8,
  },
  countLabel: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  favToggleTxt: { color: colors.muted, fontSize: 12, fontWeight: '600' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTxt: { color: colors.muted, fontSize: 14, textAlign: 'center' },
});
