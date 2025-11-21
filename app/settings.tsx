// app/settings.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useSettings } from '../src/contexts/SettingsContext';
import AppHeader from '../components/AppHeader';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { soundsEnabled, toggleSounds } = useSettings();
  const router = useRouter();

  // Подбираем цвета "вручную" внутри компонента
  const colors = {
    background: isDark ? '#181826' : '#fff',
    surface: isDark ? '#232338' : '#eee',
    primary: isDark ? '#00ff88' : '#6200ee',
    text: isDark ? '#fff' : '#000',
    buttonBg: isDark ? '#00ff88' : '#6200ee',
    buttonText: isDark ? '#181826' : '#fff'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader />

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.primary }]}>Настройки</Text>

        <TouchableOpacity style={[styles.option, { backgroundColor: colors.surface }]} onPress={toggleTheme}>
          <Text style={[styles.optionText, { color: colors.text }]}>
            Тема: {isDark ? 'Тёмная' : 'Светлая'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { backgroundColor: colors.surface }]} onPress={toggleSounds}>
          <Text style={[styles.optionText, { color: colors.text }]}>
            Звуки: {soundsEnabled ? 'Включены' : 'Выключены'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={() => router.replace('/main')}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Назад в меню</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: 20, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '800', marginVertical: 20 },
  option: { width: '100%', padding: 16, borderRadius: 12, marginVertical: 10, alignItems: 'center' },
  optionText: { fontSize: 18, fontWeight: '600' },
  button: { marginTop: 30, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
