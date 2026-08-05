import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import Icon from '../../components/ui/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';

type Props = { navigation: NativeStackNavigationProp<any> };

export default function LogoutScreen({ navigation }: Props) {
  const { signOut } = useAuth() as any;
  const { colors } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="geri" size={20} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Çıkış Yap</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={s.body}>
        <View style={s.iconCircle}>
          <Icon name="cikis" size={44} />
        </View>

        <Text style={s.title}>Çıkış yapmak istediğine emin misin?</Text>
        <Text style={s.subtitle}>
          Tekrar giriş yapmak için e-posta adresin{'\n'}ve şifren yeterli olacak.
        </Text>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={() => signOut?.()}>
          <Text style={s.primaryBtnTxt}>Çıkış Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Text style={s.cancelTxt}>İptal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  title: { color: colors.foreground, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19 },

  footer: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnTxt: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', paddingVertical: 6 },
  cancelTxt: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  });
}
