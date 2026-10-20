import { Request, Response } from 'express';
import StudySchedule from '@/models/StudySchedule';
import Subject from '@/models/Subject';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AIService } from '@/utils/aiService';

export const generateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { selectedSubjects, weakSubjects, availableHours } = req.body;

  const subjects = await Subject.find({
    _id: { $in: selectedSubjects },
    userId: req.user!.userId,
  });

  const subjectData = subjects.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    difficulty: s.difficulty,
    progress: s.progress,
  }));

  const aiResult = await AIService.generateStudySchedule({
    subjects: subjectData,
    weakSubjects,
    availableHours,
  });

  const now = new Date();
  const week = getWeekNumber(now);
  const year = now.getFullYear();

  await StudySchedule.findOneAndDelete({
    userId: req.user!.userId,
    week,
    year,
  });

  const schedule = await StudySchedule.create({
    userId: req.user!.userId,
    week,
    year,
    schedule: aiResult.schedule,
    recommendations: aiResult.recommendations,
    weakSubjects,
    totalHours: availableHours,
  });

  sendSuccess(res, schedule, 'Study schedule generated', 201);
});

export const getCurrentSchedule = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const week = getWeekNumber(now);
  const year = now.getFullYear();

  const schedule = await StudySchedule.findOne({
    userId: req.user!.userId,
    week,
    year,
  });

  sendSuccess(res, schedule, 'Current schedule retrieved');
});

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
