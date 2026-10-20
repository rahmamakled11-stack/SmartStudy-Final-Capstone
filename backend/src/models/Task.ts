import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  deadline: Date;
  estimatedTime: number;
  actualTime?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    subjectName: { type: String, required: true },
    subjectColor: { type: String, default: '#3b82f6' },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in_progress', 'completed', 'cancelled'], default: 'todo' },
    deadline: { type: Date, required: true },
    estimatedTime: { type: Number, default: 60 },
    actualTime: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
