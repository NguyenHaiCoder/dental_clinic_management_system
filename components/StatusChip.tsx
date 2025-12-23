import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';

interface StatusChipProps {
  label: string;
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'completed' | 'cancelled';
  style?: ViewStyle;
}

export default function StatusChip({ label, status, style }: StatusChipProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
      case 'completed':
        return colors.success;
      case 'warning':
      case 'pending':
        return colors.warning;
      case 'error':
      case 'cancelled':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: `${getStatusColor()}15`, // 15% opacity
          borderColor: getStatusColor(),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: getStatusColor(),
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
  },
});

