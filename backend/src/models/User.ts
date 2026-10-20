import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  subscriptionPlan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'cancelled';
  stripeCustomerId?: string;
  language: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyReminders: boolean;
    reminderTime: string;
    soundEffects: boolean;
    autoSave: boolean;
  };
  streak: number;
  longestStreak: number;
  totalStudyHours: number;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionPlan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    subscriptionStatus: { type: String, enum: ['active', 'past_due', 'cancelled'], default: 'active' },
    stripeCustomerId: { type: String },
    language: { type: String, default: 'en' },
    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      notifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      studyReminders: { type: Boolean, default: true },
      reminderTime: { type: String, default: '09:00' },
      soundEffects: { type: Boolean, default: true },
      autoSave: { type: Boolean, default: true },
    },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalStudyHours: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
