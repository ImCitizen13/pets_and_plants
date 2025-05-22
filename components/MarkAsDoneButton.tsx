import { StyleSheet, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";
import { Entry } from "@/types";
import React, { useEffect, useState } from "react";
import ThemedText from "./Themed";

export default function MarkAsDoneButton({
  item,
  handleMarkAsDone,
}: {
  item: Entry;
  handleMarkAsDone: (item: Entry) => void;
}) {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const timeto = new Date(item.timeToNextAction).valueOf();
    const now = new Date().valueOf();
    const diff = timeto - now;
    const shouldDisable = diff > 5000 ? true : false;
    setDisabled(shouldDisable);
  }, [item]);
  useEffect(() => {}, [disabled, item]);
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.doneButton, { opacity: disabled ? 0.5 : 1 }]}
      onPress={() => handleMarkAsDone(item)}
    >
      <ThemedText style={styles.doneButtonText}>Mark as done</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  doneButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: Colors.light.text,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "500",
  },
  doneButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
