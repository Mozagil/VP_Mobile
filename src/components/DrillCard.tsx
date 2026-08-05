import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Drill } from '../data/types';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../theme/palettes';
import { coverFor, difficultyLabel } from '../utils/drillCovers';
import Icon from './ui/Icon';

type Props = {
  drill: Drill;
  onPress: (drill: Drill) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (drill: Drill) => void;
};

export default function DrillCard({ drill, onPress, isFavorite, onToggleFavorite }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  return (
    <TouchableOpacity style={s.card} onPress={() => onPress(drill)} activeOpacity={0.8}>
      <View style={s.thumbWrap}>
        <Image source={coverFor(drill.skill, drill.phase, drill.id)} style={s.thumb} resizeMode="cover" />
        {onToggleFavorite !== undefined && (
          <TouchableOpacity
            onPress={() => onToggleFavorite(drill)}
            style={s.favBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="favori" size={15} opacity={isFavorite ? 1 : 0.35} />
          </TouchableOpacity>
        )}
      </View>

      <View style={s.body}>
        <Text style={s.name} numberOfLines={2}>{drill.name}</Text>
        <Text style={s.meta}>{drill.skill} • {drill.players} Kişi</Text>
        <View style={s.footerRow}>
          <View style={s.durationRow}>
            <Icon name="sure" size={12} />
            <Text style={s.duration}>{drill.duration}</Text>
          </View>
          <View style={s.diffBadge}>
            <Text style={s.diffBadgeTxt}>{difficultyLabel(drill.level)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row', gap: 12,
      backgroundColor: colors.card, borderRadius: 14, padding: 10, marginBottom: 10,
      borderWidth: 1, borderColor: colors.border,
    },
    thumbWrap: { width: 84, height: 84, borderRadius: 10, overflow: 'hidden', position: 'relative' },
    thumb: { width: '100%', height: '100%' },
    favBtn: { position: 'absolute', top: 4, right: 4 },
    favIcon: { fontSize: 16 },

    body: { flex: 1, justifyContent: 'center' },
    name: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 4 },
    meta: { color: colors.muted, fontSize: 12, marginBottom: 6 },
    footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    duration: { color: colors.muted, fontSize: 12 },
    diffBadge: { backgroundColor: colors.accent + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
    diffBadgeTxt: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  });
}
