import EmptyState from '@/components/EmptyState';
import ListItem from '@/components/ListItem';
import LoadingScreen from '@/components/LoadingScreen';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useThemeStore } from '@/stores/themeStore';
import { Car } from '@/types';
import { useRouter } from 'expo-router';
import { Car as CarIcon, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function CarsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(theme);

  const {
    cars,
    selectedCar,
    selectCar,
    fetchCars,
    deleteCar,
    isLoading
  } = useCarStore();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCars();
    setRefreshing(false);
  };

  const handleSelectCar = (car: Car) => {
    selectCar(car);
  };

  const handleDeleteCar = (id: string) => {
    Alert.alert(
      'Delete Car',
      'Are you sure you want to delete this car? This will also delete all related fuel entries, repairs, and reminders.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCar(id),
        },
      ]
    );
  };

  if (isLoading && !refreshing) {
    return <LoadingScreen message="Loading cars..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cars</Text>
      </View>

      {cars.length === 0 ? (
        <EmptyState
          title="No Cars Found"
          message="Add your first car to start tracking expenses"
          buttonTitle="Add a Car"
          onButtonPress={() => router.push('/cars/add')}
        />
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedCar?.id === item.id;

            return (
              <ListItem
                title={`${item.name} ${item.model}`}
                subtitle={`${item.year} • ${item.numberPlate} • ${item.fuelType}`}
                leftIcon={<CarIcon size={24} color={colors.primary} />}
                rightContent={
                  <TouchableOpacity
                    onPress={() => handleDeleteCar(item.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color={colors.error} />
                  </TouchableOpacity>
                }
                onPress={() => handleSelectCar(item)}
                style={[
                  styles.carItem,
                  isSelected && { backgroundColor: colors.primary },
                ]}
                titleStyle={isSelected && styles.selectedText}
                subtitleStyle={isSelected && styles.selectedSubtitle}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/cars/add')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
    carItem: {
      marginBottom: 8,
      borderRadius: 8,
      overflow: 'hidden',
    },
    selectedText: {
      color: '#fff',
    },
    selectedSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    deleteButton: {
      padding: 8,
    },
    fab: {
      position: 'absolute',
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4, // Android shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
    },
    fabText: {
      fontSize: 28,
      color: '#fff',
      lineHeight: 32,
    },
  });
}
