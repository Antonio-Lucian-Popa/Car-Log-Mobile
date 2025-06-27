import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import EmptyState from '@/components/EmptyState';
import ListItem from '@/components/ListItem';
import LoadingScreen from '@/components/LoadingScreen';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useRepairStore } from '@/stores/repairStore';
import { Car } from '@/types';
import { useRouter } from 'expo-router';
import { Trash2, Wrench } from 'lucide-react-native';
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

export default function RepairsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { cars, selectedCar, selectCar } = useCarStore();
  const { 
    repairs, 
    fetchRepairsByCarId, 
    deleteRepair, 
    isLoading 
  } = useRepairStore();

  useEffect(() => {
    if (selectedCar) {
      fetchRepairsByCarId(selectedCar.id);
    }
  }, [selectedCar]);

  const onRefresh = async () => {
    if (selectedCar) {
      setRefreshing(true);
      await fetchRepairsByCarId(selectedCar.id);
      setRefreshing(false);
    }
  };

  const handleSelectCar = (car: Car) => {
    selectCar(car);
  };

  const handleDeleteRepair = (id: string) => {
    Alert.alert(
      'Delete Repair',
      'Are you sure you want to delete this repair record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteRepair(id)
        }
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

  const formatPrice = (price: number | undefined) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
  };

  if (isLoading && !refreshing) {
    return <LoadingScreen message="Loading repairs..." />;
  }

  if (!selectedCar) {
    return (
      <EmptyState
        title="No Car Selected"
        message="Please select a car to view repairs"
        buttonTitle="Go to Cars"
        onButtonPress={() => router.push('/cars')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Repairs</Text>
        <Button
          title="Add Repair"
          onPress={() => router.push('/repairs/add')}
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

      {repairs.length === 0 ? (
        <EmptyState
          title="No Repair Records"
          message={`Add your first repair record for ${selectedCar.name} ${selectedCar.model}`}
          buttonTitle="Add Repair"
          onButtonPress={() => router.push('/repairs/add')}
        />
      ) : (
        <FlatList
          data={repairs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.category}
              subtitle={`${formatDate(item.date)} • ${formatPrice(item.price)} • ${item.odometer ?? 'N/A'} km`}
              leftIcon={<Wrench size={24} color={Colors.secondary} />}
              rightContent={
                <TouchableOpacity
                  onPress={() => handleDeleteRepair(item.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color={Colors.error} />
                </TouchableOpacity>
              }
              style={styles.repairItem}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  repairItem: {
    marginBottom: 8,
  },
  deleteButton: {
    padding: 8,
  },
});