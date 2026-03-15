import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { buildTheme } from '../constants/theme/build-theme';

export function TaskLoadErrorState({
  theme,
  onRetry,
  onOfflineMode,
}: {
  theme: ReturnType<typeof buildTheme>;
  onRetry: () => void;
  onOfflineMode: () => void;
}) {
  const dark = theme.mode === 'dark';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.illustrationCircle,
          {
            backgroundColor: dark ? '#1D2940' : '#DCE8FF',
            borderColor: dark ? '#334155' : '#B7CCFF',
          },
        ]}
      >
        <Ionicons name="cloud-offline-outline" size={58} color={dark ? '#2E63D7' : '#2A61DA'} />

        <View
          style={[
            styles.illustrationBadge,
            {
              backgroundColor: dark ? '#121C30' : '#FFFFFF',
              borderColor: dark ? '#121C30' : '#2E63D7',
            },
          ]}
        >
          <Ionicons name="briefcase-outline" size={18} color="#2A61DA" />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.textPrimary }]}>Unable to load tasks</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        Please check your internet connection and try again.
      </Text>

      <TouchableOpacity onPress={onRetry} style={[styles.primaryButton, { backgroundColor: theme.blue }]}>
        <Text style={styles.primaryButtonText}>Retry Connection</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onOfflineMode} style={styles.secondaryButton}>
        <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Go to Offline Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  illustrationCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  illustrationBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: 30,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
