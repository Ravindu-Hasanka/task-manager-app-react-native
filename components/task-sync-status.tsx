import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { buildTheme } from '@/constants/theme/build-theme';

export function TaskSyncStatus({ theme }: { theme: ReturnType<typeof buildTheme> }) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: theme.mode === 'dark' ? '#233046' : '#FFFFFF',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Ionicons name="sync-outline" size={26} color={theme.blue} />
      </View>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Updating task list...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
