// src/services/gameHistory.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameResult = {
  id: string;
  date: string;           // ISO строка
  nick: string;
  timeSeconds: number;
  targetScore: number;
  achievedScore: number;
  durationSeconds: number; // сколько реально играл
  won: boolean;
  playerLevel: number;
};

const STORAGE_KEY = '@game_history';

// src/services/gameHistory.ts
export const saveGameResult = async (result: Omit<GameResult, 'id' | 'date'>) => {
  try {
    const newResult: GameResult = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const history: GameResult[] = existing ? JSON.parse(existing) : [];
    history.unshift(newResult);
    if (history.length > 100) history.pop();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Не удалось сохранить игру', e);
  }
};


export const getGameHistory = async (): Promise<GameResult[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};