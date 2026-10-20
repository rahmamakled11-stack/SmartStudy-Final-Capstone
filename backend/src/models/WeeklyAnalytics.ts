import mongoose, { Schema, Document } from 'mongoose';

export interface IWeeklyAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
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

const WeeklyAnalyticsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    week: { type: Number, required: true },
    year: { type: Number, required: true },
    completionRate: { type: Number, default: 0 },
    studyScore: { type: Number, default: 0 },
    consistency: { type: Number, default: 0 },
    totalStudyHours: { type: Number, default: 0 },
    focusSessions: { type: Number, default: 0 },
    weakSubjects: [{ type: String }],
    burnoutRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

WeeklyAnalyticsSchema.index({ userId: 1, week: 1, year: 1 }, { unique: true });

export default mongoose.model<IWeeklyAnalytics>('WeeklyAnalytics', WeeklyAnalyticsSchema);
