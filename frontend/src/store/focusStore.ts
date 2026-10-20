import { create } from 'zustand';
import apiClient from '@/lib/api';

interface FocusState {
  isRunning: boolean;
  timeRemaining: number;
  mode: 'focus' | 'short_break' | 'long_break';
  currentSessionId: string | null;
  totalSessions: number;
  totalHours: number;

  startSession: (mode: 'focus' | 'short_break' | 'long_break') => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => Promise<void>;
  resetTimer: () => void;
  tick: () => void;
  getTotalSessions: () => number;
  getTotalHours: () => number;
}

const MODES = {
  focus: { duration: 25 * 60 },
  short_break: { duration: 5 * 60 },
  long_break: { duration: 15 * 60 },
};

export const useFocusStore = create<FocusState>((set, get) => ({
  isRunning: false,
  timeRemaining: MODES.focus.duration,
  mode: 'focus',
  currentSessionId: null,
  totalSessions: 0,
  totalHours: 0,

  startSession: async (mode) => {
    const duration = MODES[mode].duration;
    set({ mode, timeRemaining: duration, isRunning: true });

    try {
      const response = await apiClient.post('/focus/start', { mode, duration });
      set({ currentSessionId: response.data.id });
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  },

  pauseSession: () => set({ isRunning: false }),

  resumeSession: () => set({ isRunning: true }),

  endSession: async () => {
    const { currentSessionId, mode } = get();
    const duration = MODES[mode].duration - get().timeRemaining;

    if (currentSessionId) {
      try {
        await apiClient.post('/focus/end', { sessionId: currentSessionId, duration });
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    }

    set((state) => ({
      isRunning: false,
      currentSessionId: null,
      totalSessions: state.mode === 'focus' ? state.totalSessions + 1 : state.totalSessions,
      totalHours: state.totalHours + (duration / 3600),
    }));
  },

  resetTimer: () => {
    set({ 
      isRunning: false, 
      timeRemaining: MODES[get().mode].duration,
      currentSessionId: null 
    });
  },

  tick: () => {
    set((state) => {
      if (state.timeRemaining <= 0) {
        return { isRunning: false, timeRemaining: 0 };
      }
      return { timeRemaining: state.timeRemaining - 1 };
    });
  },

  getTotalSessions: () => get().totalSessions,
  getTotalHours: () => get().totalHours,
}));
