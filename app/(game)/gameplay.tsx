// app/(game)/gameplay.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useAuth } from '../../src/contexts/AuthContext';
import { saveGameResult } from '../../src/services/gameHistory';

export default function GameplayScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const { timeSeconds, targetScore, playerLevel = '1' } = useLocalSearchParams<{
    timeSeconds: string;
    targetScore: string;
    playerLevel?: string;
  }>();

  const totalTime = parseInt(timeSeconds || '30');
  const target = parseInt(targetScore || '50');
  const currentLevel = parseInt(playerLevel || '1');

  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Звуки
  const [tapSound, setTapSound] = useState<Audio.Sound | null>(null);
  const [victorySound, setVictorySound] = useState<Audio.Sound | null>(null);
  const [failSound, setFailSound] = useState<Audio.Sound | null>(null);

  // Загрузка звуков
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: tap } = await Audio.Sound.createAsync(
          require('../../assets/sounds/tap.mp3')
        );
        setTapSound(tap);

        const { sound: victory } = await Audio.Sound.createAsync(
          require('../../assets/sounds/victory.mp3')
        );
        setVictorySound(victory);

        const { sound: fail } = await Audio.Sound.createAsync(
          require('../../assets/sounds/fail.mp3')
        );
        setFailSound(fail);
      } catch (e) {
        console.warn('Ошибка загрузки звуков:', e);
      }
    };
    loadSounds();

    return () => {
      tapSound?.unloadAsync();
      victorySound?.unloadAsync();
      failSound?.unloadAsync();
    };
  }, []);

  const playTap = async () => {
    try {
      if (tapSound) {
        await tapSound.setPositionAsync(0);
        await tapSound.playAsync();
      }
    } catch (e) {
      console.warn('Ошибка звука тапа:', e);
    }
  };

  const playVictory = async () => {
    try {
      if (victorySound) {
        await victorySound.setPositionAsync(0);
        await victorySound.playAsync();
      }
    } catch (e) {
      console.warn('Ошибка звука победы:', e);
    }
  };

  const playFail = async () => {
    try {
      if (failSound) {
        await failSound.setPositionAsync(0);
        await failSound.playAsync();
      }
    } catch (e) {
      console.warn('Ошибка звука поражения:', e);
    }
  };

  // Таймер
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endGame(currentScore >= target);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive, timeLeft]);

  // Проверка победы
  useEffect(() => {
    if (currentScore >= target && gameActive) {
      endGame(true);
    }
  }, [currentScore, target, gameActive]);

  const handleTap = useCallback(() => {
    if (!gameActive) return;

    setCurrentScore(prev => prev + 1);
    Vibration.vibrate(20);
    playTap(); // ✅ ЗВУК ТАПА

    if (idleTimer) clearTimeout(idleTimer);
    const newTimer = setTimeout(() => endGame(false), 5000);
    setIdleTimer(newTimer);
  }, [gameActive, idleTimer]);

  const endGame = async (won: boolean) => {
    if (!gameActive) return; // Предотвращаем повторные вызовы
    setGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (idleTimer) clearTimeout(idleTimer);

    Vibration.vibrate(won ? 500 : 200);
    if (won) playVictory();
    else playFail();

    const usedTime = totalTime - timeLeft;
    await saveGameResult({
      nick: user?.nick || 'Гость',
      timeSeconds: totalTime,
      targetScore: target,
      achievedScore: currentScore,
      durationSeconds: usedTime,
      won,
      playerLevel: currentLevel,
    });

    setTimeout(() => {
      if (won) {
        // ✅ ОКНО ПОБЕ democratization
        Alert.alert(
          '🎉 Поздравляем!',
          `Вы перешли на новый уровень!\nУровень ${currentLevel} → ${currentLevel + 1}`,
          [
            {
              text: 'Далее',
              onPress: () => router.replace({
                pathname: '/(game)/level-setup',
                params: {
                  playerLevel: (currentLevel + 1).toString(), // ✅ ПОВЫШЕНИЕ УРОВНЯ
                },
              }),
            },
          ]
        );
      } else {
        Alert.alert(
          '😔 Поражение',
          'Время вышло или бездействие!',
          [{ text: 'В меню', onPress: () => router.replace('/main') }]
        );
      }
    }, 300);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const exitGame = () => {
    Alert.alert('Выход', 'Завершить игру?', [
      { text: 'Продолжить', style: 'cancel' },
      { text: 'В меню', onPress: () => router.replace('/main') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>⏱️</Text>
          <Text style={styles.value}>{formatTime(timeLeft)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>🎯</Text>
          <Text style={styles.value}>{currentScore}/{target}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>#</Text>
          <Text style={styles.value}>{currentLevel}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.tapCircle} onPress={handleTap} activeOpacity={0.7}>
        <Text style={styles.tapText}>ТАП!</Text>
        <Text style={styles.tapEmoji}>👆</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
        <Text style={styles.exitText}>← Меню</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.player}>{user?.nick || 'Гость'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 60 },
  infoBox: { alignItems: 'center' },
  label: { fontSize: 16, color: '#aaa' },
  value: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  tapCircle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#ff006e', // ✅ РОЗОВЫЙ КРУГ
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 60,
    shadowColor: '#ff006e',
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 30,
  },
  tapText: { fontSize: 56, fontWeight: 'bold', color: '#fff' },
  tapEmoji: { fontSize: 80, marginTop: 10 },
  exitBtn: { backgroundColor: '#444', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, alignSelf: 'center' },
  exitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { paddingBottom: 40, alignItems: 'center' },
  player: { fontSize: 20, color: '#aaa', fontWeight: '600' },
});