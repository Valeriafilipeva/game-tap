import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Что тестируем: что loginAsGuest корректно создает гостевого пользователя и сохраняет данные в AsyncStorage.
// Модульное тестирование (Unit tests)
// Цель: проверка отдельных компонентов и функций.

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('AuthContext', () => {
  it('loginAsGuest sets user correctly', async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.loginAsGuest('Tester');
    });

    expect(result.current.user).toMatchObject({ nick: 'Tester', isGuest: true });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@guest', expect.any(String));
  });
});
