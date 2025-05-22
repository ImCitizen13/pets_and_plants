import { Colors } from "@/constants/Colors";
import { AnimalType, Entry } from "@/types";
import { getTimeRemaining } from "@/utils/timeOperations";
import { Image } from "expo-image";
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
      fillColor={
        item.type === "pet"
          ? Colors.light.secondaryBackground
          : Colors.light.plantBackground
      }
      backgroundColor={Colors.light.background}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {/* <Text style={styles.typeIcon}>{item.type === "pet" ? "🐶" : "🌱"}</Text> */}
        <Image
          contentFit="contain"
          source={
            item.type === "pet"
              ? item.animalType === AnimalType.DOG
                ? require("@/assets/images/dog.png")
                : require("@/assets/images/cat.png")
              : require("@/assets/images/plant.png")
          }
          style={{ width: 60, height: 60 }}
        />
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
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.light.text,
    flex: 1,
    marginBottom: 12,
    shadowColor: Colors.light.secondaryBackground,
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
    fontSize: 28,

    fontWeight: "800",
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
