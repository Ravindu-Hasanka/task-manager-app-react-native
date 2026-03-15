import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { buildTheme } from '@/constants/theme/build-theme';

export function TaskSearchEmptyState({
  query,
  theme,
  onClearSearch,
  onBrowseAll,
}: {
  query: string;
  theme: ReturnType<typeof buildTheme>;
  onClearSearch: () => void;
  onBrowseAll: () => void;
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
        <Ionicons name="document-text-outline" size={60} color={dark ? '#2E63D7' : '#6C95EE'} />

        <View
          style={[
            styles.illustrationBadge,
            {
              backgroundColor: dark ? '#121C30' : '#FFFFFF',
              borderColor: dark ? '#121C30' : '#2E63D7',
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color="#FF4D4F" />
          <Ionicons name="close-outline" size={14} color="#FF4D4F" style={styles.badgeCloseIcon} />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.textPrimary }]}>No matching tasks found</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        We couldn&apos;t find any results for{' '}
        <Text style={[styles.queryText, { color: theme.textPrimary }]}>&quot;{query}&quot;</Text>. Try a
        different search term or check your spelling.
      </Text>

      <TouchableOpacity onPress={onClearSearch} style={[styles.primaryButton, { backgroundColor: theme.blue }]}>
        <Ionicons name="close-outline" size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Clear Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onBrowseAll}
        style={[
          styles.secondaryButton,
          {
            backgroundColor: dark ? '#233046' : '#EEF3FF',
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.textPrimary }]}>Browse All Tasks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    paddingBottom: 40,
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
  badgeCloseIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  queryText: {
    fontWeight: '700',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
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
    width: '100%',
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
