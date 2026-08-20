import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Drill } from '../../data/types';
import { coverFor, difficultyLabel } from '../../utils/drillCovers';
import { useI18n, useContent, skillLabel } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import Icon from '../../components/ui/Icon';

type LibraryStackParamList = {
  DrillList: undefined;
  AddToTrainingChoice: { drill: Drill };
  AddToTraining: { drill: Drill };
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'AddToTrainingChoice'>;

export default function AddToTrainingChoiceScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { drillName } = useContent();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { drill } = route.params;

  const backToLibrary = () => navigation.navigate('DrillList');

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn} onPress={backToLibrary} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.closeTxt}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('addToTraining.title')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.body}>
        <View style={s.previewCard}>
          <Image source={coverFor(drill.skill, drill.phase, drill.id)} style={s.previewImg} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={s.previewName} numberOfLines={1}>{drillName(drill)}</Text>
            <Text style={s.previewMeta}>{skillLabel(drill.skill, lang)} • {t('common.playerCount', { n: drill.players })}</Text>
            <View style={s.previewMetaRow}>
              <Icon name="sure" size={12} />
              <Text style={s.previewMeta}>{drill.duration} • {difficultyLabel(drill.level, lang)}</Text>
            </View>
          </View>
        </View>

        <Text style={s.question}>{t('addToTraining.question')}</Text>

        <TouchableOpacity
          style={s.option}
          activeOpacity={0.78}
          onPress={() => navigation.navigate('AddToTraining', { drill })}
        >
          <View style={s.iconBox}>
            <Icon name="antrenmanlar" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>{t('addToTraining.choice.existingTitle')}</Text>
            <Text style={s.optionDesc}>{t('addToTraining.choice.existingDesc')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.option, { marginTop: 12 }]}
          activeOpacity={0.78}
          onPress={() => navigation.getParent()?.navigate('AntrenmanStack' as any, { screen: 'NewTrainingChoice' } as any)}
        >
          <View style={[s.iconBox, { backgroundColor: colors.blue + '20' }]}>
            <Text style={s.icon}>➕</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>{t('addToTraining.choice.newTitle')}</Text>
            <Text style={s.optionDesc}>{t('addToTraining.choice.newDesc')}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.cancelBtn} activeOpacity={0.8} onPress={backToLibrary}>
          <Text style={s.cancelBtnTxt}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 18, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },

  body: { padding: 16, flex: 1 },
  previewCard: {
    flexDirection: 'row', gap: 12, alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 14, padding: 12, marginBottom: 24,
    borderWidth: 1, borderColor: colors.border,
  },
  previewImg: { width: 56, height: 56, borderRadius: 10 },
  previewName: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  previewMeta: { color: colors.muted, fontSize: 12 },
  previewMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  question: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 14 },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accent + '20', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  optionTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  optionDesc: { color: colors.muted, fontSize: 12, lineHeight: 17 },

  footer: { padding: 16 },
  cancelBtn: { paddingVertical: 14, alignItems: 'center' },
  cancelBtnTxt: { color: colors.muted, fontSize: 15, fontWeight: '600' },
  });
}
