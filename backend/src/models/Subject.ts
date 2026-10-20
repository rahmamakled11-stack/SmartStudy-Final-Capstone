import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade?: string;
  progress: number;
  weeklyHours: number;
  totalHours: number;
  tasksCount: number;
  completedTasks: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#3b82f6' },
    icon: { type: String, default: 'BookOpen' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    grade: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    weeklyHours: { type: Number, default: 5 },
    totalHours: { type: Number, default: 0 },
    tasksCount: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISubject>('Subject', SubjectSchema);
