import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function GuestScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PrimaryButton
        title="Продолжить как гость"
        onPress={() => router.push("/guest-nick")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,              // занимает весь экран
    justifyContent: "center",  // центр по вертикали
    alignItems: "center",      // центр по горизонтали
    paddingHorizontal: 20,     // небольшой отступ
  },
});
