import { Colors } from "@/constants/Colors";
import { Entry } from "@/types";
import { getTimeRemaining } from "@/utils/timeOperations";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MarkAsDoneButton from "./MarkAsDoneButton";

type EntryCardProps = {
  entry: Entry;
  onMarkAsDone: (entry: Entry) => void;
  onPress?: (entry: Entry) => void;
};

export default function EntryCard({ entry, onMarkAsDone, onPress }: EntryCardProps) {
  const getActionText = (type: "pet" | "plant") => {
    return type === "pet" ? "Feed" : "Water";
  };

  // Calculate if the entry needs attention (close to or past due)
  const hoursSinceLastDone = (Date.now() - (entry.lastDone || Date.now())) / (1000 * 60 * 60);
  const hoursRemaining = Math.max(0, entry.frequency - hoursSinceLastDone);
  const needsAttention = hoursRemaining < 2; // Less than 2 hours remaining
  const overdue = hoursRemaining === 0;

  // Animation for attention
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (overdue) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [overdue]);

  return (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.7 : 1}
      onPress={() => onPress && onPress(entry)}
    >
      <Animated.View 
        style={[
          styles.card, 
          needsAttention && styles.cardAttention,
          overdue && styles.cardOverdue,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{entry.name}</Text>
          <Text style={styles.typeIcon}>{entry.type === "pet" ? "🐶" : "🌱"}</Text>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.infoContainer}>
            <Text style={[
              styles.timeRemaining,
              needsAttention && styles.timeAttention,
              overdue && styles.timeOverdue,
            ]}>
              {getActionText(entry.type)} {getTimeRemaining(entry)}
            </Text>
            
            {entry.notificationsEnabled !== false && (
              <View style={styles.notificationTag}>
                <Ionicons name="notifications" size={12} color={Colors.light.tint} />
                <Text style={styles.notificationText}>Reminders On</Text>
              </View>
            )}
          </View>
          
          <MarkAsDoneButton
            item={entry}
            handleMarkAsDone={onMarkAsDone}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    position: "relative",
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  cardAttention: {
    borderLeftColor: "#FFC107", // Warning yellow
  },
  cardOverdue: {
    borderLeftColor: "#FF5722", // Error orange/red
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  typeIcon: {
    fontSize: 22,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  timeRemaining: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  timeAttention: {
    color: "#FFC107", // Warning yellow
    fontWeight: "500",
  },
  timeOverdue: {
    color: "#FF5722", // Error orange/red
    fontWeight: "600",
  },
  notificationTag: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 12,
    color: Colors.light.tint,
    marginLeft: 4,
  },
  notificationIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    fontSize: 12,
  },
}); 