import React, { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DueDateInput } from '../components/due-date-input';
import { TaskScreenLoadingState } from '../components/task-screen-loading-state';
import { getTaskCreatedLabel } from '../utils/task-ui';
import { buildTheme } from '../constants/theme/build-theme';
import { useThemeMode } from '../hooks/use-theme-mode';
import { useToast } from '../hooks/use-toast';
import { useTaskStore } from '../store/task-store';
import { TASK_PRIORITIES } from '../types/task';
import { mapTaskFormValuesToInput, taskFormDefaults, taskFormSchema, TaskFormValues } from '../utils/task-form';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const { showError, showSuccess } = useToast();
  const activeTaskMutationId = useTaskStore((state) => state.activeTaskMutationId);
  const activeTaskMutationType = useTaskStore((state) => state.activeTaskMutationType);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const fetchTaskById = useTaskStore((state) => state.fetchTaskById);
  const isFetchingTask = useTaskStore((state) => state.isFetchingTask);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const task = tasks.find((item) => item.id === id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
  } = useForm<TaskFormValues, unknown, TaskFormValues>({
    defaultValues: taskFormDefaults,
    mode: 'onTouched',
    resolver: yupResolver(taskFormSchema),
  });

  const isUpdatingCurrentTask = activeTaskMutationId === id && activeTaskMutationType === 'update';
  const isDeletingCurrentTask = activeTaskMutationId === id && activeTaskMutationType === 'delete';
  const isSaving = isSubmitting || isUpdatingCurrentTask;

  useEffect(() => {
    if (id) {
      void fetchTaskById(id);
    }
  }, [fetchTaskById, id]);

  useEffect(() => {
    if (!task) {
      return;
    }

    reset({
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate,
      priority: task.priority,
    });
  }, [reset, task]);

  if (!task && isFetchingTask) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Edit Task</Text>
          <View style={styles.headerSpacer} />
        </View>

        <TaskScreenLoadingState
          description="Fetching the latest task details from the server."
          theme={theme}
          title="Loading task..."
        />
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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Edit Task</Text>
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

  const handleUpdate = handleSubmit(async (values) => {
    clearErrors('root');

    try {
      const updatedTask = await updateTask({
        ...task,
        ...mapTaskFormValuesToInput(values),
      });
      showSuccess('Task updated successfully.');

      router.replace({
        pathname: '/task/[id]',
        params: { id: updatedTask.id },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update task';

      if (message === 'Priority is required') {
        setError('priority', { message, type: 'required' });
        showError(message);
        return;
      }

      setError('root', { message, type: 'server' });
      showError(message);
    }
  });

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      showSuccess('Task deleted successfully.');
      router.replace('/tasks');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete task';
      setError('root', {
        message,
        type: 'server',
      });
      showError(message);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Edit Task</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.fieldBlock}>
              <FieldLabel label="Title" color={theme.textPrimary} />
              <TextInput
                value={value}
                onBlur={onBlur}
                onChangeText={(nextValue) => {
                  onChange(nextValue);
                  clearErrors('root');
                }}
                placeholder="Enter task title"
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.title ? '#FF4D4F' : theme.cardBorder,
                    color: theme.textPrimary,
                  },
                ]}
              />
              <FieldError message={errors.title?.message} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.fieldBlock}>
              <FieldLabel label="Description" color={theme.textPrimary} />
              <TextInput
                value={value}
                onBlur={onBlur}
                onChangeText={(nextValue) => {
                  onChange(nextValue);
                  clearErrors('root');
                }}
                placeholder="Enter task description"
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.descriptionInput,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.description ? '#FF4D4F' : theme.cardBorder,
                    color: theme.textPrimary,
                  },
                ]}
              />
              <FieldError message={errors.description?.message} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.fieldBlock}>
              <FieldLabel label="Category" color={theme.textPrimary} />
              <TextInput
                value={value}
                onBlur={onBlur}
                onChangeText={(nextValue) => {
                  onChange(nextValue);
                  clearErrors('root');
                }}
                placeholder="Enter task category"
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.category ? '#FF4D4F' : theme.cardBorder,
                    color: theme.textPrimary,
                  },
                ]}
              />
              <FieldError message={errors.category?.message} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="dueDate"
          render={({ field: { onBlur, onChange, value } }) => (
            <View style={styles.fieldBlock}>
              <FieldLabel label="Due Date & Time" color={theme.textPrimary} />
              <DueDateInput
                hasError={Boolean(errors.dueDate)}
                mode={mode}
                onBlur={onBlur}
                onChange={(nextValue) => {
                  onChange(nextValue);
                  clearErrors('dueDate');
                  clearErrors('root');
                }}
                theme={theme}
                value={value}
              />
              <FieldError message={errors.dueDate?.message} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldBlock}>
              <FieldLabel label="Priority" color={theme.textPrimary} />
              <Pressable
                onPress={() => setShowPriorityOptions((current) => !current)}
                style={[
                  styles.input,
                  styles.selectInput,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.priority ? '#FF4D4F' : theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectText,
                    { color: value ? theme.textPrimary : theme.textSecondary },
                  ]}
                >
                  {value || 'Select priority level'}
                </Text>
                <Ionicons
                  name={showPriorityOptions ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>

              {showPriorityOptions && (
                <View
                  style={[
                    styles.priorityList,
                    { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  ]}
                >
                  {TASK_PRIORITIES.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => {
                        onChange(item);
                        clearErrors('priority');
                        clearErrors('root');
                        setShowPriorityOptions(false);
                      }}
                      style={styles.priorityOption}
                    >
                      <Text style={[styles.priorityOptionText, { color: theme.textPrimary }]}>
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <FieldError message={errors.priority?.message} />
            </View>
          )}
        />

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              Created {getTaskCreatedLabel(task)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {task.completed ? 'Completed task' : 'Pending task'}
            </Text>
          </View>
        </View>

        <FieldError message={errors.root?.message} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: mode === 'dark' ? '#111827' : '#EEF3FF',
            borderTopColor: theme.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          disabled={isSaving || isDeletingCurrentTask}
          onPress={() => void handleUpdate()}
          style={[
            styles.updateButton,
            {
              backgroundColor: theme.blue,
              opacity: isSaving || isDeletingCurrentTask ? 0.72 : 1,
            },
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          )}
          <Text style={styles.updateButtonText}>{isSaving ? 'Updating Task...' : 'Update Task'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isSaving || isDeletingCurrentTask}
          onPress={() => setShowDeleteConfirm(true)}
          style={[styles.deleteTextButton, { opacity: isSaving || isDeletingCurrentTask ? 0.72 : 1 }]}
        >
          <Ionicons name="trash-outline" size={18} color="#FF335C" />
          <Text style={styles.deleteText}>Delete Task</Text>
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
            {
              backgroundColor:
                mode === 'dark' ? 'rgba(2, 6, 23, 0.78)' : 'rgba(148, 163, 184, 0.28)',
            },
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
              <Text style={{ color: theme.textPrimary }}>&quot;{task.title}&quot;</Text>? This action
              cannot be undone and will remove all details for this task.
            </Text>

            <TouchableOpacity
              disabled={isDeletingCurrentTask}
              style={[
                styles.confirmDeleteButton,
                styles.confirmDangerButton,
                { opacity: isDeletingCurrentTask ? 0.72 : 1 },
              ]}
              onPress={() => void handleDelete()}
            >
              {isDeletingCurrentTask ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              )}
              <Text style={styles.confirmDangerText}>
                {isDeletingCurrentTask ? 'Deleting...' : 'Delete Task'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isDeletingCurrentTask}
              onPress={() => setShowDeleteConfirm(false)}
              style={[
                styles.confirmCancelButton,
                {
                  backgroundColor: mode === 'dark' ? '#273246' : theme.blue,
                  opacity: isDeletingCurrentTask ? 0.72 : 1,
                },
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

function FieldLabel({ label, color }: { label: string; color: string }) {
  return <Text style={[styles.label, { color }]}>{label}</Text>;
}

function FieldError({ message }: { message?: unknown }) {
  const text = typeof message === 'string' ? message : undefined;

  if (!text) {
    return null;
  }

  return (
    <View style={styles.errorRow}>
      <Ionicons name="alert-circle-outline" size={16} color="#FF4D4F" />
      <Text style={styles.errorText}>{text}</Text>
    </View>
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
  fieldBlock: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 160,
    paddingTop: 16,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
  },
  priorityList: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 12,
    overflow: 'hidden',
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  priorityOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
  },
  updateButton: {
    height: 58,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563EB',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  deleteTextButton: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: {
    color: '#FF335C',
    fontSize: 15,
    fontWeight: '700',
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
  confirmDangerButton: {
    backgroundColor: '#D01D1D',
    shadowColor: '#D01D1D',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  confirmDangerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
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
