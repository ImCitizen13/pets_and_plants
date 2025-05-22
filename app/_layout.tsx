import {
  NotificationProvider,
  useNotification,
} from "@/contexts/NotificationContext";
import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  setUpNotifications,
  useNotificationListeners,
} from "@/utils/notifications";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

// import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const [loaded] = useFonts({
    AlfaSlabOne: require("../assets/fonts/AlfaSlabOne-Regular.ttf"),
    Love: require("../assets/fonts/LoveYaLikeASister-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Bangers: require("../assets/fonts/Bangers-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { setLastNotification } = useNotification();

  // Set up notification handlers when the app is first loaded
  useEffect(() => {
    setUpNotifications();
  }, []);

  // Add this to implement notification listeners
  useNotificationListeners(
    // This function handles notifications received while app is open
    (notification) => {
      setLastNotification(notification);
    },
    // This function handles when user taps on a notification
    (response) => {
      console.log("User tapped notification:", response);
      // Handle response...
    }
  );

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

    checkNotificationPermissions();
  }, []);

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
        <Stack.Screen
          name="entry"
          options={{ headerShown: true, headerTitle: "Entry" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
