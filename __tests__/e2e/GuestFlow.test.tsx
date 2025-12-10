import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../src/contexts/AuthContext';
import GuestNickScreen from '../../app/(auth)/guest-nick';
import HistoryScreen from '../../app/history';
import StartScreen from '../../app/index';
import PrimaryButton from '../../components/PrimaryButton';

// сценарий игры как гость


describe('Full guest scenario', () => {
  it('guest can enter nickname, play and see history', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <NavigationContainer>
        <AuthProvider>
          <StartScreen />
        </AuthProvider>
      </NavigationContainer>
    );

    // Проверяем стартовый экран
    expect(getByText('Играть как гость')).toBeTruthy();

    // Имитируем переход на guest-nick
    fireEvent.press(getByText('Играть как гость'));

    // Здесь должен быть экран ввода ника
    const nickInput = getByPlaceholderText('Котик228');
    fireEvent.changeText(nickInput, 'Tester');

    fireEvent.press(getByText('Начать игру'));

    // Имитация завершения игры
    // Например, можно вызвать функцию saveGameResult напрямую через мок
    await waitFor(() => {
      // Проверяем, что после игры можно перейти в историю
      render(
        <NavigationContainer>
          <AuthProvider>
            <HistoryScreen />
          </AuthProvider>
        </NavigationContainer>
      );
      expect(queryByText('Tester')).toBeTruthy(); // Ник должен быть в истории
    });
  });
});
