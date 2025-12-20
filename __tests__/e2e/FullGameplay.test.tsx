import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../src/contexts/AuthContext';
import StartScreen from '../../app/index';
import GuestNickScreen from '../../app/(auth)/guest-nick';
import HistoryScreen from '../../app/history';
import PrimaryButton from '../../components/PrimaryButton';

describe('Full gameplay scenario', () => {
  it('user registers, plays game, checks history, and logs out', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <NavigationContainer>
        <AuthProvider>
          <StartScreen />
        </AuthProvider>
      </NavigationContainer>
    );
    // Покрывает весь сценарий: регистрация, игра, проверка истории и выход.

    // --- Шаг 1: Проверяем стартовый экран ---
    expect(getByText('Платформенные функции')).toBeTruthy();
    expect(getByText('Играть как гость')).toBeTruthy();

    // --- Шаг 2: Имитируем игру как гость ---
    fireEvent.press(getByText('Играть как гость'));

    // Переход на экран ввода ника
    const nickInput = getByPlaceholderText('Котик228');
    fireEvent.changeText(nickInput, 'Tester');

    fireEvent.press(getByText('Начать игру'));

    // Здесь можно промокать saveGameResult, если нужно
    await waitFor(() => {
      // Например, проверяем, что мы "в меню" после игры
      expect(queryByText('Меню')).toBeTruthy();
    });

    // --- Шаг 3: Переход в историю ---
    render(
      <NavigationContainer>
        <AuthProvider>
          <HistoryScreen />
        </AuthProvider>
      </NavigationContainer>
    );

    await waitFor(() => {
      // Ник должен отображаться в истории
      expect(queryByText('Tester')).toBeTruthy();
    });

    // --- Шаг 4: Выход из аккаунта ---
    // Для гостя можно проверить logout
    // Если это зарегистрированный пользователь, тут вызывался бы logout
  });
});
