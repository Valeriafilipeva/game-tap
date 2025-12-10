// app/(auth)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';

export default function AuthStartScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GameTap</Text>
        <Text style={styles.subtitle}>Тапай быстрее всех!</Text>

        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconText}>TAP</Text>
        </View>

        <PrimaryButton
          title="Зарегистрироваться"
          onPress={() => router.push('/(auth)/register')}
          style={{ backgroundColor: '#00ff88', marginBottom: 16 }}
        />

        <PrimaryButton
          title="Войти"
          onPress={() => router.push('/(auth)/login')}
          style={{ backgroundColor: '#6200EE', marginBottom: 16 }}
        />

        <PrimaryButton
          title="Играть как гость"
          onPress={() => router.push('/(auth)/guest-nick')}
          style={{ backgroundColor: '#ff006e' }}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#aaa',
    marginBottom: 50,
  },
  icon: {
    width: 140,
    height: 140,
    marginBottom: 60,
  },
});