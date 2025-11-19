// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';

// Главный layout — оборачиваем всё в провайдеры
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false, // скрываем заголовки у всех экранов
              animation: 'slide_from_right',
            }}
          >
            {/* Все экраны автоматически подхватываются из папки app */}
            <Stack.Screen name="index" />
            <Stack.Screen name="main" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
            <Stack.Screen name="(auth)/register-guest" />
            <Stack.Screen name="(game)/level-setup" />
            <Stack.Screen name="(game)/gameplay" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="history" />
            <Stack.Screen name="settings" />
            {/* Добавляй сюда новые экраны — они будут работать автоматически */}
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}