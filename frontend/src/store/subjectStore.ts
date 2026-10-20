import { create } from 'zustand';
import apiClient from '@/lib/api';
import { Subject } from '@/types';

interface SubjectState {
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;

  fetchSubjects: () => Promise<void>;
  createSubject: (data: Partial<Subject>) => Promise<Subject>;
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  getWeakSubjects: () => Subject[];
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  isLoading: false,
  error: null,

  fetchSubjects: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/subjects');
      set({ subjects: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createSubject: async (data) => {
    const response = await apiClient.post('/subjects', data);
    const newSubject = response.data;
    set((state) => ({ subjects: [...state.subjects, newSubject] }));
    return newSubject;
  },

  updateSubject: async (id, data) => {
    const response = await apiClient.put(`/subjects/${id}`, data);
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? response.data : s)),
    }));
  },

  deleteSubject: async (id) => {
    await apiClient.delete(`/subjects/${id}`);
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    }));
  },

  getWeakSubjects: () => {
    return get().subjects.filter((s) => s.progress < 70);
  },
}));
