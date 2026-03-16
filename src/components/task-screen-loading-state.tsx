import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { buildTheme } from '../constants/theme/build-theme';

export function TaskScreenLoadingState({
  description,
  theme,
  title,
}: {
  description: string;
  theme: ReturnType<typeof buildTheme>;
  title: string;
}) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.spinnerWrap,
          {
            backgroundColor: theme.mode === 'dark' ? '#1E293B' : '#E8F0FF',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <ActivityIndicator color={theme.blue} size="large" />
      </View>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  spinnerWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
});
