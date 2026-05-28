import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTrainingPlans } from '../../hooks/useTrainingPlans';
import { colors } from '../../theme/colors';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabsParamList } from '../../navigation/AppTabs';

type Props = { navigation: BottomTabNavigationProp<AppTabsParamList, 'Panel'> };

const levelLabels: Record<string, string> = {
  baslangic: 'Başlangıç', başlangıç: 'Başlangıç',
  orta: 'Orta', ileri: 'İleri', profesyonel: 'Profesyonel',
};
const positionLabels: Record<string, string> = {
  pasor: 'Pasör', smacor: 'Smaçör', orta: 'Orta Oyuncu',
  libero: 'Libero', pasor_caprazi: 'Pasör Karşıtı', kararsiz: 'Kararsız',
};

// Circular progress ring using nested Views
function RingProgress({ pct }: { pct: number }) {
  const color = pct >= 100 ? colors.success : pct > 0 ? colors.accent : colors.border;
  return (
    <View style={[ring.outer, { borderColor: color }]}>
      <Text style={[ring.text, { color }]}>{pct}%</Text>
    </View>
  );
}

// Quick-access card (2-column grid)
function QuickCard({
  icon, title, subtitle, color, onPress,
}: { icon: string; title: string; subtitle: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[q.card]} onPress={onPress} activeOpacity={0.78}>
      <View style={[q.iconBox, { backgroundColor: color + '22' }]}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>
      <Text style={q.title} numberOfLines={2}>{title}</Text>
      <Text style={q.sub} numberOfLines={2}>{subtitle}</Text>
      <Text style={q.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ navigation }: Props) {
  const { user, signOut } = useAuth() as any;
  const { data: profile } = useProfile();
  const { data: plans = [] } = useTrainingPlans();

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'Oyuncu';
  const lastName  = profile?.last_name || '';
  const fullName  = [firstName, lastName].filter(Boolean).join(' ').toUpperCase();
  const initials  = `${(firstName[0] || '').toUpperCase()}${(lastName[0] || '').toUpperCase()}`;
  const levelLabel    = profile?.level    ? (levelLabels[profile.level]    ?? profile.level)    : null;
  const positionLabel = profile?.position ? (positionLabels[profile.position] ?? profile.position) : null;

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => signOut?.() },
      ],
    );
  };

  const goTo = (tab: string, screen?: string, params?: object) => {
    if (screen) {
      (navigation as any).navigate(tab, { screen, params });
    } else {
      (navigation as any).navigate(tab);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Profile Header ── */}
        <View style={s.header}>
          <View style={s.headerRow}>
            {/* Avatar */}
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>{initials || '🏐'}</Text>
            </View>

            {/* Name + badges */}
            <View style={s.headerMid}>
              <Text style={s.greeting}>HOŞ GELDİN,</Text>
              <Text style={s.userName} numberOfLines={1}>{fullName || 'OYUNCU'}!</Text>
              <View style={s.badgesRow}>
                {levelLabel && (
                  <View style={s.badge}>
                    <Text style={s.badgeTxt}>{levelLabel}</Text>
                  </View>
                )}
                {positionLabel && (
                  <View style={[s.badge, s.badgeBlue]}>
                    <Text style={s.badgeTxt}>{positionLabel}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action buttons */}
            <View style={s.headerBtns}>
              <View style={s.outlineBtnWrap}>
                <TouchableOpacity
                  style={s.outlineBtn}
                  onPress={() => goTo('GelişimStack', 'Ayarlar')}
                  activeOpacity={0.8}
                >
                  <Text style={s.outlineBtnTxt}>⚙ Ayarlar</Text>
                </TouchableOpacity>
              </View>
              <View style={[s.outlineBtnWrap, { marginTop: 6 }]}>
                <TouchableOpacity style={s.outlineBtn} onPress={handleSignOut} activeOpacity={0.8}>
                  <Text style={s.outlineBtnTxt}>→ Çıkış</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ── Quick Access ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>⚡ HIZLI ERİŞİM</Text>
          <View style={s.quickGrid}>
            <QuickCard
              icon="🤖" color={colors.accent}
              title="AI İLE PLAN OLUŞTUR"
              subtitle="Kişiselleştirilmiş antrenman programı"
              onPress={() => goTo('ÖzelliklerStack', 'AIWizard')}
            />
            <QuickCard
              icon="📚" color={colors.blue}
              title="ANTRENMAN KÜTÜPHANESİ"
              subtitle="100+ dril keşfet"
              onPress={() => goTo('KütüphaneStack')}
            />
            <QuickCard
              icon="📈" color={colors.green}
              title="GELİŞİM MODÜLÜ"
              subtitle="Teknikleri öğren"
              onPress={() => goTo('GelişimStack')}
            />
            <QuickCard
              icon="📖" color={colors.purple}
              title="SÖZLÜK"
              subtitle="Terimleri öğren"
              onPress={() => goTo('Sözlük')}
            />
          </View>
        </View>

        {/* ── Training Plans ── */}
        <View style={s.section}>
          {/* Header row */}
          <View style={s.plansHeaderRow}>
            <Text style={s.sectionTitle}>📋 ANTRENMAN PLANLARI</Text>
            <View style={s.plansBtnRow}>
              <View style={s.aiPlanBtnWrap}>
                <TouchableOpacity
                  style={s.aiPlanBtn}
                  onPress={() => goTo('ÖzelliklerStack', 'AIWizard')}
                  activeOpacity={0.8}
                >
                  <Text style={s.aiPlanBtnTxt}>🤖 AI ile Plan</Text>
                </TouchableOpacity>
              </View>
              <View style={s.newPlanBtnWrap}>
                <TouchableOpacity
                  style={s.newPlanBtn}
                  onPress={() => goTo('GelişimStack', 'CreatePlan')}
                  activeOpacity={0.8}
                >
                  <Text style={s.newPlanBtnTxt}>+ Yeni Plan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Plan list */}
          {plans.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyIcon}>📋</Text>
              <Text style={s.emptyTitle}>Henüz antrenman planınız yok</Text>
              <Text style={s.emptyDesc}>
                Yeni plan oluşturun veya AI sihirbazını kullanın.
              </Text>
            </View>
          ) : (
            plans.map(plan => {
              const total = plan.drills.length;
              const done  = plan.drills.filter(d => d.completed).length;
              const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
              const date  = plan.created_at
                ? new Date(plan.created_at).toLocaleDateString('tr-TR')
                : '';
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={s.planCard}
                  onPress={() => goTo('GelişimStack', 'PlanDetail', { planId: plan.id })}
                  activeOpacity={0.75}
                >
                  <RingProgress pct={pct} />
                  <View style={s.planMid}>
                    <View style={s.planNameRow}>
                      <Text style={s.planName} numberOfLines={1}>{plan.name.toUpperCase()}</Text>
                      {plan.team ? (
                        <View style={s.teamBadge}>
                          <Text style={s.teamBadgeTxt}>{plan.team}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={s.planMeta}>
                      {done}/{total} dril{date ? `  ·  ${date}` : ''}
                    </Text>
                  </View>
                  <Text style={s.planArrow}>›</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const ring = StyleSheet.create({
  outer: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  text:  { fontSize: 11, fontWeight: '700' },
});

const q = StyleSheet.create({
  card: {
    width: '47.8%',
    backgroundColor: colors.card,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border,
    position: 'relative',
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title:   { color: colors.foreground, fontSize: 11, fontWeight: '800', marginBottom: 4, lineHeight: 14, paddingRight: 18 },
  sub:     { color: colors.muted, fontSize: 10, lineHeight: 14 },
  arrow:   { position: 'absolute', top: 14, right: 12, color: colors.muted, fontSize: 18 },
});

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },

  // Header
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    marginBottom: 20,
  },
  headerRow:  { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.accent + '30',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.accent + '70',
    marginRight: 12, flexShrink: 0,
  },
  avatarTxt:  { color: colors.accent, fontSize: 18, fontWeight: '800' },
  headerMid:  { flex: 1 },
  greeting:   { color: colors.muted, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  userName:   { color: colors.foreground, fontSize: 18, fontWeight: '800', lineHeight: 22, marginBottom: 6 },
  badgesRow:  { flexDirection: 'row', gap: 6 },
  badge:      { backgroundColor: colors.accent + '25', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.accent + '50' },
  badgeBlue:  { backgroundColor: colors.blue + '25', borderColor: colors.blue + '50' },
  badgeTxt:   { color: colors.foreground, fontSize: 11, fontWeight: '600' },

  headerBtns: { marginLeft: 8, alignItems: 'flex-end' },
  outlineBtnWrap: { borderRadius: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  outlineBtn:     { paddingHorizontal: 10, paddingVertical: 6 },
  outlineBtnTxt:  { color: colors.muted, fontSize: 11, fontWeight: '600' },

  // Section
  section:      { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 12 },

  // Quick grid
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  // Plans
  plansHeaderRow: { marginBottom: 12 },
  plansBtnRow:    { flexDirection: 'row', gap: 8, marginTop: 8 },
  aiPlanBtnWrap:  { borderRadius: 10, borderWidth: 1.5, borderColor: colors.accent + '80', overflow: 'hidden' },
  aiPlanBtn:      { paddingHorizontal: 12, paddingVertical: 8 },
  aiPlanBtnTxt:   { color: colors.accent, fontSize: 12, fontWeight: '700' },
  newPlanBtnWrap: { borderRadius: 10, overflow: 'hidden' },
  newPlanBtn:     { backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8 },
  newPlanBtnTxt:  { color: '#fff', fontSize: 12, fontWeight: '700' },

  planCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border, gap: 12,
  },
  planMid:     { flex: 1 },
  planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  planName:    { color: colors.foreground, fontSize: 14, fontWeight: '700', flex: 1 },
  teamBadge:   { backgroundColor: colors.cardAlt, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: colors.border },
  teamBadgeTxt:{ color: colors.muted, fontSize: 10, fontWeight: '600' },
  planMeta:    { color: colors.muted, fontSize: 12 },
  planArrow:   { color: colors.muted, fontSize: 22 },

  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 14, padding: 32,
    alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  emptyIcon:  { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc:  { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
