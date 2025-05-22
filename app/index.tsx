import EntryListItem from "@/components/EntryListItem";
import { Colors } from "@/constants/Colors";
import { useNotification } from "@/contexts/NotificationContext";
import { getAllEntries, updateEntry } from "@/storage/localStorage";
import { Entry } from "@/types";
import { cancelReminder, scheduleReminder } from "@/utils/notifications";
import { getTimeInMiliseconds } from "@/utils/timeOperations";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { lastNotification } = useNotification();
  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (lastNotification) {
      console.log("Got it ");
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
    <Animated.View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackground: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.light.background,
                borderBottomWidth: 5,
                borderColor: Colors.light.text,
              }}
            />
          ),
          headerTitle: () => (
            <Text
              style={{
                fontFamily: "AlfaSlabOne",
                fontSize: 24,
                fontWeight: "500",
                color: Colors.light.text,
              }}
            >
              Pets & Plants
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/add")}>
              <FontAwesome name="plus" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Animated.FlatList
        data={entries}
        extraData={entries}
        renderItem={({ item }) => (
          <EntryListItem item={item} handleMarkAsDone={handleMarkAsDone} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              loadEntries();
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

      {/* <Animated.View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")}
        >
          <FontAwesome
            name="plus"
            size={30}
            color={Colors.light.background}
            style={{
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
            }}
          />
        </TouchableOpacity>
      </Animated.View> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 1,
    borderTopWidth: 2,
    borderColor: Colors.light.text,
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
