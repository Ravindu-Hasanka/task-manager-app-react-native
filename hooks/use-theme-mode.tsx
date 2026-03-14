import React, { createContext, useContext, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeMode } from '@/types/theme-mode';

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeModeContext.Provider
      value={{
        mode,
        toggleTheme: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
      }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }

  return context;
}
