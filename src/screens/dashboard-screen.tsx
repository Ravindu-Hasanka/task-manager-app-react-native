import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskListLoadingState } from '../components/task-list-loading-state';
import { TaskLoadErrorState } from '../components/task-load-error-state';
import { TaskSearchEmptyState } from '../components/task-search-empty-state';
import { TaskSyncStatus } from '../components/task-sync-status';
import { buildTheme } from '../constants/theme/build-theme';
import { useTaskConnection } from '../hooks/use-task-connection';
import { useThemeMode } from '../hooks/use-theme-mode';
import { useToast } from '../hooks/use-toast';
import { useTaskStore } from '../store/task-store';
import { Task } from '../types/task';
import { Filter } from '../types/task-filter';
import { ThemeMode } from '../types/theme-mode';
import {
  getTaskDueLabel,
  getTaskPriorityLabel,
  getTaskStatusLabel,
  isTaskCompleted,
  isTaskDueToday,
  matchesTaskFilter,
  matchesTaskSearch,
} from '../utils/task-ui';

export const DashboardScreen = ({ mode }: { mode: ThemeMode }) => {
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showError, showInfo, showSuccess } = useToast();
  const { goOfflineMode, initialLoadFailed, isCheckingConnection, isRefreshing, retryConnection } =
    useTaskConnection();
  const activeTaskMutationId = useTaskStore((state) => state.activeTaskMutationId);
  const activeTaskMutationType = useTaskStore((state) => state.activeTaskMutationType);
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const isFetchingList = useTaskStore((state) => state.isFetchingList);
  const tasks = useTaskStore((state) => state.tasks);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const todayTasks = tasks.filter((task) => isTaskDueToday(task));
  const filteredTasks = todayTasks.filter(
    (task) => matchesTaskSearch(task, search) && matchesTaskFilter(task, filter)
  );

  const completedCount = todayTasks.filter(isTaskCompleted).length;
  const pendingCount = todayTasks.length - completedCount;
  const progress = todayTasks.length > 0 ? completedCount / todayTasks.length : 0;

  if (initialLoadFailed) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <TaskLoadErrorState
          theme={theme}
          onRetry={() =>
            void (async () => {
              await retryConnection();
              await fetchTasks();
              showSuccess('Connection restored. Tasks refreshed.');
            })()
          }
          onOfflineMode={() => {
            goOfflineMode();
            showInfo('Offline mode enabled.');
          }}
        />
      </SafeAreaView>
    );
  }

  const showInitialLoading = (isCheckingConnection || isFetchingList) && tasks.length === 0;

  const handleDeleteTask = (taskId: string) => {
    void (async () => {
      try {
        await deleteTask(taskId);
        showSuccess('Task deleted successfully.');
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Unable to delete task');
      }
    })();
  };

  const handleCompleteTask = (taskId: string) => {
    void (async () => {
      try {
        await completeTask(taskId);
        showInfo('Task marked as completed.');
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Unable to update task status');
      }
    })();
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={styles.screenWrapper}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing || isFetchingList}
              onRefresh={() => {
                void fetchTasks();
              }}
              tintColor={theme.blue}
              colors={[theme.blue]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {showInitialLoading ? (
            <TaskListLoadingState theme={theme} />
          ) : (
            <>
              <Text style={[styles.heading, { color: theme.textPrimary }]}>Today&apos;s Tasks</Text>
              <Text style={[styles.subheading, { color: theme.textSecondary }]}>
                {todayTasks.length > 0
                  ? `${todayTasks.length} task${todayTasks.length === 1 ? '' : 's'} scheduled for today`
                  : 'No tasks scheduled for today yet'}
              </Text>

              <View style={styles.statsRow}>
                <StatCard
                  label="Completed"
                  value={completedCount}
                  valueColor="#10B981"
                  theme={theme}
                />
                <StatCard label="Pending" value={pendingCount} valueColor="#F59E0B" theme={theme} />
              </View>

              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: theme.blue }]}>Task Progress</Text>
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                  {completedCount} of {todayTasks.length} completed ({Math.round(progress * 100)}%)
                </Text>
              </View>

              <View style={[styles.progressTrack, { backgroundColor: theme.progressTrack }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.blue, width: `${progress * 100}%` },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                  },
                ]}
              >
                <Feather name="search" size={20} color={theme.iconMuted} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search today's tasks..."
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.searchInput, { color: theme.textPrimary }]}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle-outline" size={24} color={theme.iconMuted} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.filterRow}>
                <FilterChip
                  label="All Tasks"
                  active={filter === 'all'}
                  onPress={() => setFilter('all')}
                  theme={theme}
                />
                <FilterChip
                  label="Pending"
                  active={filter === 'pending'}
                  onPress={() => setFilter('pending')}
                  theme={theme}
                />
                <FilterChip
                  label="Completed"
                  active={filter === 'completed'}
                  onPress={() => setFilter('completed')}
                  theme={theme}
                />
              </View>

              {(isRefreshing || isFetchingList) && tasks.length > 0 && (
                <TaskSyncStatus theme={theme} />
              )}

              {filteredTasks.length === 0 && search.trim().length > 0 ? (
                <TaskSearchEmptyState
                  query={search.trim()}
                  theme={theme}
                  onClearSearch={() => setSearch('')}
                  onBrowseAll={() => {
                    setSearch('');
                    setFilter('all');
                    router.replace('/tasks');
                  }}
                />
              ) : filteredTasks.length === 0 ? (
                <TodayTasksEmptyState theme={theme} />
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    actionType={activeTaskMutationId === task.id ? activeTaskMutationType : null}
                    key={task.id}
                    task={task}
                    theme={theme}
                    onDelete={() => handleDeleteTask(task.id)}
                    onComplete={() => handleCompleteTask(task.id)}
                    onPress={() =>
                      router.push({
                        pathname: '/task/[id]',
                        params: { id: task.id },
                      })
                    }
                  />
                ))
              )}
            </>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.push('/add-task')}
          style={[
            styles.fab,
            {
              backgroundColor: theme.blue,
              shadowColor: theme.fabShadow,
              bottom: insets.bottom,
            },
          ]}
        >
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const { mode } = useThemeMode();

  return <DashboardScreen mode={mode} />;
}

const StatCard = ({
  label,
  value,
  valueColor,
  theme,
}: {
  label: string;
  value: number;
  valueColor: string;
  theme: ReturnType<typeof buildTheme>;
}) => (
  <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const FilterChip = ({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ReturnType<typeof buildTheme>;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.filterChip,
      {
        backgroundColor: active ? theme.blue : theme.chipBg,
        borderColor: active ? theme.blue : theme.chipBorder,
      },
    ]}
  >
    <Text style={[styles.filterChipText, { color: active ? '#FFFFFF' : theme.textSecondary }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const TaskCard = ({
  task,
  theme,
  onDelete,
  onComplete,
  onPress,
  actionType,
}: {
  task: Task;
  theme: ReturnType<typeof buildTheme>;
  onDelete: () => void;
  onComplete: () => void;
  onPress: () => void;
  actionType: 'complete' | 'delete' | 'update' | null;
}) => {
  const [openedSide, setOpenedSide] = useState<'left' | 'right' | null>(null);
  const isCompleted = isTaskCompleted(task);
  const isCompleting = actionType === 'complete';
  const isDeleting = actionType === 'delete';
  const isMutating = Boolean(actionType);
  const statusLabel = getTaskStatusLabel(task);
  const dueLabel = getTaskDueLabel(task);
  const priorityLabel = getTaskPriorityLabel(task);

  const priorityStyles =
    task.priority === 'High'
      ? { bg: theme.highBg, text: theme.highText }
      : task.priority === 'Medium'
        ? { bg: theme.mediumBg, text: theme.mediumText }
        : { bg: theme.normalBg, text: theme.normalText };

  return (
    <View style={styles.swipeContainer}>
      <Swipeable
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillOpen={(direction) => setOpenedSide(direction)}
        onSwipeableWillClose={() => setOpenedSide(null)}
        renderLeftActions={() =>
          !isCompleted ? (
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={isMutating}
              onPress={onComplete}
              style={[styles.swipeAction, styles.completeAction, styles.leftSwipeAction]}
            >
              {isCompleting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="checkmark-done-outline" size={24} color="#FFFFFF" />
              )}
              <Text style={styles.swipeActionText}>{isCompleting ? 'SAVING' : 'DONE'}</Text>
            </TouchableOpacity>
          ) : null
        }
        renderRightActions={() => (
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={isMutating}
            onPress={onDelete}
            style={[styles.swipeAction, styles.deleteAction, styles.rightSwipeAction]}
          >
            {isDeleting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.swipeActionText}>{isDeleting ? 'DELETING' : 'DELETE'}</Text>
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          disabled={isMutating}
          onPress={onPress}
          style={[
            styles.taskCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              opacity: isMutating ? 0.72 : 1,
            },
            openedSide === 'left'
              ? styles.cardOpenToLeft
              : openedSide === 'right'
                ? styles.cardOpenToRight
                : null,
          ]}
        >
          <View style={styles.taskTopRow}>
            <View style={styles.taskMetaRow}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityStyles.bg }]}>
                <Text style={[styles.priorityText, { color: priorityStyles.text }]}>
                  {priorityLabel}
                </Text>
              </View>
              <Text style={[styles.taskTime, { color: theme.textSecondary }]}>{dueLabel}</Text>
            </View>

            {isCompleted && (
              <View style={[styles.completedIconBox, { backgroundColor: theme.successChip }]}>
                <MaterialCommunityIcons name="check-all" size={22} color={theme.completed} />
              </View>
            )}
          </View>

          <Text
            style={[
              styles.taskTitle,
              {
                color: theme.textPrimary,
                textDecorationLine: isCompleted ? 'line-through' : 'none',
                opacity: isCompleted ? 0.6 : 1,
              },
            ]}
          >
            {task.title}
          </Text>

          <Text style={[styles.taskSubtitle, { color: theme.textSecondary }]}>
            {task.description}
          </Text>

          <View style={styles.statusRow}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle-outline' : 'time-outline'}
              size={14}
              color={isCompleted ? theme.completed : theme.pending}
            />
            <Text
              style={[styles.statusText, { color: isCompleted ? theme.completed : theme.pending }]}
            >
              {statusLabel}
            </Text>
            <Text style={[styles.categoryText, { color: theme.textSecondary }]}>
              {task.category}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
  },
  subheading: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  searchBox: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  filterChip: {
    flex: 1,
    height: 42,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  swipeContainer: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
  },
  swipeAction: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  leftSwipeAction: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightSwipeAction: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  completeAction: {
    backgroundColor: '#1FBA84',
  },
  deleteAction: {
    backgroundColor: '#ED2024',
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  cardOpenToLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  cardOpenToRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  taskSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
});

const TodayTasksEmptyState = ({ theme }: { theme: ReturnType<typeof buildTheme> }) => (
  <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Nothing due today</Text>
    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
      Add a task or check the full task list from the Tasks tab.
    </Text>
  </View>
);
