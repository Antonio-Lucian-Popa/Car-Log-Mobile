import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import EmptyState from '@/components/EmptyState';
import ListItem from '@/components/ListItem';
import LoadingScreen from '@/components/LoadingScreen';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useFuelStore } from '@/stores/fuelStore';
import { useThemeStore } from '@/stores/themeStore';
import { Car } from '@/types';
import { useRouter } from 'expo-router';
import { Droplet, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function FuelScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(theme);

  const { cars, selectedCar, selectCar } = useCarStore();
  const {
    fuelEntries,
    fetchFuelByCarId,
    deleteFuel,
    isLoading
  } = useFuelStore();

  useEffect(() => {
    if (selectedCar) {
      fetchFuelByCarId(selectedCar.id);
    }
  }, [selectedCar]);

  const onRefresh = async () => {
    if (selectedCar) {
      setRefreshing(true);
      await fetchFuelByCarId(selectedCar.id);
      setRefreshing(false);
    }
  };

  const handleSelectCar = (car: Car) => {
    selectCar(car);
  };

  const handleDeleteFuel = (id: string) => {
    Alert.alert(
      'Delete Fuel Entry',
      'Are you sure you want to delete this fuel entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteFuel(id),
        },
      ]
    );
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && !refreshing) {
    return <LoadingScreen message="Loading fuel entries..." />;
  }

  if (!selectedCar) {
    return (
      <EmptyState
        title="No Car Selected"
        message="Please select a car to view fuel entries"
        buttonTitle="Go to Cars"
        onButtonPress={() => router.push('/cars')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Logs</Text>
        <Button
          title="Add Fuel"
          onPress={() => router.push('/fuel/add')}
          variant="primary"
          size="small"
          style={styles.addButton}
        />
      </View>

      <CarSelector
        cars={cars}
        selectedCar={selectedCar}
        onSelectCar={handleSelectCar}
      />

      {fuelEntries.length === 0 ? (
        <EmptyState
          title="No Fuel Entries"
          message={`Add your first fuel entry for ${selectedCar.name} ${selectedCar.model}`}
          buttonTitle="Add Fuel Entry"
          onButtonPress={() => router.push('/fuel/add')}
        />
      ) : (
        <FlatList
          data={fuelEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.station}
              subtitle={`${formatDate(item.date)} • ${item.liters.toFixed(2)}L • Ron ${(item.price).toFixed(2)}`}
              leftIcon={<Droplet size={24} color={colors.primary} />}
              rightContent={
                <TouchableOpacity
                  onPress={() => handleDeleteFuel(item.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
              }
              style={styles.fuelItem}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const colors = Colors[theme] ?? Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      marginVertical: 48,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    listContent: {
      paddingBottom: 20,
    },
    fuelItem: {
      marginBottom: 8,
    },
    deleteButton: {
      padding: 8,
    },
  });
}
