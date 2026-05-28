import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity,
  Modal, ScrollView, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

type Term = {
  term: string;
  category: string;
  desc: string;       // Kısa tanım  (Tanım bölümü)
  detail?: string;    // Uzun açıklama (Detaylı Açıklama bölümü)
  example?: string;
  related?: string[];
};

// ── Cover images per category ───────────────────────────────────────────────
const categoryCover: Record<string, any> = {
  'Teknik':   require('../../assets/covers/passing.jpg'),
  'Servis':   require('../../assets/covers/serve.jpg'),
  'Savunma':  require('../../assets/covers/defense.jpg'),
  'Saldırı':  require('../../assets/covers/attack.jpg'),
  'Pozisyon': require('../../assets/covers/tactics.jpg'),
  'Kural':    require('../../assets/covers/game.jpg'),
  'Strateji': require('../../assets/covers/tactics.jpg'),
  'Ekipman':  require('../../assets/covers/game.jpg'),
  'Hata':     require('../../assets/covers/game.jpg'),
};
function getCover(cat: string) {
  return categoryCover[cat] ?? require('../../assets/covers/tactics.jpg');
}

// ── Category accent colors ───────────────────────────────────────────────────
const categoryColor: Record<string, string> = {
  'Teknik':   '#f97316',
  'Servis':   '#60a5fa',
  'Savunma':  '#22c55e',
  'Saldırı':  '#a78bfa',
  'Pozisyon': '#f59e0b',
  'Kural':    '#6366f1',
  'Strateji': '#f97316',
  'Ekipman':  '#60a5fa',
  'Hata':     '#ef4444',
};

// ── Terms data ───────────────────────────────────────────────────────────────
const TERMS: Term[] = [
  {
    term: 'Ace', category: 'Servis',
    desc: 'Rakibin dokunmadan ya da hata yaparak tamamlanamayan, doğrudan sayı kazandıran servis.',
    detail: 'Ace serviste hedef, savunucunun pozisyon dışına düşen ya da kontrolsüz bir topa neden olacak şekilde hız veya yerleştirme avantajı sağlamaktır.',
    example: "Güçlü float servisini ace'e dönüştürerek seti kapattı.",
    related: ['Floater', 'Topspin Servis', 'Servis Çizgisi'],
  },
  {
    term: 'Blok', category: 'Savunma',
    desc: 'File üzerinde rakibin smaçına karşı yapılan engelleme hareketi.',
    detail: '1, 2 veya 3 oyuncuyla yapılabilir. Etkili bir blok, rakibin saldırı açısını daraltır ve takım savunmasını kolaylaştırır.',
    example: 'Ortanın çift bloğu rakibin güçlü smaçını sahaya düşürdü.',
    related: ['Üçlü Blok', 'Smaç', 'File'],
  },
  {
    term: 'Libero', category: 'Pozisyon',
    desc: 'Özel formaya sahip, yalnızca arka sırada oynayan savunma uzmanı oyuncu.',
    detail: 'Libero smaç atamaz ve servis kullanamaz. Arka sıra rotasyonlarında herhangi bir oyuncunun yerine serbestçe girebilir; bu değişim sayılmaz.',
    example: 'Libero servis bölgesine çöktü ve zor topu kurtardı.',
    related: ['Savunma', 'Manşet', 'Rotasyon'],
  },
  {
    term: 'Manşet', category: 'Teknik',
    desc: 'İç kollarla yapılan pas tekniği.',
    detail: 'Her iki kolun iç yüzeyini birleştirerek topun kontrollü şekilde yönlendirilmesi. Karşılamada ve savunmada kullanılır.',
    example: 'Güçlü servisi manşet ile kontrollü şekilde pasöre iletti.',
    related: ['Pas', 'Karşılama', 'Dig'],
  },
  {
    term: 'Pasör', category: 'Pozisyon',
    desc: 'Takımın oyun kuruculuğunu yapan, smaçörlere ikinci dokunuşu aktaran oyuncu.',
    detail: 'Pasör, rakip savunmasını okuyarak hızlı, yüksek veya çapraz setler vererek saldırıyı yönetir. Takımın motor gücüdür.',
    example: 'Pasör hızlı set ile ortanın önüne harika bir açılım yaptı.',
    related: ['Set', 'Smaç', '5-1 Sistem'],
  },
  {
    term: 'Smaç', category: 'Teknik',
    desc: 'Filein üzerinden rakip sahaya kuvvetli vurulan atak tekniği.',
    detail: 'Smaçör zıplayarak havada topla buluşur; bilek, omuz ve gövde rotasyonuyla güç üretir. Köşe, çapraz veya düz hedeflere vurulabilir.',
    example: 'Köşe smaç ile rakibin savunmasını dağıttı.',
    related: ['Blok', 'Pas', 'Atak'],
  },
  {
    term: 'Floater', category: 'Servis',
    desc: 'Topu döndürmeden atılan, havada salınım yapan ve savunucuyu zorlayan servis türü.',
    detail: 'Topa herhangi bir spin verilmez; bu durum topun hava akışından etkilenerek öngörülemez biçimde salınmasına yol açar.',
    example: 'Float servis savunucunun gözünden kaçarak düştü.',
    related: ['Ace', 'Servis', 'Topspin Servis'],
  },
  {
    term: 'Dump', category: 'Teknik',
    desc: 'Pasörün ikinci dokunuşta fileti geçirerek yaptığı sürpriz topa vurma.',
    detail: 'Rakip takım genellikle üçüncü bir dokunuş beklerken pasörün topu doğrudan rakip sahaya bırakması sürpriz yaratır.',
    example: 'Pasör rakibi şaşırtmak için dump yaptı.',
    related: ['Pasör', 'Set', 'Smaç'],
  },
  {
    term: 'Tip', category: 'Teknik',
    desc: 'Smaç pozisyonundan güçlü vurmak yerine parmak uçlarıyla yapılan kontrollü dokunuş.',
    detail: 'Blok duvarını aşmak veya boş bölgeye yerleştirmek amacıyla kullanılır. Savunmanın güç beklediği anlarda etkilidir.',
    example: 'Blok beklentisini boşa çıkarmak için tip yaptı.',
    related: ['Smaç', 'Dump', 'Pasör'],
  },
  {
    term: 'Pancake', category: 'Savunma',
    desc: 'Oyuncunun yere uzanarak elini düz koyduğu savunma hamlesi.',
    detail: 'Top yere değmeden hemen önce el yatay olarak zemine yerleştirilir ve top bu elin üzerinden sekerek oyunda kalır. Büyük refleks gerektirir.',
    example: 'Son anda pancake kurtarışıyla puanı kurtardı.',
    related: ['Savunma', 'Dig', 'Rölyef'],
  },
  {
    term: 'Rölyef', category: 'Teknik',
    desc: 'Rakibin smaçından sonra savunmada topun kontrolünü sağlayan teknik.',
    related: ['Savunma', 'Manşet', 'Blok'],
  },
  {
    term: 'Rotasyon', category: 'Kural',
    desc: 'Her servis kazanımında oyuncuların saat yönünde birer mevzi kaydığı zorunlu yer değiştirme.',
    related: ['Kural', 'Pozisyon', 'Libero'],
  },
  {
    term: 'Set', category: 'Kural',
    desc: 'Her oyunun bölünmüş birimleri; 25 sayıya ulaşan takım seti kazanır, 5. set 15 sayıda oynanır.',
    related: ['Rotasyon', 'Smaç', 'Servis'],
  },
  {
    term: 'Topa Sahip Olma', category: 'Strateji',
    desc: 'Topun rakibe geçmeden önce üç dokunuş hakkının tamamını kullanma stratejisi.',
    related: ['Smaç', 'Pasör', 'Taktik'],
  },
  {
    term: 'Topspin Servis', category: 'Servis',
    desc: 'Topa üst rotasyon verilmesiyle sert ve düşük giden, karşı çıkması zor servis türü.',
    related: ['Ace', 'Floater', 'Zıplama Servisi'],
  },
  {
    term: 'Zıplama Servisi', category: 'Servis',
    desc: 'Oyuncunun zıplayarak havada vurduğu, güç ve açı avantajı sağlayan servis türü.',
    related: ['Topspin Servis', 'Ace', 'Servis Çizgisi'],
  },
  {
    term: 'Pipe', category: 'Saldırı',
    desc: 'Arka sıra 6 numaralı pozisyondan yapılan orta saldırı.',
    related: ['Quick', 'Smaç', 'Pasör'],
  },
  {
    term: 'Quick (Hızlı Pas)', category: 'Saldırı',
    desc: 'Pasörün kısa ve hızlı verdiği pastan orta oyuncunun yapacağı ani smaç.',
    related: ['Pipe', 'Pasör', 'Blok'],
  },
  {
    term: 'Çift Faz', category: 'Hata',
    desc: 'Aynı oyuncunun topa iki kez art arda dokunması; bu kurala aykırıdır.',
    related: ['Kural', 'Hata'],
  },
  {
    term: 'Yüzer Çizgi', category: 'Kural',
    desc: 'Sahayı ikiye bölen ve oyuncuların rakip sahaya geçmesini engelleyen orta çizgi.',
    related: ['Kural', 'File', 'Antenna'],
  },
  {
    term: 'Antenna', category: 'Ekipman',
    desc: 'Filein her iki yanındaki dikey çubuk; topun bu çubuğun dışından geçmesi hatadır.',
    related: ['File', 'Kural'],
  },
  {
    term: 'Libero Trafiği', category: 'Kural',
    desc: 'Libero\'nun bir sette en fazla iki kez aynı oyuncunun yerini alabilmesi kuralı.',
    related: ['Libero', 'Rotasyon', 'Kural'],
  },
  {
    term: 'Servis Çizgisi', category: 'Kural',
    desc: 'Arkasından servis atılan 3 metre genişliğindeki servis bölgesi.',
    related: ['Servis', 'Kural'],
  },
  {
    term: 'Üçlü Blok', category: 'Savunma',
    desc: 'Üç oyuncunun yan yana gelerek oluşturduğu geniş blok duvarı.',
    related: ['Blok', 'Savunma', 'Smaç'],
  },
  {
    term: 'Overhand Pas', category: 'Teknik',
    desc: 'Parmak uçlarıyla yukarıdan yapılan, genellikle smaça hazırlık için kullanılan pas tekniği.',
    related: ['Set', 'Pasör', 'Manşet'],
  },
  {
    term: 'Sideout', category: 'Strateji',
    desc: 'Rakibin servis attığı turda sayı kazanarak servis hakkını geri alma.',
    related: ['Servis', 'Rotasyon', 'Strateji'],
  },
  {
    term: 'Doğrudan Sayı', category: 'Strateji',
    desc: 'Serve edilen topun smaç, blok veya serbest top kazanımıyla doğrudan sayıya dönüştürülmesi.',
    related: ['Smaç', 'Blok', 'Ace'],
  },
  {
    term: 'Karşı Alan Saldırısı', category: 'Saldırı',
    desc: 'Rakibin saldırısını blok veya kaz ile karşılayıp konter saldırıya geçme.',
    related: ['Blok', 'Smaç', 'Sideout'],
  },
];

const CATEGORIES = ['Tümü', 'Teknik', 'Pozisyon', 'Servis', 'Saldırı', 'Savunma', 'Kural', 'Strateji', 'Ekipman', 'Hata'];

// ── Term Detail Modal ────────────────────────────────────────────────────────
function TermModal({ term, onClose }: { term: Term; onClose: () => void }) {
  const [isFav, setIsFav] = useState(false);
  const initials    = term.term.substring(0, 1).toUpperCase();
  const accentColor = categoryColor[term.category] ?? colors.accent;
  const cover       = getCover(term.category);

  return (
    <Modal animationType="slide" transparent onRequestClose={onClose}>
      <View style={d.overlay}>
        <View style={d.sheet}>

          {/* ── Header ── */}
          <View style={d.header}>
            <View style={[d.initialCircle, { backgroundColor: accentColor + '28', borderColor: accentColor + '55' }]}>
              <Text style={[d.initialTxt, { color: accentColor }]}>{initials}</Text>
            </View>
            <View style={d.headerMid}>
              <Text style={d.termTitle}>{term.term.toUpperCase()}</Text>
              <View style={[d.catBadge, { backgroundColor: accentColor + '22', borderColor: accentColor + '44' }]}>
                <Text style={[d.catBadgeTxt, { color: accentColor }]}>{term.category}</Text>
              </View>
            </View>

            {/* Kalp butonu */}
            <TouchableOpacity
              style={[d.iconBtn, isFav && { backgroundColor: '#ef444420', borderColor: '#ef444455' }]}
              onPress={() => setIsFav(f => !f)}
              activeOpacity={0.75}
            >
              <Text style={[d.iconBtnTxt, isFav && { color: '#ef4444' }]}>{isFav ? '♥' : '♡'}</Text>
            </TouchableOpacity>

            {/* Kapat butonu */}
            <TouchableOpacity style={d.iconBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={d.iconBtnTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

            {/* ── Cover image ── */}
            <View style={d.imageWrap}>
              <Image source={cover} style={d.image} resizeMode="cover" />
              <View style={d.imageOverlay} />

              {/* Kategori etiketi — sol üst */}
              <View style={[d.catTag, { backgroundColor: accentColor }]}>
                <Text style={d.catTagTxt}>{term.category}</Text>
              </View>

              {/* Oynat butonu — orta */}
              <View style={d.playBtn}>
                <Text style={d.playIcon}>▶</Text>
              </View>

              {/* Süre rozeti — sağ alt */}
              <View style={d.durationBadge}>
                <Text style={d.durationTxt}>2:00</Text>
              </View>
            </View>

            {/* ── Görsel alt başlık ── */}
            <View style={d.captionBar}>
              <Text style={d.captionTitle}>{term.term}</Text>
              <View style={d.captionActions}>
                <Text style={d.captionActionIcon}>🔊</Text>
                <Text style={[d.captionActionIcon, { marginLeft: 12 }]}>⛶</Text>
              </View>
            </View>

            {/* ── Body ── */}
            <View style={d.body}>

              {/* Tanım */}
              <Text style={d.sectionLabel}>Tanım</Text>
              <Text style={d.desc}>{term.desc}</Text>

              {/* Detaylı Açıklama */}
              {term.detail ? (
                <>
                  <Text style={d.sectionLabel}>Detaylı Açıklama</Text>
                  <Text style={d.desc}>{term.detail}</Text>
                </>
              ) : null}

              {/* Maç İçi Örnek */}
              {term.example ? (
                <View style={d.exampleBox}>
                  <Text style={[d.exampleLabel, { color: accentColor }]}>Maç İçi Örnek:</Text>
                  <Text style={d.exampleText}>"{term.example}"</Text>
                </View>
              ) : null}

              {/* İlişkili */}
              {term.related && term.related.length > 0 ? (
                <View style={d.relatedRow}>
                  <Text style={d.relatedLabel}>İlişkili:</Text>
                  <View style={d.relatedTags}>
                    {term.related.map(r => (
                      <View key={r} style={d.relatedTag}>
                        <Text style={d.relatedTagTxt}>{r}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

            </View>
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function SozlukScreen() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('Tümü');
  const [selected, setSelected] = useState<Term | null>(null);

  const filtered = useMemo(() => {
    return TERMS.filter(t => {
      const matchSearch =
        search.length === 0 ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'Tümü' || t.category === category;
      return matchSearch && matchCat;
    }).sort((a, b) => a.term.localeCompare(b.term, 'tr'));
  }, [search, category]);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>

      {/* Arama */}
      <View style={s.searchRow}>
        <TextInput
          style={s.search}
          placeholder="Terim ara..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Kategori chip'leri */}
      <View style={s.chips}>
        {CATEGORIES.map(c => {
          const active = category === c;
          return (
            <View key={c} style={[s.chipWrap, active && s.chipWrapActive]}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setCategory(c)} style={s.chipInner}>
                <Text style={[s.chipTxt, active && s.chipTxtActive]}>{c}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <Text style={s.count}>{filtered.length} terim</Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.term}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const accentColor = categoryColor[item.category] ?? colors.accent;
          return (
            <TouchableOpacity style={s.termCard} onPress={() => setSelected(item)} activeOpacity={0.8}>
              <View style={s.termHeader}>
                <View style={[s.termInitial, { backgroundColor: accentColor + '25', borderColor: accentColor + '50' }]}>
                  <Text style={[s.termInitialTxt, { color: accentColor }]}>
                    {item.term.substring(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={s.termMid}>
                  <Text style={s.termName}>{item.term}</Text>
                  <Text style={s.termDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
                <View style={[s.catBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '40' }]}>
                  <Text style={[s.catBadgeTxt, { color: accentColor }]}>{item.category}</Text>
                </View>
              </View>
              {item.related && item.related.length > 0 && (
                <Text style={s.relatedPreview}>
                  İlişkili: {item.related.slice(0, 3).join(' · ')}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {selected ? <TermModal term={selected} onClose={() => setSelected(null)} /> : null}
    </SafeAreaView>
  );
}

// ── List Styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.background },
  searchRow:  { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  search: {
    backgroundColor: colors.card, color: colors.foreground,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border, fontSize: 15,
  },
  chips:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 6 },
  chipWrap:      { alignSelf: 'flex-start', marginRight: 7, marginBottom: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#4a6090', backgroundColor: '#1a2a5e', overflow: 'hidden' },
  chipWrapActive:{ borderColor: '#f97316', backgroundColor: '#3d1800' },
  chipInner:     { paddingHorizontal: 11, paddingVertical: 5 },
  chipTxt:       { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  chipTxtActive: { color: '#f97316' },
  count: { color: colors.muted, fontSize: 12, paddingHorizontal: 16, marginBottom: 6 },
  list:  { paddingHorizontal: 16, paddingBottom: 24 },

  termCard: {
    backgroundColor: colors.card, borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  termHeader:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  termInitial:    { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  termInitialTxt: { fontSize: 16, fontWeight: '800' },
  termMid:    { flex: 1 },
  termName:   { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  termDesc:   { color: colors.muted, fontSize: 12, lineHeight: 16 },
  catBadge:   { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, alignSelf: 'flex-start' },
  catBadgeTxt:{ fontSize: 10, fontWeight: '700' },
  relatedPreview: { color: colors.border, fontSize: 11, marginTop: 4 },
});

// ── Modal Styles ──────────────────────────────────────────────────────────────
const d = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: colors.background, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '92%', overflow: 'hidden' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  initialCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, flexShrink: 0,
  },
  initialTxt: { fontSize: 20, fontWeight: '800' },
  headerMid:  { flex: 1 },
  termTitle:  { color: colors.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 },
  catBadge:   { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  catBadgeTxt:{ fontSize: 11, fontWeight: '700' },

  // Kalp + Kapat ikonları
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  iconBtnTxt: { color: colors.foreground, fontSize: 15 },

  // Görsel
  imageWrap: { width: '100%', height: 210, position: 'relative' },
  image:     { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },

  catTag: {
    position: 'absolute', top: 12, left: 12,
    borderRadius: 6, paddingHorizontal: 9, paddingVertical: 4,
  },
  catTagTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },

  playBtn: {
    position: 'absolute', top: '50%', left: '50%',
    marginTop: -30, marginLeft: -30,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#f97316',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 8, elevation: 10,
  },
  playIcon: { color: '#fff', fontSize: 22, marginLeft: 4 },

  durationBadge: {
    position: 'absolute', bottom: 10, right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 5,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  durationTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // Alt başlık çubuğu
  captionBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  captionTitle:      { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  captionActions:    { flexDirection: 'row', alignItems: 'center' },
  captionActionIcon: { fontSize: 18, color: colors.muted },

  // İçerik
  body:         { padding: 20, paddingBottom: 44 },
  sectionLabel: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 6 },
  desc:         { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 18 },

  exampleBox: {
    backgroundColor: colors.accent + '12',
    borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: colors.accent + '30',
    marginBottom: 20,
  },
  exampleLabel: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  exampleText:  { color: colors.foreground, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },

  relatedRow:  { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  relatedLabel:{ color: colors.muted, fontSize: 13, fontWeight: '600', marginTop: 4 },
  relatedTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  relatedTag:  {
    backgroundColor: colors.cardAlt, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: colors.border,
  },
  relatedTagTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
});
