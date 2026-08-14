import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { IconName } from '../components/ui/Icon';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AllTrainingsScreen from '../screens/dashboard/AllTrainingsScreen';
import NextTrainingDetailScreen from '../screens/dashboard/NextTrainingDetailScreen';
import TrainingCalendarScreen from '../screens/dashboard/TrainingCalendarScreen';
import ProfileShortcutsScreen from '../screens/dashboard/ProfileShortcutsScreen';
import TrainingHistoryScreen from '../screens/dashboard/TrainingHistoryScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import BildirimlerScreen from '../screens/dashboard/BildirimlerScreen';
import LogoutScreen from '../screens/dashboard/LogoutScreen';
import DeleteAccountScreen from '../screens/dashboard/DeleteAccountScreen';
import HelpSupportScreen from '../screens/dashboard/HelpSupportScreen';
import PlatformScreen from '../screens/platform/PlatformScreen';
import AIWizardScreen from '../screens/platform/AIWizardScreen';
import VoIleybolOkuluScreen from '../screens/platform/VoIleybolOkuluScreen';
import AntrenmanHubScreen from '../screens/antrenman/AntrenmanHubScreen';
import ProgramlarimScreen from '../screens/antrenman/ProgramlarimScreen';
import ProgramDetailScreen from '../screens/antrenman/ProgramDetailScreen';
import NewTrainingChoiceScreen from '../screens/antrenman/NewTrainingChoiceScreen';
import TrainingSuccessScreen from '../screens/antrenman/TrainingSuccessScreen';
import StartTrainingScreen from '../screens/antrenman/StartTrainingScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import DrillDetailScreen from '../screens/library/DrillDetailScreen';
import AddToTrainingScreen from '../screens/library/AddToTrainingScreen';
import AddToTrainingChoiceScreen from '../screens/library/AddToTrainingChoiceScreen';
import PlanDrillSettingsScreen from '../screens/library/PlanDrillSettingsScreen';
import ReadyProgramsScreen from '../screens/library/ReadyProgramsScreen';
import ReadyProgramDetailScreen from '../screens/library/ReadyProgramDetailScreen';
import PhaseSequenceScreen from '../screens/antrenman/PhaseSequenceScreen';
import DrillPlayerScreen from '../screens/antrenman/DrillPlayerScreen';
import WorkoutCompleteScreen from '../screens/antrenman/WorkoutCompleteScreen';
import PlansScreen from '../screens/plans/PlansScreen';
import PlanDetailScreen from '../screens/plans/PlanDetailScreen';
import CreatePlanScreen from '../screens/plans/CreatePlanScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SozlukStackNav from './SozlukStack';
import GelisimScreen from '../screens/gelisim/GelisimScreen';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../theme/palettes';
import { Drill } from '../data/types';

export type AppTabsParamList = {
  Panel: undefined;
  ÖzelliklerStack: undefined;
  AntrenmanStack: undefined;
  KütüphaneStack: undefined;
  Sözlük: undefined;
};

export type AntrenmanStackParamList = {
  AntrenmanHub: undefined;
  AntrenmanMenu: undefined;
  ProgramDetail: { planId: string };
  NewTrainingChoice: undefined;
  TrainingSuccess: { planId: string; planName: string; drillName: string };
  StartTraining: { planId: string };
  PhaseSequence: { planId: string; phase: string; showAll?: boolean };
  DrillPlayer: { planId: string; phase: string; index: number };
  WorkoutComplete: { planId: string };
  PlanList: undefined;
  PlanDetail: { planId: string };
  CreatePlan: undefined;
  DrillList: undefined;
  DrillDetail: { drill: Drill };
  AddToTrainingChoice: { drill: Drill };
  AddToTraining: { drill: Drill };
  PlanDrillSettings: { drill: Drill; planId: string };
  GelisimMain: undefined;
  Profil: undefined;
  Ayarlar: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

const PanelStack = createNativeStackNavigator<{
  PanelMain: undefined;
  AllTrainings: undefined;
  NextTrainingDetail: { planId: string };
  TrainingCalendar: undefined;
  ProfileShortcuts: undefined;
  TrainingHistory: undefined;
  NotificationSettings: undefined;
  Bildirimler: undefined;
  Logout: undefined;
  DeleteAccount: undefined;
  HelpSupport: undefined;
}>();

const PlatformStack = createNativeStackNavigator<{
  PlatformMain: undefined;
  AIWizard: undefined;
  VoIleybolOkulu: undefined;
}>();

const AntrenmanStack = createNativeStackNavigator<AntrenmanStackParamList>();

const KutuphaneStack = createNativeStackNavigator<{
  DrillList: undefined;
  DrillDetail: { drill: Drill };
  AddToTrainingChoice: { drill: Drill };
  AddToTraining: { drill: Drill };
  PlanDrillSettings: { drill: Drill; planId: string };
  ReadyPrograms: undefined;
  ReadyProgramDetail: { programKey: string };
}>();

function getStackOpts(colors: Colors) {
  return {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.foreground,
    headerShadowVisible: false,
    headerBackTitle: '',          // iOS: show only the back chevron, no text
    contentStyle: { backgroundColor: colors.background },
  };
}

function PanelStackNav() {
  const { colors } = useTheme();
  const stackOpts = getStackOpts(colors);
  return (
    <PanelStack.Navigator screenOptions={stackOpts}>
      <PanelStack.Screen name="PanelMain" component={DashboardScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="AllTrainings" component={AllTrainingsScreen} options={{ title: 'Antrenmanlarım' }} />
      <PanelStack.Screen name="NextTrainingDetail" component={NextTrainingDetailScreen} options={{ title: 'Antrenman Detayı' }} />
      <PanelStack.Screen name="TrainingCalendar" component={TrainingCalendarScreen} options={{ title: 'Antrenman Takvimi' }} />
      <PanelStack.Screen name="ProfileShortcuts" component={ProfileShortcutsScreen} options={{ title: 'Profil Kısayolları' }} />
      <PanelStack.Screen name="TrainingHistory" component={TrainingHistoryScreen} options={{ title: 'Antrenman Geçmişim' }} />
      <PanelStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Bildirim Ayarları' }} />
      <PanelStack.Screen name="Bildirimler" component={BildirimlerScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="Logout" component={LogoutScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />
    </PanelStack.Navigator>
  );
}

function PlatformStackNav() {
  const { colors } = useTheme();
  const stackOpts = getStackOpts(colors);
  return (
    <PlatformStack.Navigator screenOptions={stackOpts}>
      <PlatformStack.Screen name="PlatformMain" component={PlatformScreen} options={{ title: 'Platform Özellikleri' }} />
      <PlatformStack.Screen name="AIWizard" component={AIWizardScreen} options={{ title: 'AI Antrenman Sihirbazı' }} />
      <PlatformStack.Screen name="VoIleybolOkulu" component={VoIleybolOkuluScreen} options={{ title: 'Voleybol Okulu' }} />
    </PlatformStack.Navigator>
  );
}

function AntrenmanStackNav() {
  const { colors } = useTheme();
  const stackOpts = getStackOpts(colors);
  return (
    <AntrenmanStack.Navigator screenOptions={stackOpts}>
      <AntrenmanStack.Screen name="AntrenmanHub" component={ProgramlarimScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="AntrenmanMenu" component={AntrenmanHubScreen} options={{ title: 'Diğer' }} />
      <AntrenmanStack.Screen name="ProgramDetail" component={ProgramDetailScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="NewTrainingChoice" component={NewTrainingChoiceScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <AntrenmanStack.Screen name="TrainingSuccess" component={TrainingSuccessScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="StartTraining" component={StartTrainingScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="PhaseSequence" component={PhaseSequenceScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="DrillPlayer" component={DrillPlayerScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="PlanList" component={PlansScreen} options={{ title: 'Antrenman Planlarım' }} />
      <AntrenmanStack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Plan Detay' }} />
      <AntrenmanStack.Screen name="CreatePlan" component={CreatePlanScreen} options={{ title: 'Yeni Plan' }} />
      <AntrenmanStack.Screen name="DrillList" component={LibraryScreen} options={{ title: 'Drill Kütüphanesi' }} />
      <AntrenmanStack.Screen
        name="DrillDetail"
        component={DrillDetailScreen}
        options={({ route }) => ({ title: route.params.drill.name })}
      />
      <AntrenmanStack.Screen name="AddToTrainingChoice" component={AddToTrainingChoiceScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="AddToTraining" component={AddToTrainingScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="PlanDrillSettings" component={PlanDrillSettingsScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="GelisimMain" component={GelisimScreen} options={{ title: 'Gelişim Modülleri' }} />
      <AntrenmanStack.Screen name="Profil" component={ProfileScreen} options={{ title: 'Antrenman Tercihleri' }} />
      <AntrenmanStack.Screen name="Ayarlar" component={SettingsScreen} options={{ headerShown: false }} />
    </AntrenmanStack.Navigator>
  );
}

function KutuphaneStackNav() {
  const { colors } = useTheme();
  const stackOpts = getStackOpts(colors);
  return (
    <KutuphaneStack.Navigator screenOptions={stackOpts}>
      <KutuphaneStack.Screen name="DrillList" component={LibraryScreen} options={{ title: 'Antrenman Kütüphanesi' }} />
      <KutuphaneStack.Screen
        name="DrillDetail"
        component={DrillDetailScreen}
        options={({ route }) => ({ title: route.params.drill.name })}
      />
      <KutuphaneStack.Screen name="AddToTrainingChoice" component={AddToTrainingChoiceScreen} options={{ headerShown: false }} />
      <KutuphaneStack.Screen name="AddToTraining" component={AddToTrainingScreen} options={{ headerShown: false }} />
      <KutuphaneStack.Screen name="PlanDrillSettings" component={PlanDrillSettingsScreen} options={{ headerShown: false }} />
      <KutuphaneStack.Screen name="ReadyPrograms" component={ReadyProgramsScreen} options={{ headerShown: false }} />
      <KutuphaneStack.Screen name="ReadyProgramDetail" component={ReadyProgramDetailScreen} options={{ headerShown: false }} />
    </KutuphaneStack.Navigator>
  );
}

const TabSvgIcon = ({ name, focused }: { name: IconName; focused: boolean }) => (
  <Icon name={name} size={22} opacity={focused ? 1 : 0.5} />
);

// Tapping a bottom tab always jumps back to that tab's starting screen,
// instead of restoring whatever screen was left open in its nested stack.
const resetTabOnPress = (initialScreen: string) => ({ navigation, route }: any) => ({
  tabPress: (e: any) => {
    e.preventDefault();
    navigation.navigate(route.name, { screen: initialScreen });
  },
});

export default function AppTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerShadowVisible: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen
        name="Panel"
        component={PanelStackNav}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => <TabSvgIcon name="ana-sayfa" focused={focused} />,
        }}
        listeners={resetTabOnPress('PanelMain')}
      />
      <Tab.Screen
        name="ÖzelliklerStack"
        component={PlatformStackNav}
        options={{
          title: 'Platform Özellikleri',
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="AntrenmanStack"
        component={AntrenmanStackNav}
        options={{
          title: 'Antrenman',
          tabBarIcon: ({ focused }) => <TabSvgIcon name="antrenmanlar" focused={focused} />,
        }}
        listeners={resetTabOnPress('AntrenmanHub')}
      />
      <Tab.Screen
        name="KütüphaneStack"
        component={KutuphaneStackNav}
        options={{
          title: 'Antrenman Kütüphanesi',
          tabBarIcon: ({ focused }) => <TabSvgIcon name="servis" focused={focused} />,
        }}
        listeners={resetTabOnPress('DrillList')}
      />
      <Tab.Screen
        name="Sözlük"
        component={SozlukStackNav}
        options={{
          title: 'Voleybol Sözlüğü',
          tabBarIcon: ({ focused }) => <TabSvgIcon name="pas" focused={focused} />,
        }}
        listeners={resetTabOnPress('SozlukList')}
      />
    </Tab.Navigator>
  );
}
