// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGameHistory, saveGameResult, GameResult } from '../services/gameHistory';

type User = {
  id: string;
  nick: string;
  isGuest: boolean;
  level: number; // добавляем уровень
};

type AuthContextType = {
  user: User | null;
  setUserLevel?: (level: number) => Promise<void>; // метод для обновления уровня
  login: (nick: string, password: string) => Promise<void>;
  register: (nick: string, password: string) => Promise<void>;
  loginAsGuest: (nick: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('@user');
        if (json) setUser(JSON.parse(json));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);
  
  const setUserLevel = async (level: number) => {
  if (!user) return;
  const updatedUser = { ...user, level };
  setUser(updatedUser);
  await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
};


  const saveUser = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem('@user', JSON.stringify(userData));
  };

  const login = async (nick: string, password: string) => {
    const registeredUser: User = { id: Date.now().toString(), nick, isGuest: false };

    // перенос истории гостя
    const guest = await AsyncStorage.getItem('@guest');
    if (guest) {
      const guestId = guest;
      const history = await getGameHistory();
      const updatedHistory = history.map(h => (h.nick === guestId ? { ...h, nick: nick } : h));
      await AsyncStorage.setItem('@game_history', JSON.stringify(updatedHistory));
      await AsyncStorage.removeItem('@guest');
    }

    await saveUser(registeredUser);
  };

  const register = async (nick: string, password: string) => {
    await login(nick, password);
  };

  const loginAsGuest = async (nick: string) => {
    const guestId = 'guest_' + Date.now();
    const guestData: User = { id: guestId, nick: nick || 'Гость', isGuest: true };
    await saveUser(guestData);
    await AsyncStorage.setItem('@guest', guestId); // для переноса истории
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsGuest, logout, isLoading, setUserLevel }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};
