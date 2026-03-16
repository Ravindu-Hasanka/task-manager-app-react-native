import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

type TaskConnectionContextValue = {
  isCheckingConnection: boolean;
  isOnline: boolean;
  initialLoadFailed: boolean;
  isRefreshing: boolean;
  showOfflineBanner: boolean;
  refreshTasks: () => Promise<void>;
  retryConnection: () => Promise<void>;
  goOfflineMode: () => void;
};

const TaskConnectionContext = createContext<TaskConnectionContextValue | null>(null);

function resolveOnlineState(
  state:
    | Awaited<ReturnType<typeof NetInfo.fetch>>
    | { isConnected: boolean | null; isInternetReachable: boolean | null }
) {
  if (typeof state.isInternetReachable === 'boolean') {
    return state.isInternetReachable;
  }

  if (typeof state.isConnected === 'boolean') {
    return state.isConnected;
  }

  return true;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function TaskConnectionProvider({ children }: { children: React.ReactNode }) {
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const runConnectionCheck = useCallback(
    async ({ initial = false }: { initial?: boolean } = {}) => {
      setIsCheckingConnection(true);
      setIsRefreshing(true);
      await wait(700);

      const online = resolveOnlineState(await NetInfo.fetch());
      setIsOnline(online);

      if (!online) {
        setIsCheckingConnection(false);
        setIsRefreshing(false);

        if (initial && !hasLoadedOnce) {
          setInitialLoadFailed(true);
          return false;
        }

        setShowOfflineBanner(true);
        return false;
      }

      setInitialLoadFailed(false);
      setShowOfflineBanner(false);
      setHasLoadedOnce(true);
      setIsCheckingConnection(false);
      setIsRefreshing(false);
      return true;
    },
    [hasLoadedOnce]
  );

  useEffect(() => {
    void runConnectionCheck({ initial: true });
  }, [runConnectionCheck]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = resolveOnlineState(state);

      setIsOnline(online);
      setIsCheckingConnection(false);

      if (online) {
        setInitialLoadFailed(false);
        setShowOfflineBanner(false);
        if (hasLoadedOnce) {
          return;
        }

        setHasLoadedOnce(true);
        return;
      }

      if (hasLoadedOnce) {
        setShowOfflineBanner(true);
      } else {
        setInitialLoadFailed(true);
      }
    });

    return unsubscribe;
  }, [hasLoadedOnce]);

  return (
    <TaskConnectionContext.Provider
      value={{
        isCheckingConnection,
        isOnline,
        initialLoadFailed,
        isRefreshing,
        showOfflineBanner,
        refreshTasks: async () => {
          await runConnectionCheck();
        },
        retryConnection: async () => {
          await runConnectionCheck();
        },
        goOfflineMode: () => {
          setInitialLoadFailed(false);
          setHasLoadedOnce(true);
          setShowOfflineBanner(true);
        },
      }}
    >
      {children}
    </TaskConnectionContext.Provider>
  );
}

export function useTaskConnection() {
  const context = useContext(TaskConnectionContext);

  if (!context) {
    throw new Error('useTaskConnection must be used within a TaskConnectionProvider');
  }

  return context;
}
