import React, { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
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
import { buildTheme } from '../constants/theme/build-theme';
import { useThemeMode } from '../hooks/use-theme-mode';
import { useTaskStore } from '../store/task-store';
import { CreateTaskInput, TASK_PRIORITIES, TaskPriority } from '../types/task';

type AddTaskFormValues = Omit<CreateTaskInput, 'priority'> & {
  priority: TaskPriority | undefined;
};

const addTaskSchema: yup.ObjectSchema<AddTaskFormValues> = yup.object({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().trim().required('Description is required'),
  category: yup.string().trim().required('Category is required'),
  dueDate: yup
    .string()
    .required('Due date is required')
    .test('valid-date', 'Please choose a valid date and time', (value) => {
      if (!value) {
        return false;
      }

      return !Number.isNaN(Date.parse(value));
    }),
  priority: yup.mixed<TaskPriority>().oneOf(TASK_PRIORITIES).required('Priority is required'),
});

export default function AddTaskScreen() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const addTask = useTaskStore((state) => state.addTask);
  const isCreatingTask = useTaskStore((state) => state.isCreatingTask);
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<AddTaskFormValues, unknown, yup.InferType<typeof addTaskSchema>>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      dueDate: '',
      priority: undefined,
    },
    mode: 'onTouched',
    resolver: yupResolver(addTaskSchema),
  });

  const isSaving = isSubmitting || isCreatingTask;

  const handleSave = handleSubmit(async (values) => {
    if (!values.priority) {
      setError('priority', { message: 'Priority is required', type: 'required' });
      return;
    }

    clearErrors('root');

    try {
      await addTask({
        title: values.title,
        description: values.description,
        category: values.category,
        dueDate: values.dueDate,
        priority: values.priority,
      });

      router.replace('/tasks');
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Unable to create task right now',
        type: 'server',
      });
    }
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Add New Task</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
                placeholder="Enter details..."
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
          disabled={isSaving}
          onPress={() => void handleSave()}
          style={[
            styles.saveButton,
            {
              backgroundColor: theme.blue,
              opacity: isSaving ? 0.72 : 1,
            },
          ]}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving Task...' : 'Save Task'}</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 16,
  },
  saveButton: {
    height: 58,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563EB',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 14,
  },
});

