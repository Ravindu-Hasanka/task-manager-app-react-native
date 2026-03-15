import React, { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getTaskDueLabel,
  getTaskPriorityLabel,
  getTaskStatusLabel,
  isTaskCompleted,
} from '@/constants/task-ui';
import { buildTheme } from '@/constants/theme/build-theme';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { useTaskStore } from '@/stores/task-store';
import { Task } from '@/types/task';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const isDeletingTask = useTaskStore((state) => state.isDeletingTask);
  const fetchTaskById = useTaskStore((state) => state.fetchTaskById);
  const isFetchingTask = useTaskStore((state) => state.isFetchingTask);
  const isUpdatingTask = useTaskStore((state) => state.isUpdatingTask);
  const tasks = useTaskStore((state) => state.tasks);
  const task = tasks.find((item) => item.id === id);
  const [completed, setCompleted] = useState(task ? isTaskCompleted(task) : false);
  const [statusError, setStatusError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      void fetchTaskById(id);
    }
  }, [fetchTaskById, id]);

  useEffect(() => {
    if (task) {
      setCompleted(isTaskCompleted(task));
    }
  }, [task]);

  if (!task && isFetchingTask) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Task Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Loading task...</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Fetching the latest task details from the server.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Task Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Task not found</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            This task may have been removed or is no longer available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentTask: Task = {
    ...task,
    completed,
    status: completed ? 'completed' : 'pending',
  };
  const priorityLabel = getTaskPriorityLabel(currentTask);
  const dueLabel = getTaskDueLabel(currentTask);
  const statusLabel = getTaskStatusLabel(currentTask);

  const priorityStyles =
    currentTask.priority === 'High'
      ? { bg: mode === 'dark' ? '#4A2025' : '#FFE2E2', text: '#FF6B6B' }
      : currentTask.priority === 'Medium'
        ? { bg: mode === 'dark' ? '#4B3C16' : '#FBE7B6', text: '#D69E2E' }
        : { bg: mode === 'dark' ? '#2D3748' : '#E2E8F0', text: '#64748B' };

  const handleStatusChange = async (nextCompleted: boolean) => {
    setStatusError('');

    try {
      await completeTask(task.id, nextCompleted);
      setCompleted(nextCompleted);
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to update task status');
    }
  };

  const handleDelete = () => {
    void (async () => {
      try {
        await deleteTask(task.id);
        router.replace('/tasks');
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Unable to delete task');
        setShowDeleteConfirm(false);
      }
    })();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Task Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.taskTitle, { color: theme.textPrimary }]}>{currentTask.title}</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: priorityStyles.bg, borderColor: priorityStyles.text }]}>
            <Ionicons name="alert-circle-outline" size={16} color={priorityStyles.text} />
            <Text style={[styles.badgeText, { color: priorityStyles.text }]}>{priorityLabel}</Text>
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: mode === 'dark' ? '#142D5C' : '#D9E7FF',
                borderColor: mode === 'dark' ? '#2E5FB7' : '#8CB4FF',
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.blue} />
            <Text style={[styles.badgeText, { color: theme.blue }]}>{dueLabel}</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DESCRIPTION</Text>
        <Text style={[styles.description, { color: theme.textPrimary }]}>{currentTask.description}</Text>

        <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>TASK STATUS</Text>
          <View
            style={[
              styles.statusSwitcher,
              { backgroundColor: mode === 'dark' ? '#273246' : '#B8CDF5' },
            ]}
          >
            <TouchableOpacity
              disabled={isUpdatingTask}
              onPress={() => void handleStatusChange(false)}
              style={[
                styles.statusOption,
                {
                  backgroundColor: !completed ? theme.blue : 'transparent',
                  borderColor: 'transparent',
                  opacity: isUpdatingTask ? 0.72 : 1,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color={!completed ? '#FFFFFF' : theme.textSecondary}
              />
              <Text style={[styles.statusOptionText, { color: !completed ? '#FFFFFF' : theme.textSecondary }]}>
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isUpdatingTask}
              onPress={() => void handleStatusChange(true)}
              style={[
                styles.statusOption,
                {
                  backgroundColor: completed ? theme.blue : 'transparent',
                  borderColor: 'transparent',
                  opacity: isUpdatingTask ? 0.72 : 1,
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={completed ? '#FFFFFF' : theme.textSecondary}
              />
              <Text style={[styles.statusOptionText, { color: completed ? '#FFFFFF' : theme.textSecondary }]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            Category: <Text style={{ color: theme.textPrimary }}>{currentTask.category}</Text>
          </Text>
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            Current status: <Text style={{ color: theme.textPrimary }}>{statusLabel}</Text>
          </Text>
          {statusError.length > 0 && <Text style={styles.statusErrorText}>{statusError}</Text>}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: mode === 'dark' ? '#111827' : '#EEF3FF', borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/task/[id]/edit',
              params: { id: currentTask.id },
            })
          }
          style={[
            styles.footerButton,
            styles.editButton,
            { borderColor: theme.blue, backgroundColor: mode === 'dark' ? 'transparent' : '#F4F8FF' },
          ]}
        >
          <Ionicons name="create-outline" size={20} color={theme.blue} />
          <Text style={[styles.editButtonText, { color: theme.blue }]}>Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.deleteButton]}
          onPress={() => setShowDeleteConfirm(true)}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <Pressable
          onPress={() => setShowDeleteConfirm(false)}
          style={[
            styles.modalOverlay,
            { backgroundColor: mode === 'dark' ? 'rgba(2, 6, 23, 0.78)' : 'rgba(148, 163, 184, 0.28)' },
          ]}
        >
          <Pressable
            onPress={() => undefined}
            style={[
              styles.confirmSheet,
              {
                backgroundColor: mode === 'dark' ? '#111827' : '#EEF3FF',
                borderTopColor: theme.cardBorder,
              },
            ]}
          >
            <View
              style={[
                styles.confirmIconWrap,
                { backgroundColor: mode === 'dark' ? '#5A2430' : '#FFDADF' },
              ]}
            >
              <Ionicons name="trash-outline" size={28} color="#EF4444" />
            </View>

            <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>Delete task?</Text>
            <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
              Are you sure you want to delete{' '}
              <Text style={{ color: theme.textPrimary }}>&quot;{currentTask.title}&quot;</Text>? This
              action cannot be undone and will remove all details for this task.
            </Text>

            <TouchableOpacity
              disabled={isDeletingTask}
              style={[
                styles.confirmDeleteButton,
                styles.deleteButton,
                { opacity: isDeletingTask ? 0.72 : 1 },
              ]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>{isDeletingTask ? 'Deleting...' : 'Delete Task'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDeleteConfirm(false)}
              style={[
                styles.confirmCancelButton,
                { backgroundColor: mode === 'dark' ? '#273246' : theme.blue },
              ]}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 68,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 20,
  },
  badgeRow: {
    gap: 12,
    marginBottom: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '500',
    marginBottom: 32,
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  statusSwitcher: {
    borderRadius: 10,
    flexDirection: 'row',
    padding: 4,
    marginBottom: 16,
  },
  statusOption: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusOptionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  statusErrorText: {
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    flexDirection: 'row',
    gap: 16,
  },
  footerButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButton: {
    borderWidth: 2,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  deleteButton: {
    backgroundColor: '#D01D1D',
    shadowColor: '#D01D1D',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  confirmSheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  confirmText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: 22,
  },
  confirmDeleteButton: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    flexDirection: 'row',
    gap: 8,
  },
  confirmCancelButton: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
