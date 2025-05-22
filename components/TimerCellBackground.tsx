// components/ProgressCountdown.tsx
import { Colors } from "@/constants/Colors";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";

type ProgressCountdownProps = {
  fromDate: number;
  targetDate: number; // Target timestamp in milliseconds
  onComplete?: () => void; // Optional callback when countdown reaches zero
  height?: number | string; // Optional height for the container (default: 100%)
  backgroundColor?: string; // Optional background color
  fillColor?: string; // Optional fill color
  textColor?: string; // Optional text color
  children?: React.ReactNode; // Optional children for the container
  style?: StyleProp<ViewStyle>; // Optional style for the container
};

export default function ProgressCountdown({
  fromDate,
  targetDate,
  onComplete,
  style = {},
  backgroundColor = "#f0f0f0",
  fillColor = Colors.light.tint,
  textColor = "#fff",
  children,
}: PropsWithChildren<ProgressCountdownProps>) {
  // Animation value for the progress
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Initialize on mount
  useEffect(() => {
    // Calculate initial progress
    const now = Date.now();
    const totalTimeSpan = targetDate - fromDate;
    const timeElapsed = now - fromDate;
    const initialProgress = Math.min(Math.max(0, timeElapsed / totalTimeSpan), 1);
    const remaining = Math.max(0, targetDate - now);

    // Set static progress value for debugging
    setProgressValue(initialProgress);
    
    // Set initial progress based on current time between fromDate and targetDate
    progressAnim.setValue(initialProgress);

    console.log("Initial progress:", initialProgress, "Total span:", totalTimeSpan, "Elapsed:", timeElapsed);

    // Only animate the remaining portion
    if (remaining > 0 && initialProgress < 1) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: remaining,
        useNativeDriver: false,
      }).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    } else if (initialProgress >= 1) {
      // Already complete
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }

    // Timer to update countdown text
    const updateCountdown = () => {
      const currentTime = Date.now();
      const remaining = Math.max(0, targetDate - currentTime);

      if (remaining <= 0) {
        setIsComplete(true);
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate time units
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Initial call and setup interval
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [fromDate, targetDate, onComplete, progressAnim]);

  // Format the countdown display
  const formatCountdown = () => {
    const { days, hours, minutes, seconds } = timeLeft;

    if (isComplete) {
      return "Complete!";
    }

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Create width string for progress bar
  const progressWidthStyle = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.container,
        { width: "100%", height: "100%", backgroundColor },
        style,
      ]}
    >
      {/* Background progress bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressWidthStyle,
            height: "100%",
            backgroundColor: fillColor,
            zIndex: 1,
          },
        ]}
      />
      
      {/* Foreground content wrapper */}
      <View style={styles.foregroundContent}>
        {children}
      </View>
      
      {/* Timer text */}
      {/* <View style={styles.textContainer}>
        <Text style={[styles.countdownText, { color: textColor }]}>
          {formatCountdown()}
        </Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 1,
    zIndex: 1,
  },
  foregroundContent: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding:16,
    zIndex: 3,
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  countdownText: {
    fontSize: 16,
    fontWeight: "600",
  },
});