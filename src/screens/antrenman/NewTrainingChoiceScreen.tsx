import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';

type Props = { navigation: NativeStackNavigationProp<AntrenmanStackParamList, 'NewTrainingChoice'> };

export default function NewTrainingChoiceScreen({ navigation }: Props) {
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
        <Text style={s.headerTitle}>Yeni Antrenman</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.body}>
        <Text style={s.question}>Nasıl bir antrenman oluşturmak istersin?</Text>

        <TouchableOpacity
          style={s.option}
          activeOpacity={0.78}
          onPress={() => navigation.navigate('CreatePlan')}
        >
          <View style={[s.iconBox, { backgroundColor: colors.accent + '20' }]}>
            <Text style={s.icon}>📋</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>Kendi Antrenmanını Oluştur</Text>
            <Text style={s.optionDesc}>Hareketleri kendin seç, kendi antrenmanını oluştur.</Text>
          </View>
          <Text style={s.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.option}
          activeOpacity={0.78}
          onPress={() => navigation.getParent()?.navigate('ÖzelliklerStack' as any, { screen: 'AIWizard' } as any)}
        >
          <View style={[s.iconBox, { backgroundColor: colors.blue + '20' }]}>
            <Text style={s.icon}>🤖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.optionTitle}>AI ile Antrenman Oluştur</Text>
            <Text style={s.optionDesc}>Hedeflerine uygun, sana özel antrenman oluşturalım.</Text>
          </View>
          <Text style={s.arrow}>›</Text>
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
