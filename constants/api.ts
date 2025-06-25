export const API_BASE_URL = 'https://carnet-auto-be.onrender.com/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    DELETE: '/auth/delete',
  },
  CARS: {
    BASE: '/cars',
    BY_ID: (id: string) => `/cars/${id}`,
  },
  FUEL: {
    LATEST: '/fuel/latest',
    BY_CAR: (carId: string) => `/fuel/${carId}`,
    BASE: '/fuel',
    BY_ID: (id: string) => `/fuel/${id}`,
  },
  REPAIR: {
    LATEST: '/repair/latest',
    BY_CAR: (carId: string) => `/repair/${carId}`,
    BASE: '/repair',
    BY_ID: (id: string) => `/repair/${id}`,
  },
  REMINDER: {
    ACTIVE: '/reminder/active',
    BY_CAR: (carId: string) => `/reminder/${carId}`,
    BASE: '/reminder',
    BY_ID: (id: string) => `/reminder/${id}`,
  },
};