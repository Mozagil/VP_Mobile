import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
};

export default function Slider({ min, max, step = 1, value, onChange, formatValue }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const trackRef = useRef<View>(null);
  const widthRef = useRef(0);
  const pageXRef = useRef(0);

  const onLayout = (_e: LayoutChangeEvent) => {
    trackRef.current?.measure((_x, _y, width, _height, pageX) => {
      widthRef.current = width;
      pageXRef.current = pageX;
    });
  };

  const valueFromPageX = (pageX: number) => {
    const w = widthRef.current;
    if (w <= 0) return value;
    const x = pageX - pageXRef.current;
    const pct = Math.max(0, Math.min(1, x / w));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => onChange(valueFromPageX(evt.nativeEvent.pageX)),
      onPanResponderMove: (evt) => onChange(valueFromPageX(evt.nativeEvent.pageX)),
    }),
  ).current;

  const pct = max > min ? (value - min) / (max - min) : 0;

  return (
    <View>
      <View ref={trackRef} style={s.track} onLayout={onLayout} {...panResponder.panHandlers}>
        <View style={s.baseLine} />
        <View style={[s.fill, { width: `${pct * 100}%` }]} />
        <View style={[s.thumb, { left: `${pct * 100}%` }]} />
      </View>
      <View style={s.labelsRow}>
        <Text style={s.labelTxt}>{formatValue ? formatValue(min) : min}</Text>
        <Text style={s.labelTxt}>{formatValue ? formatValue(max) : max}</Text>
      </View>
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    track: {
      height: 30, justifyContent: 'center', marginVertical: 10,
    },
    baseLine: { position: 'absolute', left: 0, right: 0, top: 12, height: 6, backgroundColor: colors.border, borderRadius: 3 },
    fill: { position: 'absolute', left: 0, top: 12, height: 6, backgroundColor: colors.accent, borderRadius: 3 },
    thumb: {
      position: 'absolute', top: 3, width: 24, height: 24, borderRadius: 12,
      backgroundColor: colors.accent, marginLeft: -12,
      borderWidth: 3, borderColor: colors.background,
    },
    labelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    labelTxt: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  });
}
