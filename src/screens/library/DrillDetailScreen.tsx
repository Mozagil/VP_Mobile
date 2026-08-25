import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Drill } from '../../data/types';
import { useFavorites } from '../../hooks/useFavorites';
import { coverFor, difficultyLabel } from '../../utils/drillCovers';
import { useI18n, useContent, skillLabel } from '../../i18n';
import { videoUrlFor } from '../../utils/drillVideos';
import { parseDrillDesc } from '../../utils/drillText';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Icon from '../../components/ui/Icon';

type LibraryStackParamList = {
  DrillList: undefined;
  DrillDetail: { drill: Drill; targetPlanId?: string };
  AddToTrainingChoice: { drill: Drill };
  PlanDrillSettings: { drill: Drill; planId: string };
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'DrillDetail'>;
type Styles = ReturnType<typeof makeStyles>;

function DrillVideo({ url, s }: { url: string; s: Styles }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
  });
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) player.pause();
  }, [isFocused, player]);
  return <VideoView style={s.image} player={player} allowsFullscreen nativeControls contentFit="cover" />;
}

export default function DrillDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { drillName, drillDesc, drillTags } = useContent();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { drill, targetPlanId } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const videoUrl = videoUrlFor(drill.id);
  const { amac, aciklama } = parseDrillDesc(drillDesc(drill));
  const tags = drillTags(drill);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <View style={s.imageWrap}>
          {videoUrl ? (
            <DrillVideo url={videoUrl} s={s} />
          ) : (
            <Image source={coverFor(drill.skill, drill.phase, drill.id)} style={s.image} resizeMode="cover" />
          )}
          <TouchableOpacity
            style={s.favBtn}
            onPress={() => toggleFavorite(drill.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="favori" size={16} opacity={isFavorite(drill.id) ? 1 : 0.35} />
          </TouchableOpacity>
        </View>

        <Text style={s.name}>{drillName(drill)}</Text>
        <Text style={s.meta}>{skillLabel(drill.skill, lang)} • {t('common.playerCount', { n: drill.players })}</Text>
        <View style={s.metaRow}>
          <Icon name="sure" size={13} />
          <Text style={s.metaChip}>{drill.duration}</Text>
          <View style={s.diffBadge}>
            <Text style={s.diffBadgeTxt}>{difficultyLabel(drill.level, lang)}</Text>
          </View>
        </View>

        {amac && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t('library.drillGoal')}</Text>
            <Text style={s.sectionBody}>{amac}</Text>
          </View>
        )}

        {aciklama && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t('library.drillDescription')}</Text>
            <Text style={s.sectionBody}>{aciklama}</Text>
          </View>
        )}

        {tags.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t('library.keywords')}</Text>
            <View style={s.tagsRow}>
              {tags.map((tag) => (
                <View key={tag} style={s.tag}>
                  <Text style={s.tagTxt}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.addBtn}
          activeOpacity={0.85}
          // Belirli bir programa hareket eklemek icin gelindiyse hangi programa
          // eklenecegi zaten belli; plan secme adimlari atlanir.
          onPress={() => (targetPlanId
            ? navigation.navigate('PlanDrillSettings', { drill, planId: targetPlanId })
            : navigation.navigate('AddToTrainingChoice', { drill }))}
        >
          <Text style={s.addBtnTxt}>{t('library.addToTraining')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 20 },

  imageWrap: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, overflow: 'hidden', marginBottom: 16, position: 'relative' },
  image: { width: '100%', height: '100%' },
  favBtn: {
    position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  favIcon: { fontSize: 16 },

  name: { color: colors.foreground, fontSize: 20, fontWeight: '800', marginBottom: 4 },
  meta: { color: colors.muted, fontSize: 13, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  metaChip: { color: colors.muted, fontSize: 13 },
  diffBadge: { backgroundColor: colors.accent + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  diffBadgeTxt: { color: colors.accent, fontSize: 12, fontWeight: '700' },

  section: {
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: { color: colors.accent, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  sectionBody: { color: colors.foreground, fontSize: 14, lineHeight: 22 },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.cardAlt, borderRadius: 12 },
  tagTxt: { color: colors.muted, fontSize: 12 },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  addBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  addBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
