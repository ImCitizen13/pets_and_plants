import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ThemedView } from './ThemedView'

export default function AnimalsBottomSheet({
    bottomSheetModalRef,
    handleCloseBottomSheet,
    handleAnimalTypeSelect,
    snapPoints,
}:{
    bottomSheetModalRef: React.RefObject<BottomSheetModal>,
    handleCloseBottomSheet: () => void,
    handleAnimalTypeSelect: (animalType: string) => void,
    snapPoints: string[],
}) {
  return (
    <BottomSheetModal
            ref={bottomSheetModalRef}
            onDismiss={handleCloseBottomSheet}
            snapPoints={snapPoints}
          >
            <BottomSheetView style={styles.bottomSheetContainer}>
          <Text style={styles.bottomSheetTitle}>Select Animal Type</Text>

          <ThemedView style={styles.optionsContainer} rounded padded>
            <TouchableOpacity
              style={styles.animalOption}
              onPress={() => handleAnimalTypeSelect("dog")}
            >
              <Ionicons
                name="logo-octocat"
                size={24}
                color={Colors.light.text}
              />
              <Text style={styles.animalOptionText}>Dog</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.animalOption}
              onPress={() => handleAnimalTypeSelect("cat")}
            >
              <Ionicons
                name="logo-github"
                size={24}
                color={Colors.light.text}
              />
              <Text style={styles.animalOptionText}>Cat</Text>
            </TouchableOpacity>
          </ThemedView>
        </BottomSheetView>
        </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
      // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: Colors.light.text,
  },
  optionsContainer: {
    marginTop: 8,
  },
  animalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  animalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  // Animal Type Button Styles
  animalTypeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  animalTypeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  animalTypeIcon: {
    marginRight: 8,
  },
  animalTypeText: {
    fontSize: 16,
    color: Colors.light.text,
  },
})