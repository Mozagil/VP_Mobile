import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, darkColors, lightColors } from './palettes';

export type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: Colors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const STORAGE_KEY = 'voleypro_theme_mode';

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: darkColors,
  setMode: () => {},
  toggleMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setModeState(saved);
    });
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };
  const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, colors: mode === 'dark' ? darkColors : lightColors, setMode, toggleMode }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
