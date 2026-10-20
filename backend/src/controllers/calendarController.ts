import { Request, Response } from 'express';
import Task from '@/models/Task';
import FocusSession from '@/models/FocusSession';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  const userId = req.user!.userId;

  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

  const [tasks, sessions] = await Promise.all([
    Task.find({
      userId,
      deadline: { $gte: startDate, $lte: endDate },
    }),
    FocusSession.find({
      userId,
      startedAt: { $gte: startDate, $lte: endDate },
    }),
  ]);

  const events = [
    ...tasks.map((t) => ({
      id: t._id,
      title: t.title,
      date: t.deadline.toISOString().split('T')[0],
      type: t.status === 'completed' ? 'completed' : 'task',
      color: t.subjectColor || '#3b82f6',
      time: t.deadline.toISOString().split('T')[1]?.slice(0, 5) || '00:00',
      priority: t.priority,
    })),
    ...sessions.map((s) => ({
      id: s._id,
      title: `${s.mode === 'focus' ? 'Focus' : 'Break'} Session`,
      date: s.startedAt.toISOString().split('T')[0],
      type: 'study',
      color: s.mode === 'focus' ? '#10b981' : '#8b5cf6',
      time: s.startedAt.toISOString().split('T')[1]?.slice(0, 5) || '00:00',
      duration: s.duration,
    })),
  ];

  sendSuccess(res, events, 'Calendar events retrieved');
});
