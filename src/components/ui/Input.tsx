import React, { useMemo } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, style, ...props }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    wrapper: { marginBottom: 16 },
    label: { color: colors.foreground, fontSize: 14, fontWeight: '500', marginBottom: 6 },
    input: {
      backgroundColor: colors.card,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
    },
    inputError: { borderColor: colors.error },
    error: { color: colors.error, fontSize: 12, marginTop: 4 },
  });
}
