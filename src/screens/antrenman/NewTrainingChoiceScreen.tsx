import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import Icon from '../../components/ui/Icon';

type Props = { navigation: NativeStackNavigationProp<AntrenmanStackParamList, 'NewTrainingChoice'> };

export default function NewTrainingChoiceScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.closeTxt}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('newTraining.title')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.body}>
        <Text style={s.question}>{t('newTraining.question')}</Text>

        <TouchableOpacity
          style={s.option}
          activeOpacity={0.78}
          onPress={() => navigation.navigate('CreatePlan')}
        >
          <View style={[s.iconBox, { backgroundColor: colors.accent + '20' }]}>
            <Icon name="antrenmanlar" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>{t('newTraining.ownTitle')}</Text>
            <Text style={s.optionDesc}>{t('newTraining.ownDesc')}</Text>
          </View>
          <Text style={s.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.option}
          activeOpacity={0.78}
          onPress={() => {
            // iOS'ta bu ekran native modal olarak sunuldugu icin, modal kapatilmadan
            // alttaki tab degistirilirse ekran degismis gibi gorunmuyor. Once modal
            // kapatilip sonra AI sihirbazina geciliyor.
            const parent = navigation.getParent();
            navigation.goBack();
            parent?.navigate('ÖzelliklerStack' as any, { screen: 'AIWizard' } as any);
          }}
        >
          <View style={[s.iconBox, { backgroundColor: colors.blue + '20' }]}>
            <Icon name="ai-koc" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>{t('newTraining.aiTitle')}</Text>
            <Text style={s.optionDesc}>{t('newTraining.aiDesc')}</Text>
          </View>
          <Text style={s.arrow}>›</Text>
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
  headerTitle: { color: colors.foreground, fontSize: 18, fontWeight: '800' },

  body: { padding: 16 },
  question: { color: colors.foreground, fontSize: 16, fontWeight: '700', marginBottom: 20 },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  iconBox: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22 },
  optionTitle: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  optionDesc: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  arrow: { color: colors.muted, fontSize: 22 },
  });
}
