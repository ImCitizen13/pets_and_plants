import AnimalChoice from "@/components/AnimalChoice";
import FrequencyView from "@/components/FrequencyView";
import ThemedText from "@/components/Themed";
import TypeSwitch from "@/components/TypeSwitch";
import { Colors } from "@/constants/Colors";
import { saveEntry } from "@/storage/localStorage";
import { AnimalType, Entry } from "@/types";
import {
  requestNotificationPermissions,
  scheduleReminder,
} from "@/utils/notifications";
import { getTimeInMiliseconds } from "@/utils/timeOperations";
import { FontAwesome } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function AddScreen() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"pet" | "plant">("pet");
  const [animalType, setAnimalType] = useState<AnimalType | undefined>(
    undefined
  );
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    frequency: false,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Open bottom sheet when type changes to "pet"
  useEffect(() => {
    // If type changes to "plant", reset animalType
    if (type === "plant") {
      setAnimalType(undefined);
    }
  }, [type]);

  const validateForm = (): boolean => {
    const hasFrequency =
      (days && Number(days) > 0) ||
      (hours && Number(hours) > 0) ||
      (minutes && Number(minutes) > 0);

    const newErrors = {
      name: name.trim() === "",
      frequency: !hasFrequency,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Convert all values to hours
      const daysInHours = days ? Number(days) * 24 : 0;
      const hoursValue = hours ? Number(hours) : 0;
      const minutesInHours = minutes ? Number(minutes) / 60 : 0;

      // Total frequency in hours
      const totalFrequencyInHours = daysInHours + hoursValue + minutesInHours;

      // Create a new entry
      const newEntry: Entry = {
        id: Math.random().toString(36).substring(2, 15),
        name: name.trim(),
        type,
        frequency: totalFrequencyInHours,
        notificationsEnabled,
        timeToNextAction: getTimeInMiliseconds(totalFrequencyInHours),
        lastDone: Date.now(),
      };

      // Add animalType if type is pet and animalType is selected
      if (type === "pet" && animalType) {
        newEntry.animalType = animalType;
      }

      // Save to storage
      await saveEntry(newEntry);

      // Schedule a reminder
      await scheduleReminder(newEntry);

      // Navigate back to home
      if (router.canGoBack()) {
        router.back();
      } else router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to save entry. Please try again.", [
        { text: "OK" },
      ]);
      console.error("Failed to save entry:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          headerBackground: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.light.background,
                borderBottomWidth: 5,
                borderColor: Colors.light.text,
              }}
            />
          ),
          headerTitle: () => (
            <ThemedText
              style={{
                fontFamily: "AlfaSlabOne",
                fontSize: 24,
                fontWeight: "500",
                color: Colors.light.text,
              }}
            >
              New Entry
            </ThemedText>
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome
                name="arrow-left"
                size={24}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Animated.ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={{
            backgroundColor: Colors.light.background,
          }}
        >
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor="#999"
            />
            {errors.name && (
              <ThemedText style={styles.errorText}>Name is required</ThemedText>
            )}
          </View>

          {/* Type Selection */}
          <TypeSwitch type={type} setType={setType} />

          {/* Animal Type Display (only shown when pet is selected and type is chosen) */}
          {type === "pet" && (
            <AnimalChoice
              animalType={animalType}
              setAnimalType={setAnimalType}
            />
          )}

          {/* Frequency Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Frequency</ThemedText>
            <FrequencyView
              days={days}
              hours={hours}
              minutes={minutes}
              setDays={setDays}
              setHours={setHours}
              setMinutes={setMinutes}
              errors={errors}
            />

            {errors.frequency && (
              <ThemedText style={styles.errorText}>
                Please enter a valid frequency (at least one field must be
                greater than 0)
              </ThemedText>
            )}
          </View>

          {/* Notification Toggle */}
          <View style={styles.inputContainer}>
            <View style={styles.switchRow}>
              <View>
                <ThemedText style={styles.label}>
                  Enable Notifications
                </ThemedText>
                <ThemedText style={[styles.helpText, { marginBottom: 0 }]}>
                  Get reminders when its time to{" "}
                  {type === "pet" ? "feed" : "water"}{" "}
                  {type === "pet" ? "your pet" : "your plant"}
                </ThemedText>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={async (value) => {
                  if (value) {
                    // If turning on notifications, request permissions
                    const granted = await requestNotificationPermissions();
                    setNotificationsEnabled(granted);
                  } else {
                    setNotificationsEnabled(false);
                  }
                }}
                trackColor={{
                  false: "#d1d1d1",
                  true: `${Colors.light.tint}80`,
                }}
                thumbColor={
                  notificationsEnabled ? Colors.light.tint : "#f4f3f4"
                }
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom Sheet for Animal Type Selection */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.light.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: Colors.light.text,
  },
  input: {
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
    fontFamily: "AlfaSlabOne",
  },
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
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "center",
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
  button: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.light.text,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent",
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.light.text,
  },
  cancelButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "500",
  },
  switchRow: {
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 8,
    padding: 12,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    gap: 8,
  },
});
