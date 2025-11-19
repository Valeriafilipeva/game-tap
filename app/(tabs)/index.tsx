// app/(tabs)/index.tsx
// ГЛАВНЫЙ ЭКРАН ИГРЫ "GameTap" - здесь происходит весь геймплей
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Vibration,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';

export default function GameScreen() {
  // ОСНОВНЫЕ СОСТОЯНИЯ ИГРЫ
  const [score, setScore] = useState(0);        // Текущий счет
  const [level, setLevel] = useState(1);        // Уровень (каждые 10 очков)
  const [combo, setCombo] = useState(0);        // Комбо (быстрые тапы)
  const [tapSpeed, setTapSpeed] = useState(100); // Скорость тапа (мс)
  const [gameActive, setGameActive] = useState(true); // Игра активна?

  const router = useRouter();

  // ЭФФЕКТ: обновление уровня при достижении 10/20/30... очков
  useEffect(() => {
    const newLevel = Math.floor(score / 10) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setTapSpeed(Math.max(50, 100 - (newLevel * 5))); // Ускоряем тапы
      Vibration.vibrate(200); // Вибрация при уровне
    }
  }, [score]);

  // ЭФФЕКТ: победа при 100 очках
  useEffect(() => {
    if (score >= 100) {
      setGameActive(false);
      Alert.alert(
        '🎉 ПОБЕДА!',
        `Ты прошёл ${level} уровней!\nИтоговый счёт: ${score}`,
        [{ text: 'В меню', onPress: () => router.push('/menu') }]
      );
    }
  }, [score]);

  // ОСНОВНАЯ ФУНКЦИЯ ТАПА - сердце игры!
  const handleTap = () => {
    if (!gameActive) return;

    // +1 очко за каждый тап
    setScore(prev => prev + 1);
    
    // Комбо-система: +бонус за быстрые тапы
    setCombo(prev => {
      const newCombo = prev + 1;
      if (newCombo >= 5) {
        setScore(s => s + 1); // Бонус очко за 5+ комбо
        Vibration.vibrate(50);
      }
      return newCombo;
    });
  };

  // СБРОС ИГРЫ
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setCombo(0);
    setTapSpeed(100);
    setGameActive(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <Stack.Screen 
        options={{ title: '🎮 GameTap' }} 
      />

      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20 
        }}
        bounces={false}
      >
        {/* ШАПКА С СЧЕТОМ */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ 
            fontSize: 64, 
            fontWeight: 'bold', 
            color: '#00ff88', 
            textShadowColor: 'rgba(0,255,136,0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20 
          }}>
            {score}
          </Text>
          
          <Text style={{ fontSize: 18, color: '#aaa', marginTop: 8 }}>
            Уровень {level} • Комбо x{combo}
          </Text>
          
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
            Цель: 100 очков
          </Text>
        </View>

        {/* ОСНОВНАЯ КНОПКА ДЛЯ ТАПА - ОГРОМНАЯ! */}
        <TouchableOpacity
          style={{
            width: 300,
            height: 300,
            borderRadius: 160,
            backgroundColor: '#ff006e',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#ff006e',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.8,
            shadowRadius: 40,
            elevation: 20,
          }}
          onPress={handleTap}
          activeOpacity={0.7}
          delayTouchStart={tapSpeed / 1000} // Задержка для скорости уровня
        >
          <Text style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#fff',
          }}>
            ТАП!
          </Text>
          <Text style={{ fontSize: 24, color: '#fff', opacity: 0.8 }}>
            👆
          </Text>
        </TouchableOpacity>

        {/* КНОПКИ УПРАВЛЕНИЯ */}
        <View style={{ marginTop: 40, gap: 12, width: '100%' }}>
          <PrimaryButton
            title="🔄 Новая игра"
            onPress={resetGame}
            style={{ backgroundColor: '#00ff88' }}
          />
          
          <PrimaryButton
            title="📋 Рекорды"
            onPress={() => router.push('/records')}
          />
          
          <PrimaryButton
            title="⚙️ Настройки"
            onPress={() => router.push('/settings')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}