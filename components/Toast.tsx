import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../constants/theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      default:
        return colors.info;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[styles.toast, { borderLeftColor: getColor() }]}>
          <Ionicons name={getIcon()} size={24} color={getColor()} />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    minWidth: 200,
    maxWidth: '90%',
    ...shadows.md,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});

