import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useTheme } from '../theme/ThemeContext';

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
