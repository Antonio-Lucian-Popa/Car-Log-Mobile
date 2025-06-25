import { ENDPOINTS } from '@/constants/api';
import { Car } from '@/types';
import api from './api';

export const getCars = async (): Promise<Car[]> => {
  const response = await api.get(ENDPOINTS.CARS.BASE);
  return response.data;
};

export const getCar = async (id: string): Promise<Car> => {
  const response = await api.get(ENDPOINTS.CARS.BY_ID(id));
  return response.data;
};

export const createCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  const response = await api.post(ENDPOINTS.CARS.BASE, car);
  return response.data;
};

export const updateCar = async (id: string, car: Partial<Car>): Promise<Car> => {
  const response = await api.put(ENDPOINTS.CARS.BY_ID(id), car);
  return response.data;
};

export const deleteCar = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.CARS.BY_ID(id));
};