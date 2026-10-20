import { Request, Response } from 'express';
import FocusSession from '@/models/FocusSession';
import User from '@/models/User';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';

export const startSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await FocusSession.create({
    ...req.body,
    userId: req.user!.userId,
    startedAt: new Date(),
  });

  sendSuccess(res, session, 'Focus session started', 201);
});

export const endSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, duration } = req.body;

  const session = await FocusSession.findOneAndUpdate(
    { _id: sessionId, userId: req.user!.userId },
    { endedAt: new Date(), duration, completed: true },
    { new: true }
  );

  if (session) {
    await User.findByIdAndUpdate(req.user!.userId, {
      $inc: { totalStudyHours: duration / 60 },
    });
  }

  sendSuccess(res, session, 'Focus session ended');
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, page = 1 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const sessions = await FocusSession.find({ userId: req.user!.userId })
    .sort({ startedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await FocusSession.countDocuments({ userId: req.user!.userId });

  sendSuccess(res, sessions, 'Focus history retrieved', 200, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
});
