import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useTrainingPlans, useToggleDrillComplete } from '../../hooks/useTrainingPlans';
import { allDrills } from '../../data/drills';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import {
  buildPhaseBreakdown, drillsInPhase, resolveDrillMinutes, resolveDrillName,
} from '../../utils/trainingPlan';
import { videoUrlFor } from '../../utils/drillVideos';
import { parseDrillDesc } from '../../utils/drillText';
import { PlanDrill } from '../../data/types';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'DrillPlayer'>;
type Styles = ReturnType<typeof makeStyles>;

function drillInfo(pd: PlanDrill) {
  const catalog = allDrills.find((d) => d.id === pd.drill_id);
  const name = resolveDrillName(pd);
  const minutes = resolveDrillMinutes(pd);
  const skill = pd.custom_skill ?? catalog?.skill ?? '—';
  const { amac, aciklama } = catalog ? parseDrillDesc(catalog.desc) : { amac: null, aciklama: null };

  return { name, minutes, skill, amac, aciklama, catalog };
}

function DrillVideo({ url, s }: { url: string; s: Styles }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.play();
  });
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) player.pause();
  }, [isFocused, player]);
  return <VideoView style={s.heroVideo} player={player} allowsFullscreen nativeControls contentFit="cover" />;
}

export default function DrillPlayerScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { planId, phase, index } = route.params;
  const { data: plans = [] } = useTrainingPlans();
  const toggle = useToggleDrillComplete();
  const plan = plans.find((p) => p.id === planId);

  const [mode, setMode] = useState<'ready' | 'playing' | 'transition'>('ready');
  const [tab, setTab] = useState<'Açıklama' | 'Detaylar'>('Açıklama');

  const drills = useMemo(() => (plan ? drillsInPhase(plan, phase) : []), [plan, phase]);
  const pd = drills[index];
  const info = pd ? drillInfo(pd) : null;
  const videoUrl = pd ? videoUrlFor(pd.drill_id) : null;

  useEffect(() => {
    if (!pd) return;
    setMode('ready');
    setTab('Açıklama');
  }, [pd?.id]);

  if (!plan || !pd || !info) {
    return <View style={s.center}><ActivityIndicator color={colors.accent} size="large" /></View>;
  }

  const breakdown = buildPhaseBreakdown(plan, colors);
  const phaseIdx = breakdown.findIndex((p) => p.phase === phase);
  const phaseNum = phaseIdx + 1;
  const isLastInPhase = index === drills.length - 1;
  const nextPhase = breakdown[phaseIdx + 1];

  let nextInfo: { name: string; minutes: number } | null = null;
  if (!isLastInPhase) {
    const nextPd = drills[index + 1];
    nextInfo = { name: resolveDrillName(nextPd), minutes: resolveDrillMinutes(nextPd) };
  } else if (nextPhase && plan) {
    const nextDrills = drillsInPhase(plan, nextPhase.phase);
    if (nextDrills[0]) nextInfo = { name: resolveDrillName(nextDrills[0]), minutes: resolveDrillMinutes(nextDrills[0]) };
  }

  function finishCurrent() {
    toggle.mutate({ drillRowId: pd.id, completed: true });
    if (!nextInfo) {
      navigation.navigate('WorkoutComplete', { planId });
    } else {
      setMode('transition');
    }
  }

  function goNext() {
    if (!isLastInPhase) {
      navigation.push('DrillPlayer', { planId, phase, index: index + 1 });
    } else if (nextPhase) {
      navigation.navigate('PhaseSequence', { planId, phase: nextPhase.phase });
    } else {
      navigation.navigate('WorkoutComplete', { planId });
    }
  }

  if (mode === 'transition') {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="geri" size={18} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Sonraki Hareket</Text>
          <Text style={s.headerCount}>{phaseNum}/{drills.length}</Text>
        </View>

        <View style={s.transitionBody}>
          <View style={s.checkCircle}><Text style={s.checkTxt}>✓</Text></View>
          <Text style={s.transitionTitle}>Harika!</Text>
          <Text style={s.transitionDesc}>{info.name} tamamlandı.</Text>

          {nextInfo && (
            <View style={s.nextCard}>
              <Text style={s.nextLabel}>Sıradaki Hareket</Text>
              <View style={s.nextRow}>
                <View style={s.nextIconBox}><Icon name="antrenmanlar" size={18} /></View>
                <View>
                  <Text style={s.nextName}>{nextInfo.name}</Text>
                  <Text style={s.nextMeta}>{nextInfo.minutes} dakika</Text>
                </View>
              </View>
              <Text style={s.readyHint}>Hazır olduğunuzda başlatın.</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={s.viewAllBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PhaseSequence', { planId, phase, showAll: true })}
        >
          <Text style={s.viewAllBtnTxt}>Tüm Hareketleri Görüntüle</Text>
        </TouchableOpacity>

        <View style={s.footerRow}>
          <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
            <Text style={s.secondaryBtnTxt}>‹ Önceki Hareket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.primaryBtn, { flex: 1 }]} activeOpacity={0.85} onPress={goNext}>
            <Text style={s.primaryBtnTxt}>{nextInfo ? 'Sonraki Hareket ›' : 'Başlat'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{info.name}</Text>
        <Text style={s.headerCount}>{phaseNum}/{drills.length}</Text>
      </View>

      <View style={[s.heroCard, mode === 'playing' && s.heroCardActive]}>
        {videoUrl && <DrillVideo key={videoUrl} url={videoUrl} s={s} />}
        <View style={s.heroBody}>
          {!videoUrl && (
            <>
              <View style={s.heroBadge}>
                <Text style={s.heroBadgeTxt}>{info.minutes} dakika</Text>
              </View>
              <View style={s.heroIconCircle}>
                <PhaseIcon phase={phase} size={26} />
              </View>
            </>
          )}
          <Text style={s.heroName}>{info.name}</Text>
          {info.amac && <Text style={s.heroDesc}>{info.amac}</Text>}
        </View>
      </View>

      <View style={s.tabRow}>
        <TouchableOpacity style={[s.tab, tab === 'Açıklama' && s.tabActive]} onPress={() => setTab('Açıklama')}>
          <Text style={[s.tabTxt, tab === 'Açıklama' && s.tabTxtActive]}>Açıklama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === 'Detaylar' && s.tabActive]} onPress={() => setTab('Detaylar')}>
          <Text style={[s.tabTxt, tab === 'Detaylar' && s.tabTxtActive]}>Detaylar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'Açıklama' ? (
          <>
            {info.amac && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Drill Amacı</Text>
                <Text style={s.sectionBody}>{info.amac}</Text>
              </View>
            )}
            {info.aciklama && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Drill Açıklaması</Text>
                <Text style={s.sectionBody}>{info.aciklama}</Text>
              </View>
            )}
            {pd.note && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Not</Text>
                <Text style={s.sectionBody}>{pd.note}</Text>
              </View>
            )}
            {info.catalog && info.catalog.tags.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Anahtar Kelimeler</Text>
                <View style={s.tagsRow}>
                  {info.catalog.tags.map((tag) => (
                    <View key={tag} style={s.tagChip}>
                      <Text style={s.tagChipTxt}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={s.section}>
            <Text style={s.detailLine}>Beceri: {info.skill}</Text>
            <Text style={s.detailLine}>Süre: {info.minutes} dakika</Text>
            {info.catalog && <Text style={s.detailLine}>Seviye: {info.catalog.level}</Text>}
            {info.catalog && <Text style={s.detailLine}>Oyuncu: {info.catalog.players}</Text>}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={s.viewAllBtn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PhaseSequence', { planId, phase, showAll: true })}
      >
        <Text style={s.viewAllBtnTxt}>Tüm Hareketleri Görüntüle</Text>
      </TouchableOpacity>

      <View style={s.footerRow}>
        <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <Text style={s.secondaryBtnTxt}>‹ Önceki</Text>
        </TouchableOpacity>
        {mode === 'ready' ? (
          <TouchableOpacity style={[s.primaryBtn, { flex: 1 }]} activeOpacity={0.85} onPress={() => setMode('playing')}>
            <Text style={s.primaryBtnTxt}>Harika, Başlat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[s.primaryBtn, { flex: 1 }]} activeOpacity={0.85} onPress={finishCurrent}>
            <Text style={s.primaryBtnTxt}>Sonraki</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 8 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1 },
  headerCount: { color: colors.muted, fontSize: 13, fontWeight: '700' },

  heroCard: {
    marginHorizontal: 16, marginBottom: 14,
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  heroCardActive: { borderColor: colors.success, borderWidth: 2 },
  heroVideo: { width: '100%', height: 200, backgroundColor: '#000' },
  heroBody: { padding: 18, alignItems: 'center' },
  heroBadge: {
    position: 'absolute', top: 12, left: 12, backgroundColor: colors.cardAlt,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  heroBadgeTxt: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  heroIconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  heroIconTxt: { fontSize: 26 },
  heroName: { color: colors.foreground, fontSize: 17, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
  heroDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19 },

  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: { flex: 1, borderRadius: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingVertical: 10, alignItems: 'center' },
  tabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  tabTxt: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  tabTxtActive: { color: '#fff' },

  scroll: { paddingHorizontal: 16, paddingBottom: 10 },
  section: {
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: { color: colors.accent, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  sectionBody: { color: colors.foreground, fontSize: 14, lineHeight: 21 },
  detailLine: { color: colors.foreground, fontSize: 14, marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.cardAlt, borderRadius: 12 },
  tagChipTxt: { color: colors.muted, fontSize: 12 },

  viewAllBtn: {
    marginHorizontal: 16, marginBottom: 4,
    borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingVertical: 12, alignItems: 'center',
  },
  viewAllBtnTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  footerRow: { flexDirection: 'row', gap: 10, padding: 16, paddingTop: 0, borderTopWidth: 1, borderTopColor: colors.border },
  secondaryBtn: { borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center' },
  secondaryBtnTxt: { color: colors.foreground, fontSize: 15, fontWeight: '700' },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  transitionBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  checkCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: colors.success,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  checkTxt: { color: colors.success, fontSize: 30, fontWeight: '800' },
  transitionTitle: { color: colors.foreground, fontSize: 20, fontWeight: '800', marginBottom: 6 },
  transitionDesc: { color: colors.muted, fontSize: 14, marginBottom: 24 },

  nextCard: {
    width: '100%', backgroundColor: colors.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  nextLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  nextIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  nextIcon: { fontSize: 18 },
  nextName: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  nextMeta: { color: colors.muted, fontSize: 12 },
  readyHint: { color: colors.muted, fontSize: 12 },
  });
}