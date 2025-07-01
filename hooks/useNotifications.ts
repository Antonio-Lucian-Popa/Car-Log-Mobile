// hooks/useNotifications.ts
import axios from 'axios';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:5000'; // poate fi setat din app.config.js

export function useNotifications(userId?: string) {
  useEffect(() => {
    let subscription: Notifications.Subscription;

    const setup = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && userId) {
        await savePushTokenToServer(userId, token);
      }

      subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('📲 Notification received:', notification);
      });
    };

    setup();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [userId]);
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    alert('🔴 Push notifications need a physical device.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('🔒 Permission for push notifications was denied.');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async function savePushTokenToServer(userId: string, expoPushToken: string) {
  try {
    await axios.post(`${API_URL}/api/notifications/token`, {
      userId,
      token: expoPushToken,
    });
    console.log('✅ Push token saved to server');
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Failed to save push token:', err.message);
    } else {
      console.error('❌ Failed to save push token:', err);
    }
  }
}
