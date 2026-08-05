import { useCallback } from 'react';
import { useServerFavorites } from './useServerFavorites';

// Account-synced glossary term favorites — uses the same backend key as the
// web app (net-pro-plans-main/src/pages/Glossary.tsx) so favorites match
// across mobile and web for the same account.
const GLOSSARY_FAV_KEY = 'glossary_favorites';

export function useSozlukFavorites() {
  const { items: favorites, setItems: setFavorites } = useServerFavorites(GLOSSARY_FAV_KEY, []);

  const toggleFavorite = useCallback((termId: number) => {
    setFavorites(favorites.includes(termId) ? favorites.filter((id) => id !== termId) : [...favorites, termId]);
  }, [favorites, setFavorites]);

  const isFavorite = useCallback(
    (termId: number) => favorites.includes(termId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
