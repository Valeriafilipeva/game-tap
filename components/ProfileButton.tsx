// components/ProfileButton.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';

export default function ProfileButton() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  // показываем ник либо "Гость"
  const nick = user?.nick || 'Гость';
  // если пользователь гость — отображаем метку (Гость)
  const showGuestLabel = !!user?.isGuest;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push('/profile')}
      style={[
        styles.button,
        { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
      ]}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.nick, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
          {nick}
        </Text>
        {showGuestLabel ? (
          <Text style={[styles.guest, { color: isDark ? '#ccc' : '#555' }]}>Гость</Text>
        ) : null}
      </View>

      <Text style={[styles.icon, { color: isDark ? '#fff' : '#000' }]}>👤</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 12,
    right: 14,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  textWrap: { marginRight: 10, maxWidth: 160 },
  nick: { fontSize: 17, fontWeight: '700' },
  guest: { fontSize: 12, marginTop: 2 },
  icon: { fontSize: 22 },
});
