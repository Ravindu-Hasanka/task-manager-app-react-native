import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TaskConnectionProvider } from '../src/hooks/use-task-connection';
import { ThemeModeProvider } from '../src/hooks/use-theme-mode';
import { useColorScheme } from '../src/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TaskConnectionProvider>
          <ThemeModeProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="add-task" options={{ headerShown: false }} />
                <Stack.Screen name="task/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="task/[id]/edit" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </ThemeModeProvider>
        </TaskConnectionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
