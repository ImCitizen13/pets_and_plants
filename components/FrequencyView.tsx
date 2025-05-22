import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ThemedText from "./Themed";

export default function FrequencyView({
  days,
  hours,
  minutes,
  setDays,
  setHours,
  setMinutes,
  errors,
}: {
  days: string;
  hours: string;
  minutes: string;
  setDays: (text: string) => void;
  setHours: (text: string) => void;
  setMinutes: (text: string) => void;
  errors: { frequency: boolean };
}) {
  return (
    <View style={styles.timeInputContainer}>
      <View style={styles.timeInputGroup}>
        <TextInput
          style={[
            styles.timeInput,
            errors.frequency && !days && styles.inputError,
          ]}
          value={days}
          onChangeText={setDays}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <ThemedText style={styles.timeLabel}>Days</ThemedText>
      </View>

      <View style={styles.timeInputGroup}>
        <TextInput
          style={[
            styles.timeInput,
            errors.frequency && !hours && styles.inputError,
          ]}
          value={hours}
          onChangeText={setHours}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <ThemedText style={styles.timeLabel}>Hours</ThemedText>
      </View>

      <View style={styles.timeInputGroup}>
        <TextInput
          style={[
            styles.timeInput,
            errors.frequency && !minutes && styles.inputError,
          ]}
          value={minutes}
          onChangeText={setMinutes}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <ThemedText style={styles.timeLabel}>Mins</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInputGroup: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  timeInput: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "center",
    color: Colors.light.text,
    fontFamily: "AlfaSlabOne",
  },
  timeLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
  },
});
