import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Drill } from '../data/types';
import Badge from './ui/Badge';
import { colors } from '../theme/colors';

const phaseColor = (phase: string) => {
  if (phase === 'Isınma') return colors.phaseIsınma;
  if (phase === 'Soğuma') return colors.phaseSoğuma;
  if (phase === 'Oyun') return colors.phaseOyun;
  return colors.accent;
};

type Props = {
  drill: Drill;
  onPress: (drill: Drill) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (drill: Drill) => void;
};

export default function DrillCard({ drill, onPress, isFavorite, onToggleFavorite }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(drill)} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>{drill.name}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.duration}>{drill.duration}</Text>
          {onToggleFavorite !== undefined && (
            <TouchableOpacity
              onPress={() => onToggleFavorite(drill)}
              style={styles.favBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.badges}>
        <Badge label={drill.phase} color={phaseColor(drill.phase)} />
        <View style={{ width: 6 }} />
        <Badge label={drill.skill} color={colors.purple} />
        <View style={{ width: 6 }} />
        <Badge label={drill.level} color={colors.muted} />
      </View>
      <Text style={styles.players}>👥 {drill.players} oyuncu</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: { color: colors.foreground, fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  duration: { color: colors.muted, fontSize: 12 },
  favBtn: { padding: 2 },
  favIcon: { fontSize: 18 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  players: { color: colors.muted, fontSize: 12 },
});
