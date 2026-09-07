import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { useI18n } from '../../i18n';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';

type Props = NativeStackScreenProps<AntrenmanStackParamList, 'TrainingSuccess'>;

export default function TrainingSuccessScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { planId, planName, drillName } = route.params;

  const goToStart = () => {
    navigation.replace('StartTraining', { planId });
  };

  const goDone = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.body}>
        <View style={s.checkCircle}>
          <Text style={s.checkTxt}>✓</Text>
        </View>
        <Text style={s.title}>{t('addToTraining.successTitle')}</Text>
        {/* Bir dril eklendiginde hangi dril oldugu yaziliyor. AI sihirbazi
            butun antrenmani olusturdugu icin dril adi gondermiyor; orada
            antrenmanin kendi adi gosteriliyor. */}
        <Text style={s.desc}>
          {drillName
            ? t('addToTraining.successBody', { drill: drillName, plan: planName })
            : t('addToTraining.successBodyPlan', { plan: planName })}
        </Text>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={goToStart}>
          <Text style={s.primaryBtnTxt}>{t('addToTraining.viewTraining')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.textBtn} activeOpacity={0.7} onPress={goDone}>
          <Text style={s.textBtnTxt}>{t('common.ok')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  checkCircle: {
    width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  checkTxt: { color: colors.accent, fontSize: 36, fontWeight: '800' },
  title: { color: colors.foreground, fontSize: 20, fontWeight: '800', marginBottom: 10 },
  desc: { color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 21 },

  footer: { padding: 16 },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  textBtn: { paddingVertical: 14, alignItems: 'center' },
  textBtnTxt: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  });
}
