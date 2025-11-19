// app/settings.tsx — теперь только звук
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [soundOn, setSoundOn] = React.useState(true);

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Настройки</Text>

      <View style={styles.setting}>
        <Text style={styles.text}>Звук</Text>
        <Switch value={soundOn} onValueChange={setSoundOn} />
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/main')}>
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 30 },
  title: { fontSize: 36, color: '#00ff88', textAlign: 'center', marginTop: 60, fontWeight: 'bold' },
  setting: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1a1a2e', padding: 20, borderRadius: 16, marginTop: 40 },
  text: { fontSize: 20, color: '#fff' },
  backBtn: { marginTop: 60, alignSelf: 'center', backgroundColor: '#444', padding: 16, borderRadius: 12 },
  backText: { color: '#fff', fontSize: 18 },
});

const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 30 },
  title: { fontSize: 36, color: '#6200ee', textAlign: 'center', marginTop: 60, fontWeight: 'bold' },
  setting: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginTop: 40, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  text: { fontSize: 20, color: '#333' },
  backBtn: { marginTop: 60, alignSelf: 'center', backgroundColor: '#6200ee', padding: 16, borderRadius: 12 },
  backText: { color: '#fff', fontSize: 18 },
});