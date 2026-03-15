import React, { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
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

import { getTaskCreatedLabel } from '@/constants/task-ui';
import { buildTheme } from '@/constants/theme/build-theme';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { useTaskStore } from '@/stores/task-store';
import { Task } from '@/types/task';

const PRIORITY_OPTIONS: { label: string; value: Task['priority'] }[] = [
  { label: 'Low', value: 'Normal' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const fetchTaskById = useTaskStore((state) => state.fetchTaskById);
  const isFetchingTask = useTaskStore((state) => state.isFetchingTask);
  const isUpdatingTask = useTaskStore((state) => state.isUpdatingTask);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const task = tasks.find((item) => item.id === id);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [category, setCategory] = useState(task?.category ?? '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority ?? 'Normal');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (id) {
      void fetchTaskById(id);
    }
  }, [fetchTaskById, id]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setPriority(task.priority);
    }
  }, [task]);

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

  const handleUpdate = async () => {
    if (!title.trim()) {
      setFormError('Task title is required');
      return;
    }

    if (!description.trim()) {
      setFormError('Description is required');
      return;
    }

    if (!category.trim()) {
      setFormError('Category is required');
      return;
    }

    try {
      const updatedTask = await updateTask({
        ...task,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        priority,
      });

      router.replace({
        pathname: '/task/[id]',
        params: { id: updatedTask.id },
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to update task');
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.replace('/tasks');
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FieldLabel label="TASK TITLE" color={theme.textSecondary} />
        <TextInput
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            setFormError('');
          }}
          placeholder="Enter task title"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              color: theme.textPrimary,
            },
          ]}
        />

        <FieldLabel label="DESCRIPTION" color={theme.textSecondary} />
        <TextInput
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            setFormError('');
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
              borderColor: theme.cardBorder,
              color: theme.textPrimary,
            },
          ]}
        />

        <FieldLabel label="CATEGORY" color={theme.textSecondary} />
        <TextInput
          value={category}
          onChangeText={(value) => {
            setCategory(value);
            setFormError('');
          }}
          placeholder="Enter category"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              color: theme.textPrimary,
            },
          ]}
        />

        <FieldLabel label="PRIORITY LEVEL" color={theme.textSecondary} />
        <View style={[styles.priorityGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {PRIORITY_OPTIONS.map((option) => {
            const active = priority === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => setPriority(option.value)}
                style={[
                  styles.priorityOption,
                  {
                    backgroundColor: active ? theme.blue : 'transparent',
                  },
                ]}
              >
                <Text style={[styles.priorityOptionText, { color: active ? '#FFFFFF' : theme.textSecondary }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              Created {getTaskCreatedLabel(task)}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="folder-open-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>{category}</Text>
          </View>
        </View>

        {formError.length > 0 && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF4D4F" />
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}
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
          disabled={isUpdatingTask}
          onPress={() => void handleUpdate()}
          style={[
            styles.updateButton,
            {
              backgroundColor: theme.blue,
              opacity: isUpdatingTask ? 0.72 : 1,
            },
          ]}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.updateButtonText}>{isUpdatingTask ? 'Updating Task...' : 'Update Task'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDeleteConfirm(true)} style={styles.deleteTextButton}>
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
              <Text style={{ color: theme.textPrimary }}>&quot;{task.title}&quot;</Text>? This action
              cannot be undone and will remove all details for this task.
            </Text>

            <TouchableOpacity style={[styles.confirmDeleteButton, styles.confirmDangerButton]} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.confirmDangerText}>Delete Task</Text>
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

function FieldLabel({ label, color }: { label: string; color: string }) {
  return <Text style={[styles.label, { color }]}>{label}</Text>;
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 12,
  },
  input: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 28,
  },
  descriptionInput: {
    minHeight: 164,
    paddingTop: 16,
  },
  priorityGroup: {
    height: 62,
    borderWidth: 1,
    borderRadius: 14,
    padding: 6,
    flexDirection: 'row',
    marginBottom: 22,
  },
  priorityOption: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityOptionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
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
    marginTop: 18,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },
  updateButton: {
    height: 64,
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
