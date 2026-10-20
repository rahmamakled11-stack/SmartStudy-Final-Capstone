import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySchedule extends Document {
  userId: mongoose.Types.ObjectId;
  week: number;
  year: number;
  schedule: Array<{
    day: string;
    sessions: Array<{
      subjectId: string;
      subjectName: string;
      startTime: string;
      endTime: string;
      duration: number;
      type: 'study' | 'break' | 'review';
    }>;
  }>;
  recommendations: string[];
  weakSubjects: string[];
  totalHours: number;
}

const SessionSchema = new Schema({
  subjectId: { type: String, required: true },
  subjectName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true },
  type: { type: String, enum: ['study', 'break', 'review'], required: true },
}, { _id: false });

const DayScheduleSchema = new Schema({
  day: { type: String, required: true },
  sessions: [SessionSchema],
}, { _id: false });

const StudyScheduleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    week: { type: Number, required: true },
    year: { type: Number, required: true },
    schedule: [DayScheduleSchema],
    recommendations: [{ type: String }],
    weakSubjects: [{ type: String }],
    totalHours: { type: Number, required: true },
  },
  { timestamps: true }
);

StudyScheduleSchema.index({ userId: 1, week: 1, year: 1 }, { unique: true });

export default mongoose.model<IStudySchedule>('StudySchedule', StudyScheduleSchema);
