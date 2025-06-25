import { ENDPOINTS } from '@/constants/api';
import { RepairEntry } from '@/types';
import api from './api';

export const getLatestRepair = async (): Promise<RepairEntry> => {
  const response = await api.get(ENDPOINTS.REPAIR.LATEST);
  return response.data;
};

export const getRepairsByCarId = async (carId: string): Promise<RepairEntry[]> => {
  const response = await api.get(ENDPOINTS.REPAIR.BY_CAR(carId));
  return response.data;
};

export const createRepair = async (repair: Omit<RepairEntry, 'id'>): Promise<RepairEntry> => {
  const response = await api.post(ENDPOINTS.REPAIR.BASE, repair);
  return response.data;
};

export const deleteRepair = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.REPAIR.BY_ID(id));
};