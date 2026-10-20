import { create } from 'zustand';
import apiClient from '@/lib/api';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    const response = await apiClient.get('/notifications');
    set({
      notifications: response.data.notifications,
      unreadCount: response.data.unreadCount,
    });
  },

  markAsRead: async (id) => {
    await apiClient.patch(`/notifications/${id}/read`);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    await apiClient.patch('/notifications/read-all');
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  deleteNotification: async (id) => {
    await apiClient.delete(`/notifications/${id}`);
    const wasUnread = get().notifications.find((n) => n.id === id)?.read === false;
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    }));
  },

  clearAll: async () => {
    const { notifications } = get();
    await Promise.all(notifications.map((n) => apiClient.delete(`/notifications/${n.id}`)));
    set({ notifications: [], unreadCount: 0 });
  },
}));
