import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useRepairStore } from '@/stores/repairStore';
import { useThemeStore } from '@/stores/themeStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


const REPAIR_CATEGORIES = [
  'Oil Change',
  'Brakes',
  'Tires',
  'Battery',
  'Engine',
  'Transmission',
  'Other',
];

export default function AddRepairScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(theme);

  const { cars, selectedCar, selectCar } = useCarStore();
  const { createRepair, isLoading, error } = useRepairStore();

  const [repairDate, setRepairDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [odometer, setOdometer] = useState('');

  const [categoryError, setCategoryError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [odometerError, setOdometerError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setCategoryError('');
    setPriceError('');
    setDescriptionError('');
    setOdometerError('');

    if (!selectedCar) {
      Alert.alert('Error', 'Please select a car first');
      return false;
    }

    if (!price.trim()) {
      setPriceError('Price is required');
      isValid = false;
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setPriceError('Please enter a valid price');
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    }

    if (!odometer.trim()) {
      setOdometerError('Odometer reading is required');
      isValid = false;
    } else if (isNaN(parseInt(odometer)) || parseInt(odometer) < 0) {
      setOdometerError('Please enter a valid odometer reading');
      isValid = false;
    }

    return isValid;
  };

  const handleAddRepair = async () => {
    if (validateForm()) {
      try {
        await createRepair({
          carId: selectedCar!.id,
          cost: parseFloat(price),
          description,
          odometer: odometer ? parseInt(odometer) : 0,
          date: repairDate.toISOString(),
        });

        Alert.alert('Success', 'Repair record added successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch {
        Alert.alert('Error', 'Failed to add repair record. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen options={{ title: 'Add Repair Record' }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Repair Details</Text>

        <CarSelector
          cars={cars}
          selectedCar={selectedCar}
          onSelectCar={selectCar}
        />

        <Text style={styles.label}>Repair Date</Text>
        <View>
          <Button
            title={repairDate.toDateString()}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
          />
          {showDatePicker && (
            <DateTimePicker
              value={repairDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setRepairDate(selectedDate);
              }}
            />
          )}
        </View>
        <Input
          label="Price"
          placeholder="e.g. 150.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          error={priceError}
        />

        <Input
          label="Description"
          placeholder="e.g. Changed oil and filter"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.textArea}
          error={descriptionError}
        />

        <Input
          label="Odometer (km)"
          placeholder="e.g. 12500"
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="number-pad"
          error={odometerError}
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
            title="Add Repair"
            onPress={handleAddRepair}
            isLoading={isLoading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const colors = Colors[theme] ?? Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingVertical: 48,
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
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    categoryButton: {
      marginRight: 8,
      marginBottom: 8,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    errorText: {
      color: colors.error,
      marginBottom: 16,
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
