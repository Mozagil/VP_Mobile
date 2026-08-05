import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../auth/AuthContext';

// Account-synced favorites, mirroring the web app's useServerFavorites
// (net-pro-plans-main/src/hooks/useServerStorage.ts) so the same `key`
// produces the same favorite list on both mobile and web.
export function useServerFavorites(key: string, fallback: number[] = []) {
  const { user } = useAuth() as { user: unknown | null };
  const [items, setItems] = useState<number[]>(fallback);

  const reload = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.get<number[]>(`/favorites/${key}`);
      setItems(data ?? []);
    } catch {
      setItems(fallback);
    }
  }, [key, user]);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const save = useCallback(async (next: number[]) => {
    setItems(next);
    if (user) await apiClient.put(`/favorites/${key}`, { item_ids: next });
  }, [key, user]);

  return { items, setItems: save, reload };
}
