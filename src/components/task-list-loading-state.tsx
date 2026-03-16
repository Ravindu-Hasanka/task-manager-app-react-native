import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { buildTheme } from '../constants/theme/build-theme';

export function TaskListLoadingState({
  theme,
  title = 'Loading tasks...',
  subtitle = 'Syncing the latest task list for you.',
}: {
  theme: ReturnType<typeof buildTheme>;
  title?: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.spinnerWrap,
          {
            backgroundColor: theme.mode === 'dark' ? '#162235' : '#E8F0FF',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <ActivityIndicator color={theme.blue} size="large" />
      </View>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  spinnerWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
});
