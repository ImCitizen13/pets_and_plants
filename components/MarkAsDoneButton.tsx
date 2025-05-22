import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Entry } from "@/types";
import React, { useEffect, useState } from "react";

export default function MarkAsDoneButton({
  item,
  handleMarkAsDone,
}: {
  item: Entry;
  handleMarkAsDone: (item: Entry) => void;
}) {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const shouldDisable =
      new Date(item.timeToNextAction).valueOf() > new Date().valueOf() ? true : false;
    setDisabled(shouldDisable);
  }, [item]);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.doneButton, { opacity: disabled ? 0.5 : 1 }]}
      onPress={() => handleMarkAsDone(item)}
    >
      <Text style={styles.doneButtonText}>Mark as done</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  doneButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
