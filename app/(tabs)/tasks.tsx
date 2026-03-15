import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskSearchEmptyState } from '@/components/task-search-empty-state';
import {
  getTaskDueLabel,
  getTaskPriorityLabel,
  getTaskStatusLabel,
  isTaskCompleted,
  matchesTaskFilter,
  matchesTaskSearch,
} from '@/constants/task-ui';
import { buildTheme } from '@/constants/theme/build-theme';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { TASKS } from '@/mock-data/tasks';
import { Filter } from '@/types/task-filter';
import { Task } from '@/types/task';

export default function TasksScreen() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const router = useRouter();
  const [, setTaskVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = TASKS.filter(
    (task) => matchesTaskSearch(task, search) && matchesTaskFilter(task, filter)
  );

  const handleDeleteTask = (taskId: string) => {
    const taskIndex = TASKS.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      TASKS.splice(taskIndex, 1);
      setTaskVersion((current) => current + 1);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = TASKS.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    task.completed = true;
    task.status = 'completed';
    task.updatedAt = new Date().toISOString();
    setTaskVersion((current) => current + 1);
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            placeholder="Search tasks..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle-outline" size={22} color={theme.iconMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} theme={theme} />
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

        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.textPrimary }]}>
            {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
          </Text>
          <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>Manage your daily workload</Text>
        </View>

        {filteredTasks.length === 0 && search.trim().length > 0 ? (
          <TaskSearchEmptyState
            query={search.trim()}
            theme={theme}
            onClearSearch={() => setSearch('')}
            onBrowseAll={() => {
              setSearch('');
              setFilter('all');
            }}
          />
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
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
      </ScrollView>
    </SafeAreaView>
  );
}

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
    <Text style={[styles.filterChipText, { color: active ? '#FFFFFF' : theme.textSecondary }]}>{label}</Text>
  </TouchableOpacity>
);

const TaskCard = ({
  task,
  theme,
  onDelete,
  onComplete,
  onPress,
}: {
  task: Task;
  theme: ReturnType<typeof buildTheme>;
  onDelete: () => void;
  onComplete: () => void;
  onPress: () => void;
}) => {
  const [openedSide, setOpenedSide] = useState<'left' | 'right' | null>(null);
  const isCompleted = isTaskCompleted(task);
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
              onPress={onComplete}
              style={[styles.swipeAction, styles.completeAction, styles.leftSwipeAction]}
            >
              <Ionicons name="checkmark-done-outline" size={24} color="#FFFFFF" />
              <Text style={styles.swipeActionText}>DONE</Text>
            </TouchableOpacity>
          ) : null
        }
        renderRightActions={() => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onDelete}
            style={[styles.swipeAction, styles.deleteAction, styles.rightSwipeAction]}
          >
            <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            <Text style={styles.swipeActionText}>DELETE</Text>
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onPress}
          style={[
            styles.taskCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
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
                <Text style={[styles.priorityText, { color: priorityStyles.text }]}>{priorityLabel}</Text>
              </View>
              <Text style={[styles.taskTime, { color: theme.textSecondary }]}>{dueLabel}</Text>
            </View>

            {isCompleted ? (
              <View style={[styles.completedIconBox, { backgroundColor: theme.successChip }]}>
                <MaterialCommunityIcons name="check-all" size={22} color={theme.completed} />
              </View>
            ) : (
              <TouchableOpacity style={[styles.menuButton, { borderColor: theme.chipBorder }]}>
                <Feather name="more-vertical" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
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

          <Text style={[styles.taskSubtitle, { color: theme.textSecondary }]}>{task.description}</Text>

          <View style={styles.statusRow}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle-outline' : 'time-outline'}
              size={14}
              color={isCompleted ? theme.completed : theme.pending}
            />
            <Text style={[styles.statusText, { color: isCompleted ? theme.completed : theme.pending }]}>
              {statusLabel}
            </Text>
            <Text style={[styles.categoryText, { color: theme.textSecondary }]}>{task.category}</Text>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
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
    gap: 10,
    marginBottom: 24,
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
    fontSize: 14,
    fontWeight: '700',
  },
  listHeader: {
    marginBottom: 18,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    fontWeight: '500',
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
});
