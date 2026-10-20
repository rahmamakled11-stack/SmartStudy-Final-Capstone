import { Request, Response } from 'express';
import Task from '@/models/Task';
import FocusSession from '@/models/FocusSession';
import Subject from '@/models/Subject';
import WeeklyAnalytics from '@/models/WeeklyAnalytics';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const [tasks, focusSessions, subjects] = await Promise.all([
    Task.find({ userId }),
    FocusSession.find({ userId, startedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
    Subject.find({ userId }),
  ]);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const upcomingTasks = tasks.filter((t) => t.status !== 'completed' && new Date(t.deadline) > new Date()).length;
  const weakSubjects = subjects.filter((s) => s.progress < 70);

  const totalFocusHours = focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60;

  sendSuccess(res, {
    stats: {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      upcomingTasks,
      totalFocusHours: Math.round(totalFocusHours * 10) / 10,
      focusSessions: focusSessions.length,
      subjectsCount: subjects.length,
      weakSubjectsCount: weakSubjects.length,
    },
    subjects: subjects.map((s) => ({
      id: s._id,
      name: s.name,
      color: s.color,
      progress: s.progress,
      weeklyHours: s.weeklyHours,
      totalHours: s.totalHours,
    })),
    weakSubjects: weakSubjects.map((s) => ({
      id: s._id,
      name: s.name,
      color: s.color,
      progress: s.progress,
    })),
  }, 'Dashboard analytics retrieved');
});

export const getWeekly = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { week, year } = req.query;

  const now = new Date();
  const targetWeek = Number(week) || getWeekNumber(now);
  const targetYear = Number(year) || now.getFullYear();

  let analytics = await WeeklyAnalytics.findOne({
    userId,
    week: targetWeek,
    year: targetYear,
  });

  if (!analytics) {
    const [tasks, focusSessions, subjects] = await Promise.all([
      Task.find({ userId }),
      FocusSession.find({ userId }),
      Subject.find({ userId }),
    ]);

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    const weakSubjects = subjects.filter((s) => s.progress < 70).map((s) => s.name);

    analytics = await WeeklyAnalytics.create({
      userId,
      week: targetWeek,
      year: targetYear,
      completionRate: Math.round(completionRate),
      studyScore: Math.round(completionRate * 0.7 + (focusSessions.length > 0 ? 30 : 0)),
      consistency: Math.round(Math.random() * 40 + 60),
      totalStudyHours: focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60,
      focusSessions: focusSessions.length,
      weakSubjects,
      burnoutRisk: focusSessions.length > 20 ? 'high' : focusSessions.length > 10 ? 'medium' : 'low',
      recommendations: [
        'Focus on weak subjects',
        'Take regular breaks',
        'Review notes daily',
      ],
    });
  }

  sendSuccess(res, analytics, 'Weekly analytics retrieved');
});

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
