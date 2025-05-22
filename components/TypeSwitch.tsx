import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText, { ThemeStyles } from "./Themed";

export default function TypeSwitch({
  type,
  setType,
}: {
  type: "pet" | "plant";
  setType: (type: "pet" | "plant") => void;
}) {
  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label}>Type</ThemedText>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "pet" && styles.typeButtonActive,
            ThemeStyles.border,
          ]}
          onPress={() => setType("pet")}
        >
          <Ionicons
            name="paw"
            size={18}
            color={type === "pet" ? "white" : Colors.light.text}
          />
          <ThemedText
            style={[
              styles.typeText,
              { color: type === "pet" ? "white" : Colors.light.text },
            ]}
          >
            Pet
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "plant" && styles.typeButtonActive,
            ThemeStyles.border,
          ]}
          onPress={() => setType("plant")}
        >
          <Ionicons
            name="leaf"
            size={18}
            color={type === "plant" ? "white" : Colors.light.plantBackground}
          />
          <ThemedText
            style={[
              styles.typeText,
              type === "plant"
                ? { color: "white" }
                : { color: Colors.light.plantBackground },
            ]}
          >
            Plant
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: Colors.light.text,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  typeTextActive: {
    color: "white",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
  },
});
