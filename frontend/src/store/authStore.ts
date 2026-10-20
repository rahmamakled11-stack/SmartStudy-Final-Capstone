import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '@/lib/api';
import { User, AuthTokens, LoginCredentials, RegisterData, UserSettings } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/login', credentials);
          const { user, tokens } = response.data;

          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false, isAuthenticated: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/register', data);
          const { user, tokens } = response.data;

          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, error: null });
      },

      fetchUser: async () => {
        try {
          const response = await apiClient.get('/auth/me');
          set({ user: response.data, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },

      updateUser: async (data) => {
        const response = await apiClient.put('/settings', data);
        set({ user: { ...get().user!, ...response.data } });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
