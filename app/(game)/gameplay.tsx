// app/(game)/gameplay.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSettings } from '../../src/contexts/SettingsContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { saveGameResult } from '../../src/services/gameHistory';
import AppHeader from '../../components/AppHeader';

export default function GameplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { user, setUserLevel } = useAuth();
  const { soundsEnabled } = useSettings();
  const { isDark } = useTheme();

  const timeSeconds = parseInt((params.timeSeconds ?? '30') as string, 10) || 30;
  const targetScore = parseInt((params.targetScore ?? '50') as string, 10) || 50;
  const currentLevel = parseInt((params.playerLevel ?? String(user?.level ?? 1)) as string, 10) || 1;

  const [timeLeft, setTimeLeft] = useState<number>(timeSeconds);
  const [score, setScore] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);
  const tapSound = useRef<Audio.Sound | null>(null);
  const victorySound = useRef<Audio.Sound | null>(null);

  // Load sounds
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tapRes = await Audio.Sound.createAsync(require('../../assets/sounds/tap.mp3'));
        const vicRes = await Audio.Sound.createAsync(require('../../assets/sounds/victory.mp3'));
        if (!mounted) {
          await tapRes.sound.unloadAsync().catch(() => {});
          await vicRes.sound.unloadAsync().catch(() => {});
          return;
        }
        tapSound.current = tapRes.sound;
        victorySound.current = vicRes.sound;
      } catch (e) {
        // не критично — просто лог
        console.warn('Ошибка при загрузке звуков', e);
      }
    })();

    return () => {
      mounted = false;
      // Unload sounds if loaded
      if (tapSound.current) {
        tapSound.current.unloadAsync().catch(() => {});
        tapSound.current = null;
      }
      if (victorySound.current) {
        victorySound.current.unloadAsync().catch(() => {});
        victorySound.current = null;
      }
    };
  }, []);

  // Play helpers — obey settings.soundsEnabled
  const playTap = async () => {
    if (!soundsEnabled) return;
    try {
      await tapSound.current?.replayAsync();
    } catch {
      // ignore
    }
  };
  const playVictory = async () => {
    if (!soundsEnabled) return;
    try {
      await victorySound.current?.replayAsync();
    } catch {
      // ignore
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameActive || isPaused) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // clear existing to avoid double intervals
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // time's up
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameActive, isPaused]);

  // Win by score
  useEffect(() => {
    if (score >= targetScore && gameActive) {
      endGame(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const handleTap = () => {
    if (!gameActive || isPaused) return;
    setScore(s => s + 1);
    void playTap();

    // reset idle timeout
    if (idleRef.current !== null) {
      clearTimeout(idleRef.current);
      idleRef.current = null;
    }
    idleRef.current = (setTimeout(() => {
      endGame(false);
    }, 5000) as unknown) as number;
  };

  const openMenu = () => {
    setIsPaused(true);
    setMenuVisible(true);
  };

  const confirmExit = async () => {
    setMenuVisible(false);
    setIsPaused(false);
    setGameActive(false);

    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
    if (idleRef.current !== null) { clearTimeout(idleRef.current); idleRef.current = null; }

    // save result as not won
    try {
      await saveGameResult({
        nick: user?.nick || 'Гость',
        timeSeconds,
        targetScore,
        achievedScore: score,
        durationSeconds: Math.max(0, timeSeconds - timeLeft),
        won: false,
        playerLevel: currentLevel,
      });
    } catch (e) {
      console.warn('Не удалось сохранить результат при выходе', e);
    }

    router.replace('/main');
  };

  const endGame = async (won: boolean) => {
    if (!gameActive) return;
    setGameActive(false);
    setIsPaused(false);

    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
    if (idleRef.current !== null) { clearTimeout(idleRef.current); idleRef.current = null; }

    try {
      await saveGameResult({
        nick: user?.nick || 'Гость',
        timeSeconds,
        targetScore,
        achievedScore: score,
        durationSeconds: Math.max(0, timeSeconds - timeLeft),
        won,
        playerLevel: currentLevel,
      });
    } catch (e) {
      console.warn('Не удалось сохранить результат игры', e);
    }

    if (won) {
      // update user level in context & storage (if available)
      if (typeof setUserLevel === 'function') {
        try { await setUserLevel(currentLevel + 1); } catch { /* ignore */ }
      }
      void playVictory();

      // show congrats modal (platform alert for native, custom for web)
      if (Platform.OS === 'web') {
        // web: simple confirm flow
        setTimeout(() => {
          router.replace(`/level-setup?playerLevel=${currentLevel + 1}`);
        }, 200);
      } else {
        Alert.alert(
          'ПОЗДРАВЛЯЕМ!',
          `Вы перешли на новый уровень!\nУровень ${currentLevel + 1}\nОчков: ${score}`,
          [
            {
              text: 'Следующий уровень',
              onPress: () => router.replace(`/level-setup?playerLevel=${currentLevel + 1}`),
            },
          ],
        );
      }
    } else {
      // lost
      if (Platform.OS === 'web') {
        setTimeout(() => router.replace('/main'), 200);
      } else {
        Alert.alert('Игра окончена', 'Попробуйте ещё раз', [{ text: 'В меню', onPress: () => router.replace('/main') }]);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
      if (idleRef.current !== null) { clearTimeout(idleRef.current); idleRef.current = null; }
      if (tapSound.current) { tapSound.current.unloadAsync().catch(() => {}); tapSound.current = null; }
      if (victorySound.current) { victorySound.current.unloadAsync().catch(() => {}); victorySound.current = null; }
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f23' : '#ffffff' }]}>
      <AppHeader />

      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.label, { color: isDark ? '#aaa' : '#666' }]}>Время</Text>
          <Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.label, { color: isDark ? '#aaa' : '#666' }]}>Очки</Text>
          <Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>{score}/{targetScore}</Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.label, { color: isDark ? '#aaa' : '#666' }]}>Уровень</Text>
          <Text style={[styles.value, { color: isDark ? '#fff' : '#000' }]}>#{currentLevel}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.circle, { backgroundColor: isDark ? '#ff3b7a' : '#ff006e' }]} onPress={handleTap} activeOpacity={0.8}>
        <Text style={styles.tapText}>ТАП!</Text>
        <Text style={styles.emoji}>🔺</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBtn} onPress={openMenu} activeOpacity={0.8}>
        <Text style={styles.menuText}>Меню</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: isDark ? '#aaa' : '#666' }]}>{user?.nick || 'Гость'}</Text>

      {/* In-app modal menu */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={modalStyles.bg}>
          <View style={[modalStyles.container, { backgroundColor: isDark ? '#12121a' : '#fff' }]}>
            <Text style={[modalStyles.title, { color: isDark ? '#fff' : '#000' }]}>Выйти в меню?</Text>
            <Text style={[modalStyles.sub, { color: isDark ? '#ccc' : '#444' }]}>Игра будет завершена</Text>

            <View style={modalStyles.row}>
              <TouchableOpacity style={[modalStyles.btn, { backgroundColor: isDark ? '#2a2a34' : '#eee' }]} onPress={() => { setMenuVisible(false); setIsPaused(false); }}>
                <Text style={[modalStyles.btnText, { color: isDark ? '#fff' : '#000' }]}>Продолжить</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.btn, { backgroundColor: '#ff006e' }]} onPress={confirmExit}>
                <Text style={modalStyles.btnText}>Выйти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 30, paddingHorizontal: 10 },
  info: { alignItems: 'center' },
  label: { fontSize: 14 },
  value: { fontSize: 28, fontWeight: '700', marginTop: 6 },

  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  tapText: { fontSize: 56, color: '#fff', fontWeight: '900' },
  emoji: { fontSize: 72, marginTop: 6 },

  menuBtn: { alignSelf: 'center', marginTop: 28, backgroundColor: '#444', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 30 },
  menuText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  footer: { textAlign: 'center', paddingBottom: 24, marginTop: 8, fontSize: 16 },
});

const modalStyles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: 320, borderRadius: 16, padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  sub: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, marginHorizontal: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
