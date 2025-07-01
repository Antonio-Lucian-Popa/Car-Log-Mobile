import Button from '@/components/Button';
import CarSelector from '@/components/CarSelector';
import EmptyState from '@/components/EmptyState';
import ListItem from '@/components/ListItem';
import LoadingScreen from '@/components/LoadingScreen';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useReminderStore } from '@/stores/reminderStore';
import { Car } from '@/types';
import { useRouter } from 'expo-router';
import { AlertTriangle, Bell, Trash2 } from 'lucide-react-native';
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

export default function RemindersScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { cars, selectedCar, selectCar } = useCarStore();
  const { 
    reminders, 
    fetchRemindersByCarId, 
    deleteReminder, 
    isLoading 
  } = useReminderStore();
  
  useEffect(() => {
    if (selectedCar) {
      fetchRemindersByCarId(selectedCar.id);
    }
  }, [selectedCar]);
  
  const onRefresh = async () => {
    if (selectedCar) {
      setRefreshing(true);
      await fetchRemindersByCarId(selectedCar.id);
      setRefreshing(false);
    }
  };
  
  const handleSelectCar = (car: Car) => {
    selectCar(car);
  };
  
  const handleDeleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteReminder(id)
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
  
  const isReminderActive = (dueDate: string | number | Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due >= today;
  };
  
  if (isLoading && !refreshing) {
    return <LoadingScreen message="Loading reminders..." />;
  }
  
  if (!selectedCar) {
    return (
      <EmptyState
        title="No Car Selected"
        message="Please select a car to view reminders"
        buttonTitle="Go to Cars"
        onButtonPress={() => router.push('/cars')}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <Button
          title="Add Reminder"
          onPress={() => router.push('/reminders/add')}
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
      
      {reminders.length === 0 ? (
        <EmptyState
          title="No Reminders"
          message={`Add your first reminder for ${selectedCar.name} ${selectedCar.model}`}
          buttonTitle="Add Reminder"
          onButtonPress={() => router.push('/reminders/add')}
        />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const active = isReminderActive(item.dueDate);
            return (
              <ListItem
                title={item.type}
                subtitle={`Due: ${formatDate(item.dueDate)} • ${item.repeatDays > 0 ? `Repeats every ${item.repeatDays} days` : 'One-time'}`}
                leftIcon={
                  active ? (
                    <AlertTriangle size={24} color={Colors.warning} />
                  ) : (
                    <Bell size={24} color={Colors.textSecondary} />
                  )
                }
                rightContent={
                  <TouchableOpacity
                    onPress={() => handleDeleteReminder(item.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color={Colors.error} />
                  </TouchableOpacity>
                }
                style={[
                  styles.reminderItem,
                  active && styles.activeReminder
                ]}
              />
            );
          }}
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
    marginVertical: 48,
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
  reminderItem: {
    marginBottom: 8,
  },
  activeReminder: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  deleteButton: {
    padding: 8,
  },
});