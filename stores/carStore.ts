import * as carService from '@/services/carService';
import { Car } from '@/types';
import { create } from 'zustand';

interface CarState {
  cars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  selectCar: (car: Car) => void;
  createCar: (car: Omit<Car, 'id'>) => Promise<void>;
  updateCar: (id: string, car: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  selectedCar: null,
  isLoading: false,
  error: null,
  
  fetchCars: async () => {
    try {
      set({ isLoading: true, error: null });
      const cars = await carService.getCars();
      console.log('Fetched cars:', cars);
      set({ cars, isLoading: false });
      
      // If there's no selected car but we have cars, select the first one
      if (!get().selectedCar && cars.length > 0) {
        set({ selectedCar: cars[0] });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cars' 
      });
    }
  },
  
  selectCar: (car: Car) => {
    set({ selectedCar: car });
  },
  
  createCar: async (car: Omit<Car, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const newCar = await carService.createCar(car);
      set(state => ({ 
        cars: [...state.cars, newCar],
        selectedCar: newCar,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create car' 
      });
    }
  },
  
  updateCar: async (id: string, car: Partial<Car>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCar = await carService.updateCar(id, car);
      set(state => ({ 
        cars: state.cars.map(c => c.id === id ? updatedCar : c),
        selectedCar: state.selectedCar?.id === id ? updatedCar : state.selectedCar,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update car' 
      });
    }
  },
  
  deleteCar: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await carService.deleteCar(id);
      
      set(state => {
        const newCars = state.cars.filter(c => c.id !== id);
        return { 
          cars: newCars,
          selectedCar: state.selectedCar?.id === id 
            ? (newCars.length > 0 ? newCars[0] : null) 
            : state.selectedCar,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete car' 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));