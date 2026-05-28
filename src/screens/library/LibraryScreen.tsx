import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { allDrills } from '../../data/drills';
import { Drill } from '../../data/types';
import DrillCard from '../../components/DrillCard';
import { useFavorites } from '../../hooks/useFavorites';

type LibraryStackParamList = {
  DrillList: undefined;
  DrillDetail: { drill: Drill };
};

type Props = { navigation: NativeStackNavigationProp<LibraryStackParamList, 'DrillList'> };

const PHASES = ['Tümü', 'Isınma', 'Ana Antrenman', 'Oyun', 'Soğuma'];
const LEVELS = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: active ? '#f97316' : '#4a6090',
        backgroundColor: active ? '#3d1800' : '#1a2a5e',
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 8 }}>
        <Text style={{ color: active ? '#f97316' : '#ffffff', fontSize: 13, fontWeight: '600' }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function LibraryScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [phase, setPhase] = useState('Tümü');
  const [level, setLevel] = useState('Tümü');
  const [showFavs, setShowFavs] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filtered = useMemo(() => {
    const base = showFavs ? allDrills.filter((d) => favorites.includes(d.id)) : allDrills;
    return base.filter((d) => {
      const matchSearch =
        search.length === 0 ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.skill.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchPhase = phase === 'Tümü' || d.phase === phase;
      const matchLevel = level === 'Tümü' || d.level === level;
      return matchSearch && matchPhase && matchLevel;
    });
  }, [search, phase, level, showFavs, favorites]);

  const navigateToDrill = (d: Drill) => navigation.navigate('DrillDetail', { drill: d });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d1b3e' }} edges={['bottom']}>

      {/* Arama */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
        <TextInput
          style={{
            backgroundColor: '#122040',
            color: '#ffffff',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: '#1e3060',
            fontSize: 15,
          }}
          placeholder="Drill ara..."
          placeholderTextColor="#8da3cc"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Favoriler toggle */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 4 }}>
        <Chip
          label={`❤️ Favoriler${favorites.length > 0 ? ` (${favorites.length})` : ''}`}
          active={showFavs}
          onPress={() => setShowFavs((v) => !v)}
        />
      </View>

      {/* Faz filtreleri */}
      {!showFavs && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 4 }}>
          {PHASES.map((p) => (
            <Chip key={p} label={p} active={phase === p} onPress={() => setPhase(p)} />
          ))}
        </View>
      )}

      {/* Seviye filtreleri */}
      {!showFavs && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 6 }}>
          {LEVELS.map((l) => (
            <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />
          ))}
        </View>
      )}

      <Text style={{ color: '#8da3cc', fontSize: 12, paddingHorizontal: 16, marginBottom: 8 }}>
        {filtered.length} drill
      </Text>

      {showFavs && filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🤍</Text>
          <Text style={{ color: '#8da3cc', fontSize: 15, textAlign: 'center' }}>
            Henüz favori eklemedin.{'\n'}Drill'lerin üzerindeki kalp ikonuna dokun.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
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
    </SafeAreaView>
  );
}
