import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  total: number;
  current: number;
};

export default function StepProgressBar({ total, current }: Props) {
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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 20 },
  step: { flex: 1, height: 4, borderRadius: 2 },
  active: { backgroundColor: colors.accent },
  inactive: { backgroundColor: colors.border },
});
