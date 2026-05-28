import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Drill } from '../../data/types';

type LibraryStackParamList = {
  DrillList: undefined;
  DrillDetail: { drill: Drill };
};
import Badge from '../../components/ui/Badge';
import { colors } from '../../theme/colors';

const phaseColor = (phase: string) => {
  if (phase === 'Isınma') return colors.phaseIsınma;
  if (phase === 'Soğuma') return colors.phaseSoğuma;
  if (phase === 'Oyun') return colors.phaseOyun;
  return colors.accent;
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'DrillDetail'>;

export default function DrillDetailScreen({ route }: Props) {
  const { drill } = route.params;

  const sections = drill.desc.split('\n\n').filter(Boolean);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.name}>{drill.name}</Text>

        <View style={styles.badges}>
          <Badge label={drill.phase} color={phaseColor(drill.phase)} />
          <View style={{ width: 6 }} />
          <Badge label={drill.skill} color={colors.purple} />
          <View style={{ width: 6 }} />
          <Badge label={drill.level} color={colors.muted} />
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱</Text>
            <Text style={styles.metaText}>{drill.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>👥</Text>
            <Text style={styles.metaText}>{drill.players} oyuncu</Text>
          </View>
        </View>

        {sections.map((section, i) => {
          const lines = section.split('\n');
          const heading = lines[0];
          const body = lines.slice(1).join('\n');
          return (
            <View key={i} style={styles.section}>
              <Text style={styles.sectionHeading}>{heading}</Text>
              {body ? <Text style={styles.sectionBody}>{body}</Text> : null}
            </View>
          );
        })}

        <View style={styles.tagsRow}>
          {drill.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  name: { color: colors.foreground, fontSize: 22, fontWeight: '700', marginBottom: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  meta: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIcon: { fontSize: 18 },
  metaText: { color: colors.muted, fontSize: 14 },
  section: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: { color: colors.accent, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  sectionBody: { color: colors.foreground, fontSize: 14, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
  },
  tagText: { color: colors.muted, fontSize: 12 },
});
