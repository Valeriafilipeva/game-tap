import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthProvider } from '../../../src/contexts/AuthContext';
import GuestNickScreen from '../guest-nick';
import { NavigationContainer } from '@react-navigation/native';

// Что тестируем: корректную интеграцию AuthContext, ввод ника и навигацию.
// Интеграционное тестирование
// Цель: проверить взаимодействие экранов и контекстов.

test('guest flow: set nick and navigate to menu', () => {
  const { getByText, getByPlaceholderText } = render(
    <NavigationContainer>
      <AuthProvider>
        <GuestNickScreen />
      </AuthProvider>
    </NavigationContainer>
  );

  fireEvent.changeText(getByPlaceholderText('Котик228'), 'Tester');
  fireEvent.press(getByText('Начать игру'));

  // тут можно проверить, что useRouter.replace был вызван с "/(game)/menu"
});
