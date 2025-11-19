// app/(game)/menu.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function GameMenu() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Привет, {user?.nick || 'Игрок'}!</Text>
        <Text style={styles.level}>Уровень игрока: <Text style={styles.levelNumber}>1/10</Text></Text>
      </View>

      <View style={styles.buttons}>
        <PrimaryButton
          title="Играть"
          onPress={() => router.push('/(game)/level-setup')}
          style={{ backgroundColor: '#ff006e', marginBottom: 20 }}
        />

        <PrimaryButton
          title="Личный кабинет"
          onPress={() => router.push('/profile')}
          style={{ backgroundColor: '#6200EE', marginBottom: 20 }}
        />

        <PrimaryButton
         title="История игр"
         onPress={() => router.push('/history')}  // ← Уже работает!
         style={{ backgroundColor: '#03dac6', marginBottom: 20 }}
        />

        <PrimaryButton
          title="Настройки"
          onPress={() => router.push('/settings')}
          style={{ backgroundColor: '#666' }}
        />
      </View>

      <Text style={styles.footer}>GameTap © 2025</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 80 },
  welcome: { fontSize: 36, fontWeight: 'bold', color: '#00ff88' },
  level: { fontSize: 20, color: '#aaa', marginTop: 10 },
  levelNumber: { color: '#00ff88', fontWeight: 'bold' },
  buttons: { flex: 1, justifyContent: 'center' },
  footer: { color: '#555', textAlign: 'center', marginTop: 40 },
});