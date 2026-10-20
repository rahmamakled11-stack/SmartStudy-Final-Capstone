export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type UserRole = 'user' | 'admin';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled';
export type FocusMode = 'focus' | 'short_break' | 'long_break';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type SessionType = 'study' | 'break' | 'review';
export type EventType = 'task' | 'study' | 'exam' | 'completed' | 'break';

export interface UserSettings {
  theme: Theme;
  language: Language;
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  reminderTime: string;
  soundEffects: boolean;
  autoSave: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subscription: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  lastLogin: string;
  settings: UserSettings;
  streak: number;
  longestStreak: number;
  totalStudyHours: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  difficulty: Difficulty;
  grade?: string;
  progress: number;
  weeklyHours: number;
  totalHours: number;
  tasksCount: number;
  completedTasks: number;
  description?: string;
  createdAt: string;
  userId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string;
  estimatedTime: number;
  actualTime?: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface StudySchedule {
  day: string;
  sessions: StudySession[];
}

export interface StudySession {
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: SessionType;
}

export interface StudyPlan {
  id: string;
  name: string;
  subjects: string[];
  weakSubjects: string[];
  availableHours: number;
  schedule: StudySchedule[];
  recommendations: string[];
  createdAt: string;
  userId?: string;
}

export interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  mode: FocusMode;
  subjectId?: string;
  taskId?: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: EventType;
  color: string;
  priority?: Priority;
  duration?: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  upcomingTasks: number;
  totalFocusHours: number;
  focusSessions: number;
  subjectsCount: number;
  weakSubjectsCount: number;
}

export interface WeeklyAnalytics {
  week: number;
  year: number;
  completionRate: number;
  studyScore: number;
  consistency: number;
  totalStudyHours: number;
  focusSessions: number;
  weakSubjects: string[];
  burnoutRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
