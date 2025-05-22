import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

export default function ThemedText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[{ color: Colors.light.text, fontFamily: "AlfaSlabOne" }, style]}
    >
      {children}
    </Text>
  );
}

export const ThemeStyles = StyleSheet.create({
  border: {
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.light.text,
  },
});
