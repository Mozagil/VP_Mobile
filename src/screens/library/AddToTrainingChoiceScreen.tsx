import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Drill } from '../../data/types';
import { coverFor, difficultyLabel } from '../../utils/drillCovers';
import { colors } from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type LibraryStackParamList = {
  DrillList: undefined;
  AddToTrainingChoice: { drill: Drill };
  AddToTraining: { drill: Drill };
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'AddToTrainingChoice'>;

export default function AddToTrainingChoiceScreen({ route, navigation }: Props) {
  const { drill } = route.params;

  const backToLibrary = () => navigation.navigate('DrillList');

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.closeBtn} onPress={backToLibrary} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.closeTxt}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Antrenmana Ekle</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.body}>
        <View style={s.previewCard}>
          <Image source={coverFor(drill.skill, drill.phase)} style={s.previewImg} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={s.previewName} numberOfLines={1}>{drill.name}</Text>
            <Text style={s.previewMeta}>{drill.skill} • {drill.players} Kişi</Text>
            <View style={s.previewMetaRow}>
              <Icon name="sure" size={12} />
              <Text style={s.previewMeta}>{drill.duration} • {difficultyLabel(drill.level)}</Text>
            </View>
          </View>
        </View>

        <Text style={s.question}>Nereye eklemek istersin?</Text>

        <TouchableOpacity
          style={s.option}
          activeOpacity={0.78}
          onPress={() => navigation.navigate('AddToTraining', { drill })}
        >
          <View style={s.iconBox}>
            <Text style={s.icon}>📋</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>Mevcut Bir Antrenmana Ekle</Text>
            <Text style={s.optionDesc}>Planlarındaki bir antrenmana bu çalışmayı ekle.</Text>
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
            <Text style={s.optionTitle}>Yeni Bir Antrenman Oluştur</Text>
            <Text style={s.optionDesc}>Bu çalışmayla birlikte sıfırdan yeni bir antrenman oluştur.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.cancelBtn} activeOpacity={0.8} onPress={backToLibrary}>
          <Text style={s.cancelBtnTxt}>İptal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
