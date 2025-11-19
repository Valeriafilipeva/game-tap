// app/main.tsx — БЕЗ РОЗОВОГО КРУГА!
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext'; // ← будем использовать контекст темы

export default function MainScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.title}>GameTap</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text style={styles.nick}>{user?.nick || 'Гость'}</Text>
      </TouchableOpacity>
      </View>

      {/* Кнопки */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(game)/level-setup')}>
          <Text style={styles.buttonText}>Новая игра</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/history')}>
          <Text style={styles.buttonText}>История игр</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
          <Text style={styles.buttonText}>Настройки</Text>
        </TouchableOpacity>
      </View>

      {/* Переключатель темы внизу */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={styles.themeText}>
          {isDark ? 'Тёмная тема' : 'Светлая тема'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ТЁМНАЯ ТЕМА
const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#00ff88' },
  nick: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  buttons: { flex: 1, justifyContent: 'center', gap: 24 },
  button: { backgroundColor: '#ff006e', padding: 20, borderRadius: 16, alignItems: 'center' },
  buttonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  themeToggle: { alignItems: 'center', marginBottom: 40 },
  themeText: { fontSize: 18, color: '#aaa' },
});

// СВЕТЛАЯ ТЕМА
const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#6200ee' },
  nick: { fontSize: 20, color: '#333', fontWeight: 'bold' },
  buttons: { flex: 1, justifyContent: 'center', gap: 24 },
  button: { backgroundColor: '#6200ee', padding: 20, borderRadius: 16, alignItems: 'center' },
  buttonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  themeToggle: { alignItems: 'center', marginBottom: 40 },
  themeText: { fontSize: 18, color: '#666' },
});