import * as fuelService from '@/services/fuelService';
import { FuelEntry } from '@/types';
import { create } from 'zustand';

interface FuelState {
  fuelEntries: FuelEntry[];
  latestFuel: FuelEntry | null;
  isLoading: boolean;
  error: string | null;
  fetchLatestFuel: () => Promise<void>;
  fetchFuelByCarId: (carId: string) => Promise<void>;
  createFuel: (fuel: Omit<FuelEntry, 'id'>) => Promise<void>;
  deleteFuel: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useFuelStore = create<FuelState>((set) => ({
  fuelEntries: [],
  latestFuel: null,
  isLoading: false,
  error: null,
  
  fetchLatestFuel: async () => {
    try {
      set({ isLoading: true, error: null });
      const latestFuel = await fuelService.getLatestFuel();
      set({ latestFuel, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch latest fuel entry' 
      });
    }
  },
  
  fetchFuelByCarId: async (carId: string) => {
    try {
      set({ isLoading: true, error: null });
      const fuelEntries = await fuelService.getFuelByCarId(carId);
      set({ fuelEntries, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch fuel entries' 
      });
    }
  },
  
  createFuel: async (fuel: Omit<FuelEntry, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const newFuel = await fuelService.createFuel(fuel);
      set(state => ({ 
        fuelEntries: [newFuel, ...state.fuelEntries],
        latestFuel: newFuel,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create fuel entry' 
      });
    }
  },
  
  deleteFuel: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await fuelService.deleteFuel(id);
      set(state => ({ 
        fuelEntries: state.fuelEntries.filter(f => f.id !== id),
        latestFuel: state.latestFuel?.id === id ? null : state.latestFuel,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete fuel entry' 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));