import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaywallScreen from '../screens/paywall/PaywallScreen';
import LegalScreen from '../screens/legal/LegalScreen';
import DeleteAccountScreen from '../screens/dashboard/DeleteAccountScreen';
import { useTheme } from '../theme/ThemeContext';

export type PaywallStackParamList = {
  Paywall: undefined;
  Legal: { doc: 'kvkk' | 'privacy' | 'faq' };
  DeleteAccount: undefined;
};

const Stack = createNativeStackNavigator<PaywallStackParamList>();

/**
 * Abonelik yokken gorulen tek stack. Paywall'in yaninda yasal metinler ve hesap
 * silme de burada: Apple, odeme duvarinin arkasinda kalan kullanicinin da
 * gizlilik politikasina ve hesap silmeye erisebilmesini sart kosuyor.
 */
export default function PaywallStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    </Stack.Navigator>
  );
}
