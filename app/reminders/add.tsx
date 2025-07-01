import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useReminderStore } from '@/stores/reminderStore';
import { useThemeStore } from '@/stores/themeStore';
import { Stack, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const REMINDER_TYPES = [
  'Oil Change',
  'Maintenance',
  'Insurance',
  'Registration',
  'Inspection',
  'Other',
];

export default function AddReminderScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const styles = createStyles(theme);

  const { cars, selectedCar, selectCar } = useCarStore();
  const { createReminder, isLoading, error } = useReminderStore();

  const [type, setType] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeatDays, setRepeatDays] = useState('0');
  const [description, setDescription] = useState('');

  const [typeError, setTypeError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleDateSelect = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setDueDate(date.toISOString().split('T')[0]);
  };

  const validateForm = () => {
    let isValid = true;
    setTypeError('');
    setDueDateError('');
    setDescriptionError('');

    if (!selectedCar) {
      Alert.alert('Error', 'Please select a car first');
      return false;
    }

    if (!type.trim()) {
      setTypeError('Reminder type is required');
      isValid = false;
    }

    if (!dueDate.trim()) {
      setDueDateError('Due date is required');
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    }

    return isValid;
  };

  const handleAddReminder = async () => {
    if (validateForm()) {
      try {
        await createReminder({
          carId: selectedCar!.id,
          type,
          dueDate: new Date(dueDate).toISOString(),
          repeatDays: parseInt(repeatDays),
          description,
          isActive: true,
        });

        Alert.alert('Success', 'Reminder added successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch {
        Alert.alert('Error', 'Failed to add reminder. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen options={{ title: 'Add Reminder' }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Reminder Details</Text>

        <CarSelector
          cars={cars}
          selectedCar={selectedCar}
          onSelectCar={selectCar}
        />

        <Text style={styles.label}>Reminder Type</Text>
        <View style={styles.typeContainer}>
          {REMINDER_TYPES.map((t) => (
            <Button
              key={t}
              title={t}
              onPress={() => setType(t)}
              variant={type === t ? 'primary' : 'outline'}
              size="small"
              style={styles.typeButton}
            />
          ))}
        </View>
        {typeError ? <Text style={styles.errorText}>{typeError}</Text> : null}

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={handleDateSelect}>
            <Text style={styles.dateText}>
              {dueDate ? dueDate : 'Select a date'}
            </Text>
            <Calendar size={20} color={colors.primary} />
          </TouchableOpacity>
          {dueDateError ? <Text style={styles.errorText}>{dueDateError}</Text> : null}
        </View>

        <Input
          label="Repeat Every (Days)"
          placeholder="0 for no repeat"
          value={repeatDays}
          onChangeText={setRepeatDays}
          keyboardType="number-pad"
        />

        <Input
          label="Description"
          placeholder="e.g. Change oil and filter"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.textArea}
          error={descriptionError}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Add Reminder"
            onPress={handleAddReminder}
            isLoading={isLoading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const colors = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: colors.text,
      fontWeight: '500',
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    typeButton: {
      marginRight: 8,
      marginBottom: 8,
    },
    dateContainer: {
      marginBottom: 16,
    },
    datePickerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      backgroundColor: colors.card,
    },
    dateText: {
      fontSize: 16,
      color: colors.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    errorText: {
      color: colors.error,
      marginTop: 4,
      fontSize: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    button: {
      flex: 1,
      marginHorizontal: 8,
    },
  });
}
