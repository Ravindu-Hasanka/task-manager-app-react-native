import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/bottom-navbar';
import { buildTheme } from '@/constants/theme/build-theme';
import { ThemeModeProvider, useThemeMode } from '@/hooks/use-theme-mode';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  return (
    <ThemeModeProvider>
      <TabsShell />
    </ThemeModeProvider>
  );
}

function TabsShell() {
  const { mode } = useThemeMode();
  const insets = useSafeAreaInsets();
  const theme = buildTheme(mode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Tabs
        initialRouteName="index"
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: theme.background,
            paddingBottom: 74 + insets.bottom,
          },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="explore" />
      </Tabs>

      <BottomNav theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
