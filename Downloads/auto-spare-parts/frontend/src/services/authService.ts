import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
    is_staff: boolean;
    is_admin: boolean;
  };
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  is_staff: boolean;
  is_admin: boolean;
  is_active: boolean;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // First, get the JWT token
  const tokenResponse = await api.post('token/', credentials);
  
  // Store the JWT tokens in localStorage
  if (tokenResponse.data.access) {
    localStorage.setItem('token', tokenResponse.data.access);
    localStorage.setItem('refreshToken', tokenResponse.data.refresh);
  }
  
  // Get user data
  const userResponse = await api.get('auth/me/');
  
  return {
    ...tokenResponse.data,
    user: userResponse.data
  };
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('auth/register/', userData);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) throw new Error('No refresh token available');
  
  const response = await api.post('token/refresh/', { refresh });
  
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
  }
  
  return response.data.access;
};

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await api.get('auth/me/');
  return response.data;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user.is_staff || user.is_admin;
  } catch (error) {
    return false;
  }
};
