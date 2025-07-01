import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import Input from '@/components/Input';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useFuelStore } from '@/stores/fuelStore';
import { useThemeStore } from '@/stores/themeStore';
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

export default function AddFuelScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(theme);

  const { cars, selectedCar, selectCar } = useCarStore();
  const { createFuel, isLoading, error } = useFuelStore();

  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('');
  const [station, setStation] = useState('');
  const [odometer, setOdometer] = useState('');

  const [litersError, setLitersError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [stationError, setStationError] = useState('');
  const [odometerError, setOdometerError] = useState('');

  const validateForm = () => {
    let isValid = true;

    setLitersError('');
    setPriceError('');
    setStationError('');
    setOdometerError('');

    if (!selectedCar) {
      Alert.alert('Error', 'Please select a car first');
      return false;
    }

    if (!liters.trim()) {
      setLitersError('Liters is required');
      isValid = false;
    } else if (isNaN(parseFloat(liters)) || parseFloat(liters) <= 0) {
      setLitersError('Please enter a valid number');
      isValid = false;
    }

    if (!price.trim()) {
      setPriceError('Price is required');
      isValid = false;
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setPriceError('Please enter a valid price');
      isValid = false;
    }

    if (!station.trim()) {
      setStationError('Station name is required');
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

  const handleAddFuel = async () => {
    if (validateForm()) {
      try {
        await createFuel({
          carId: selectedCar!.id,
          liters: parseFloat(liters),
          price: parseFloat(price),
          station,
          odometer: parseInt(odometer),
          date: new Date().toISOString(),
        });

        Alert.alert('Success', 'Fuel entry added successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch (err) {
        Alert.alert('Error', 'Failed to add fuel entry. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Stack.Screen options={{ title: 'Add Fuel Entry' }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Fuel Details</Text>

        <CarSelector
          cars={cars}
          selectedCar={selectedCar}
          onSelectCar={selectCar}
        />

        <Input
          label="Liters"
          placeholder="e.g. 45.5"
          value={liters}
          onChangeText={setLiters}
          keyboardType="decimal-pad"
          error={litersError}
        />

        <Input
          label="Price"
          placeholder="e.g. 300"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          error={priceError}
        />

        <Input
          label="Gas Station"
          placeholder="e.g. Shell"
          value={station}
          onChangeText={setStation}
          error={stationError}
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
            title="Add Fuel"
            onPress={handleAddFuel}
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
    errorText: {
      color: colors.error,
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
}
