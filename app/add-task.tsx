import React, { useMemo, useState } from 'react';
import { router } from 'expo-router';
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

import { buildTheme } from '@/constants/theme/build-theme';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { TASKS } from '@/mock-data/tasks';
import { Task } from '@/types/task';

const PRIORITIES = ['High', 'Medium', 'Normal'] as const;

export default function AddTaskScreen() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority'] | ''>('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [showPriorityError, setShowPriorityError] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }

    if (!priority) {
      setShowPriorityError(true);
      setFormError('Priority is required');
      return;
    }

    if (!category.trim()) {
      setFormError('Category is required');
      return;
    }

    const parsedDueDate = new Date(dueDate);

    if (!dueDate.trim() || Number.isNaN(parsedDueDate.getTime())) {
      setFormError('Due date must be a valid ISO date');
      return;
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      category: category.trim(),
      dueDate: parsedDueDate.toISOString(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    TASKS.unshift(newTask);
    router.replace('/tasks');
  };

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
        <FieldLabel label="Title" color={theme.textPrimary} />
        <TextInput
          value={title}
          onChangeText={setTitle}
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

        <FieldLabel label="Description" color={theme.textPrimary} />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter details..."
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

        <FieldLabel label="Category" color={theme.textPrimary} />
        <TextInput
          value={category}
          onChangeText={(value) => {
            setCategory(value);
            setFormError('');
          }}
          placeholder="Enter task category"
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

        <FieldLabel label="Due Date" color={theme.textPrimary} />
        <TextInput
          value={dueDate}
          onChangeText={(value) => {
            setDueDate(value);
            setFormError('');
          }}
          placeholder="2025-12-22T09:00:00.000Z"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              color: theme.textPrimary,
            },
          ]}
        />

        <FieldLabel label="Priority" color={theme.textPrimary} />
        <Pressable
          onPress={() => setShowPriorityOptions((current) => !current)}
          style={[
            styles.input,
            styles.selectInput,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.selectText, { color: priority ? theme.textPrimary : theme.textSecondary }]}>
            {priority || 'Select priority level'}
          </Text>
          <Ionicons
            name={showPriorityOptions ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>

        {showPriorityOptions && (
          <View style={[styles.priorityList, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {PRIORITIES.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  setPriority(item);
                  setShowPriorityOptions(false);
                  setShowPriorityError(false);
                  setFormError('');
                }}
                style={styles.priorityOption}
              >
                <Text style={[styles.priorityOptionText, { color: theme.textPrimary }]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {showPriorityError && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF4D4F" />
            <Text style={styles.errorText}>Priority is required</Text>
          </View>
        )}

        {formError.length > 0 && !showPriorityError && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF4D4F" />
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: mode === 'dark' ? '#111827' : '#EEF3FF', borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: theme.blue }]}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>Changes will be saved to your workspace</Text>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
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
    marginBottom: 24,
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
    marginTop: -10,
    marginBottom: 16,
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
    marginTop: -4,
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
