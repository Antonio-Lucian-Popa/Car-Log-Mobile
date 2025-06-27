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

export const storeTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', accessToken);
  await AsyncStorage.setItem('refresh_token', refreshToken);
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refresh_token');
};

export const removeTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    await storeTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    await removeTokens();
    return null;
  }
};