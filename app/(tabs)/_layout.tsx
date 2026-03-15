import { router, usePathname, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/bottom-navbar';
import { buildTheme } from '@/constants/theme/build-theme';
import { OfflineBanner } from '@/components/offline-banner';
import { useTaskConnection } from '@/hooks/use-task-connection';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { Header } from '@/components/header';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  return <TabsShell />;
}

function TabsShell() {
  const { mode, toggleTheme } = useThemeMode();
  const { initialLoadFailed, retryConnection, showOfflineBanner } = useTaskConnection();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const theme = buildTheme(mode);
  const isTasksScreen = pathname === '/tasks';

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        {isTasksScreen ? (
          <Header
            theme={theme}
            variant="title"
            title="Task List"
            onBackPress={() => router.replace('/')}
          />
        ) : (
          <Header theme={theme} onThemeToggle={toggleTheme} />
        )}
      </View>

      {showOfflineBanner && !initialLoadFailed && (
        <OfflineBanner theme={theme} onRetry={() => void retryConnection()} />
      )}

      <View style={styles.tabsContainer}>
        <Tabs
          initialRouteName="index"
          tabBar={() => null}
          screenOptions={{
            headerShown: false,
            sceneStyle: {
              backgroundColor: theme.background,
              paddingBottom: 0,
            },
          }}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="tasks" />
        </Tabs>
      </View>

      <BottomNav theme={theme} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  tabsContainer: {
    flex: 1,
  },
});
