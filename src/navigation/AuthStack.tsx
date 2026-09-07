import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LegalScreen from '../screens/legal/LegalScreen';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import type { LegalDocKey } from '../data/legalTexts';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  // Kayit ekranindaki onay kutulari metinlere baglaniyor; kullanici hesap
  // acmadan once sartlari okuyabilmeli.
  Legal: { doc: LegalDocKey };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t('nav.register') }} />
      <Stack.Screen name="Legal" component={LegalScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
