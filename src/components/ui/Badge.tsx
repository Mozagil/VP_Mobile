import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = {
  label: string;
  color?: string;
};

export default function Badge({ label, color }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const resolvedColor = color ?? colors.accent;
  return (
    <View style={[styles.badge, { backgroundColor: resolvedColor + '25', borderColor: resolvedColor + '60' }]}>
      <Text style={[styles.text, { color: resolvedColor }]}>{label}</Text>
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    text: { fontSize: 11, fontWeight: '600' },
  });
}
