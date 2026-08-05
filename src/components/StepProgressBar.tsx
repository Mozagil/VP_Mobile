import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../theme/palettes';

type Props = {
  total: number;
  current: number;
};

export default function StepProgressBar({ total, current }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            { marginRight: i < total - 1 ? 6 : 0 },
            i <= current ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', marginBottom: 20 },
    step: { flex: 1, height: 4, borderRadius: 2 },
    active: { backgroundColor: colors.accent },
    inactive: { backgroundColor: colors.border },
  });
}
