import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TouchableOpacityProps } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  noShadow?: boolean;
  onPress?: () => void;
}

export default function Card({ 
  children, 
  style, 
  padding = 'md', 
  noShadow = false,
  onPress,
  ...touchableProps 
}: CardProps) {
  const cardStyle = [
    styles.card,
    { padding: spacing[padding] },
    !noShadow && shadows.md,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
});
