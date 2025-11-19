// app/(game)/victory.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { saveGameResult } from '../../src/services/gameHistory';
import PrimaryButton from '../../components/PrimaryButton';

export default function VictoryScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const params = useLocalSearchParams();
  const {
    timeSeconds = '30',
    targetScore = '50',
    achievedScore = '0',
    durationSeconds = '0',
    playerLevel = '1',
  } = params;

  const nextLevel = Number(playerLevel) + 1;

  // Сохраняем результат сразу при загрузке экрана
  React.useEffect(() => {
    saveGameResult({
      nick: user?.nick || 'Гость',
      timeSeconds: Number(timeSeconds),
      targetScore: Number(targetScore),
      achievedScore: Number(achievedScore),
      durationSeconds: Number(durationSeconds),
      won: true,
      playerLevel: Number(playerLevel),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => router.push('/(game)/level-setup')}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Поздравляем!</Text>
          <Text style={styles.subtitle}>Новый уровень открыт</Text>

          <Text style={styles.level}>Уровень {nextLevel}/10</Text>

          <Text style={styles.stats}>
            Набрано: {achievedScore} из {targetScore} очков{'\n'}
            Время: {durationSeconds} сек
          </Text>

          <PrimaryButton
            title="Настроить следующий уровень"
            onPress={() => router.push('/(game)/level-setup')}
            style={{ marginTop: 60, backgroundColor: '#00ff88' }}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 56, fontWeight: 'bold', color: '#00ff88', textAlign: 'center' },
  subtitle: { fontSize: 28, color: '#00ff88', marginTop: 20 },
  level: { fontSize: 64, color: '#ff006e', marginTop: 40, fontWeight: 'bold' },
  stats: { fontSize: 20, color: '#aaa', textAlign: 'center', marginTop: 40, lineHeight: 30 },
});