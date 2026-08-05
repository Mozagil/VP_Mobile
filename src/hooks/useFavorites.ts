import { useCallback } from 'react';
import { useServerFavorites } from './useServerFavorites';

// Account-synced drill favorites — uses the same backend key as the web app
// (net-pro-plans-main/src/pages/TrainingLibrary.tsx) so favorites match
// across mobile and web for the same account.
const FAVORITES_KEY = 'voleypro_favorites';

export function useFavorites() {
  const { items: favorites, setItems: setFavorites } = useServerFavorites(FAVORITES_KEY, []);

  const toggleFavorite = useCallback((drillId: number) => {
    setFavorites(favorites.includes(drillId) ? favorites.filter((id) => id !== drillId) : [...favorites, drillId]);
  }, [favorites, setFavorites]);

  const isFavorite = useCallback(
    (drillId: number) => favorites.includes(drillId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
