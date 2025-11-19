// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!nick.trim()) return Alert.alert('Ошибка', 'Введите ник');
    if (!isValidEmail) return Alert.alert('Ошибка', 'Введите правильный email!\nПример: user@mail.ru');
    if (password.length < 4) return Alert.alert('Ошибка', 'Пароль минимум 4 символа');

    try {
      await register(email, password, nick);
      router.replace('/(game)/menu');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput style={styles.input} placeholder="Ник" value={nick} onChangeText={setNick} />
      <TextInput
        style={[styles.input, email && !isValidEmail && styles.error]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {email && !isValidEmail && <Text style={styles.hint}>Пример: ivan@example.com</Text>}

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryButton title="Зарегистрироваться" onPress={handleRegister} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 30, justifyContent: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00ff88', textAlign: 'center', marginBottom: 50 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 18, borderRadius: 12, marginBottom: 16, fontSize: 18 },
  error: { borderColor: '#ff4400', borderWidth: 2 },
  hint: { color: '#ffaa00', fontSize: 16, textAlign: 'center', marginTop: -10, marginBottom: 10 },
});