import { create } from 'zustand';
import apiClient from '@/lib/api';
import { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: (filters?: { status?: string; priority?: string; subjectId?: string }) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getUpcomingTasks: (limit?: number) => Task[];
  getTasksByStatus: (status: string) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.subjectId) params.append('subjectId', filters.subjectId);

      const response = await apiClient.get(`/tasks?${params.toString()}`);
      set({ tasks: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTask: async (data) => {
    const response = await apiClient.post('/tasks', data);
    const newTask = response.data;
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    return newTask;
  },

  updateTask: async (id, data) => {
    const response = await apiClient.put(`/tasks/${id}`, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
    }));
  },

  deleteTask: async (id) => {
    await apiClient.delete(`/tasks/${id}`);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  getUpcomingTasks: (limit = 5) => {
    return get()
      .tasks.filter((t) => t.status !== 'completed' && new Date(t.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, limit);
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((t) => t.status === status);
  },
}));
