// src/services/SoundManager.ts
import { Audio } from 'expo-av';

let isLoaded = false;
let tapSound: Audio.Sound | null = null;
let victorySound: Audio.Sound | null = null;
let failSound: Audio.Sound | null = null;

export const initSounds = async () => {
  if (isLoaded) return;

  try {
    // Загружаем звуки (замени на свои пути или используй системные)
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    tapSound = await Audio.Sound.createAsync(require('../../assets/sounds/tap.mp3'));
    victorySound = await Audio.Sound.createAsync(require('../../assets/sounds/victory.mp3'));
    failSound = await Audio.Sound.createAsync(require('../../assets/sounds/fail.mp3'));

    isLoaded = true;
  } catch (e) {
    console.warn('Звуки не загружены', e);
  }
};

