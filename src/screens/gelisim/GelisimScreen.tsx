import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Image, StyleSheet, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { allModules, getModuleCover, Module } from '../../data/modules';

const CATEGORIES = ['Tümü', 'Bireysel Performans', 'Teknik Gelişim', 'Takım Organizasyonu', 'Temel Teknikler', 'Savunma Teknikleri', 'Atak Teknikleri', 'Servis Teknikleri'];
const LEVELS = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];

const typeColors = {
  module: { bg: '#1a2a5e', border: '#4a6090', text: '#8da3cc', label: 'Modül' },
  technique: { bg: '#1e3060', border: colors.blue, text: colors.blue, label: 'Teknik' },
};

const levelColors: Record<string, string> = {
  Başlangıç: colors.success,
  Orta: colors.warning,
  İleri: colors.accent,
};

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <View style={{ alignSelf: 'flex-start', marginRight: 8, marginBottom: 8, borderRadius: 20, borderWidth: 1.5, borderColor: active ? '#f97316' : '#4a6090', backgroundColor: active ? '#3d1800' : '#1a2a5e', overflow: 'hidden' }}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <Text style={{ color: active ? '#f97316' : '#ffffff', fontSize: 12, fontWeight: '600' }}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ModuleCard({ item, onPress }: { item: Module; onPress: () => void }) {
  const cover = getModuleCover(item.category);
  const tc = typeColors[item.type];
  const lvlColor = levelColors[item.level] ?? colors.muted;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Cover image */}
      <View style={styles.imageWrap}>
        <Image source={cover} style={styles.image} resizeMode="cover" />
        {/* Gradient overlay */}
        <View style={styles.imageOverlay} />
        {/* Badges on image */}
        <View style={styles.imageBadges}>
          <View style={[styles.badge, { backgroundColor: colors.accent + 'dd' }]}>
            <Text style={[styles.badgeText, { color: '#fff' }]}>{item.category}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: item.type === 'module' ? '#1e3a8add' : '#1d4ed8dd' }]}>
            <Text style={[styles.badgeText, { color: '#fff' }]}>{tc.label}</Text>
          </View>
        </View>
        {/* Level + duration bottom */}
        <View style={styles.imageBottom}>
          <Text style={styles.imageLevel}>{item.level}</Text>
          {item.duration && <Text style={styles.imageDuration}>{item.duration}</Text>}
        </View>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title.toUpperCase()}</Text>
        <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ModuleDetail({ item, onClose }: { item: Module; onClose: () => void }) {
  const cover = getModuleCover(item.category);
  const tc = typeColors[item.type];

  return (
    <Modal animationType="slide" transparent onRequestClose={onClose}>
      <View style={detail.overlay}>
        <View style={detail.sheet}>
          {/* Cover */}
          <View style={detail.imageWrap}>
            <Image source={cover} style={detail.image} resizeMode="cover" />
            <View style={detail.imageOverlay} />
            <View style={detail.badges}>
              <View style={[detail.badge, { backgroundColor: colors.accent + 'dd' }]}>
                <Text style={detail.badgeText}>{item.category}</Text>
              </View>
              <View style={[detail.badge, { backgroundColor: item.type === 'module' ? '#1e3a8add' : '#1d4ed8dd' }]}>
                <Text style={detail.badgeText}>{tc.label}</Text>
              </View>
            </View>
            <TouchableOpacity style={detail.closeBtn} onPress={onClose}>
              <Text style={detail.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={detail.imageBottom}>
              <Text style={detail.imageLevel}>{item.level}</Text>
              {item.duration && <Text style={detail.imageDuration}>{item.duration}</Text>}
            </View>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={detail.body} showsVerticalScrollIndicator={false}>
            <Text style={detail.title}>{item.title.toUpperCase()}</Text>
            <Text style={detail.desc}>{item.desc}</Text>

            {/* Exercises */}
            <Text style={detail.sectionTitle}>🏋️ Egzersizler</Text>
            {item.exercises.map((ex, i) => (
              <View key={i} style={detail.exerciseRow}>
                <View style={detail.exerciseNum}>
                  <Text style={detail.exerciseNumText}>{i + 1}</Text>
                </View>
                <Text style={detail.exerciseText}>{ex}</Text>
              </View>
            ))}

            {/* Tips */}
            <Text style={detail.sectionTitle}>💡 İpuçları</Text>
            {item.tips.map((tip, i) => (
              <View key={i} style={detail.tipRow}>
                <Text style={detail.tipDot}>•</Text>
                <Text style={detail.tipText}>{tip}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function GelisimScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [level, setLevel] = useState('Tümü');
  const [selected, setSelected] = useState<Module | null>(null);

  const filtered = useMemo(() => {
    return allModules.filter((m) => {
      const matchSearch = search.length === 0 || m.title.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'Tümü' || m.category === category;
      const matchLvl = level === 'Tümü' || m.level === level;
      return matchSearch && matchCat && matchLvl;
    });
  }, [search, category, level]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Arama */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Modül veya teknik ara..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Kategori chips */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 4 }}>
        {CATEGORIES.map((c) => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}
      </View>

      {/* Seviye chips */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 8 }}>
        {LEVELS.map((l) => <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />)}
      </View>

      <Text style={styles.count}>{filtered.length} modül/teknik</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => (
          <ModuleCard item={item} onPress={() => setSelected(item)} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {selected && <ModuleDetail item={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  search: {
    backgroundColor: colors.card, color: colors.foreground,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },
  count: { color: colors.muted, fontSize: 12, paddingHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 10, paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 2 },

  card: {
    width: '48.5%',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrap: { width: '100%', aspectRatio: 16 / 10, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  },
  imageBadges: { position: 'absolute', top: 6, left: 6, flexDirection: 'row', gap: 4 },
  badge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  imageBottom: {
    position: 'absolute', bottom: 6, left: 8, right: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  imageLevel: { color: '#fff', fontSize: 10, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 4 },
  imageDuration: { color: '#fff', fontSize: 10, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 4 },

  cardBody: { padding: 10 },
  cardTitle: { color: colors.foreground, fontSize: 11, fontWeight: '800', marginBottom: 4, lineHeight: 15 },
  cardDesc: { color: colors.muted, fontSize: 10, lineHeight: 14 },
});

const detail = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%', overflow: 'hidden' },
  imageWrap: { width: '100%', height: 200, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  badges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  closeBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#000', fontSize: 14, fontWeight: '700' },
  imageBottom: { position: 'absolute', bottom: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  imageLevel: { color: '#fff', fontSize: 12, fontWeight: '600' },
  imageDuration: { color: '#fff', fontSize: 12, fontWeight: '600' },
  body: { padding: 20, paddingBottom: 40 },
  title: { color: colors.foreground, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  desc: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  sectionTitle: { color: colors.accent, fontSize: 14, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  exerciseNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent + '20', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  exerciseNumText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  exerciseText: { color: colors.foreground, fontSize: 13, flex: 1 },
  tipRow: { flexDirection: 'row', marginBottom: 6 },
  tipDot: { color: colors.accent, fontSize: 16, marginRight: 8, lineHeight: 20 },
  tipText: { color: colors.muted, fontSize: 13, lineHeight: 20, flex: 1 },
});
