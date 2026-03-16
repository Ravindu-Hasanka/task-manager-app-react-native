import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { buildTheme } from '../constants/theme/build-theme';

export type ToastVariant = 'success' | 'error' | 'info';

type AppToastProps = {
  message: string;
  onClose: () => void;
  theme: ReturnType<typeof buildTheme>;
  variant: ToastVariant;
};

export function AppToast({ message, onClose, theme, variant }: AppToastProps) {
  const palette =
    variant === 'success'
      ? {
          backgroundColor: theme.mode === 'dark' ? '#0D2F27' : '#E7F8F1',
          borderColor: theme.mode === 'dark' ? '#1C7C63' : '#93E0C1',
          iconColor: '#10B981',
        }
      : variant === 'error'
        ? {
            backgroundColor: theme.mode === 'dark' ? '#37151D' : '#FFE9ED',
            borderColor: theme.mode === 'dark' ? '#8C3043' : '#FFB9C5',
            iconColor: '#EF4444',
          }
        : {
            backgroundColor: theme.mode === 'dark' ? '#142848' : '#E7F0FF',
            borderColor: theme.mode === 'dark' ? '#3E6EC2' : '#B9D0FF',
            iconColor: theme.blue,
          };

  const iconName =
    variant === 'success'
      ? 'checkmark-circle'
      : variant === 'error'
        ? 'alert-circle'
        : 'information-circle';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          shadowColor: theme.mode === 'dark' ? '#020617' : '#0F172A',
        },
      ]}
    >
      <Ionicons name={iconName} size={22} color={palette.iconColor} />
      <Text style={[styles.message, { color: theme.textPrimary }]}>{message}</Text>
      <Pressable hitSlop={10} onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={18} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
