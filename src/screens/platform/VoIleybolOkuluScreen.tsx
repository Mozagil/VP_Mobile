import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { allModules, Module } from '../../data/modules';
import { useModuleFavorites } from '../../hooks/useModuleFavorites';

const LEVELS = ['Tümü', 'Başlangıç', 'Orta', 'İleri'];

const categoryColors: Record<string, string> = {
  'Temel Teknikler':    colors.accent,
  'Atak Teknikleri':    '#6366f1',
  'Savunma Teknikleri': '#22c55e',
  'Servis Teknikleri':  '#60a5fa',
  'Bireysel Performans':'#f59e0b',
  'Teknik Gelişim':     '#a78bfa',
  'Takım Organizasyonu':'#f97316',
};

// Android-safe chip
function LevelChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <View style={[chip.wrap, active && chip.wrapActive]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={chip.inner}>
        <Text style={[chip.text, active && chip.textActive]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ModuleRow({ item, isFav, onToggleFav, onPress }: {
  item: Module; isFav: boolean; onToggleFav: () => void; onPress: () => void;
}) {
  const catColor = categoryColors[item.category] ?? colors.muted;
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.8}>
      <View style={s.rowLeft}>
        <View style={s.rowBadges}>
          <View style={[s.catBadge, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
            <Text style={[s.catBadgeTxt, { color: catColor }]}>{item.category}</Text>
          </View>
          <View style={s.lvlBadge}>
            <Text style={s.lvlBadgeTxt}>{item.level}</Text>
          </View>
        </View>
        <Text style={s.rowName}>{item.title.toUpperCase()}</Text>
      </View>
      <TouchableOpacity
        style={s.bookmarkBtn}
        onPress={e => { e.stopPropagation?.(); onToggleFav(); }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 18, color: isFav ? colors.accent : colors.border }}>{isFav ? '🔖' : '🔖'}</Text>
      </TouchableOpacity>
      <Text style={s.arrow}>›</Text>
    </TouchableOpacity>
  );
}

// Saved (small) row
function SavedRow({ item, onRemove, onPress }: { item: Module; onRemove: () => void; onPress: () => void }) {
  const catColor = categoryColors[item.category] ?? colors.muted;
  return (
    <TouchableOpacity style={s.savedRow} onPress={onPress} activeOpacity={0.8}>
      <View style={[s.savedDot, { backgroundColor: catColor }]} />
      <Text style={s.savedName} numberOfLines={1}>{item.title}</Text>
      <Text style={s.savedLevel}>{item.level}</Text>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={{ color: colors.border, fontSize: 16 }}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function ModuleDetail({ item, onClose }: { item: Module; onClose: () => void }) {
  return (
    <Modal animationType="slide" transparent onRequestClose={onClose}>
      <View style={d.overlay}>
        <View style={d.sheet}>
          <View style={d.header}>
            <View style={d.headerLeft}>
              <Text style={d.headerCat}>{item.category}</Text>
              <Text style={d.headerTitle}>{item.title.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={d.closeBtn} onPress={onClose}>
              <Text style={d.closeBtnTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={d.body} showsVerticalScrollIndicator={false}>
            <View style={d.metaRow}>
              <View style={d.metaBadge}>
                <Text style={d.metaBadgeTxt}>{item.level}</Text>
              </View>
              {item.duration && (
                <View style={[d.metaBadge, { backgroundColor: colors.blue + '20', borderColor: colors.blue + '40' }]}>
                  <Text style={[d.metaBadgeTxt, { color: colors.blue }]}>{item.duration}</Text>
                </View>
              )}
            </View>
            <Text style={d.desc}>{item.desc}</Text>
            <Text style={d.sectionTitle}>🏋️ Egzersizler</Text>
            {item.exercises.map((ex, i) => (
              <View key={i} style={d.exRow}>
                <View style={d.exNum}>
                  <Text style={d.exNumTxt}>{i + 1}</Text>
                </View>
                <Text style={d.exTxt}>{ex}</Text>
              </View>
            ))}
            <Text style={d.sectionTitle}>💡 İpuçları</Text>
            {item.tips.map((tip, i) => (
              <View key={i} style={d.tipRow}>
                <Text style={d.tipDot}>•</Text>
                <Text style={d.tipTxt}>{tip}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function VoIleybolOkuluScreen() {
  const [level, setLevel] = useState('Tümü');
  const [selected, setSelected] = useState<Module | null>(null);
  const { favorites, toggleFavorite, isFavorite } = useModuleFavorites();

  const savedItems = useMemo(
    () => allModules.filter(m => favorites.includes(m.id)),
    [favorites],
  );

  const filtered = useMemo(
    () => allModules.filter(m => level === 'Tümü' || m.level === level),
    [level],
  );

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      {/* Level filter */}
      <View style={s.filterRow}>
        {LEVELS.map(l => (
          <LevelChip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => `${item.type}-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View style={s.savedSection}>
            <View style={s.savedHeader}>
              <View style={s.savedHeaderLeft}>
                <Text style={s.savedHeaderIcon}>🔖</Text>
                <Text style={s.savedHeaderTitle}>KAYDEDİLEN TEKNİKLER</Text>
              </View>
              <View style={s.addBtnWrap}>
                <TouchableOpacity style={s.addBtn} activeOpacity={0.8} onPress={() => {}}>
                  <Text style={s.addBtnTxt}>+ Modül Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>

            {savedItems.length === 0 ? (
              <View style={s.savedEmpty}>
                <Text style={s.savedEmptyIcon}>🔖</Text>
                <Text style={s.savedEmptyTxt}>
                  Henüz kaydedilen modül yok. Favori modüllerinizi ekleyin!
                </Text>
              </View>
            ) : (
              savedItems.map(item => (
                <SavedRow
                  key={item.id}
                  item={item}
                  onRemove={() => toggleFavorite(item.id)}
                  onPress={() => setSelected(item)}
                />
              ))
            )}
            <View style={s.divider} />
            <Text style={s.allTitle}>TÜM MODÜLLER · {filtered.length}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ModuleRow
            item={item}
            isFav={isFavorite(item.id)}
            onToggleFav={() => toggleFavorite(item.id)}
            onPress={() => setSelected(item)}
          />
        )}
      />

      {selected && <ModuleDetail item={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const chip = StyleSheet.create({
  wrap:       { alignSelf: 'flex-start', marginRight: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#4a6090', backgroundColor: '#1a2a5e', overflow: 'hidden' },
  wrapActive: { borderColor: '#f97316', backgroundColor: '#3d1800' },
  inner:      { paddingHorizontal: 14, paddingVertical: 7 },
  text:       { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  textActive: { color: '#f97316' },
});

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  list:      { paddingHorizontal: 16, paddingBottom: 32 },

  // Saved section
  savedSection:    {},
  savedHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  savedHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  savedHeaderIcon: { fontSize: 16 },
  savedHeaderTitle:{ color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  addBtnWrap:      { borderRadius: 8, overflow: 'hidden' },
  addBtn:          { backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnTxt:       { color: '#fff', fontSize: 12, fontWeight: '700' },

  savedEmpty:    { backgroundColor: colors.card, borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  savedEmptyIcon:{ fontSize: 32, marginBottom: 10, opacity: 0.4 },
  savedEmptyTxt: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  savedRow:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border, gap: 10 },
  savedDot:  { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  savedName: { color: colors.foreground, fontSize: 13, fontWeight: '600', flex: 1 },
  savedLevel:{ color: colors.muted, fontSize: 11, marginRight: 6 },

  divider:  { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  allTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },

  // Module rows
  row:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  rowLeft:  { flex: 1 },
  rowBadges:{ flexDirection: 'row', gap: 6, marginBottom: 6 },
  catBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1 },
  catBadgeTxt: { fontSize: 10, fontWeight: '700' },
  lvlBadge: { backgroundColor: colors.cardAlt, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: colors.border },
  lvlBadgeTxt: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  rowName:  { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  bookmarkBtn: { padding: 6, marginRight: 4 },
  arrow:       { color: colors.muted, fontSize: 22 },
});

const d = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '88%', overflow: 'hidden' },
  header:  { flexDirection: 'row', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerLeft: { flex: 1 },
  headerCat:  { color: colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  headerTitle:{ color: colors.foreground, fontSize: 18, fontWeight: '800', lineHeight: 22 },
  closeBtn:   { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  closeBtnTxt:{ color: colors.foreground, fontSize: 14, fontWeight: '700' },
  body:       { padding: 20, paddingBottom: 40 },
  metaRow:    { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metaBadge:  { backgroundColor: colors.accent + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.accent + '40' },
  metaBadgeTxt: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  desc:       { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  sectionTitle: { color: colors.accent, fontSize: 14, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  exRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  exNum:  { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent + '20', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  exNumTxt: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  exTxt:  { color: colors.foreground, fontSize: 13, flex: 1 },
  tipRow: { flexDirection: 'row', marginBottom: 6 },
  tipDot: { color: colors.accent, fontSize: 16, marginRight: 8, lineHeight: 20 },
  tipTxt: { color: colors.muted, fontSize: 13, lineHeight: 20, flex: 1 },
});
