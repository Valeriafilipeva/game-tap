// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (v: boolean) => void;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  setDark: () => {},
  loading: true,
});

const STORAGE_KEY = 'appTheme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  // Загружаем тему из AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light') setIsDark(false);
        if (saved === 'dark') setIsDark(true);
      } catch (e) {
        console.log('Ошибка загрузки темы', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Сохраняем тему при изменении
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    }
  }, [isDark, loading]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const setDark = (v: boolean) => setIsDark(v);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setDark, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
