import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'voleypro_sozluk_favorites';

export function useSozlukFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try { setFavorites(JSON.parse(val)); } catch {}
      }
    });
  }, []);

  const toggleFavorite = useCallback((term: string) => {
    setFavorites((prev) => {
      const next = prev.includes(term)
        ? prev.filter((t) => t !== term)
        : [...prev, term];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (term: string) => favorites.includes(term),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
