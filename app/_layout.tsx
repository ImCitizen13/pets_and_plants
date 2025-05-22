import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  setUpNotifications,
} from "@/utils/notifications";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import "react-native-reanimated";

// import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Set up notification handlers when the app is first loaded
  useEffect(() => {
    if (loaded) {
      setUpNotifications();
    }
  }, [loaded]);

  // Check and request notification permissions when the app starts
  useEffect(() => {
    const checkNotificationPermissions = async () => {
      try {
        const status = await getNotificationPermissionStatus();
        // If permissions haven't been granted or denied yet, show the request
        if (status !== "granted" && status !== "denied") {
          // For iOS, we can directly request
          if (Platform.OS === "ios") {
            await requestNotificationPermissions();
          } else {
            // For Android, show a dialog explaining why we need permissions first
            Alert.alert(
              "Enable Notifications",
              "Would you like to receive reminders when your pets need feeding or plants need watering?",
              [
                {
                  text: "Not Now",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: async () => {
                    await requestNotificationPermissions();
                  },
                },
              ]
            );
          }
        }
      } catch (error) {
        console.error("Error checking notification permissions:", error);
      }
    };

    if (loaded) {
      checkNotificationPermissions();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: true, headerTitle: "Pets&Plants" }}
        />
        <Stack.Screen
          name="add"
          options={{ headerShown: true, headerTitle: "Add Entry" }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: true, headerTitle: "Settings" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
