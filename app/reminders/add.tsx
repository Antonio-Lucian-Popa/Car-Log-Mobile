import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useReminderStore } from '@/stores/reminderStore';
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
    View
} from 'react-native';

const REMINDER_TYPES = [
  'Oil Change', 
  'Maintenance', 
  'Insurance', 
  'Registration', 
  'Inspection',
  'Other'
];

export default function AddReminderScreen() {
  const router = useRouter();
  const { cars, selectedCar, selectCar } = useCarStore();
  const { createReminder, isLoading, error } = useReminderStore();
  
  const [type, setType] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeatDays, setRepeatDays] = useState('0');
  const [description, setDescription] = useState('');
  
  const [typeError, setTypeError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  
  // For date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setTypeError('');
    setDueDateError('');
    setDescriptionError('');
    
    // Validate car selection
    if (!selectedCar) {
      Alert.alert('Error', 'Please select a car first');
      isValid = false;
      return isValid;
    }
    
    // Validate type
    if (!type.trim()) {
      setTypeError('Reminder type is required');
      isValid = false;
    }
    
    // Validate due date
    if (!dueDate.trim()) {
      setDueDateError('Due date is required');
      isValid = false;
    }
    
    // Validate description
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
        
        Alert.alert(
          'Success',
          'Reminder added successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (err) {
        Alert.alert('Error', 'Failed to add reminder. Please try again.');
      }
    }
  };
  
  // Simple date picker for demo purposes
  const handleDateSelect = () => {
    // In a real app, you would use a proper date picker
    // For this demo, we'll just set a date 30 days from now
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setDueDate(date.toISOString().split('T')[0]);
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
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={handleDateSelect}
          >
            <Text style={styles.dateText}>
              {dueDate ? dueDate : 'Select a date'}
            </Text>
            <Calendar size={20} color={Colors.primary} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: Colors.text,
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
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.card,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: Colors.error,
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