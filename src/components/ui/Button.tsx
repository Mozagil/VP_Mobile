import React, { useMemo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.accent} size="small" />
      ) : (
        <Text style={[styles.text, variant !== 'primary' && styles.textOutline]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    base: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
    },
    primary: { backgroundColor: colors.accent },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent },
    ghost: { backgroundColor: 'transparent' },
    disabled: { opacity: 0.5 },
    text: { color: '#fff', fontSize: 16, fontWeight: '600' },
    textOutline: { color: colors.accent },
  });
}
