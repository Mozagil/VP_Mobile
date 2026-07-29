import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'voleypro_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try { setFavorites(JSON.parse(val)); } catch {}
      }
    });
  }, []);

  const toggleFavorite = useCallback((drillId: number) => {
    setFavorites((prev) => {
      const next = prev.includes(drillId)
        ? prev.filter((id) => id !== drillId)
        : [...prev, drillId];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (drillId: number) => favorites.includes(drillId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
