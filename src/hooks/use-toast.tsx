import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppToast, ToastVariant } from '../components/app-toast';
import { buildTheme } from '../constants/theme/build-theme';
import { useThemeMode } from './use-theme-mode';

type ToastState = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ShowToastOptions = {
  durationMs?: number;
  variant?: ToastVariant;
};

type ToastContextValue = {
  hideToast: () => void;
  showError: (message: string, durationMs?: number) => void;
  showInfo: (message: string, durationMs?: number) => void;
  showSuccess: (message: string, durationMs?: number) => void;
  showToast: (message: string, options?: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToastTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearToastTimeout();

    Animated.timing(animation, {
      duration: 180,
      easing: Easing.out(Easing.ease),
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setToast(null);
      }
    });
  }, [animation, clearToastTimeout]);

  const showToast = useCallback(
    (message: string, options?: ShowToastOptions) => {
      const nextToast = {
        id: Date.now(),
        message,
        variant: options?.variant ?? 'info',
      } satisfies ToastState;
      const durationMs = options?.durationMs ?? 2600;

      clearToastTimeout();
      setToast(nextToast);
      animation.stopAnimation();
      animation.setValue(0);

      requestAnimationFrame(() => {
        Animated.timing(animation, {
          duration: 220,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });

      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, durationMs);
    },
    [animation, clearToastTimeout, hideToast]
  );

  const showSuccess = useCallback(
    (message: string, durationMs?: number) => {
      showToast(message, { durationMs, variant: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, durationMs?: number) => {
      showToast(message, { durationMs, variant: 'error' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, durationMs?: number) => {
      showToast(message, { durationMs, variant: 'info' });
    },
    [showToast]
  );

  useEffect(() => () => clearToastTimeout(), [clearToastTimeout]);

  return (
    <ToastContext.Provider value={{ hideToast, showError, showInfo, showSuccess, showToast }}>
      {children}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {toast ? (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.toastWrapper,
              {
                opacity: animation,
                top: insets.top + 12,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-18, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <AppToast
              key={toast.id}
              message={toast.message}
              onClose={hideToast}
              theme={theme}
              variant={toast.variant}
            />
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  toastWrapper: {
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 999,
  },
});
