// app/(game)/game-over.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { saveGameResult } from '../../src/services/gameHistory';

export default function GameOverScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const params = useLocalSearchParams();
  const {
    reason = 'Поражение',
    score = '0',
    target = '50',
    timeUsed = '0',
    timeSeconds = '30',
    playerLevel = '1',
  } = params;

  // Сохраняем поражение
  React.useEffect(() => {
    saveGameResult({
      nick: user?.nick || 'Гость',
      timeSeconds: Number(timeSeconds),
      targetScore: Number(target),
      achievedScore: Number(score),
      durationSeconds: Number(timeUsed),
      won: false,
      playerLevel: Number(playerLevel),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => router.replace('/(game)/menu')}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Вы проиграли!</Text>
          <Text style={styles.reason}>{reason}</Text>

          <Text style={styles.stats}>
            Набрано: {score} из {target} очков{'\n'}
            Время: {timeUsed} сек
          </Text>

          <Text style={styles.tapHint}>Тапни в любое место, чтобы выйти</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 56, fontWeight: 'bold', color: '#ff0266', textAlign: 'center' },
  reason: { fontSize: 28, color: '#ff0266', marginTop: 20 },
  stats: { fontSize: 22, color: '#aaa', textAlign: 'center', marginTop: 50, lineHeight: 34 },
  tapHint: { fontSize: 18, color: '#666', marginTop: 80 },
});