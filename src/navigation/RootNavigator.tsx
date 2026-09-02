import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { usePurchases } from '../purchases/PurchasesContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import PaywallStack from './PaywallStack';
import { useTheme } from '../theme/ThemeContext';

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { ready: purchasesReady, isPro } = usePurchases();
  const { colors } = useTheme();

  // Abonelik durumu okunmadan karar verme: aksi halde abone kullanici acilista
  // bir an paywall goruyor.
  if (loading || (user && !purchasesReady)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : isPro ? <AppTabs /> : <PaywallStack />}
    </NavigationContainer>
  );
}
