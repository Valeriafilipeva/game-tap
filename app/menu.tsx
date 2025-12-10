// app/menu.tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import Card from "../components/Card";
import { useAuth } from "@/src/contexts/AuthContext";

export default function MenuScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f23" }}>
      <Stack.Screen options={{ title: "🏠 Главное меню" }} />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 24,
        }}
      >
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "#00ff88",
            textAlign: "center",
          }}
        >
          GameTap
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: "#aaa",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Покей экран как можно быстрее!
          {"\n"}Цель: 100 очков
        </Text>

        {/* КНОПКИ МЕНЮ */}
        <PrimaryButton
          title="▶️ Играть"
          onPress={() => router.push(user ? "/(tabs)" : "/(auth)/guest-nick")}
          style={{ backgroundColor: "#ff006e" }}
        />

        <PrimaryButton
          title="🏆 Рекорды"
          onPress={() => router.push("/records")}
        />

        <PrimaryButton
          title="⚙️ Настройки"
          onPress={() => router.push("/settings")}
        />
      </View>
    </SafeAreaView>
  );
}
