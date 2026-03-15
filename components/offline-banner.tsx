import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { buildTheme } from '@/constants/theme/build-theme';

export function OfflineBanner({
  theme,
  onRetry,
}: {
  theme: ReturnType<typeof buildTheme>;
  onRetry: () => void;
}) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.mode === 'dark' ? '#2B2417' : '#FFF4DB',
          borderBottomColor: theme.mode === 'dark' ? '#53452A' : '#F2D79A',
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="wifi-outline" size={20} color="#FBBF24" style={styles.icon} />
        <View style={styles.textBlock}>
          <Text style={styles.title}>You&apos;re offline.</Text>
          <Text style={styles.description}>Connectivity lost. Some features may be limited.</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>RETRY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  icon: {
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#FCD34D',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  description: {
    color: '#D6B66F',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
});
