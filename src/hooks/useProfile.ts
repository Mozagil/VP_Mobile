import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Profile } from '../data/types';

const QUERY_KEY = ['profile'];

export function useProfile() {
  return useQuery<Profile>({
    queryKey: QUERY_KEY,
    queryFn: () => apiClient.get('/profiles/me').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<Profile>) => apiClient.patch('/profiles/me', data).then((r) => r.data),
    { onSuccess: () => qc.invalidateQueries(QUERY_KEY) },
  );
}
