// app/records.tsx
import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';

const mockRecords = [
  { id: 1, name: 'Ты', score: 127, level: 13 },
  { id: 2, name: 'Игрок2', score: 98, level: 10 },
  { id: 3, name: 'Гость', score: 75, level: 8 },
];

export default function RecordsScreen() {
  const router = useRouter();

  const renderRecord = ({ item }: { item: typeof mockRecords[0] }) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#1a1a2e',
      borderBottomWidth: 1,
      borderBottomColor: '#333',
    }}>
      <Text style={{ fontSize: 18, color: '#fff' }}>{item.name}</Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00ff88' }}>
          {item.score}
        </Text>
        <Text style={{ fontSize: 14, color: '#aaa' }}>Ур.{item.level}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0f23' }}>
      <Stack.Screen options={{ title: '🏆 Рекорды' }} />

      <View style={{ flex: 1 }}>
        <FlatList
          data={mockRecords}
          renderItem={renderRecord}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
        />

        <PrimaryButton
          title="🔙 В меню"
          onPress={() => router.back()}
          style={{ margin: 20, backgroundColor: '#666' }}
        />
      </View>
    </SafeAreaView>
  );
}