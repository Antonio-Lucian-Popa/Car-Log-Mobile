import { ENDPOINTS } from '@/constants/api';
import { FuelEntry } from '@/types';
import api from './api';

export const getLatestFuel = async (): Promise<FuelEntry> => {
  const response = await api.get(ENDPOINTS.FUEL.LATEST);
  return response.data;
};

export const getFuelByCarId = async (carId: string): Promise<FuelEntry[]> => {
  const response = await api.get(ENDPOINTS.FUEL.BY_CAR(carId));
  return response.data;
};

export const createFuel = async (fuel: Omit<FuelEntry, 'id'>): Promise<FuelEntry> => {
  const response = await api.post(ENDPOINTS.FUEL.BASE, fuel);
  return response.data;
};

export const deleteFuel = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.FUEL.BY_ID(id));
};