import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LevelContextType = {
  level: number;
  xp: number;
  addXP: (amount: number) => void;
  resetLevel: () => void;
};

const PlayerLevelContext = createContext<LevelContextType>({
  level: 1,
  xp: 0,
  addXP: () => {},
  resetLevel: () => {},
});

export const PlayerLevelProvider = ({ children }: { children: React.ReactNode }) => {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  // Load saved level & XP
  useEffect(() => {
    (async () => {
      const savedLevel = await AsyncStorage.getItem("playerLevel");
      const savedXP = await AsyncStorage.getItem("playerXP");

      if (savedLevel) setLevel(Number(savedLevel));
      if (savedXP) setXP(Number(savedXP));
    })();
  }, []);

  // Save when level or XP changes
  useEffect(() => {
    AsyncStorage.setItem("playerLevel", String(level));
    AsyncStorage.setItem("playerXP", String(xp));
  }, [level, xp]);

  const addXP = (amount: number) => {
    const newXP = xp + amount;

    // Example leveling system
    if (newXP >= level * 100) {
      setLevel(level + 1);
      setXP(newXP - level * 100);
    } else {
      setXP(newXP);
    }
  };

  const resetLevel = () => {
    setLevel(1);
    setXP(0);
  };

  return (
    <PlayerLevelContext.Provider value={{ level, xp, addXP, resetLevel }}>
      {children}
    </PlayerLevelContext.Provider>
  );
};

export const usePlayerLevel = () => useContext(PlayerLevelContext);
