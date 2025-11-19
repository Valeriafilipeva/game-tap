// app/(auth)/register-guest.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import { getGameHistory } from '../../src/services/gameHistory';

export default function RegisterGuestScreen() {
  const [email, setEmail] = useState('');
  const { user, register } = useAuth();
  const router = useRouter();

  const handleRegisterGuest = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }
    // Переносим историю гостя (по nick)
    await register(email.trim(), '', user?.nick || ''); // пароль пустой, ник сохраняем
    router.replace('/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Регистрация гостя</Text>
        <Text style={styles.desc}>Твоя история игр сохранится!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PrimaryButton title="Зарегистрироваться" onPress={handleRegisterGuest} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  form: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00ff88', textAlign: 'center', marginBottom: 10 },
  desc: { fontSize: 18, color: '#aaa', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 17 },
});