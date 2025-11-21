// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
  soundsEnabled: boolean;
  toggleSounds: () => void;
  setSoundsEnabled: (v: boolean) => void;
  isLoading: boolean;
};

const STORAGE_KEY = '@app_settings_sounds';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundsEnabled, setSoundsEnabledState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw !== null) setSoundsEnabledState(raw === '1');
      } catch (e) {
        console.warn('Не удалось загрузить настройки звуков', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, soundsEnabled ? '1' : '0');
      } catch (e) {
        console.warn('Не удалось сохранить настройки звуков', e);
      }
    })();
  }, [soundsEnabled]);

  const toggleSounds = () => setSoundsEnabledState(prev => !prev);
  const setSoundsEnabled = (v: boolean) => setSoundsEnabledState(v);

  return (
    <SettingsContext.Provider value={{ soundsEnabled, toggleSounds, setSoundsEnabled, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
