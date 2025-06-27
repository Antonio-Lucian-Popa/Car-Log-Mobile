import * as reminderService from '@/services/remainderService';
import { Reminder } from '@/types';
import { create } from 'zustand';

interface ReminderState {
  reminders: Reminder[];
  activeReminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  fetchActiveReminders: () => Promise<void>;
  fetchRemindersByCarId: (carId: string) => Promise<void>;
  fetchActiveRemindersByCarId: (carId: string) => Promise<void>;
  createReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  activeReminders: [],
  isLoading: false,
  error: null,
  
  fetchActiveReminders: async () => {
    try {
      set({ isLoading: true, error: null });
      const activeReminders = await reminderService.getActiveReminders();
      set({ activeReminders, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch active reminders' 
      });
    }
  },

  fetchActiveRemindersByCarId: async (carId: string) => {
  try {
    set({ isLoading: true, error: null });
    const reminders = await reminderService.getRemindersByCarId(carId);
    const active = reminders.filter(r => r.isActive);
    set({ reminders, activeReminders: active, isLoading: false });
  } catch (error) {
    set({
      isLoading: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reminders',
    });
  }
},
  
  fetchRemindersByCarId: async (carId: string) => {
    try {
      set({ isLoading: true, error: null });
      const reminders = await reminderService.getRemindersByCarId(carId);
      set({ reminders, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch reminders' 
      });
    }
  },
  
  createReminder: async (reminder: Omit<Reminder, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const newReminder = await reminderService.createReminder(reminder);
      set(state => ({ 
        reminders: [newReminder, ...state.reminders],
        activeReminders: newReminder.isActive 
          ? [newReminder, ...state.activeReminders] 
          : state.activeReminders,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create reminder' 
      });
    }
  },
  
  deleteReminder: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await reminderService.deleteReminder(id);
      set(state => ({ 
        reminders: state.reminders.filter(r => r.id !== id),
        activeReminders: state.activeReminders.filter(r => r.id !== id),
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete reminder' 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));