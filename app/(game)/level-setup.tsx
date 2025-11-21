// app/(game)/level-setup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppHeader from '../../components/AppHeader';
import ProfileButton from '../../components/ProfileButton'; // кликабельный ЛК (как на главной)
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LevelSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [time, setTime] = useState('30');
  const [score, setScore] = useState(''); // поле пустое, игрок вводит сам

  // определяем текущий уровень: сначала из params, иначе из user.level, иначе 1
  const playerLevel = parseInt((params.playerLevel ?? String(user?.level ?? 1)) as string, 10) || 1;

  const start = () => {
    if (!/^\d+$/.test(time) || Number(time) < 10) {
      return Alert.alert('Ошибка', 'Время ≥ 10 сек');
    }
    if (!/^\d+$/.test(score) || Number(score) < 1) {
      return Alert.alert('Ошибка', 'Очки ≥ 1');
    }

    router.push({
      pathname: '/(game)/gameplay',
      params: { timeSeconds: time, targetScore: score, playerLevel: String(playerLevel) },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0f0f23' : '#ffffff' }}>
      <AppHeader />

      {/* ЛК в правом верхнем углу (единый компонент) */}
      <ProfileButton />

      {/* Кнопка "Назад в меню" в левом верхнем углу */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace('/main')}
        activeOpacity={0.8}
      >
        <Text style={styles.backText}>← Назад в меню</Text>
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={[styles.title, { color: isDark ? '#00ff88' : '#6200ee' }]}>Новая игра</Text>

        {/* Показ текущего уровня */}
        <Text style={[styles.currentLevel, { color: isDark ? '#ddd' : '#333' }]}>
          Текущий уровень: <Text style={{ fontWeight: 'bold' }}>#{playerLevel}</Text>
        </Text>

        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Время (сек)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1a1a2e' : '#f0f0f0', color: isDark ? '#fff' : '#000' }]}
          value={time}
          onChangeText={t => /^\d*$/.test(t) && setTime(t)}
          keyboardType="number-pad"
        />

        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Набрать очков</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#1a1a2e' : '#f0f0f0', color: isDark ? '#fff' : '#000' }]}
          value={score}
          onChangeText={s => /^\d*$/.test(s) && setScore(s)}
          keyboardType="number-pad"
          placeholder="Пример: 50"
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.startBtn} onPress={start} activeOpacity={0.85}>
          <Text style={styles.startText}>НАЧАТЬ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 12,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  backText: { color: '#fff', fontSize: 14 },

  body: { flex: 1, padding: 30, justifyContent: 'center' },
  title: { fontSize: 38, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  currentLevel: { fontSize: 18, textAlign: 'center', marginBottom: 18 },
  label: { fontSize: 22, textAlign: 'center', marginTop: 20 },
  input: { padding: 18, borderRadius: 12, textAlign: 'center', fontSize: 26, marginTop: 10 },
  startBtn: { backgroundColor: '#ff006e', padding: 22, borderRadius: 16, marginTop: 50 },
  startText: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
});
