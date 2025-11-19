// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';

export default function StartScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    router.replace('/main');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>GameTap</Text>
      <Text style={styles.subtitle}>Тапай быстрее всех!</Text>

      <PrimaryButton
        title="Зарегистрироваться"
        onPress={() => router.push('/register')}
        style={{ backgroundColor: '#00ff88', marginBottom: 16 }}
      />
      <PrimaryButton
        title="Войти"
        onPress={() => router.push('/login')}
        style={{ backgroundColor: '#6200EE', marginBottom: 16 }}
      />
      <PrimaryButton
        title="Играть как гость"
        onPress={() => router.push('/guest')}
        style={{ backgroundColor: '#ff006e' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 56, fontWeight: 'bold', color: '#00ff88', marginBottom: 20 },
  subtitle: { fontSize: 20, color: '#aaa', textAlign: 'center', marginBottom: 60 },
});