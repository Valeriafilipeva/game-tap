// components/AppHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';

export default function AppHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const nick = user?.nick || 'Гость';
  const role = user?.nick ? '' : 'Гость'; // если есть регистрация — не пишем роль

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0f23' : '#ffffff' }]}>
      {/* Логотип */}
      <Text style={[styles.title, { color: isDark ? '#00ff88' : '#6200ee' }]}>
        GameTap
      </Text>

      {/* Кнопка профиля */}
      <TouchableOpacity
        onPress={() => router.push('/profile')}
        activeOpacity={0.75}
        style={[
          styles.profileBtn,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' },
        ]}
      >
        <View>
          <Text style={[styles.nick, { color: isDark ? '#fff' : '#000' }]}>
            {nick}
          </Text>

          {role ? (
            <Text style={[styles.role, { color: isDark ? '#ccc' : '#444' }]}>
              {role}
            </Text>
          ) : null}
        </View>

        <Text style={[styles.icon, { color: isDark ? '#fff' : '#000' }]}>
          👤
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 45,
    paddingBottom: 14,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
  },

  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 12,
  },

  nick: {
    fontSize: 18,
    fontWeight: '700',
  },

  role: {
    fontSize: 13,
    opacity: 0.8,
  },

  icon: {
    fontSize: 28,
  },
});
