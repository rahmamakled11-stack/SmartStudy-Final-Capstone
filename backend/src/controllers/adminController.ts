import { Request, Response } from 'express';
import User from '@/models/User';
import Task from '@/models/Task';
import FocusSession from '@/models/FocusSession';
import Subscription from '@/models/Subscription';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, newUsers, totalTasks, totalFocusSessions, subscriptions] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Task.countDocuments(),
    FocusSession.countDocuments(),
    Subscription.find(),
  ]);

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length;
  const proUsers = subscriptions.filter((s) => s.plan === 'pro').length;

  const dailyGrowth = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const count = await User.countDocuments({ createdAt: { $gte: startOfDay, $lt: endOfDay } });
    dailyGrowth.push({
      date: startOfDay.toISOString().split('T')[0],
      users: count,
    });
  }

  sendSuccess(res, {
    stats: {
      totalUsers,
      newUsers,
      totalTasks,
      totalFocusSessions,
      activeSubscriptions,
      proUsers,
      freeUsers: totalUsers - proUsers,
    },
    dailyGrowth,
  }, 'Admin dashboard retrieved');
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  }, 'Users retrieved');
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  sendSuccess(res, user, 'User role updated');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  await Task.deleteMany({ userId: req.params.id });
  await FocusSession.deleteMany({ userId: req.params.id });
  await Subscription.deleteMany({ userId: req.params.id });

  sendSuccess(res, null, 'User deleted');
});

export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [weeklyTasks, weeklyFocus, subscriptionBreakdown] = await Promise.all([
    Task.find({ createdAt: { $gte: sevenDaysAgo } }),
    FocusSession.find({ startedAt: { $gte: sevenDaysAgo } }),
    Subscription.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } },
    ]),
  ]);

  const tasksByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    return {
      date: dateStr,
      created: weeklyTasks.filter((t) => t.createdAt.toISOString().startsWith(dateStr)).length,
      completed: weeklyTasks.filter(
        (t) => t.status === 'completed' && t.updatedAt.toISOString().startsWith(dateStr)
      ).length,
    };
  });

  const focusByDay = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = weeklyFocus.filter((f) => f.startedAt.toISOString().startsWith(dateStr));
    return {
      date: dateStr,
      sessions: daySessions.length,
      hours: Math.round(daySessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60 * 10) / 10,
    };
  });

  sendSuccess(res, {
    tasksByDay,
    focusByDay,
    subscriptionBreakdown: subscriptionBreakdown.map((s) => ({
      plan: s._id,
      count: s.count,
    })),
  }, 'Admin analytics retrieved');
});
