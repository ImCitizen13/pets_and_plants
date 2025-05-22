import { Colors } from "@/constants/Colors";
import { getNotificationPermissionStatus, requestNotificationPermissions, sendTestNotification } from "@/utils/notifications";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const [notificationPermission, setNotificationPermission] = useState<string>("loading");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const status = await getNotificationPermissionStatus();
      setNotificationPermission(status);
    } catch (error) {
      console.error("Error checking notification permission:", error);
      setNotificationPermission("denied");
    }
  };

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setNotificationPermission("granted");
        Alert.alert(
          "Permission Granted",
          "You'll now receive notifications for your pets and plants.",
          [
            { 
              text: "Send Test", 
              onPress: () => sendTestNotification() 
            },
            { text: "OK" }
          ]
        );
      } else {
        setNotificationPermission("denied");
        Alert.alert(
          "Permission Denied",
          "Without notifications, you won't receive reminders for your pets and plants. You can enable them in your device settings.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationStatus = () => {
    switch (notificationPermission) {
      case "granted":
        return (
          <View style={styles.permissionRow}>
            <View>
              <Text style={styles.label}>Notifications</Text>
              <Text style={styles.statusText}>Enabled</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
            </View>
          </View>
        );
      case "denied":
        return (
          <View style={styles.permissionRow}>
            <View>
              <Text style={styles.label}>Notifications</Text>
              <Text style={styles.statusText}>Disabled</Text>
            </View>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRequestPermission}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View style={styles.permissionRow}>
            <View>
              <Text style={styles.label}>Notifications</Text>
              <Text style={styles.statusText}>Not Set</Text>
            </View>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRequestPermission}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        
        {renderNotificationStatus()}
        
        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={styles.row} 
          onPress={() => {
            if (notificationPermission === "granted") {
              sendTestNotification();
            } else {
              Alert.alert(
                "Notification Permission Required",
                "Please enable notifications first.",
                [{ text: "OK" }]
              );
            }
          }}
        >
          <View>
            <Text style={styles.label}>Test Notifications</Text>
            <Text style={styles.description}>Send a test notification</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.light.text,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  statusBadge: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
}); 