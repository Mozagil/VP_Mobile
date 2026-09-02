import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { TrainingPlan } from '../data/types';

const QUERY_KEY = ['training-plans'];

export function useTrainingPlans() {
  return useQuery<TrainingPlan[]>({
    queryKey: QUERY_KEY,
    queryFn: () => apiClient.get('/training-plans').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<TrainingPlan>) => apiClient.post('/training-plans', data).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation(
    ({ id, ...data }: Partial<TrainingPlan> & { id: string }) =>
      apiClient.put(`/training-plans/${id}`, data).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useUpdatePlanStatus() {
  const qc = useQueryClient();
  return useMutation(
    ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/training-plans/${id}`, { status }).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

// Backend'de PATCH yalnizca status/location kabul ediyor, isim degistirmek icin
// PUT gerekiyor. PUT ise plan drill'lerini silip payload'dan yeniden yaziyor;
// bu yuzden mevcut hareketler sirasi bozulmadan oldugu gibi geri gonderiliyor.
export function useRenamePlan() {
  const qc = useQueryClient();
  return useMutation(
    ({ plan, name }: { plan: TrainingPlan; name: string }) =>
      apiClient.put(`/training-plans/${plan.id}`, {
        name,
        team: plan.team,
        location: plan.location,
        drills: [...plan.drills]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((pd) => ({
            drill_id: pd.drill_id,
            phase: pd.phase,
            completed: pd.completed,
            custom_name: pd.custom_name,
            custom_skill: pd.custom_skill,
            custom_duration: pd.custom_duration,
            note: pd.note,
          })),
      }).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation(
    (id: string) => apiClient.delete(`/training-plans/${id}`),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useToggleDrillComplete() {
  const qc = useQueryClient();
  return useMutation(
    ({ drillRowId, completed }: { drillRowId: string; completed: boolean }) =>
      apiClient.patch(`/plan-drills/${drillRowId}`, { completed }).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useRemoveDrillFromPlan() {
  const qc = useQueryClient();
  return useMutation(
    (drillRowId: string) => apiClient.delete(`/plan-drills/${drillRowId}`),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useAddDrillsToPlan() {
  const qc = useQueryClient();
  return useMutation(
    ({ planId, name, team, drills }: {
      planId: string;
      name: string;
      team?: string | null;
      drills: Array<{
        drill_id: number;
        phase: string;
        sort_order: number;
        completed: boolean;
        custom_name?: string | null;
        custom_skill?: string | null;
      }>;
    }) =>
      apiClient.put(`/training-plans/${planId}`, { name, team, drills }).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}
