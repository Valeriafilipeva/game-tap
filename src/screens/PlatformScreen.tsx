import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";
import * as ImagePicker from "expo-image-picker";
import PrimaryButton from "../../components/PrimaryButton";

export default function PlatformScreen() {
  const [image, setImage] = useState<string | null>(null);

  // --- ВИБРАЦИЯ ---
  const vibrate = () => {
    if (Platform.OS === "android") {
      Vibration.vibrate(200); // Android вибрирует сильнее
    } else {
      Vibration.vibrate(100); // iOS мягче
    }
  };

  // --- ХАПТИК (iOS > Android слабее) ---
  const haptic = async () => {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // --- КАМЕРА / ГАЛЕРЕЯ ---
  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: Platform.OS === "ios" ? 0.8 : 0.5, // iOS делает выше качество
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: Platform.OS === "android" ? 0.4 : 0.7, // Android снижает качество
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Платформенные функции</Text>

        <Text style={styles.info}>
          Текущая платформа: <Text style={styles.value}>{Platform.OS}</Text>
        </Text>

        <Text style={styles.info}>
          Версия платформы: <Text style={styles.value}>{Platform.Version}</Text>
        </Text>

        {/* ВИБРАЦИЯ */}
        <PrimaryButton
          title="Вибрация"
          onPress={vibrate}
          style={{ backgroundColor: "#2196f3", marginTop: 20 }}
        />

        {/* ХАПТИК */}
        <PrimaryButton
          title="Хаптик-фидбек"
          onPress={haptic}
          style={{ backgroundColor: "#7b2cbf", marginTop: 20 }}
        />

        {/* КАМЕРА */}
        <PrimaryButton
          title="Открыть камеру"
          onPress={pickImage}
          style={{ backgroundColor: "#ff6b6b", marginTop: 20 }}
        />

        {/* ГАЛЕРЕЯ */}
        <PrimaryButton
          title="Открыть галерею"
          onPress={openGallery}
          style={{ backgroundColor: "#00c49a", marginTop: 20 }}
        />

        {image && (
          <>
            <Text style={[styles.info, { marginTop: 20 }]}>Выбранное изображение:</Text>
            <Image source={{ uri: image }} style={styles.image} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ff88",
    textAlign: "center",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#aaa",
    marginTop: 10,
  },
  value: {
    fontWeight: "bold",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 15,
  },
});
