// app/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import AppHeader from '../components/AppHeader';
import { useTheme } from '../src/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const nick = user?.nick || 'Гость';
  const isGuest = !!user?.isGuest;
  const level = user?.level ?? 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f23' : '#ffffff' }]}>
      <AppHeader />

      <View style={styles.body}>
        <View style={[styles.card, { backgroundColor: isDark ? '#12121a' : '#f6f6f6' }]}>
          <Text style={[styles.title, { color: isDark ? '#00ff88' : '#6200ee' }]}>
            {user ? `Привет, ${nick}` : 'Гость'}
          </Text>

          {/* Уровень */}
          <View style={styles.row}>
            <Text style={[styles.label, { color: isDark ? '#ccc' : '#444' }]}>Текущий уровень</Text>
            <Text style={[styles.level, { color: isDark ? '#fff' : '#000' }]}>#{level}</Text>
          </View>

          {/* Подсказка для гостя */}
          {isGuest && (
            <Text style={[styles.hint, { color: isDark ? '#aaa' : '#666' }]}>
              Ваши игры сохраняются как гость. После регистрации они будут перенесены в профиль.
            </Text>
          )}
        </View>

        {/* Действия */}
        <View style={styles.actions}>
          {/* История — доступна всегда */}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#0088ff' }]}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.actionText}>История игр</Text>
          </TouchableOpacity>

          {user && !isGuest ? (
            <>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ff006e' }]} onPress={handleLogout}>
                <Text style={styles.actionText}>Выйти из аккаунта</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#6c5ce7' }]}
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={styles.actionText}>Регистрация</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={[styles.actionBtn, styles.backBtn]} onPress={() => router.replace('/main')}>
            <Text style={styles.actionText}>Назад в меню</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, padding: 20, alignItems: 'center' },

  card: {
    width: '100%',
    borderRadius: 14,
    padding: 22,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },

  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },

  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', width: '100%' },
  label: { fontSize: 16 },
  level: { fontSize: 22, fontWeight: '700', marginLeft: 8 },

  hint: { marginTop: 12, fontSize: 13, lineHeight: 18 },

  actions: { width: '100%', marginTop: 12, alignItems: 'center' },

  actionBtn: {
    width: '90%',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  backBtn: { backgroundColor: '#444' },
});
