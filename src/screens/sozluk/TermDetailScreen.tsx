import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { categoryColor } from '../../data/sozlukTerms';
import { useSozlukFavorites } from '../../hooks/useSozlukFavorites';
import Icon from '../../components/ui/Icon';
import { SozlukStackParamList } from '../../navigation/SozlukStack';

type Props = NativeStackScreenProps<SozlukStackParamList, 'TermDetail'>;

export default function TermDetailScreen({ route, navigation }: Props) {
  const { term } = route.params;
  const { isFavorite, toggleFavorite } = useSozlukFavorites();
  const fav = isFavorite(term.term);
  const accent = categoryColor[term.category] ?? colors.accent;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{term.term}</Text>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => toggleFavorite(term.term)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="favori" size={18} opacity={fav ? 1 : 0.3} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <Text style={s.termTitle}>{term.term}</Text>
        <View style={[s.catBadge, { backgroundColor: accent + '20', borderColor: accent + '50' }]}>
          <Text style={[s.catBadgeTxt, { color: accent }]}>{term.category}</Text>
        </View>

        <Text style={s.sectionLabel}>Açıklama</Text>
        <Text style={s.desc}>{term.desc}</Text>
        {term.detail && <Text style={[s.desc, { marginTop: 8 }]}>{term.detail}</Text>}

        {term.example && (
          <>
            <Text style={s.sectionLabel}>Maç İçinde Kullanım Örneği</Text>
            <View style={[s.exampleBox, { borderColor: accent + '40', backgroundColor: accent + '10' }]}>
              <Text style={s.exampleText}>"{term.example}"</Text>
            </View>
          </>
        )}

        {term.keywords.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Anahtar Kelimeler</Text>
            <View style={s.tagsRow}>
              {term.keywords.map((k) => (
                <View key={k} style={s.tag}>
                  <Text style={s.tagTxt}>{k}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <Text style={s.secondaryBtnTxt}>Sözlüğe Dön</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.primaryBtn, fav && s.primaryBtnActive]}
          activeOpacity={0.85}
          onPress={() => toggleFavorite(term.term)}
        >
          <Text style={s.primaryBtnTxt}>{fav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  starTxt: { fontSize: 20, color: colors.muted },
  headerTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, textAlign: 'center' },

  body: { padding: 16, paddingBottom: 24 },
  termTitle: { color: colors.foreground, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  catBadge: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 20 },
  catBadgeTxt: { fontSize: 12, fontWeight: '700' },

  sectionLabel: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 18 },
  desc: { color: colors.muted, fontSize: 14, lineHeight: 21 },

  exampleBox: { borderRadius: 12, borderWidth: 1, padding: 14 },
  exampleText: { color: colors.foreground, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  tagTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },

  footer: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  secondaryBtn: { flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 14, alignItems: 'center' },
  secondaryBtnTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  primaryBtn: { flex: 1.4, backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnActive: { backgroundColor: colors.error },
  primaryBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
