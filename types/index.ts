export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Car {
  id: string;
  name: string;
  model: string;
  numberPlate: string;
  year: number;
  fuelType: string;
}

export interface FuelEntry {
  id: string;
  carId: string;
  liters: number;
  price: number;
  station: string;
  odometer: number;
  date: string;
  totalPrice?: number;
}

export interface RepairEntry {
  id: string;
  carId: string;
  category: string;
  price: number;
  description: string;
  odometer: number;
  date: string;
}

export interface Reminder {
  id: string;
  carId: string;
  type: string;
  dueDate: string;
  repeatDays: number;
  description: string;
  isActive?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}