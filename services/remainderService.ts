import { ENDPOINTS } from '@/constants/api';
import { Reminder } from '@/types';
import api from './api';

export const getActiveReminders = async (): Promise<Reminder[]> => {
  const response = await api.get(ENDPOINTS.REMINDER.ACTIVE);
  return response.data;
};

export const getRemindersByCarId = async (carId: string): Promise<Reminder[]> => {
  const response = await api.get(ENDPOINTS.REMINDER.BY_CAR(carId));
  return response.data;
};

export const createReminder = async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
  const response = await api.post(ENDPOINTS.REMINDER.BASE, reminder);
  return response.data;
};

export const deleteReminder = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.REMINDER.BY_ID(id));
};