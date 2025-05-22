import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PetPlantButton({
  type,
  buttonType,
  setType,
}: {
  buttonType: "plant" | "pet";
  type: "plant" | "pet";
  setType: (type: "plant" | "pet") => void;
}) {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.typeButton,
          buttonType === type && styles.typeButtonActive,
        ]}
        onPress={() => setType(type)}
      >
        <Ionicons
          name={buttonType === "plant" ? "leaf" : "paw"}
          size={18}
          color={
            buttonType === type
              ? "white"
              : buttonType === "plant"
              ? Colors.light.plantBackground
              : Colors.light.text
          }
        />
        <Text
          style={[styles.typeText, type === "plant" && styles.typeTextActive]}
        >
          {buttonType}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
