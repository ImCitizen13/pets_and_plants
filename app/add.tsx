import AnimalChoice from "@/components/AnimalChoice";
import { Colors } from "@/constants/Colors";
import { saveEntry } from "@/storage/localStorage";
import { AnimalType, Entry } from "@/types";
import {
  requestNotificationPermissions,
  scheduleReminder,
} from "@/utils/notifications";
import { getTimeInMiliseconds } from "@/utils/timeOperations";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
        lastDone: 0,
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
      <Animated.ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={{
            backgroundColor: Colors.light.background,
          }}
        >
          <Text style={styles.title}>Add New Entry</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor="#999"
            />
            {errors.name && (
              <Text style={styles.errorText}>Name is required</Text>
            )}
          </View>

          {/* Type Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "pet" && styles.typeButtonActive,
                ]}
                onPress={() => setType("pet")}
              >
                <Ionicons
                  name="paw"
                  size={18}
                  color={
                    type === "pet"
                      ? "white"
                      : type === "plant"
                      ? Colors.light.plantBackground
                      : Colors.light.text
                  }
                />
                <Text
                  style={[
                    styles.typeText,
                    type === "pet" && styles.typeTextActive,
                  ]}
                >
                  Pet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,

                  type === "plant" && styles.typeButtonActive,
                ]}
                onPress={() => setType("plant")}
              >
                <Ionicons
                  name="leaf"
                  size={18}
                  color={
                    type === "plant" ? "white" : Colors.light.plantBackground
                  }
                />
                <Text
                  style={[
                    styles.typeText,
                    type === "plant" && styles.typeTextActive,
                  ]}
                >
                  Plant
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Animal Type Display (only shown when pet is selected and type is chosen) */}
          {type === "pet" && (
            <AnimalChoice
              animalType={animalType}
              setAnimalType={setAnimalType}
            />
          )}

          {/* Frequency Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Frequency</Text>
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
                <Text style={styles.timeLabel}>Days</Text>
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
                <Text style={styles.timeLabel}>Hours</Text>
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
                <Text style={styles.timeLabel}>Mins</Text>
              </View>
            </View>

            {errors.frequency && (
              <Text style={styles.errorText}>
                Please enter a valid frequency (at least one field must be
                greater than 0)
              </Text>
            )}
          </View>

          {/* Notification Toggle */}
          <View style={styles.inputContainer}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.label}>Enable Notifications</Text>
                <Text style={[styles.helpText, { marginBottom: 0 }]}>
                  `Get reminders when its time to{" "}
                  {type === "pet" ? "feed" : "water"}{" "}
                  {type === "pet" ? "your pet" : "your plant"}`
                </Text>
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

          {/* Help Text */}
          <Text style={styles.helpText}>
            {type === "pet"
              ? "How often does your pet need to be fed?"
              : "How often does your plant need to be watered?"}
          </Text>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  },
  cancelButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "500",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
