import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { SozlukTerm } from '../data/sozlukTerms';
import SozlukScreen from '../screens/sozluk/SozlukScreen';
import FavoriTerimlerScreen from '../screens/sozluk/FavoriTerimlerScreen';
import SozlukFilterScreen from '../screens/sozluk/SozlukFilterScreen';
import TermDetailScreen from '../screens/sozluk/TermDetailScreen';

export type SortBy = 'az' | 'za';

export type SozlukFilterState = {
  category: string;
  keywords: string[];
  sortBy: SortBy;
};

export type SozlukStackParamList = {
  SozlukList: undefined;
  FavoriTerimler: undefined;
  SozlukFilter: { current: SozlukFilterState; onApply: (next: SozlukFilterState) => void };
  TermDetail: { term: SozlukTerm };
};

const Stack = createNativeStackNavigator<SozlukStackParamList>();

export default function SozlukStackNav() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="SozlukList" component={SozlukScreen} />
      <Stack.Screen name="FavoriTerimler" component={FavoriTerimlerScreen} />
      <Stack.Screen name="SozlukFilter" component={SozlukFilterScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TermDetail" component={TermDetailScreen} />
    </Stack.Navigator>
  );
}
