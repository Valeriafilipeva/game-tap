// app/(game)/level-setup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function LevelSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [timeSeconds, setTimeSeconds] = useState('30');
  const [targetScore, setTargetScore] = useState('');

  // Проверка: только цифры и не пустое
  const isValidTime = timeSeconds && /^\d+$/.test(timeSeconds) && parseInt(timeSeconds) >= 10;
  const isValidScore = targetScore && /^\d+$/.test(targetScore) && parseInt(targetScore) >= 1;

  const timePresets = [30, 60, 90];

  const handleStart = () => {
    if (!isValidTime) {
      Alert.alert('Ошибка', 'Введите время: только положительное число (минимум 10 сек)');
      return;
    }
    if (!isValidScore) {
      Alert.alert('Ошибка', 'Введите цель: только ПОЛОЖИТЕЛЬНОЕ ЧИСЛО (минимум 1)!\nБуквы, знаки, 0 — запрещены.');
      return;
    }

    const time = parseInt(timeSeconds);
    const target = parseInt(targetScore);

    router.push({
      pathname: '/(game)/gameplay',
      params: {
        timeSeconds: time.toString(),
        targetScore: target.toString(),
        playerLevel: '1',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Настройка уровня</Text>
      <Text style={styles.player}>Игрок: <Text style={styles.nick}>{user?.nick || 'Гость'}</Text></Text>

      {/* ВРЕМЯ */}
      <View style={styles.section}>
        <Text style={styles.label}>Время уровня (сек)</Text>
        <View style={styles.presets}>
          {timePresets.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.preset, timeSeconds === p.toString() && styles.active]}
              onPress={() => setTimeSeconds(p.toString())}
            >
              <Text style={[styles.presetText, timeSeconds === p.toString() && styles.activeText]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={[styles.input, !isValidTime && targetScore !== '' && styles.errorInput]}
          value={timeSeconds}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setTimeSeconds(text); // только цифры
          }}
          keyboardType="number-pad"
          placeholder="от 10 сек"
          placeholderTextColor="#666"
        />
      </View>

      {/* ЦЕЛЬ ОЧКОВ */}
      <View style={styles.section}>
        <Text style={styles.label}>Набрать очков</Text>
        <TextInput
          style={[styles.input, !isValidScore && targetScore !== '' && styles.errorInput]}
          value={targetScore}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setTargetScore(text); // только цифры
          }}
          keyboardType="number-pad"
          placeholder="например 50"
          placeholderTextColor="#666"
        />
        {!isValidScore && targetScore !== '' && (
          <Text style={styles.errorText}>
            Введите ПОЛОЖИТЕЛЬНОЕ ЧИСЛО! (минимум 1)
          </Text>
        )}
      </View>

      <PrimaryButton
        title="НАЧАТЬ ИГРУ"
        onPress={handleStart}
        style={{ backgroundColor: isValidScore && isValidTime ? '#ff006e' : '#444' }}
        disabled={!isValidScore || !isValidTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20 },
  title: { fontSize: 38, fontWeight: 'bold', color: '#00ff88', textAlign: 'center', marginTop: 40 },
  player: { fontSize: 18, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  nick: { color: '#00ff88', fontWeight: 'bold' },
  section: { marginBottom: 30 },
  label: { fontSize: 22, color: '#fff', textAlign: 'center', marginBottom: 12 },
  presets: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 16 },
  preset: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#1a1a2e', borderRadius: 12, borderWidth: 2, borderColor: '#333' },
  active: { backgroundColor: '#00ff88', borderColor: '#00ff88' },
  presetText: { color: '#fff', fontWeight: 'bold' },
  activeText: { color: '#000' },
  input: { backgroundColor: '#1a1a2e', color: '#fff', fontSize: 28, textAlign: 'center', padding: 18, borderRadius: 16, borderWidth: 2, borderColor: '#333' },
  errorInput: { borderColor: '#ff4400', backgroundColor: '#44000022' },
  errorText: { color: '#ff4400', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
});