import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function LoginScreen() {
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!nick.trim() || !password.trim()) {
      return Alert.alert('Ошибка', 'Введите ник и пароль');
    }

    try {
      await login(nick.trim(), password.trim());
      router.replace('/main'); // после входа на главную
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось войти');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Вход</Text>

        <TextInput
          style={styles.input}
          placeholder="Ник"
          placeholderTextColor="#888"
          value={nick}
          onChangeText={setNick}
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton title="Войти" onPress={handleLogin} />

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
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 17 },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#ffaa00', fontSize: 18 },
});
