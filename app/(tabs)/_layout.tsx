import { Colors } from '@/constants/Colors';
import { useCarStore } from '@/stores/carStore';
import { useFuelStore } from '@/stores/fuelStore';
import { useReminderStore } from '@/stores/reminderStore';
import { useRepairStore } from '@/stores/repairStore';
import { useThemeStore } from '@/stores/themeStore';
import { Tabs } from 'expo-router';
import {
  Bell,
  Car,
  Droplet,
  Home,
  Settings,
  Wrench
} from 'lucide-react-native';
import React, { useEffect } from 'react';

export default function TabLayout() {
  const { fetchCars } = useCarStore();
  const { fetchLatestFuel } = useFuelStore();
  const { fetchLatestRepair } = useRepairStore();
  const { fetchActiveReminders } = useReminderStore();
  const { theme } = useThemeStore();
  const colors = Colors[theme];

  useEffect(() => {
    fetchCars();
    fetchLatestFuel();
    fetchLatestRepair();
    fetchActiveReminders();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cars"
        options={{
          title: 'My Cars',
          tabBarLabel: 'Cars',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Car size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel Logs',
          tabBarLabel: 'Fuel',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Droplet size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="repairs"
        options={{
          title: 'Repairs',
          tabBarLabel: 'Repairs',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Wrench size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarLabel: 'Reminders',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
