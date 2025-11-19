// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email?: string;
  nick: string;
  isGuest: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, nick: string) => Promise<void>;
  register: (email: string, password: string, nick: string) => Promise<void>;
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
        if (json) {
          setUser(JSON.parse(json));
        }
      } catch (e) {
        console.warn('Не удалось загрузить пользователя', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const saveUser = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem('@user', JSON.stringify(userData));
  };

  const login = async (email: string, nick: string) => {
    const userData: User = {
      id: Date.now().toString(),
      email,
      nick,
      isGuest: false,
    };
    await saveUser(userData);
  };

  const register = async (email: string, password: string, nick: string) => {
    await login(email, nick);
  };

  const loginAsGuest = async (nick: string) => {
    const guestData: User = {
      id: 'guest_' + Date.now(),
      nick: nick || 'Гость',
      isGuest: true,
    };
    await saveUser(guestData);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(['@user']);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, loginAsGuest, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};