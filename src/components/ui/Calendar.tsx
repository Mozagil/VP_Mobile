import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { weekdayLabels } from '../../utils/trainingPlan';
import { useI18n, MONTHS } from '../../i18n';

function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

type Props = {
  markedDates: Set<string>;
  dots?: Record<string, string[]>;
  onDayPress?: (dateKey: string) => void;
  disablePast?: boolean;
  selectedDate?: string | null;
};

const MAX_DOTS = 6;

export default function Calendar({ markedDates, dots, onDayPress, disablePast, selectedDate }: Props) {
  const { colors } = useTheme();
  const { lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const today = new Date();
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const leadingBlanks = (firstDay + 6) % 7; // Monday-first offset
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<number | null> = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrev = () => setCursor(new Date(year, month - 1, 1));
  const goNext = () => setCursor(new Date(year, month + 1, 1));

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <TouchableOpacity onPress={goPrev} style={s.navBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.navTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>{MONTHS[lang][month]} {year}</Text>
        <TouchableOpacity onPress={goNext} style={s.navBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.navTxt}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={s.weekRow}>
        {weekdayLabels(lang).map((label) => (
          <Text key={label} style={s.weekLabel}>{label}</Text>
        ))}
      </View>

      <View style={s.grid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={i} style={s.cell} />;
          const key = toKey(year, month, day);
          const dayDots = (dots?.[key] ?? []).slice(0, MAX_DOTS);
          const isToday = key === todayKey;
          const isPast = disablePast && key < todayKey;
          const isSelected = selectedDate === key && !isToday;
          return (
            <TouchableOpacity
              key={i}
              style={s.cell}
              activeOpacity={onDayPress && !isPast ? 0.7 : 1}
              onPress={() => !isPast && onDayPress?.(key)}
              disabled={!onDayPress || isPast}
            >
              <View style={[s.dayDot, isToday && s.dayDotToday, isSelected && s.dayDotSelected]}>
                <Text style={[s.dayTxt, (isToday || isSelected) && s.dayTxtToday, isPast && s.dayTxtPast]}>{day}</Text>
              </View>
              <View style={s.dotsRow}>
                {dayDots.map((c, idx) => (
                  <View key={idx} style={[s.miniDot, { backgroundColor: c }]} />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const CELL = `${100 / 7}%` as const;

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    wrap: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    navBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
    navTxt: { color: colors.accent, fontSize: 20, fontWeight: '700' },
    title: { color: colors.foreground, fontSize: 15, fontWeight: '700' },

    weekRow: { flexDirection: 'row', marginBottom: 6 },
    weekLabel: { width: CELL, textAlign: 'center', color: colors.muted, fontSize: 11, fontWeight: '600' },

    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: CELL, height: 52, alignItems: 'center', justifyContent: 'flex-start', marginBottom: 2, position: 'relative' },
    dayDot: {
      width: 28, height: 28, borderRadius: 14,
      alignItems: 'center', justifyContent: 'center',
    },
    dayDotToday: { backgroundColor: colors.blue },
    dayDotSelected: { backgroundColor: colors.accent },
    dayTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
    dayTxtToday: { color: '#fff', fontWeight: '800' },
    dayTxtPast: { color: colors.border },
    dotsRow: {
      flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
      gap: 3, marginTop: 3, width: 34,
    },
    miniDot: { width: 5, height: 5, borderRadius: 2.5, marginBottom: 2 },
  });
}
