import EntryCard from "@/components/EntryCard";
import { Colors } from "@/constants/Colors";
import { getAllEntries, updateEntry } from "@/storage/localStorage";
import { Entry } from "@/types";
import { cancelReminder, scheduleReminder } from "@/utils/notifications";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const entries = await getAllEntries();
      const foundEntry = entries.find(e => e.id === id);
      
      if (foundEntry) {
        setEntry(foundEntry);
        setNotificationsEnabled(foundEntry.notificationsEnabled !== false);
      } else {
        Alert.alert("Error", "Entry not found");
        router.back();
      }
    } catch (error) {
      console.error("Failed to load entry:", error);
      Alert.alert("Error", "Failed to load entry details");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async (entry: Entry) => {
    try {
      // Cancel the existing reminder if it exists
      await cancelReminder(entry);
      
      // Update the entry with the current timestamp
      const updatedEntry = { ...entry, lastDone: Date.now() };
      
      // Save to storage
      await updateEntry(updatedEntry);
      
      // Schedule a new reminder only if notifications are enabled
      if (updatedEntry.notificationsEnabled !== false) {
        await scheduleReminder(updatedEntry);
      }
      
      // Update the UI
      setEntry(updatedEntry);
      
      // Show success message
      Alert.alert("Success", `${entry.name} has been marked as done!`);
    } catch (error) {
      console.error("Failed to mark as done:", error);
      Alert.alert("Error", "Failed to update entry");
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (!entry) return;
    
    try {
      const updatedEntry = { 
        ...entry, 
        notificationsEnabled: value 
      };
      
      // Update notification setting
      await updateEntry(updatedEntry);
      
      // If enabling notifications, schedule a reminder
      if (value) {
        await scheduleReminder(updatedEntry);
      } else {
        // If disabling, cancel any existing reminders
        await cancelReminder(entry);
      }
      
      // Update UI
      setEntry(updatedEntry);
      setNotificationsEnabled(value);
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  const deleteEntry = async () => {
    if (!entry) return;
    
    Alert.alert(
      "Delete Entry",
      `Are you sure you want to delete ${entry.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              // Get all entries
              const entries = await getAllEntries();
              
              // Filter out the current entry
              const updatedEntries = entries.filter(e => e.id !== entry.id);
              
              // Cancel any reminders
              await cancelReminder(entry);
              
              // Save the updated entries back to storage
              // This would need a proper function in localStorage.ts to handle this
              // For now we'll keep it simple with a console message
              console.log("Would delete entry:", entry.id);
              // Normally would call something like:
              // await saveEntries(updatedEntries);
              
              // Navigate back
              router.back();
            } catch (error) {
              console.error("Failed to delete entry:", error);
              Alert.alert("Error", "Failed to delete entry");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.centered}>
        <Text>Entry not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Entry Card */}
      <EntryCard 
        entry={entry}
        onMarkAsDone={handleMarkAsDone}
      />
      
      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => console.log("Edit entry:", entry.id)}
        >
          <Ionicons name="pencil" size={18} color="white" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={deleteEntry}
        >
          <Ionicons name="trash" size={18} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      
      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive reminders for {entry.name}
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: "#d1d1d1", true: `${Colors.light.tint}80` }}
            thumbColor={notificationsEnabled ? Colors.light.tint : "#f4f3f4"}
          />
        </View>
      </View>
      
      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>{entry.name}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>
            {entry.type === "pet" ? "Pet 🐶" : "Plant 🌱"}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frequency</Text>
          <Text style={styles.detailValue}>
            {entry.frequency < 1 
              ? `${Math.round(entry.frequency * 60)} minutes` 
              : entry.frequency < 24 
                ? `${Math.round(entry.frequency)} hours` 
                : `${Math.round(entry.frequency / 24)} days`}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Done</Text>
          <Text style={styles.detailValue}>
            {entry.lastDone ? new Date(entry.lastDone).toLocaleString() : "Never"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.light.text,
  },
  actionButton: {
    backgroundColor: Colors.light.tint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "#FF5722",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  detailValue: {
    flex: 2,
    fontSize: 16,
    color: "#666",
  },
});
