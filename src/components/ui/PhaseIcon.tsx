import React from 'react';
import { Text, TextStyle } from 'react-native';
import Icon, { IconName } from './Icon';
import { phaseDisplay } from '../../utils/trainingPlan';

// Renders a phase's icon as an SVG when the phase has one mapped, falling back to
// its emoji otherwise. Keeps every phase-icon render site in the app consistent.
type Props = { phase: string; size?: number; emojiStyle?: TextStyle };

export default function PhaseIcon({ phase, size = 16, emojiStyle }: Props) {
  const display = phaseDisplay[phase];
  if (display?.iconName) {
    return <Icon name={display.iconName as IconName} size={size} />;
  }
  return <Text style={[{ fontSize: size }, emojiStyle]}>{display?.icon ?? '🏐'}</Text>;
}
