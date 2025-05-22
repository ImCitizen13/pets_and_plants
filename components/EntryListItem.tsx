import { Entry } from "@/types";
import { getTimeRemaining } from "@/utils/timeOperations";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MarkAsDoneButton from "./MarkAsDoneButton";
import ProgressCountdown from "./TimerCellBackground";
const getActionText = (type: "pet" | "plant") => {
  return type === "pet" ? "Feed" : "Water";
};
export default function EntryListItem({
  item,
  handleMarkAsDone,
}: {
  item: Entry;
  handleMarkAsDone: (item: Entry) => void;
}) {
  return (
    <ProgressCountdown
      targetDate={new Date(item.timeToNextAction).getTime()}
      fromDate={new Date(item.lastDone).getTime()}
      fillColor="white"
      backgroundColor="gray"
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.typeIcon}>{item.type === "pet" ? "🐶" : "🌱"}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.timeRemaining}>
          {getActionText(item.type)} {getTimeRemaining(item)}
        </Text>

        <MarkAsDoneButton item={item} handleMarkAsDone={handleMarkAsDone} />
      </View>
    </ProgressCountdown>
  );
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: "white",
    borderRadius: 12,
    // padding: 16,
    flex: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  },
  typeIcon: {
    fontSize: 22,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRemaining: {
    fontSize: 16,
    color: "#555",
  },
});
