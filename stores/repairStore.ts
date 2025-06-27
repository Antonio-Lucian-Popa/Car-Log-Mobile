import * as repairService from '@/services/repairService';
import { RepairEntry } from '@/types';
import { create } from 'zustand';

interface RepairState {
  repairs: RepairEntry[];
  latestRepair: RepairEntry | null;
  isLoading: boolean;
  error: string | null;
  fetchLatestRepair: () => Promise<void>;
  fetchRepairsByCarId: (carId: string) => Promise<void>;
  fetchLatestRepairByCarId: (carId: string) => Promise<void>;
  createRepair: (repair: Omit<RepairEntry, 'id'>) => Promise<void>;
  deleteRepair: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useRepairStore = create<RepairState>((set) => ({
  repairs: [],
  latestRepair: null,
  isLoading: false,
  error: null,
  
  fetchLatestRepair: async () => {
    try {
      set({ isLoading: true, error: null });
      const latestRepair = await repairService.getLatestRepair();
      set({ latestRepair, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch latest repair' 
      });
    }
  },

  fetchLatestRepairByCarId: async (carId: string) => {
  try {
    set({ isLoading: true, error: null });
    const entries = await repairService.getRepairsByCarId(carId);
    const latest = entries[0] || null;
    set({ latestRepair: latest, repairs: entries, isLoading: false });
  } catch (error) {
    set({
      isLoading: false,
      error: error instanceof Error ? error.message : 'Failed to fetch repair data',
    });
  }
},

  
  fetchRepairsByCarId: async (carId: string) => {
    try {
      set({ isLoading: true, error: null });
      const repairs = await repairService.getRepairsByCarId(carId);
      set({ repairs, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch repairs' 
      });
    }
  },
  
  createRepair: async (repair: Omit<RepairEntry, 'id'>) => {
    try {
      set({ isLoading: true, error: null });
      const newRepair = await repairService.createRepair(repair);
      set(state => ({ 
        repairs: [newRepair, ...state.repairs],
        latestRepair: newRepair,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create repair' 
      });
    }
  },
  
  deleteRepair: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await repairService.deleteRepair(id);
      set(state => ({ 
        repairs: state.repairs.filter(r => r.id !== id),
        latestRepair: state.latestRepair?.id === id ? null : state.latestRepair,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete repair' 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));