import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildTheme } from '@/constants/theme/build-theme';

export const BottomNav = ({ theme }: { theme: ReturnType<typeof buildTheme> }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomNav,
        {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          height: 74 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <NavItem icon="grid-outline" label="DASHBOARD" active theme={theme} />
      <NavItem icon="list-outline" label="Tasks" theme={theme} />
      <NavItem icon="calendar-outline" label="SCHEDULE" theme={theme} />
      <NavItem icon="settings-outline" label="SETTINGS" theme={theme} />
    </View>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  theme: ReturnType<typeof buildTheme>;
}) => (
  <TouchableOpacity style={styles.navItem}>
    <Ionicons name={icon} size={22} color={active ? theme.blue : theme.iconMuted} />
    <Text style={[styles.navText, { color: active ? theme.blue : theme.iconMuted }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomNav: {
    height: 74,
    borderTopWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
