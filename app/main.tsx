import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';

export default function MainScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const backgroundColor = isDark ? '#0f0f23' : '#ffffff';
  const textColor = isDark ? '#00ff88' : '#000';

  const displayName = user?.nick || 'Гость';
  const isGuest = user?.isGuest;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Верхний правый угол: кликабельный ЛК */}
      <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
        <Text style={styles.profileText}>
          {displayName} {isGuest ? '(Гость)' : ''}
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Краткая информация о игре */}
        <Text style={[styles.title, { color: textColor }]}>Добро пожаловать в GameTap!</Text>
        <Text style={[styles.description, { color: textColor }]}>
          В этой игре вам нужно нажимать на круг как можно быстрее и набрать указанное количество очков.
          Каждый уровень сложнее предыдущего. Проверьте свои рефлексы и побейте рекорды!
        </Text>

        {/* Картинка игры */}
        <Image
           source={require('../assets/images/game_preview.png')} // вставьте свою картинку
          style={styles.image}
          resizeMode="contain"
        />

        {/* Основные кнопки */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#00ff88' }]}
          onPress={() => router.push('/(game)/level-setup')}
        >
          <Text style={styles.buttonText}>Играть</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#0088ff' }]}
          onPress={() => router.push('/history')}
        >
          <Text style={styles.buttonText}>История игр</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#bb86fc' }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.buttonText}>Настройки</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 10,
    zIndex: 10,
  },
  profileText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    gap: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  description: { fontSize: 16, textAlign: 'center', marginVertical: 10 },

  image: { width: 250, height: 250, marginVertical: 20 },

  button: {
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
});
