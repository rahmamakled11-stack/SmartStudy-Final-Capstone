import mongoose, { Schema, Document } from 'mongoose';

export interface IFocusSession extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  mode: 'focus' | 'short_break' | 'long_break';
  duration: number;
  startedAt: Date;
  endedAt?: Date;
  completed: boolean;
}

const FocusSessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    mode: { type: String, enum: ['focus', 'short_break', 'long_break'], required: true },
    duration: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IFocusSession>('FocusSession', FocusSessionSchema);
