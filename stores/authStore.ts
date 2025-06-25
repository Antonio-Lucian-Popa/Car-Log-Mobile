import * as authService from '@/services/authService';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(email, password);
          await authService.storeToken(response.token);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to login' 
          });
        }
      },
      
      register: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register(email, password);
          await authService.storeToken(response.token);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to register' 
          });
        }
      },
      
      logout: async () => {
        try {
          await authService.removeToken();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const token = await authService.getToken();
          
          if (!token) {
            set({ isAuthenticated: false, isLoading: false });
            return;
          }
          
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          await authService.removeToken();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },
      
      deleteAccount: async () => {
        try {
          set({ isLoading: true });
          await authService.deleteAccount();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete account' 
          });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);