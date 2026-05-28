import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTrainingPlans, useDeletePlan } from '../../hooks/useTrainingPlans';
import { TrainingPlan } from '../../data/types';
import { colors } from '../../theme/colors';

type PlansStackParamList = {
  PlanList: undefined;
  PlanDetail: { planId: string };
  CreatePlan: undefined;
};

type Props = { navigation: NativeStackNavigationProp<PlansStackParamList, 'PlanList'> };

// Circular progress ring
function Ring({ pct }: { pct: number }) {
  const color = pct >= 100 ? colors.success : pct > 0 ? colors.accent : colors.border;
  return (
    <View style={[s.ring, { borderColor: color }]}>
      <Text style={[s.ringTxt, { color }]}>{pct}%</Text>
    </View>
  );
}

function PlanRow({
  plan,
  onPress,
  onEdit,
  onDelete,
}: {
  plan: TrainingPlan;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const total = plan.drills.length;
  const done  = plan.drills.filter(d => d.completed).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const date  = plan.created_at
    ? new Date(plan.created_at).toLocaleDateString('tr-TR')
    : '';

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <Ring pct={pct} />

      {/* Main info */}
      <View style={s.cardMid}>
        <View style={s.nameRow}>
          <Text style={s.planName} numberOfLines={1}>{plan.name.toUpperCase()}</Text>
          {plan.team ? (
            <View style={s.teamBadge}>
              <Text style={s.teamBadgeTxt}>{plan.team}</Text>
            </View>
          ) : null}
        </View>
        <Text style={s.meta}>{done}/{total} dril{date ? `  ·  ${date}` : ''}</Text>

        {/* Progress bar */}
        <View style={s.barBg}>
          <View style={[s.barFill, { width: `${pct}%` }]} />
        </View>
      </View>

      {/* Action buttons (Android-safe: outer View owns borderRadius) */}
      <View style={s.actions}>
        <View style={s.actionBtnWrap}>
          <TouchableOpacity style={s.editBtn} onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }} activeOpacity={0.7}>
            <Text style={s.editBtnTxt}>✏️</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.actionBtnWrap, { marginTop: 6 }]}>
          <TouchableOpacity style={s.deleteBtn} onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }} activeOpacity={0.7}>
            <Text style={s.deleteBtnTxt}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PlansScreen({ navigation }: Props) {
  const { data: plans = [], isLoading } = useTrainingPlans();
  const deletePlan = useDeletePlan();

  const handleDelete = (plan: TrainingPlan) => {
    Alert.alert(
      '🗑️ Planı Sil',
      `"${plan.name}" planını silmek istiyor musunuz? Bu işlem geri alınamaz.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deletePlan.mutate(plan.id) },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      {plans.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📋</Text>
          <Text style={s.emptyTitle}>Henüz plan yok</Text>
          <Text style={s.emptyDesc}>Yeni bir antrenman planı oluşturun</Text>
          <View style={s.emptyBtnWrap}>
            <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.navigate('CreatePlan')} activeOpacity={0.8}>
              <Text style={s.emptyBtnTxt}>+ Yeni Plan Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlanRow
              plan={item}
              onPress={() => navigation.navigate('PlanDetail', { planId: item.id })}
              onEdit={() => navigation.navigate('PlanDetail', { planId: item.id })}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {plans.length > 0 && (
        <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('CreatePlan')} activeOpacity={0.85}>
          <Text style={s.fabTxt}>＋</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  list:   { padding: 14, paddingBottom: 90 },

  // Plan row card
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border, gap: 12,
  },
  ring:    { width: 52, height: 52, borderRadius: 26, borderWidth: 3, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ringTxt: { fontSize: 10, fontWeight: '700' },
  cardMid: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  planName: { color: colors.foreground, fontSize: 14, fontWeight: '700', flex: 1 },
  teamBadge: { backgroundColor: colors.cardAlt, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: colors.border },
  teamBadgeTxt: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  meta: { color: colors.muted, fontSize: 12, marginBottom: 6 },
  barBg:   { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },

  // Action buttons
  actions: { flexDirection: 'column', alignItems: 'center' },
  actionBtnWrap: { borderRadius: 8, overflow: 'hidden' },
  editBtn:    { backgroundColor: colors.blue + '22', padding: 8, borderRadius: 8 },
  editBtnTxt: { fontSize: 16 },
  deleteBtn:    { backgroundColor: colors.error + '22', padding: 8, borderRadius: 8 },
  deleteBtnTxt: { fontSize: 16 },

  // Empty state
  empty:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon:   { fontSize: 60, marginBottom: 12 },
  emptyTitle:  { color: colors.foreground, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyDesc:   { color: colors.muted, textAlign: 'center', marginBottom: 24 },
  emptyBtnWrap:{ borderRadius: 12, overflow: 'hidden' },
  emptyBtn:    { backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 14 },
  emptyBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6,
  },
  fabTxt: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
