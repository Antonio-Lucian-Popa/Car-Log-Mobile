import Card from '@/components/Card';
import CarSelector from '@/components/CarSelector';
import EmptyState from '@/components/EmptyState';
import LoadingScreen from '@/components/LoadingScreen';
import Colors from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useFuelStore } from '@/stores/fuelStore';
import { useReminderStore } from '@/stores/reminderStore';
import { useRepairStore } from '@/stores/repairStore';
import { useThemeStore } from '@/stores/themeStore';
import { Car } from '@/types';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Bell,
  Droplet,
  Wrench
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/stores/authStore';


export default function DashboardScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] ?? Colors.light;
  const styles = createStyles(theme);

  const [refreshing, setRefreshing] = React.useState(false);

  const { cars, selectedCar, selectCar, isLoading: carsLoading } = useCarStore();
  const { latestFuel, fetchLatestFuelByCarId, isLoading: fuelLoading } = useFuelStore();
  const { latestRepair, fetchLatestRepairByCarId, isLoading: repairLoading } = useRepairStore();
  const { activeReminders, fetchActiveRemindersByCarId, isLoading: remindersLoading } = useReminderStore();

  const { user } = useAuthStore();
  useNotifications(user?.id);

  const isLoading = carsLoading || fuelLoading || repairLoading || remindersLoading;

  useEffect(() => {
    if (selectedCar) {
      fetchLatestFuelByCarId(selectedCar.id);
      fetchLatestRepairByCarId(selectedCar.id);
      fetchActiveRemindersByCarId(selectedCar.id);
    }
  }, [selectedCar]);

  const handleSelectCar = (car: Car) => {
    selectCar(car);
  };

  const onRefresh = React.useCallback(async () => {
    if (!selectedCar) return;
    setRefreshing(true);
    await Promise.all([
      fetchLatestFuelByCarId(selectedCar.id),
      fetchLatestRepairByCarId(selectedCar.id),
      fetchActiveRemindersByCarId(selectedCar.id),
    ]);
    setRefreshing(false);
  }, [selectedCar]);

  if (isLoading && !refreshing) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        title="No Cars Found"
        message="Add your first car to start tracking expenses"
        buttonTitle="Add a Car"
        onButtonPress={() => router.push('/cars/add')}
      />
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatValue = (value: number | undefined, decimals: number = 2) => {
    return typeof value === 'number' ? value.toFixed(decimals) : 'N/A';
  };

  const calculateTotalPrice = () => {
    if (typeof latestFuel?.totalPrice === 'number') return `$${formatValue(latestFuel.totalPrice)}`;
    if (
      typeof latestFuel?.price === 'number' &&
      typeof latestFuel?.liters === 'number'
    ) {
      return `Ron ${formatValue(latestFuel.price)}`;
    }
    return 'N/A';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <CarSelector
          cars={cars}
          selectedCar={selectedCar}
          onSelectCar={handleSelectCar}
        />
      </View>

      {/* Latest Fuel Entry */}
      <Card title="Latest Fuel Entry">
        {latestFuel ? (
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => router.push('/fuel')}
          >
            <View style={styles.iconContainer}>
              <Droplet size={24} color={colors.primary} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailTitle}>{latestFuel.station}</Text>
              <Text style={styles.detailSubtitle}>
                {formatDate(latestFuel.date)}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Liters</Text>
                  <Text style={styles.statValue}>{formatValue(latestFuel.liters)}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Price</Text>
                  <Text style={styles.statValue}>{calculateTotalPrice()}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Odometer</Text>
                  <Text style={styles.statValue}>{latestFuel.odometer ? latestFuel.odometer.toLocaleString('ro-RO') : 'N/A'} km</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <EmptyState
            title="No Fuel Entries"
            buttonTitle="Add Fuel Entry"
            onButtonPress={() => router.push('/fuel/add')}
            style={styles.emptyStateSmall}
          />
        )}
      </Card>

      {/* Latest Repair */}
      <Card title="Latest Repair">
        {latestRepair ? (
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => router.push('/repairs')}
          >
            <View style={styles.iconContainer}>
              <Wrench size={24} color={colors.secondary} />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailTitle} numberOfLines={2}>{latestRepair.description}</Text>
              <Text style={styles.detailSubtitle}>
                {formatDate(latestRepair.date)}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Cost</Text>
                  <Text style={styles.statValue}>Ron {formatValue(latestRepair.cost)}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Odometer</Text>
                  <Text style={styles.statValue}>{latestRepair.odometer ? latestRepair.odometer.toLocaleString('ro-RO') : 'N/A'} km</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <EmptyState
            title="No Repair Records"
            buttonTitle="Add Repair"
            onButtonPress={() => router.push('/repair/add')}
            style={styles.emptyStateSmall}
          />
        )}
      </Card>

      {/* Active Reminders */}
      <Card title="Active Reminders">
        {activeReminders && activeReminders.length > 0 ? (
          <View>
            {activeReminders.slice(0, 3).map((reminder) => (
              <TouchableOpacity
                key={reminder.id}
                style={styles.reminderItem}
                onPress={() => router.push('/reminders')}
              >
                <View style={styles.reminderIconContainer}>
                  <AlertTriangle size={20} color={colors.warning} />
                </View>
                <View style={styles.reminderDetails}>
                  <Text style={styles.reminderTitle}>{reminder.type}</Text>
                  <Text style={styles.reminderDate}>
                    Due: {formatDate(reminder.dueDate)}
                  </Text>
                  <Text style={styles.reminderDescription} numberOfLines={1}>
                    {reminder.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {activeReminders.length > 3 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/reminders')}
              >
                <Text style={styles.viewAllText}>
                  View All ({activeReminders.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <EmptyState
            title="No Active Reminders"
            buttonTitle="Add Reminder"
            onButtonPress={() => router.push('/reminders/add')}
            style={styles.emptyStateSmall}
          />
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/fuel/add')}
          >
            <Droplet size={24} color={colors.primary} />
            <Text style={styles.actionText}>Add Fuel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/repair/add')}
          >
            <Wrench size={24} color={colors.secondary} />
            <Text style={styles.actionText}>Add Repair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/reminders/add')}
          >
            <Bell size={24} color={colors.warning} />
            <Text style={styles.actionText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const colors = Colors[theme] ?? Colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    header: {
      marginBottom: 16,
      marginVertical: 48,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    detailsContainer: {
      flex: 1,
    },
    detailTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    detailSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    stat: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    description: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    emptyStateSmall: {
      padding: 16,
      height: 120,
    },
    reminderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    reminderIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    reminderDetails: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    reminderDate: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    reminderDescription: {
      fontSize: 13,
      color: colors.text,
      marginTop: 2,
    },
    viewAllButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginTop: 4,
    },
    viewAllText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 8,
    },
    actionButton: {
      alignItems: 'center',
      padding: 16,
    },
    actionText: {
      marginTop: 8,
      fontSize: 14,
      color: colors.text,
    },
  });
}
