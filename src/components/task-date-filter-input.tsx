import React, { useMemo, useState } from 'react';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  formatDueDateLabel,
  mergeDatePart,
  parseDueDate,
} from '../components/due-date-input.shared';
import { buildTheme } from '../constants/theme/build-theme';

type TaskDateFilterInputProps = {
  mode: 'light' | 'dark';
  onChange: (value: string) => void;
  onClear: () => void;
  theme: ReturnType<typeof buildTheme>;
  value: string;
};

export function TaskDateFilterInput({
  mode,
  onChange,
  onClear,
  theme,
  value,
}: TaskDateFilterInputProps) {
  const selectedDate = useMemo(() => parseDueDate(value), [value]);
  const [showIosPicker, setShowIosPicker] = useState(false);

  const handleDateChange = (_: DateTimePickerEvent, nextValue?: Date) => {
    if (!nextValue) {
      return;
    }

    onChange(mergeDatePart(selectedDate, nextValue));
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        design: 'default',
        display: 'calendar',
        mode: 'date',
        onChange: handleDateChange,
        value: selectedDate ?? new Date(),
      });
      return;
    }

    setShowIosPicker(true);
  };

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openDatePicker}
          style={[
            styles.dateField,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.dateFieldContent}>
            <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
            <View>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                Filter by date
              </Text>
              <Text
                style={[
                  styles.fieldValue,
                  { color: selectedDate ? theme.textPrimary : theme.textSecondary },
                ]}
              >
                {selectedDate ? formatDueDateLabel(selectedDate) : 'Pick a due date'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {selectedDate ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClear}
            style={[
              styles.clearButton,
              {
                backgroundColor: theme.chipBg,
                borderColor: theme.chipBorder,
              },
            ]}
          >
            <Ionicons name="close-circle-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.clearButtonText, { color: theme.textSecondary }]}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent
          visible={showIosPicker}
          onRequestClose={() => setShowIosPicker(false)}
        >
          <Pressable
            onPress={() => setShowIosPicker(false)}
            style={[
              styles.modalOverlay,
              {
                backgroundColor: mode === 'dark' ? 'rgba(2, 6, 23, 0.7)' : 'rgba(15, 23, 42, 0.25)',
              },
            ]}
          >
            <Pressable
              onPress={() => undefined}
              style={[
                styles.modalSheet,
                {
                  backgroundColor: mode === 'dark' ? '#111827' : '#EEF3FF',
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Select date</Text>
                <TouchableOpacity onPress={() => setShowIosPicker(false)} style={styles.doneButton}>
                  <Text style={[styles.doneButtonText, { color: theme.blue }]}>Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                display="inline"
                mode="date"
                onChange={handleDateChange}
                value={selectedDate ?? new Date()}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  dateField: {
    flex: 1,
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateFieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  doneButton: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
