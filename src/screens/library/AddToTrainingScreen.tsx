import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTrainingPlans, useCreatePlan } from '../../hooks/useTrainingPlans';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { Drill, TrainingPlan } from '../../data/types';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { planTotalMinutes, formatSessionBadge, parseLocalDate } from '../../utils/trainingPlan';
import { useI18n, useContent } from '../../i18n';
import Icon from '../../components/ui/Icon';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';

type LibraryStackParamList = {
  AddToTraining: { drill: Drill };
};

type Props = NativeStackScreenProps<LibraryStackParamList, 'AddToTraining'>;

const TABS = [
  { key: 'upcoming', labelKey: 'addToTraining.tab.upcoming' },
  { key: 'own', labelKey: 'addToTraining.tab.own' },
  { key: 'new', labelKey: 'addToTraining.tab.new' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function AddToTrainingScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { drillName } = useContent();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { drill } = route.params;
  const [tab, setTab] = useState<TabKey>('upcoming');
  const [search, setSearch] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [newPlanName, setNewPlanName] = useState(drill.name);

  const { data: plans = [] } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();
  const createPlan = useCreatePlan();

  const upcomingSessions = useMemo(() => {
    return [...sessions]
      .filter((sess) => !sess.completed)
      .sort((a, b) => parseLocalDate(a.session_date).getTime() - parseLocalDate(b.session_date).getTime());
  }, [sessions]);

  const pastSessions = useMemo(() => {
    return [...sessions]
      .filter((sess) => sess.completed)
      .sort((a, b) => parseLocalDate(b.session_date).getTime() - parseLocalDate(a.session_date).getTime())
      .slice(0, 5);
  }, [sessions]);

  const filteredOwnPlans = useMemo(() => {
    return plans.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [plans, search]);

  const planFor = (planId: string) => plans.find((p) => p.id === planId);

  const goToSuccess = (plan: TrainingPlan | undefined, planIdFallback: string) => {
    navigation.getParent()?.navigate('AntrenmanStack' as any, {
      screen: 'TrainingSuccess',
      params: {
        planId: plan?.id ?? planIdFallback,
        planName: plan?.name ?? 'Antrenman',
        drillName: drill.name,
      },
    });
  };

  const goToSettings = () => {
    if (!selectedPlanId) return;
    navigation.navigate('PlanDrillSettings' as any, { drill, planId: selectedPlanId });
  };

  const planStats = (minutes: number, drillCount: number) =>
    t('addToTraining.planStats', {
      duration: minutes > 0 ? t('common.minShort', { n: minutes }) : t('common.durationUnset'),
      n: drillCount,
    });

  const createAndAdd = async () => {
    try {
      const plan = await createPlan.mutateAsync({
        name: newPlanName.trim() || drillName(drill),
        drills: [{ drill_id: drill.id, phase: drill.phase, sort_order: 0, completed: false }] as any,
      });
      goToSuccess(undefined, (plan as any)?.id);
    } catch {
      Alert.alert(t('common.error'), t('addToTraining.createError'));
    }
  };

  const renderPlanRow = (plan: TrainingPlan, dateLine: string | null, statsLine: string) => {
    const active = selectedPlanId === plan.id;
    return (
      <TouchableOpacity
        key={plan.id}
        style={[s.row, active && s.rowActive]}
        activeOpacity={0.78}
        onPress={() => setSelectedPlanId(plan.id)}
      >
        <View style={s.rowIconBox}>
          <Icon name="antrenmanlar" size={18} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.rowName} numberOfLines={1}>{plan.name}</Text>
          {dateLine && (
            <View style={s.rowSubLine}>
              <Icon name="takvim" size={11} />
              <Text style={s.rowSub}>{dateLine}</Text>
            </View>
          )}
          <View style={s.rowSubLine}>
            <Icon name="sure" size={11} />
            <Text style={s.rowSub}>{statsLine}</Text>
          </View>
        </View>
        <View style={[s.radio, active && s.radioActive]}>
          {active && <View style={s.radioDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('addToTraining.pickTitle')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.searchRow}>
        <TextInput
          style={s.searchInput}
          placeholder={t('addToTraining.searchPlaceholder')}
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={s.tabRow}>
        {TABS.map((tabItem) => {
          const active = tab === tabItem.key;
          return (
            <TouchableOpacity
              key={tabItem.key}
              style={[s.tab, active && s.tabActive]}
              onPress={() => setTab(tabItem.key)}
              activeOpacity={0.8}
            >
              <Text style={[s.tabTxt, active && s.tabTxtActive]} numberOfLines={1}>{t(tabItem.labelKey)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'upcoming' && (
          <>
            <Text style={s.sectionTitle}>{t('addToTraining.upcomingSection')}</Text>
            {upcomingSessions.length === 0 ? (
              <Text style={s.empty}>{t('addToTraining.upcomingEmpty')}</Text>
            ) : (
              upcomingSessions.map((sess) => {
                const plan = planFor(sess.plan_id);
                if (!plan) return null;
                const dateLine = formatSessionBadge(sess.session_date, sess.session_time, lang);
                const minutes = planTotalMinutes(plan, colors);
                return renderPlanRow(plan, dateLine, planStats(minutes, plan.drills.length));
              })
            )}

            {pastSessions.length > 0 && (
              <>
                <Text style={[s.sectionTitle, { marginTop: 20 }]}>{t('addToTraining.pastSection')}</Text>
                {pastSessions.map((sess) => {
                  const plan = planFor(sess.plan_id);
                  if (!plan) return null;
                  const dateLine = formatSessionBadge(sess.session_date, sess.session_time, lang);
                  const minutes = planTotalMinutes(plan, colors);
                  return renderPlanRow(plan, dateLine, planStats(minutes, plan.drills.length));
                })}
              </>
            )}
          </>
        )}

        {tab === 'own' && (
          <>
            <Text style={s.sectionTitle}>{t('addToTraining.ownSection')}</Text>
            {filteredOwnPlans.length === 0 ? (
              <Text style={s.empty}>{t('addToTraining.ownEmpty')}</Text>
            ) : (
              filteredOwnPlans.map((plan) => {
                const minutes = planTotalMinutes(plan, colors);
                return renderPlanRow(plan, null, planStats(minutes, plan.drills.length));
              })
            )}
          </>
        )}

        {tab === 'new' && (
          <>
            <Text style={s.sectionTitle}>{t('addToTraining.newProgram')}</Text>
            <TextInput
              style={s.searchInput}
              placeholder={t('addToTraining.planNamePlaceholder')}
              placeholderTextColor={colors.muted}
              value={newPlanName}
              onChangeText={setNewPlanName}
            />
          </>
        )}
      </ScrollView>

      <View style={s.footer}>
        {tab === 'new' ? (
          <TouchableOpacity
            style={[s.primaryBtn, createPlan.isPending && s.primaryBtnDisabled]}
            activeOpacity={0.85}
            onPress={createAndAdd}
            disabled={createPlan.isPending}
          >
            <Text style={s.primaryBtnTxt}>{createPlan.isPending ? t('common.creating') : t('common.continue')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[s.primaryBtn, !selectedPlanId && s.primaryBtnDisabled]}
            activeOpacity={0.85}
            disabled={!selectedPlanId}
            onPress={goToSettings}
          >
            <Text style={s.primaryBtnTxt}>{t('common.continue')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800' },

  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchInput: {
    backgroundColor: colors.card, color: colors.foreground, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, fontSize: 14,
  },

  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: { flex: 1, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card, paddingVertical: 8, alignItems: 'center' },
  tabActive: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  tabTxt: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  tabTxtActive: { color: colors.accent },

  scroll: { paddingHorizontal: 16, paddingBottom: 20 },
  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  empty: { color: colors.muted, fontSize: 13 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  rowActive: { borderColor: colors.accent },
  rowIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  rowIcon: { fontSize: 18 },
  rowName: { color: colors.foreground, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  rowSub: { color: colors.muted, fontSize: 12 },
  rowSubLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.accent },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.accent },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
}
