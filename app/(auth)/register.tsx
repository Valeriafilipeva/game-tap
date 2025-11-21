import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function RegisterScreen() {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!nick.trim()) return Alert.alert('Ошибка', 'Введите ник');
    if (!isValidEmail) return Alert.alert('Ошибка', 'Введите правильный email!\nПример: user@mail.ru');
    if (password.length < 4) return Alert.alert('Ошибка', 'Пароль минимум 4 символа');

    try {
      await register(nick.trim(), password.trim());
      router.replace('/main'); // после регистрации на главную
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Регистрация</Text>

        <TextInput
          style={styles.input}
          placeholder="Ник"
          placeholderTextColor="#888"
          value={nick}
          onChangeText={setNick}
        />
        <TextInput
          style={[styles.input, email && !isValidEmail && styles.error]}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {email && !isValidEmail && <Text style={styles.hint}>Пример: ivan@example.com</Text>}

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton title="Зарегистрироваться" onPress={handleRegister} />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
          <Text style={styles.backText}>Назад в меню</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  form: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00ff88', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 18, borderRadius: 12, marginBottom: 16, fontSize: 18 },
  error: { borderColor: '#ff4400', borderWidth: 2 },
  hint: { color: '#ffaa00', fontSize: 16, textAlign: 'center', marginTop: -10, marginBottom: 10 },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#ffaa00', fontSize: 18 },
});
