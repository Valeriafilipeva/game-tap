import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { useRouter } from 'expo-router';

function LayoutWithAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // если обычный пользователь авторизован — в main
    if (user && !user.isGuest) {
      router.replace('/main');
    }
  }, [user, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="main" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="guest" />
      <Stack.Screen name="guest-nick" />
      <Stack.Screen name="platform" />

      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />

      <Stack.Screen name="(game)/level-setup" />
      <Stack.Screen name="(game)/gameplay" />

      <Stack.Screen name="profile" />
      <Stack.Screen name="history" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <LayoutWithAuth />
          </AuthProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
