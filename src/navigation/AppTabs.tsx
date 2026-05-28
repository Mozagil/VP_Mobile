import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import PlatformScreen from '../screens/platform/PlatformScreen';
import AIWizardScreen from '../screens/platform/AIWizardScreen';
import VoIleybolOkuluScreen from '../screens/platform/VoIleybolOkuluScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import DrillDetailScreen from '../screens/library/DrillDetailScreen';
import PlansScreen from '../screens/plans/PlansScreen';
import PlanDetailScreen from '../screens/plans/PlanDetailScreen';
import CreatePlanScreen from '../screens/plans/CreatePlanScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SozlukScreen from '../screens/sozluk/SozlukScreen';
import GelisimScreen from '../screens/gelisim/GelisimScreen';
import { colors } from '../theme/colors';
import { Drill } from '../data/types';

export type AppTabsParamList = {
  Panel: undefined;
  ÖzelliklerStack: undefined;
  KütüphaneStack: undefined;
  GelişimStack: undefined;
  Sözlük: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

const LibStack = createNativeStackNavigator<{
  DrillList: undefined;
  DrillDetail: { drill: Drill };
}>();

const PlatformStack = createNativeStackNavigator<{
  PlatformMain: undefined;
  AIWizard: undefined;
  VoIleybolOkulu: undefined;
}>();

const GelisimStack = createNativeStackNavigator<{
  GelisimMain: undefined;
  PlanList: undefined;
  PlanDetail: { planId: string };
  CreatePlan: undefined;
  Profil: undefined;
  Ayarlar: undefined;
}>();

const stackOpts = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.foreground,
  headerShadowVisible: false,
  headerBackTitle: '',          // iOS: show only the back chevron, no text
  contentStyle: { backgroundColor: colors.background },
};

function PlatformStackNav() {
  return (
    <PlatformStack.Navigator screenOptions={stackOpts}>
      <PlatformStack.Screen name="PlatformMain" component={PlatformScreen} options={{ title: 'Platform Özellikleri' }} />
      <PlatformStack.Screen name="AIWizard" component={AIWizardScreen} options={{ title: 'AI Antrenman Sihirbazı' }} />
      <PlatformStack.Screen name="VoIleybolOkulu" component={VoIleybolOkuluScreen} options={{ title: 'Voleybol Okulu' }} />
    </PlatformStack.Navigator>
  );
}

function LibraryStackNav() {
  return (
    <LibStack.Navigator screenOptions={stackOpts}>
      <LibStack.Screen name="DrillList" component={LibraryScreen} options={{ title: 'Antrenman Kütüphanesi' }} />
      <LibStack.Screen
        name="DrillDetail"
        component={DrillDetailScreen}
        options={({ route }) => ({ title: route.params.drill.name })}
      />
    </LibStack.Navigator>
  );
}

function GelisimStackNav() {
  return (
    <GelisimStack.Navigator screenOptions={stackOpts}>
      <GelisimStack.Screen name="GelisimMain" component={GelisimScreen} options={{ title: 'Gelişim Modülü' }} />
      <GelisimStack.Screen name="PlanList" component={PlansScreen} options={{ title: 'Antrenman Planlarım' }} />
      <GelisimStack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Plan Detay' }} />
      <GelisimStack.Screen name="CreatePlan" component={CreatePlanScreen} options={{ title: 'Yeni Plan' }} />
      <GelisimStack.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profilim' }} />
      <GelisimStack.Screen name="Ayarlar" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
    </GelisimStack.Navigator>
  );
}

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
);

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen
        name="Panel"
        component={DashboardScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ÖzelliklerStack"
        component={PlatformStackNav}
        options={{
          title: 'Platform',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label="🚀" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="KütüphaneStack"
        component={LibraryStackNav}
        options={{
          title: 'Kütüphane',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label="📚" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="GelişimStack"
        component={GelisimStackNav}
        options={{
          title: 'Gelişim',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label="📈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Sözlük"
        component={SozlukScreen}
        options={{
          title: 'Sözlük',
          tabBarIcon: ({ focused }) => <TabIcon label="📖" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
