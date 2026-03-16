import React, { useMemo, useState } from 'react';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { buildTheme } from '../constants/theme/build-theme';
import {
  formatDueDateLabel,
  formatDueTimeLabel,
  mergeDatePart,
  mergeTimePart,
  parseDueDate,
} from '../components/due-date-input.shared';

type DueDateInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  theme: ReturnType<typeof buildTheme>;
  mode: 'light' | 'dark';
};

type PickerMode = 'date' | 'time';

export function DueDateInput({
  value,
  onChange,
  onBlur,
  hasError = false,
  theme,
  mode,
}: DueDateInputProps) {
  const selectedDate = useMemo(() => parseDueDate(value), [value]);
  const [iosPickerMode, setIosPickerMode] = useState<PickerMode>('date');
  const [showIosPicker, setShowIosPicker] = useState(false);

  const fieldBorderColor = hasError ? '#FF4D4F' : theme.cardBorder;

  const applySelectedPart = (pickerMode: PickerMode, nextValue: Date) => {
    const nextDueDate =
      pickerMode === 'date'
        ? mergeDatePart(selectedDate, nextValue)
        : mergeTimePart(selectedDate, nextValue);

    onChange(nextDueDate);
  };

  const handleAndroidChange =
    (pickerMode: PickerMode) => (event: DateTimePickerEvent, nextValue?: Date) => {
      if (event.type !== 'set' || !nextValue) {
        onBlur?.();
        return;
      }

      applySelectedPart(pickerMode, nextValue);
      onBlur?.();
    };

  const openPicker = (pickerMode: PickerMode) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        design: 'default',
        display: pickerMode === 'date' ? 'calendar' : 'clock',
        is24Hour: false,
        mode: pickerMode,
        onChange: handleAndroidChange(pickerMode),
        value: selectedDate ?? new Date(),
      });
      return;
    }

    setIosPickerMode(pickerMode);
    setShowIosPicker(true);
  };

  const closeIosPicker = () => {
    setShowIosPicker(false);
    onBlur?.();
  };

  return (
    <>
      <View style={styles.row}>
        <PickerField
          iconName="calendar-outline"
          label="Date"
          value={formatDueDateLabel(selectedDate)}
          onPress={() => openPicker('date')}
          borderColor={fieldBorderColor}
          textColor={selectedDate ? theme.textPrimary : theme.textSecondary}
          backgroundColor={theme.card}
          iconColor={theme.textSecondary}
        />

        <PickerField
          iconName="time-outline"
          label="Time"
          value={formatDueTimeLabel(selectedDate)}
          onPress={() => openPicker('time')}
          borderColor={fieldBorderColor}
          textColor={selectedDate ? theme.textPrimary : theme.textSecondary}
          backgroundColor={theme.card}
          iconColor={theme.textSecondary}
        />
      </View>

      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent
          visible={showIosPicker}
          onRequestClose={closeIosPicker}
        >
          <Pressable
            style={[
              styles.modalOverlay,
              {
                backgroundColor: mode === 'dark' ? 'rgba(2, 6, 23, 0.7)' : 'rgba(15, 23, 42, 0.25)',
              },
            ]}
            onPress={closeIosPicker}
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
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {iosPickerMode === 'date' ? 'Select date' : 'Select time'}
                </Text>
                <TouchableOpacity onPress={closeIosPicker} style={styles.doneButton}>
                  <Text style={[styles.doneButtonText, { color: theme.blue }]}>Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                display={iosPickerMode === 'date' ? 'inline' : 'spinner'}
                mode={iosPickerMode}
                onChange={(_, nextValue) => {
                  if (!nextValue) {
                    return;
                  }

                  applySelectedPart(iosPickerMode, nextValue);
                }}
                value={selectedDate ?? new Date()}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

type PickerFieldProps = {
  label: string;
  value: string;
  onPress: () => void;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
};

function PickerField({
  label,
  value,
  onPress,
  borderColor,
  backgroundColor,
  textColor,
  iconColor,
  iconName,
}: PickerFieldProps) {
  return (
    <View style={styles.fieldColumn}>
      <Text style={[styles.fieldLabel, { color: iconColor }]}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.fieldButton, { backgroundColor, borderColor }]}
      >
        <View style={styles.fieldButtonContent}>
          <Ionicons name={iconName} size={18} color={iconColor} />
          <Text style={[styles.fieldValue, { color: textColor }]}>{value}</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldColumn: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  fieldButton: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
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
