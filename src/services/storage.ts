// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key: string) => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};
export const setItem = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};
export const removeItem = async (key: string) => AsyncStorage.removeItem(key);
