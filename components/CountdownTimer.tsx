import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CountdownTimerProps = {
  targetDate: number; // Target timestamp in milliseconds
  onComplete?: () => void; // Optional callback when countdown reaches zero
  style?: object; // Optional style for the container
  textStyle?: object; // Optional style for the text
};

export default function CountdownTimer({ 
  targetDate, 
  onComplete, 
  style,
  textStyle
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Function to calculate time remaining
    const calculateTimeLeft = () => {
      const difference = targetDate - Date.now();
      
      // If the target date is in the past
      if (difference <= 0) {
        setIsComplete(true);
        if (onComplete && !isComplete) {
          onComplete();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // Calculate the time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    // Set initial time left
    setTimeLeft(calculateTimeLeft());
    
    // Update the countdown every second
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
    }, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate, onComplete, isComplete]);

  // Format the countdown display
  const formatCountdown = () => {
    const { days, hours, minutes, seconds } = timeLeft;
    
    if (isComplete) {
      return "Time's up!";
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

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.countdownText, textStyle]}>
        {formatCountdown()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  countdownText: {
    fontSize: 12,
    color: Colors.light.text,
  },
});
