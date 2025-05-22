import { Entry } from "@/types";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

// Add these interface definitions
interface NotificationData {
  type?: string;
  entryId?: string;
  [key: string]: any;
}

// Fixed notification listeners hook
export function useNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (
    response: Notifications.NotificationResponse
  ) => void
) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Listener for when notification is received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      });

    // Listener for user interactions with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content
          .data as NotificationData;

        if (onNotificationResponse) {
          onNotificationResponse(response);
        }
      });

    // Clean up listeners on unmount
    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, [onNotificationReceived, onNotificationResponse]);
}

export async function getNotificationPermissionStatus() {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export function setUpNotifications() {
  // Set how notifications should be handled when the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () =>
      ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      } as Notifications.NotificationBehavior),
  });

  // Configure notification settings for Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Notifications are working!",
      body: "You'll now get reminders for your pets and plants.",
      data: { type: "test" },
    },
    trigger: null, // Show immediately
  });
}

export async function scheduleReminder(entry: Entry) {
  // Only schedule if notifications are enabled for this entry
  if (entry.notificationsEnabled === false) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${entry.name} needs care!`,
      body: `It's time to ${entry.type === "pet" ? "feed" : "water"} ${
        entry.name
      }`,
      data: {
        type: "reminder",
        entryId: entry.id,
        entryType: entry.type,
      },
    },
    trigger: {
      type: "date",
      date: entry.timeToNextAction,
    } as Notifications.DateTriggerInput,
  });
}

export async function cancelReminder(entry: Entry) {
  await Notifications.cancelScheduledNotificationAsync(entry.id);
}
