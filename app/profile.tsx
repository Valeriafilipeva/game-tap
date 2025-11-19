// app/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Ты уверена?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/'); // ← обратно на стартовый экран (регистрация/вход/гость)
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Личный кабинет</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Ник:</Text>
        <Text style={styles.value}>{user?.nick || 'Гость'}</Text>

        <Text style={styles.label}>Статус:</Text>
        <Text style={styles.value}>{user?.isGuest ? 'Гость' : 'Зарегистрирован'}</Text>

        {!user?.isGuest && (
          <>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </>
        )}

        <Text style={styles.label}>Уровень игрока:</Text>
        <Text style={styles.bigValue}>1 / 10</Text>
      </View>

      {/* КНОПКА ВЫХОДА */}
      <PrimaryButton
        title="Выйти из аккаунта"
        onPress={handleLogout}
        style={{ backgroundColor: '#ff0266', marginTop: 40 }}
      />

      {/* КНОПКА В МЕНЮ */}
      <PrimaryButton
        title="В меню"
        onPress={() => router.push('/main')}
        style={{ backgroundColor: '#666', marginTop: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00ff88', textAlign: 'center', marginVertical: 40 },
  infoCard: {
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  label: { fontSize: 18, color: '#aaa', marginTop: 16 },
  value: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginTop: 4 },
  bigValue: { fontSize: 48, color: '#00ff88', fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
});