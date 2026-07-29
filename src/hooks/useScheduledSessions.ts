import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { ScheduledSession } from '../data/types';

const QUERY_KEY = ['scheduled-sessions'];

export function useScheduledSessions() {
  return useQuery<ScheduledSession[]>({
    queryKey: QUERY_KEY,
    queryFn: () => apiClient.get('/scheduled-sessions').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateScheduledSession() {
  const qc = useQueryClient();
  return useMutation(
    (data: { plan_id: string; session_date: string; session_time?: string }) =>
      apiClient
        .post('/scheduled-sessions', {
          plan_id: data.plan_id,
          sessions: [{ session_date: data.session_date, session_time: data.session_time }],
        })
        .then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useUpdateScheduledSessionTime() {
  const qc = useQueryClient();
  return useMutation(
    (data: { sessionId: string; session_date: string; session_time?: string }) =>
      apiClient
        .patch(`/scheduled-sessions/${data.sessionId}`, {
          session_date: data.session_date, session_time: data.session_time,
        })
        .then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}

export function useCompleteScheduledSession() {
  const qc = useQueryClient();
  return useMutation(
    (sessionId: string) =>
      apiClient.patch(`/scheduled-sessions/${sessionId}`, { completed: true }).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}
