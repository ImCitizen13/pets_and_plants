import EntryListItem from "@/components/EntryListItem";
import { Colors } from "@/constants/Colors";
import { useNotification } from "@/contexts/NotificationContext";
import { getAllEntries, updateEntry } from "@/storage/localStorage";
import { Entry } from "@/types";
import { cancelReminder, scheduleReminder } from "@/utils/notifications";
import { getTimeInMiliseconds } from "@/utils/timeOperations";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { lastNotification } = useNotification();
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (lastNotification) {
      
      loadEntries();
    }
  }, [lastNotification]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getAllEntries();
      setEntries(data);
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async (entry: Entry) => {
    try {
      // Cancel the existing reminder if it exists
      await cancelReminder(entry);

      // Update the entry with the current timestamp
      const updatedEntry = {
        ...entry,
        lastDone: Date.now(),
        timeToNextAction: getTimeInMiliseconds(entry.frequency),
      };

      // Save to storage
      await updateEntry(updatedEntry);

      // Schedule a new reminder only if notifications are enabled
      if (updatedEntry.notificationsEnabled !== false) {
        await scheduleReminder(updatedEntry);
      }

      // Update the UI
      setEntries(entries.map((e) => (e.id === entry.id ? updatedEntry : e)));
    } catch (error) {
      console.error("Failed to mark as done:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Animated.FlatList
        data={entries}
        renderItem={({ item }) => (
          <EntryListItem item={item} handleMarkAsDone={handleMarkAsDone} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              console.log("Refreshing");
              loadEntries();
              setRefetch(false);
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No entries yet</Text>
            <Text>Add your first pet or plant to get started</Text>
          </View>
        }
      />

      <View style={styles.actionButtonsContainer}>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },

  doneButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    position: "absolute",
    right: 24,
    bottom: 24,
    flexDirection: "column",
    alignItems: "center",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#757575",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
});
