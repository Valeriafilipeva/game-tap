// app/(auth)/guest-nick.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function GuestNickScreen() {
  const [nick, setNick] = useState('');
  const { loginAsGuest } = useAuth();
  const router = useRouter();

  const startAsGuest = () => {
    if (!nick.trim()) return Alert.alert('Введите ник', 'Например: Котик228');
    loginAsGuest(nick.trim());

    // ВАЖНО: push вместо replace — чтобы меню НЕ ломалось
    router.push('/(game)/menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Играть как гость</Text>
        <Text style={styles.desc}>Введите свой ник — он будет в рекордах</Text>

        <TextInput
          style={styles.input}
          placeholder="Котик228"
          placeholderTextColor="#888"
          value={nick}
          onChangeText={setNick}
          maxLength={20}
        />

        <PrimaryButton title="Начать игру" onPress={startAsGuest} />

        {/* ➤ Добавлена кнопка "Назад в меню" */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.backText}>← Назад в меню</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#ff006e', textAlign: 'center', marginBottom: 20 },
  desc: { fontSize: 17, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 18,
    borderRadius: 14,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },

  // новая кнопка
  backBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#444',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
