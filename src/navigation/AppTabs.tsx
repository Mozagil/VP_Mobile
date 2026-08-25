import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { IconName } from '../components/ui/Icon';
import { useI18n, useContent } from '../i18n';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AllTrainingsScreen from '../screens/dashboard/AllTrainingsScreen';
import NextTrainingDetailScreen from '../screens/dashboard/NextTrainingDetailScreen';
import TrainingCalendarScreen from '../screens/dashboard/TrainingCalendarScreen';
import ProfileShortcutsScreen from '../screens/dashboard/ProfileShortcutsScreen';
import TrainingHistoryScreen from '../screens/dashboard/TrainingHistoryScreen';
import BildirimlerScreen from '../screens/dashboard/BildirimlerScreen';
import LogoutScreen from '../screens/dashboard/LogoutScreen';
import DeleteAccountScreen from '../screens/dashboard/DeleteAccountScreen';
import HelpSupportScreen from '../screens/dashboard/HelpSupportScreen';
import LegalScreen from '../screens/legal/LegalScreen';
import PlatformScreen from '../screens/platform/PlatformScreen';
import AIWizardScreen from '../screens/platform/AIWizardScreen';
import VoIleybolOkuluScreen from '../screens/platform/VoIleybolOkuluScreen';
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
  // targetPlanId verildiginde kutuphane "bu programa hareket ekle" modunda acilir.
  DrillList: { targetPlanId?: string } | undefined;
  DrillDetail: { drill: Drill; targetPlanId?: string };
  AddToTrainingChoice: { drill: Drill };
  AddToTraining: { drill: Drill };
  PlanDrillSettings: { drill: Drill; planId: string };
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
  Bildirimler: undefined;
  Logout: undefined;
  DeleteAccount: undefined;
  HelpSupport: undefined;
  // Ayarlar/Profil, Antrenman sekmesinde de kayitli. Panel sekmesinden
  // acildiklarinda geri tusu Profil Kısayolları'na donsun diye burada da
  // kayitlilar (DrillDetail'in iki stack'te birden durmasiyla ayni yaklasim).
  Ayarlar: undefined;
  Profil: undefined;
  Legal: { doc: 'kvkk' | 'privacy' | 'faq' };
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

// Tum stack ekranlari icin tek tip baslik. Native header yerine bunu
// kullaniyoruz: iOS 26 native header butonlarini yuvarlak "glass" zemin
// icine aliyor, bu da uygulamanin kendi custom header'lariyla uyusmuyordu.
function StackHeader({ title, onBack, colors }: { title?: string; onBack?: () => void; colors: Colors }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top + 8,
        paddingBottom: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {onBack ? (
        <TouchableOpacity
          style={{ width: 36, height: 36, alignItems: 'flex-start', justifyContent: 'center' }}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="geri" size={18} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36, height: 36 }} />
      )}
      <Text
        style={{ color: colors.foreground, fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' }}
        numberOfLines={1}
      >
        {title ?? ''}
      </Text>
      <View style={{ width: 36, height: 36 }} />
    </View>
  );
}

function getStackOpts(colors: Colors) {
  return ({ navigation }: any) => ({
    headerShadowVisible: false,
    header: ({ options, back }: any) => (
      <StackHeader
        title={options.title}
        onBack={back ? () => navigation.goBack() : undefined}
        colors={colors}
      />
    ),
    contentStyle: { backgroundColor: colors.background },
  });
}

function PanelStackNav() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const stackOpts = getStackOpts(colors);
  return (
    <PanelStack.Navigator screenOptions={stackOpts}>
      <PanelStack.Screen name="PanelMain" component={DashboardScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="AllTrainings" component={AllTrainingsScreen} options={{ title: t('nav.allTrainings') }} />
      <PanelStack.Screen name="NextTrainingDetail" component={NextTrainingDetailScreen} options={{ title: t('nav.trainingDetail') }} />
      <PanelStack.Screen name="TrainingCalendar" component={TrainingCalendarScreen} options={{ title: t('nav.trainingCalendar') }} />
      <PanelStack.Screen name="ProfileShortcuts" component={ProfileShortcutsScreen} options={{ title: t('nav.profileShortcuts') }} />
      <PanelStack.Screen name="TrainingHistory" component={TrainingHistoryScreen} options={{ title: t('nav.trainingHistory') }} />
      <PanelStack.Screen name="Bildirimler" component={BildirimlerScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="Logout" component={LogoutScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="Ayarlar" component={SettingsScreen} options={{ headerShown: false }} />
      <PanelStack.Screen name="Profil" component={ProfileScreen} options={{ title: t('nav.trainingPreferences') }} />
      <PanelStack.Screen name="Legal" component={LegalScreen} options={{ headerShown: false }} />
    </PanelStack.Navigator>
  );
}

function PlatformStackNav() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const stackOpts = getStackOpts(colors);
  return (
    <PlatformStack.Navigator screenOptions={stackOpts}>
      <PlatformStack.Screen name="PlatformMain" component={PlatformScreen} options={{ title: t('nav.platformFeatures') }} />
      <PlatformStack.Screen name="AIWizard" component={AIWizardScreen} options={{ headerShown: false }} />
      <PlatformStack.Screen name="VoIleybolOkulu" component={VoIleybolOkuluScreen} options={{ title: t('nav.volleyballSchool') }} />
    </PlatformStack.Navigator>
  );
}

function AntrenmanStackNav() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { drillName } = useContent();
  const stackOpts = getStackOpts(colors);
  return (
    <AntrenmanStack.Navigator screenOptions={stackOpts}>
      <AntrenmanStack.Screen name="AntrenmanHub" component={ProgramlarimScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="ProgramDetail" component={ProgramDetailScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="NewTrainingChoice" component={NewTrainingChoiceScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <AntrenmanStack.Screen name="TrainingSuccess" component={TrainingSuccessScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="StartTraining" component={StartTrainingScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="PhaseSequence" component={PhaseSequenceScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="DrillPlayer" component={DrillPlayerScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="PlanList" component={PlansScreen} options={{ title: t('nav.planList') }} />
      <AntrenmanStack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: t('nav.planDetail') }} />
      <AntrenmanStack.Screen name="CreatePlan" component={CreatePlanScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="DrillList" component={LibraryScreen} options={{ title: t('nav.drillLibrary') }} />
      <AntrenmanStack.Screen
        name="DrillDetail"
        component={DrillDetailScreen}
        options={({ route }) => ({ title: drillName(route.params.drill) })}
      />
      <AntrenmanStack.Screen name="AddToTrainingChoice" component={AddToTrainingChoiceScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="AddToTraining" component={AddToTrainingScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="PlanDrillSettings" component={PlanDrillSettingsScreen} options={{ headerShown: false }} />
      <AntrenmanStack.Screen name="Profil" component={ProfileScreen} options={{ title: t('nav.trainingPreferences') }} />
      <AntrenmanStack.Screen name="Ayarlar" component={SettingsScreen} options={{ headerShown: false }} />
    </AntrenmanStack.Navigator>
  );
}

function KutuphaneStackNav() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { drillName } = useContent();
  const stackOpts = getStackOpts(colors);
  return (
    <KutuphaneStack.Navigator screenOptions={stackOpts}>
      {/* Sekme kokunde normalde geri butonu olmaz; Antrenmanlar ve Sözlük
          sekmeleri gibi burada da Ana Sayfa'ya donen bir geri butonu var. */}
      <KutuphaneStack.Screen
        name="DrillList"
        component={LibraryScreen}
        options={({ navigation }) => ({
          title: t('nav.tab.library'),
          header: () => (
            <StackHeader
              title={t('nav.tab.library')}
              onBack={() => navigation.getParent()?.navigate('Panel' as any)}
              colors={colors}
            />
          ),
        })}
      />
      <KutuphaneStack.Screen
        name="DrillDetail"
        component={DrillDetailScreen}
        options={({ route }) => ({ title: drillName(route.params.drill) })}
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
  const { t } = useI18n();
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
          title: t('nav.tab.home'),
          tabBarIcon: ({ focused }) => <TabSvgIcon name="ana-sayfa" focused={focused} />,
        }}
        listeners={resetTabOnPress('PanelMain')}
      />
      <Tab.Screen
        name="ÖzelliklerStack"
        component={PlatformStackNav}
        options={{
          title: t('nav.platformFeatures'),
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="AntrenmanStack"
        component={AntrenmanStackNav}
        options={{
          title: t('nav.tab.training'),
          tabBarIcon: ({ focused }) => <TabSvgIcon name="antrenmanlar" focused={focused} />,
        }}
        listeners={resetTabOnPress('AntrenmanHub')}
      />
      <Tab.Screen
        name="KütüphaneStack"
        component={KutuphaneStackNav}
        options={{
          title: t('nav.tab.library'),
          tabBarIcon: ({ focused }) => <TabSvgIcon name="servis" focused={focused} />,
        }}
        listeners={resetTabOnPress('DrillList')}
      />
      <Tab.Screen
        name="Sözlük"
        component={SozlukStackNav}
        options={{
          title: t('nav.tab.glossary'),
          tabBarIcon: ({ focused }) => <TabSvgIcon name="pas" focused={focused} />,
        }}
        listeners={resetTabOnPress('SozlukList')}
      />
    </Tab.Navigator>
  );
}
