import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Calendar from './Calendar';

type Props = {
  selectedDate: string | null;
  onSelectDate: (dateKey: string) => void;
  time: string;
  onTimeChange: (t: string) => void;
  durationMinutes: number;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];

function addMinutes(hhmm: string, minutes: number): string | null {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const total = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + minutes;
  const h = Math.floor((total % (24 * 60)) / 60);
  const mm = total % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function getRoundedCurrentTime(): string {
  const now = new Date();
  let h = now.getHours();
  let m = Math.ceil(now.getMinutes() / 10) * 10;
  if (m === 60) { m = 0; h = (h + 1) % 24; }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function parseTime(hhmm: string): { h: string; m: string } {
  const match = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return parseTime(getRoundedCurrentTime());
  const h = match[1].padStart(2, '0');
  const nearestMin = MINUTES.reduce((best, cur) =>
    Math.abs(parseInt(cur, 10) - parseInt(match[2], 10)) < Math.abs(parseInt(best, 10) - parseInt(match[2], 10)) ? cur : best,
  MINUTES[0]);
  return { h, m: nearestMin };
}

export default function ScheduleStep({ selectedDate, onSelectDate, time, onTimeChange, durationMinutes }: Props) {
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const markedDates = useMemo(() => new Set(selectedDate ? [selectedDate] : []), [selectedDate]);
  const endTime = addMinutes(time, durationMinutes);
  const [showPicker, setShowPicker] = useState(false);
  const parsed = parseTime(time);
  const [draftHour, setDraftHour] = useState(parsed.h);
  const [draftMinute, setDraftMinute] = useState(parsed.m);

  const openPicker = () => {
    const p = parseTime(time);
    setDraftHour(p.h);
    setDraftMinute(p.m);
    setShowPicker(true);
  };

  const confirm = () => {
    onTimeChange(`${draftHour}:${draftMinute}`);
    setShowPicker(false);
  };

  return (
    <View>
      <Text style={s.fieldLabel}>Tarih Seç</Text>
      <Calendar markedDates={markedDates} onDayPress={onSelectDate} disablePast selectedDate={selectedDate} />

      <Text style={s.fieldLabel}>Saat</Text>
      <TouchableOpacity style={s.timeBtn} activeOpacity={0.8} onPress={openPicker}>
        <Text style={s.timeBtnTxt}>{time || getRoundedCurrentTime()}</Text>
        <Text style={s.timeBtnArrow}>▾</Text>
      </TouchableOpacity>

      {selectedDate && (
        <Text style={s.hint}>
          Bu antrenman yaklaşık {durationMinutes} dakika sürecek{endTime ? ` (${time} – ${endTime})` : ''}.
        </Text>
      )}

      <Modal visible={showPicker} animationType="slide" transparent onRequestClose={() => setShowPicker(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Saat Seç</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)} style={s.closeBtn}>
                <Text style={s.closeTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={s.columnsRow}>
              <View style={s.column}>
                <Text style={s.columnLabel}>Saat</Text>
                <ScrollView style={s.columnScroll} showsVerticalScrollIndicator={false}>
                  {HOURS.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[s.optionRow, draftHour === h && s.optionRowActive]}
                      onPress={() => setDraftHour(h)}
                    >
                      <Text style={[s.optionTxt, draftHour === h && s.optionTxtActive]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={s.colon}>:</Text>

              <View style={s.column}>
                <Text style={s.columnLabel}>Dakika</Text>
                <ScrollView style={s.columnScroll} showsVerticalScrollIndicator={false}>
                  {MINUTES.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[s.optionRow, draftMinute === m && s.optionRowActive]}
                      onPress={() => setDraftMinute(m)}
                    >
                      <Text style={[s.optionTxt, draftMinute === m && s.optionTxtActive]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={s.confirmBtn} activeOpacity={0.85} onPress={confirm}>
              <Text style={s.confirmBtnTxt}>Tamam ({draftHour}:{draftMinute})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    fieldLabel: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginTop: 18, marginBottom: 8 },
    hint: { color: colors.muted, fontSize: 12, marginTop: 10 },

    timeBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
      borderWidth: 1, borderColor: colors.border,
    },
    timeBtnTxt: { color: colors.foreground, fontSize: 15, fontWeight: '700' },
    timeBtnArrow: { color: colors.muted, fontSize: 14 },

    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    sheetTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800' },
    closeBtn: {
      width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
    },
    closeTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

    columnsRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 10 },
    column: { flex: 1, maxWidth: 120 },
    columnLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
    columnScroll: { height: 220, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
    colon: { color: colors.foreground, fontSize: 22, fontWeight: '800', marginTop: 28 },

    optionRow: { paddingVertical: 12, alignItems: 'center' },
    optionRowActive: { backgroundColor: colors.accent + '25' },
    optionTxt: { color: colors.foreground, fontSize: 15, fontWeight: '600' },
    optionTxtActive: { color: colors.accent, fontWeight: '800' },

    confirmBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
    confirmBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
