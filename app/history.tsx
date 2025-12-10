// app/history.tsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { getGameHistory, GameResult } from "../src/services/gameHistory";
import PrimaryButton from "../components/PrimaryButton";

export default function HistoryScreen() {
  const [history, setHistory] = useState<GameResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<GameResult[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    // ФИЛЬТР: только свои игры!
    if (user) {
      setFilteredHistory(history.filter((h) => h.nick === user.nick));
    } else {
      setFilteredHistory(history); // Гость видит все свои на устройстве
    }
  }, [history, user]);

  const loadHistory = async () => {
    const data = await getGameHistory();
    setHistory(data);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }: { item: GameResult }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
      <View style={styles.stats}>
        <Text style={styles.time}>{item.timeSeconds}с</Text>
        <Text
          style={[styles.score, { color: item.won ? "#00ff88" : "#ff0266" }]}
        >
          {item.achievedScore}/{item.targetScore}
        </Text>
        <Text style={styles.result}>{item.won ? "✅" : "❌"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>История игр</Text>
      <Text style={styles.subtitle}>
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Пока нет игр</Text>
            <Text style={styles.emptySubtext}>
              Сыграй и увидишь результаты здесь!
            </Text>
          </View>
        ) : (
          `${filteredHistory.length} игр • ${user?.nick || "Гость"}`
        )}
      </Text>

      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <PrimaryButton
        title="В меню"
        onPress={() => router.replace(user ? "/main" : "/")}
        style={{ backgroundColor: "#666" }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23", padding: 20 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00ff88",
    marginTop: 40,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  list: { flexGrow: 1, paddingBottom: 20 },
  item: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  date: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  time: { fontSize: 16, color: "#aaa" },
  score: { fontSize: 20, fontWeight: "bold" },
  result: { fontSize: 24 },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 28, color: "#aaa", fontWeight: "bold" },
  emptySubtext: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
  },
});
