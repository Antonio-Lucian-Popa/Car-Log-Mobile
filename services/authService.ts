import { ENDPOINTS } from '@/constants/api';
import { AuthResponse, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post(ENDPOINTS.AUTH.REGISTER, { email, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get(ENDPOINTS.AUTH.ME);
  return response.data;
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete(ENDPOINTS.AUTH.DELETE);
  await AsyncStorage.removeItem('auth_token');
};

export const storeToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', token);
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('auth_token');
};