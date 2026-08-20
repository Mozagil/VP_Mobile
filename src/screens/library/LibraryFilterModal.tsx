import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { FULL_CATEGORIES, DIFFICULTIES, PLAYER_COUNTS } from '../../utils/libraryFilters';
import Slider from '../../components/ui/Slider';
import { useI18n, libCategoryLabel, difficultyLabel, playersLabel } from '../../i18n';

export type LibraryFilters = {
  categories: string[];
  difficulties: string[];
  playerCounts: string[];
  maxDuration: number;
};

export const DEFAULT_FILTERS: LibraryFilters = {
  categories: [], difficulties: [], playerCounts: [], maxDuration: 60,
};

type Props = {
  visible: boolean;
  filters: LibraryFilters;
  onApply: (f: LibraryFilters) => void;
  onClose: () => void;
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function LibraryFilterModal({ visible, filters, onApply, onClose }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [draft, setDraft] = useState<LibraryFilters>(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  const clear = () => setDraft(DEFAULT_FILTERS);

  const apply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.title}>{t('sozluk.filterTitle')}</Text>
            <TouchableOpacity onPress={clear}>
              <Text style={s.clearLink}>{t('sozluk.filter.clear')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.sectionTitle}>{t('library.filter.categories')}</Text>
          <View style={s.chipsRow}>
            {FULL_CATEGORIES.map((c) => {
              const active = draft.categories.includes(c);
              return (
                <TouchableOpacity
                  key={c}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => setDraft((d) => ({ ...d, categories: toggle(d.categories, c) }))}
                  activeOpacity={0.8}
                >
                  <Text style={[s.chipTxt, active && s.chipTxtActive]}>{libCategoryLabel(c, lang)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.sectionTitle}>{t('library.filter.difficultyLevel')}</Text>
          <View style={s.chipsRow}>
            {DIFFICULTIES.map((d) => {
              const active = draft.difficulties.includes(d);
              return (
                <TouchableOpacity
                  key={d}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => setDraft((prev) => ({ ...prev, difficulties: toggle(prev.difficulties, d) }))}
                  activeOpacity={0.8}
                >
                  <Text style={[s.chipTxt, active && s.chipTxtActive]}>{difficultyLabel(d, lang)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.sectionTitle}>{t('library.filter.playerCount')}</Text>
          <View style={s.chipsRow}>
            {PLAYER_COUNTS.map((p) => {
              const active = draft.playerCounts.includes(p);
              return (
                <TouchableOpacity
                  key={p}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => setDraft((prev) => ({ ...prev, playerCounts: toggle(prev.playerCounts, p) }))}
                  activeOpacity={0.8}
                >
                  <Text style={[s.chipTxt, active && s.chipTxtActive]}>{playersLabel(p, lang)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.sectionTitle}>{t('library.filter.duration')}</Text>
          <Slider
            min={5} max={60} step={5}
            value={draft.maxDuration}
            onChange={(v) => setDraft((prev) => ({ ...prev, maxDuration: v }))}
            formatValue={(v) => (v >= 60 ? t('library.filter.maxDurationPlus') : t('library.filter.maxDuration', { n: v }))}
          />

          <TouchableOpacity style={s.applyBtn} onPress={apply} activeOpacity={0.85}>
            <Text style={s.applyBtnTxt}>{t('sozluk.filter.apply')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: colors.foreground, fontSize: 17, fontWeight: '800' },
  clearLink: { color: colors.accent, fontSize: 13, fontWeight: '700' },

  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginTop: 14, marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accent },
  chipTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },

  applyBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 22 },
  applyBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
