import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type TaskConnectionContextValue = {
  initialLoadFailed: boolean;
  isRefreshing: boolean;
  showOfflineBanner: boolean;
  refreshTasks: () => Promise<void>;
  retryConnection: () => Promise<void>;
  goOfflineMode: () => void;
};

const TaskConnectionContext = createContext<TaskConnectionContextValue | null>(null);

function hasInternetConnection() {
  if (typeof globalThis.navigator?.onLine === 'boolean') {
    return globalThis.navigator.onLine;
  }

  return true;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function TaskConnectionProvider({ children }: { children: React.ReactNode }) {
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const runConnectionCheck = useCallback(
    async ({ initial = false }: { initial?: boolean } = {}) => {
      setIsRefreshing(true);
      await wait(700);

      const online = hasInternetConnection();

      if (!online) {
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
      setIsRefreshing(false);
      return true;
    },
    [hasLoadedOnce]
  );

  useEffect(() => {
    void runConnectionCheck({ initial: true });
  }, [runConnectionCheck]);

  useEffect(() => {
    const eventTarget =
      typeof window !== 'undefined' &&
      typeof window.addEventListener === 'function' &&
      typeof window.removeEventListener === 'function'
        ? window
        : null;

    if (!eventTarget) {
      return;
    }

    const handleOffline = () => {
      if (hasLoadedOnce) {
        setShowOfflineBanner(true);
      } else {
        setInitialLoadFailed(true);
      }
    };

    eventTarget.addEventListener('offline', handleOffline);

    return () => {
      eventTarget.removeEventListener('offline', handleOffline);
    };
  }, [hasLoadedOnce]);

  return (
    <TaskConnectionContext.Provider
      value={{
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
