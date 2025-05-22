import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'card' | 'transparent';
  intensity?: 'light' | 'medium' | 'dark';
  elevated?: boolean;
  rounded?: boolean;
  padded?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

/**
 * A themed view component that automatically applies styling based on the current theme
 */
export const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'primary',
  intensity = 'medium',
  elevated = false,
  rounded = false,
  padded = false,
  fullWidth = false,
  fullHeight = false,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  
  // Define colors based on variant and intensity
  const getBackgroundColor = () => {
    if (variant === 'transparent') return 'transparent';
    
    const baseColor = variant === 'primary' 
      ? theme.colors.primary 
      : variant === 'secondary' 
        ? theme.colors.card
        : theme.colors.background;
    
    // Adjust opacity/intensity based on the intensity prop
    switch (intensity) {
      case 'light': return variant === 'primary' ? `${baseColor}20` : baseColor;
      case 'dark': return variant === 'primary' ? `${baseColor}` : baseColor;
      default: return variant === 'primary' ? `${baseColor}50` : baseColor;
    }
  };
  
  const viewStyles = [
    styles.base,
    rounded && styles.rounded,
    padded && styles.padded,
    elevated && styles.elevated,
    fullWidth && styles.fullWidth,
    fullHeight && styles.fullHeight,
    { backgroundColor: getBackgroundColor() },
    style, // Apply any custom styles passed as props
  ];

  return (
    <View style={viewStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 12,
  },
  padded: {
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
}); 