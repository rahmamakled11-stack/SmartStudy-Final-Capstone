import { Request, Response } from 'express';
import Subject from '@/models/Subject';
import Task from '@/models/Task';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AppError } from '@/middleware/errorHandler';

export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const subjects = await Subject.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
  sendSuccess(res, subjects, 'Subjects retrieved');
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await Subject.create({
    ...req.body,
    userId: req.user!.userId,
  });
  sendSuccess(res, subject, 'Subject created', 201);
});

export const updateSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!subject) throw new AppError('Subject not found', 404);
  sendSuccess(res, subject, 'Subject updated');
});

export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await Subject.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });

  if (!subject) throw new AppError('Subject not found', 404);

  await Task.deleteMany({ subjectId: req.params.id, userId: req.user!.userId });

  sendSuccess(res, null, 'Subject deleted');
});
