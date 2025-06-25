import Button from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'];

export default function AddCarScreen() {
  const router = useRouter();
  const { createCar, isLoading, error } = useCarStore();
  
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('Gasoline');
  
  const [nameError, setNameError] = useState('');
  const [modelError, setModelError] = useState('');
  const [plateNumberError, setPlateNumberError] = useState('');
  const [yearError, setYearError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setModelError('');
    setPlateNumberError('');
    setYearError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Car name is required');
      isValid = false;
    }
    
    // Validate model
    if (!model.trim()) {
      setModelError('Car model is required');
      isValid = false;
    }
    
    // Validate plate number
    if (!plateNumber.trim()) {
      setPlateNumberError('Plate number is required');
      isValid = false;
    }
    
    // Validate year
    if (!year.trim()) {
      setYearError('Year is required');
      isValid = false;
    } else {
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
        setYearError('Please enter a valid year');
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  const handleAddCar = async () => {
    if (validateForm()) {
      try {
        await createCar({
          name,
          model,
          plateNumber,
          year: parseInt(year),
          fuelType,
        });
        
        Alert.alert(
          'Success',
          'Car added successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (err) {
        Alert.alert('Error', 'Failed to add car. Please try again.');
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen options={{ title: 'Add New Car' }} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Car Details</Text>
        
        <Input
          label="Car Name"
          placeholder="e.g. My Honda"
          value={name}
          onChangeText={setName}
          error={nameError}
        />
        
        <Input
          label="Model"
          placeholder="e.g. Civic"
          value={model}
          onChangeText={setModel}
          error={modelError}
        />
        
        <Input
          label="Plate Number"
          placeholder="e.g. ABC123"
          value={plateNumber}
          onChangeText={setPlateNumber}
          autoCapitalize="characters"
          error={plateNumberError}
        />
        
        <Input
          label="Year"
          placeholder="e.g. 2020"
          value={year}
          onChangeText={setYear}
          keyboardType="number-pad"
          error={yearError}
        />
        
        <Text style={styles.label}>Fuel Type</Text>
        <View style={styles.fuelTypeContainer}>
          {FUEL_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => setFuelType(type)}
              variant={fuelType === type ? 'primary' : 'outline'}
              size="small"
              style={styles.fuelTypeButton}
            />
          ))}
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Add Car"
            onPress={handleAddCar}
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
  fuelTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  fuelTypeButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
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