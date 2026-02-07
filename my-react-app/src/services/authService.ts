import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email_or_username: string;
  password: string;
  role: 'admin' | 'operator';
}

export interface User {
  id: number;
  username?: string;
  email?: string;
  name: string;
  role: 'admin' | 'operator';
  login_id?: string;
  area?: string;
  post?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<{ success: boolean; data: LoginResponse; message: string }>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  setAuth(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  },
};
