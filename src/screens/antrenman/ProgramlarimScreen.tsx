import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTrainingPlans, useDeletePlan } from '../../hooks/useTrainingPlans';
import { useScheduledSessions } from '../../hooks/useScheduledSessions';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/palettes';
import { AntrenmanStackParamList } from '../../navigation/AppTabs';
import { TrainingPlan, ScheduledSession } from '../../data/types';
import Calendar from '../../components/ui/Calendar';
import Icon from '../../components/ui/Icon';
import PhaseIcon from '../../components/ui/PhaseIcon';
import { useI18n, LOCALE } from '../../i18n';
import { PHASES, buildPhaseBreakdown, dateKeyOf, getPhaseDisplay, isPlanPastDue, isSessionMissed, parseLocalDate, planEffectiveDate, planTotalMinutes, sessionDateTime } from '../../utils/trainingPlan';

type Props = { navigation: NativeStackNavigationProp<AntrenmanStackParamList, 'AntrenmanHub'> };

function planStats(plan: TrainingPlan) {
  const total = plan.drills.length;
  const done = plan.drills.filter((d) => d.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

const TABS = [
  { key: 'list', labelKey: 'training.tab.list' },
  { key: 'calendar', labelKey: 'training.tab.calendar' },
  { key: 'history', labelKey: 'training.tab.history' },
] as const;

type TabKey = typeof TABS[number]['key'];

const TAB_TITLE_KEYS: Record<TabKey, 'training.header.list' | 'training.header.calendar' | 'training.header.history'> = {
  list: 'training.header.list',
  calendar: 'training.header.calendar',
  history: 'training.header.history',
};

type HistoryFilter = 'all' | 'done' | 'missed';

const HISTORY_FILTERS = [
  { key: 'all', labelKey: 'training.filter.all' },
  { key: 'done', labelKey: 'training.filter.done' },
  { key: 'missed', labelKey: 'training.filter.missed' },
] as const;

type HistoryPhaseFilter = 'all' | typeof PHASES[number];

export default function ProgramlarimScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [tab, setTab] = useState<TabKey>('list');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [historyPhaseFilter, setHistoryPhaseFilter] = useState<HistoryPhaseFilter>('all');
  const [historySortNewestFirst, setHistorySortNewestFirst] = useState(true);
  const [showHistoryFilter, setShowHistoryFilter] = useState(false);
  // Toplu silme: secim modunda kartlara dokunmak antrenmani acmak yerine secer.
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const deletePlan = useDeletePlan();
  const { data: plans = [], isLoading } = useTrainingPlans();
  const { data: sessions = [] } = useScheduledSessions();

  const sortedPlans = useMemo(() => {
    return [...plans]
      .filter((p) => planStats(p).pct < 100 && !isPlanPastDue(p, sessions))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [plans, sessions]);

  // Plans with no scheduled session at all still need to leave the active
  // list and show up in Geçmiş once their day has passed — pastSessions
  // below only covers plans that actually have a ScheduledSession row.
  const pastPlansWithoutSessions = useMemo(() => {
    return plans.filter((p) => {
      const hasSession = sessions.some((s) => s.plan_id === p.id);
      if (hasSession) return false;
      const { pct } = planStats(p);
      return pct === 100 || isPlanPastDue(p, sessions);
    });
  }, [plans, sessions]);

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((sess) => {
      if (!Number.isNaN(new Date(sess.session_date).getTime())) set.add(dateKeyOf(sess.session_date));
    });
    return set;
  }, [sessions]);

  const dayDots = useMemo(() => {
    const map: Record<string, string[]> = {};
    sessions.forEach((sess) => {
      if (Number.isNaN(new Date(sess.session_date).getTime())) return;
      const key = dateKeyOf(sess.session_date);
      const plan = plans.find((p) => p.id === sess.plan_id);
      if (!plan) return;
      const colorsForPlan = buildPhaseBreakdown(plan, colors, lang).map((p) => p.color);
      (map[key] ??= []).push(...colorsForPlan);
    });
    return map;
  }, [sessions, plans, colors]);

  const sessionsForDay = useMemo(() => {
    if (!selectedDay) return [];
    return sessions
      .filter((sess) => dateKeyOf(sess.session_date) === selectedDay)
      .sort((a, b) => (a.session_time ?? '').localeCompare(b.session_time ?? ''));
  }, [sessions, selectedDay]);

  const upcoming = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return [...sessions]
      .filter((sess) => parseLocalDate(sess.session_date) >= todayStart)
      .sort((a, b) => parseLocalDate(a.session_date).getTime() - parseLocalDate(b.session_date).getTime())
      .slice(0, 10);
  }, [sessions]);

  type HistoryRow = {
    id: string; planId: string; planName: string; date: Date; time?: string | null;
    completed: boolean; phase: string | null;
  };

  const dominantPhase = (plan: TrainingPlan | undefined): string | null => {
    if (!plan) return null;
    const breakdown = buildPhaseBreakdown(plan, colors, lang);
    if (breakdown.length === 0) return null;
    return [...breakdown].sort((a, b) => b.minutes - a.minutes)[0].phase;
  };

  const historyItems = useMemo<HistoryRow[]>(() => {
    const fromSessions: HistoryRow[] = sessions
      .filter((sess) => sess.completed || sessionDateTime(sess) < new Date())
      .map((sess) => {
        const plan = plans.find((p) => p.id === sess.plan_id);
        return {
          id: sess.id, planId: sess.plan_id, planName: plan?.name ?? 'Antrenman',
          date: parseLocalDate(sess.session_date), time: sess.session_time, completed: sess.completed,
          phase: dominantPhase(plan),
        };
      });

    const fromOrphanPlans: HistoryRow[] = pastPlansWithoutSessions.map((p) => ({
      id: `plan-${p.id}`, planId: p.id, planName: p.name,
      date: planEffectiveDate(p), time: null, completed: planStats(p).pct === 100,
      phase: dominantPhase(p),
    }));

    return [...fromSessions, ...fromOrphanPlans]
      .filter((row) => {
        if (historyFilter === 'done' && !row.completed) return false;
        if (historyFilter === 'missed' && row.completed) return false;
        if (historyPhaseFilter !== 'all' && row.phase !== historyPhaseFilter) return false;
        return true;
      })
      .sort((a, b) => (historySortNewestFirst ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime()));
  }, [sessions, plans, pastPlansWithoutSessions, historyFilter, historyPhaseFilter, historySortNewestFirst, colors]);

  // Bu ekrana antrenman akisinin icinden gelindiginde modal olarak sunulmus
  // oluyor; sadece sekme degistirmek modali ekranda birakiyordu. Once yigin
  // kokune iniliyor. Ekran zaten kokteyse popToTop bir sey yapmaz.
  const goBackHome = () => {
    navigation.popToTop();
    navigation.getParent()?.navigate('Panel' as any);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.closeBtn}
          onPress={goBackHome}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="geri" size={18} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t(TAB_TITLE_KEYS[tab])}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.tabRow}>
        {TABS.map((tabItem) => {
          const active = tab === tabItem.key;
          return (
            <TouchableOpacity
              key={tabItem.key}
              style={[s.tab, active && s.tabActive]}
              onPress={() => {
                setTab(tabItem.key);
                // Sekme degisince secim modundan cikilir, secim de temizlenir.
                setSelectMode(false);
                setSelectedIds([]);
              }}
              activeOpacity={0.8}
            >
              <Text style={[s.tabTxt, active && s.tabTxtActive]}>{t(tabItem.labelKey)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'list' && (
          <>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionTitle}>{t('training.createdSection')}</Text>
              {sortedPlans.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectMode((v) => !v);
                    setSelectedIds([]);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={s.allLink}>
                    {selectMode ? t('training.selectCancel') : t('training.selectMode')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {isLoading ? (
              <Text style={s.empty}>{t('common.loading')}</Text>
            ) : sortedPlans.length === 0 ? (
              <View style={s.emptyCard}>
                <Icon name="antrenmanlar" size={36} style={{ marginBottom: 12 }} />
                <Text style={s.emptyTitle}>{t('training.noProgramsTitle')}</Text>
                <Text style={s.emptyDesc}>{t('training.noProgramsDesc')}</Text>
              </View>
            ) : (
              sortedPlans.map((plan) => {
                const { total, pct } = planStats(plan);
                const minutes = planTotalMinutes(plan, colors);
                const isScheduled = sessions.some((sess) => sess.plan_id === plan.id && !sess.completed);
                const selected = selectedIds.includes(plan.id);
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[s.card, selectMode && selected && s.cardSelected]}
                    activeOpacity={0.78}
                    onPress={() => {
                      if (selectMode) {
                        setSelectedIds((prev) =>
                          prev.includes(plan.id) ? prev.filter((id) => id !== plan.id) : [...prev, plan.id],
                        );
                      } else {
                        navigation.navigate('StartTraining', { planId: plan.id });
                      }
                    }}
                  >
                    {selectMode ? (
                      <View style={[s.checkbox, selected && s.checkboxOn]}>
                        {selected && <Text style={s.checkboxTick}>✓</Text>}
                      </View>
                    ) : (
                      <View style={s.thumb}>
                        <Icon name="antrenmanlar" size={20} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={s.cardName} numberOfLines={1}>{plan.name}</Text>
                        {isScheduled && <Icon name="takvim" size={13} />}
                      </View>
                      <Text style={s.cardMeta}>
                        {minutes > 0 ? t('start.drillCountDuration', { n: total, min: minutes }) : t('start.drillCount', { n: total })}
                      </Text>
                      {plan.status === 'active' && <Text style={s.activeTag}>{'● ' + t('plans.activeBadge')}</Text>}
                      <Text style={s.createdDate}>
                        {t('training.createdAt', {
                          date: new Date(plan.created_at).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' }),
                        })}
                      </Text>
                    </View>
                    <View style={s.cardProgress}>
                      <Text style={s.progressPct}>%{pct}</Text>
                      <View style={s.barBg}>
                        <View style={[s.barFill, { width: `${pct}%` }]} />
                      </View>
                    </View>
                    {!selectMode && <Text style={s.cardArrow}>›</Text>}
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {tab === 'calendar' && (
          <>
            <Calendar markedDates={markedDates} dots={dayDots} onDayPress={setSelectedDay} />

            <View style={s.legend}>
              {Object.entries(getPhaseDisplay(colors, lang)).map(([phase, disp]) => (
                <View key={phase} style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: disp.color }]} />
                  <Text style={s.legendTxt}>{disp.label}</Text>
                </View>
              ))}
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: colors.blue }]} />
                <Text style={s.legendTxt}>{t('calendar.legendToday')}</Text>
              </View>
            </View>

            <Text style={s.sectionTitle}>{t('training.upcomingSection')}</Text>
            {upcoming.length === 0 ? (
              <Text style={s.empty}>{t('training.noScheduled')}</Text>
            ) : (
              upcoming.map((session) => {
                const plan = plans.find((p) => p.id === session.plan_id);
                const missed = isSessionMissed(session);
                return (
                  <TouchableOpacity
                    key={session.id}
                    style={[s.listRow, (session.completed || missed) && s.listRowDone]}
                    activeOpacity={0.78}
                    disabled={!plan}
                    onPress={() => plan && navigation.navigate('StartTraining', { planId: plan.id })}
                  >
                    <Text style={[s.listRowDate, missed && s.listRowDateMissed]}>
                      {parseLocalDate(session.session_date).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long' })}
                      {session.session_time ? ` • ${session.session_time}` : ''}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                      {session.completed && <Icon name="tamamlandi" size={14} />}
                      {missed && <Icon name="tamamlanmadi" size={14} />}
                      <Text style={[s.listRowName, (session.completed || missed) && s.listRowNameDone]} numberOfLines={1}>
                        {plan?.name ?? t('training.genericName')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {tab === 'history' && (
          <>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionTitle}>{t('training.pastSection')}</Text>
              <TouchableOpacity
                style={[s.filterBtn, { flexDirection: 'row', alignItems: 'center', gap: 5 }]}
                activeOpacity={0.7}
                onPress={() => setShowHistoryFilter((v) => !v)}
              >
                <Icon name="filtre" size={13} />
                <Text style={s.filterBtnTxt}>{t(HISTORY_FILTERS.find((f) => f.key === historyFilter)!.labelKey)}</Text>
              </TouchableOpacity>
            </View>

            {showHistoryFilter && (
              <View style={s.filterChipsRow}>
                {HISTORY_FILTERS.map((f) => {
                  const active = historyFilter === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[s.filterChip, active && s.filterChipActive]}
                      activeOpacity={0.8}
                      onPress={() => setHistoryFilter(f.key)}
                    >
                      <Text style={[s.filterChipTxt, active && s.filterChipTxtActive]}>{t(f.labelKey)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {showHistoryFilter && (
              <>
                <Text style={s.filterGroupLabel}>{t('training.filterGroup.class')}</Text>
                <View style={s.filterChipsRow}>
                  <TouchableOpacity
                    style={[s.filterChip, historyPhaseFilter === 'all' && s.filterChipActive]}
                    activeOpacity={0.8}
                    onPress={() => setHistoryPhaseFilter('all')}
                  >
                    <Text style={[s.filterChipTxt, historyPhaseFilter === 'all' && s.filterChipTxtActive]}>{t('common.all')}</Text>
                  </TouchableOpacity>
                  {PHASES.map((phase) => {
                    const active = historyPhaseFilter === phase;
                    const label = getPhaseDisplay(colors, lang)[phase]?.label ?? phase;
                    return (
                      <TouchableOpacity
                        key={phase}
                        style={[s.filterChip, active && s.filterChipActive]}
                        activeOpacity={0.8}
                        onPress={() => setHistoryPhaseFilter(phase)}
                      >
                        <Text style={[s.filterChipTxt, active && s.filterChipTxtActive]}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={s.filterGroupLabel}>{t('training.filterGroup.date')}</Text>
                <View style={s.filterChipsRow}>
                  <TouchableOpacity
                    style={[s.filterChip, historySortNewestFirst && s.filterChipActive]}
                    activeOpacity={0.8}
                    onPress={() => setHistorySortNewestFirst(true)}
                  >
                    <Text style={[s.filterChipTxt, historySortNewestFirst && s.filterChipTxtActive]}>{t('training.sortNewestFirst')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.filterChip, !historySortNewestFirst && s.filterChipActive]}
                    activeOpacity={0.8}
                    onPress={() => setHistorySortNewestFirst(false)}
                  >
                    <Text style={[s.filterChipTxt, !historySortNewestFirst && s.filterChipTxtActive]}>{t('training.sortOldestFirst')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {historyItems.length === 0 ? (
              <View style={s.emptyCard}>
                <Text style={s.emptyIcon}>🏐</Text>
                <Text style={s.emptyTitle}>{t('training.noHistoryTitle')}</Text>
                <Text style={s.emptyDesc}>{t('training.noHistoryDesc')}</Text>
              </View>
            ) : (
              historyItems.map((row) => {
                const missed = !row.completed;
                return (
                  <TouchableOpacity
                    key={row.id}
                    style={s.historyRow}
                    activeOpacity={0.78}
                    onPress={() => navigation.navigate('StartTraining', { planId: row.planId })}
                  >
                    <View style={[s.checkIcon, missed && s.checkIconMissed]}>
                      <Icon name={missed ? 'tamamlanmadi' : 'tamamlandi'} size={16} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={s.historyName} numberOfLines={1}>{row.planName}</Text>
                        <Text style={s.historyArrow}>›</Text>
                      </View>
                      <Text style={s.historyDate}>
                        {row.date.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' })}
                        {row.time ? ` • ${row.time}` : ''}
                      </Text>
                    </View>
                    <Text style={[s.historyPct, missed && s.historyPctMissed]}>{missed ? t('common.notDone') : t('common.completed')}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {tab === 'list' && (
        <View style={s.stickyFooter}>
          {selectMode ? (
            <TouchableOpacity
              style={[s.deleteBtn, selectedIds.length === 0 && s.deleteBtnDisabled]}
              activeOpacity={0.85}
              disabled={selectedIds.length === 0}
              onPress={() => setConfirmBulkDelete(true)}
            >
              <Text style={s.deleteBtnTxt}>{t('training.deleteSelected', { n: selectedIds.length })}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={s.newBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('NewTrainingChoice')}
            >
              <Text style={s.newBtnTxt}>{t('training.newSession')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Modal
        visible={confirmBulkDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmBulkDelete(false)}
      >
        <View style={s.confirmOverlay}>
          <View style={s.confirmCard}>
            <Text style={s.confirmTitle}>{t('training.deleteSelectedTitle')}</Text>
            <Text style={s.confirmBody}>{t('training.deleteSelectedBody', { n: selectedIds.length })}</Text>
            <View style={s.confirmBtnRow}>
              <TouchableOpacity
                style={s.confirmCancelBtn}
                activeOpacity={0.8}
                onPress={() => setConfirmBulkDelete(false)}
              >
                <Text style={s.confirmCancelTxt}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.confirmDeleteBtn}
                activeOpacity={0.85}
                onPress={() => {
                  selectedIds.forEach((id) => deletePlan.mutate(id));
                  setConfirmBulkDelete(false);
                  setSelectedIds([]);
                  setSelectMode(false);
                }}
              >
                <Text style={s.confirmDeleteTxt}>{t('common.remove')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!selectedDay}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedDay(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>
                {selectedDay ? parseLocalDate(selectedDay).toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDay(null)} style={s.modalCloseBtn}>
                <Text style={s.modalCloseTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            {sessionsForDay.length === 0 ? (
              <Text style={s.empty}>{t('training.noneOnDay')}</Text>
            ) : (
              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                {sessionsForDay.map((sess: ScheduledSession) => {
                  const plan = plans.find((p) => p.id === sess.plan_id);
                  if (!plan) return null;
                  const breakdown = buildPhaseBreakdown(plan, colors, lang);
                  return (
                    <TouchableOpacity
                      key={sess.id}
                      style={s.dayModalRow}
                      activeOpacity={0.78}
                      onPress={() => {
                        setSelectedDay(null);
                        navigation.navigate('StartTraining', { planId: plan.id });
                      }}
                    >
                      <View style={s.dayModalHeaderRow}>
                        <Text style={s.dayModalIcon}>🏐</Text>
                        <Text style={s.dayModalName} numberOfLines={1}>{plan.name}</Text>
                        {sess.completed && <Icon name="tamamlandi" size={14} />}
                        {isSessionMissed(sess) && <Icon name="tamamlanmadi" size={14} />}
                        {sess.session_time && <Text style={s.dayModalTime}>{sess.session_time}</Text>}
                      </View>
                      <View style={s.dayModalPhasesRow}>
                        {breakdown.map((p) => (
                          <View key={p.phase} style={[s.phaseChip, { borderColor: p.color }]}>
                            <PhaseIcon phase={p.phase} size={11} />
                            <Text style={[s.phaseChipTxt, { color: p.color }]}>{p.label}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 18, color: colors.foreground },
  headerTitle: { color: colors.foreground, fontSize: 18, fontWeight: '800' },

  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
  },
  tabActive: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  tabTxt: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  tabTxtActive: { color: colors.accent },

  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  allLink: { color: colors.accent, fontSize: 12, fontWeight: '700' },

  filterBtn: {
    borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  filterBtnTxt: { color: colors.foreground, fontSize: 12, fontWeight: '600' },
  filterGroupLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  filterChip: {
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.card,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  filterChipActive: { borderColor: colors.accent, backgroundColor: colors.accent + '20' },
  filterChipTxt: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  filterChipTxtActive: { color: colors.accent },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 14, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  thumb: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbIcon: { fontSize: 20 },
  cardName: { color: colors.foreground, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  scheduledIcon: { fontSize: 12, marginBottom: 2 },
  cardMeta: { color: colors.muted, fontSize: 12, marginBottom: 2 },
  activeTag: { color: colors.success, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  createdDate: { color: colors.muted, fontSize: 11 },
  cardProgress: { alignItems: 'flex-end', width: 52, gap: 4 },
  progressPct: { color: colors.success, fontSize: 13, fontWeight: '800' },
  barBg: { width: 44, height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, backgroundColor: colors.success, borderRadius: 3 },
  cardArrow: { color: colors.muted, fontSize: 20 },

  stickyFooter: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
  newBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  newBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  cardSelected: { borderColor: colors.accent, backgroundColor: colors.accent + '12' },
  checkbox: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { borderColor: colors.accent, backgroundColor: colors.accent },
  checkboxTick: { color: '#fff', fontSize: 18, fontWeight: '800' },
  deleteBtn: { backgroundColor: colors.error, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  deleteBtnDisabled: { opacity: 0.45 },
  deleteBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  confirmOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 28,
  },
  confirmCard: {
    width: '100%', backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 20,
  },
  confirmTitle: { color: colors.foreground, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  confirmBody: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  confirmBtnRow: { flexDirection: 'row', gap: 10 },
  confirmCancelBtn: {
    flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border,
    paddingVertical: 12, alignItems: 'center',
  },
  confirmCancelTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  confirmDeleteBtn: {
    flex: 1, borderRadius: 12, backgroundColor: colors.error,
    paddingVertical: 12, alignItems: 'center',
  },
  confirmDeleteTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },

  emptyCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, marginTop: 20,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 15, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  legend: { flexDirection: 'row', gap: 16, marginTop: 12, marginBottom: 8, paddingHorizontal: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { color: colors.muted, fontSize: 12 },

  listRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border, gap: 10,
  },
  listRowDate: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  listRowName: { color: colors.foreground, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  listRowDone: { opacity: 0.6 },
  listRowNameDone: { textDecorationLine: 'line-through', color: colors.muted },
  listRowCheck: { color: colors.success, fontSize: 13, fontWeight: '800' },
  listRowMissed: { color: colors.error, fontSize: 13, fontWeight: '800' },
  listRowDateMissed: { color: colors.error },

  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  checkIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.success + '25',
    alignItems: 'center', justifyContent: 'center',
  },
  checkIconMissed: { backgroundColor: colors.error + '25' },
  checkTxt: { color: colors.success, fontSize: 14, fontWeight: '800' },
  checkTxtMissed: { color: colors.error },
  historyName: { color: colors.foreground, fontSize: 14, fontWeight: '700' },
  historyArrow: { color: colors.muted, fontSize: 16 },
  historyMeta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  historyDate: { color: colors.muted, fontSize: 11, marginTop: 2 },
  historyPct: { color: colors.success, fontSize: 13, fontWeight: '800' },
  historyPctMissed: { color: colors.error },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 28 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { color: colors.foreground, fontSize: 16, fontWeight: '800', flex: 1, marginRight: 10 },
  modalCloseBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  modalCloseTxt: { color: colors.foreground, fontSize: 14, fontWeight: '700' },

  dayModalRow: {
    backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  dayModalHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dayModalIcon: { fontSize: 16 },
  dayModalName: { color: colors.foreground, fontSize: 14, fontWeight: '700', flex: 1 },
  dayModalTime: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  dayModalPhasesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phaseChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
  },
  phaseChipTxt: { fontSize: 11, fontWeight: '600' },
  });
}
