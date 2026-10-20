import { Request, Response } from 'express';
import Task from '@/models/Task';
import Subject from '@/models/Subject';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AppError } from '@/middleware/errorHandler';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { status, priority, subjectId } = req.query;
  const filter: any = { userId: req.user!.userId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (subjectId) filter.subjectId = subjectId;

  const tasks = await Task.find(filter)
    .populate('subjectId', 'name color')
    .sort({ deadline: 1, createdAt: -1 });

  sendSuccess(res, tasks, 'Tasks retrieved');
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const subject = await Subject.findOne({
    _id: req.body.subjectId,
    userId: req.user!.userId,
  });

  if (!subject) throw new AppError('Subject not found', 404);

  const task = await Task.create({
    ...req.body,
    userId: req.user!.userId,
    subjectName: subject.name,
    subjectColor: subject.color,
  });

  await Subject.findByIdAndUpdate(subject._id, {
    $inc: { tasksCount: 1 },
  });

  sendSuccess(res, task, 'Task created', 201);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const oldTask = await Task.findOne({
    _id: req.params.id,
    userId: req.user!.userId,
  });

  if (!oldTask) throw new AppError('Task not found', 404);

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (req.body.status === 'completed' && oldTask.status !== 'completed') {
    await Subject.findByIdAndUpdate(oldTask.subjectId, {
      $inc: { completedTasks: 1, progress: 5 },
    });
  } else if (oldTask.status === 'completed' && req.body.status !== 'completed') {
    await Subject.findByIdAndUpdate(oldTask.subjectId, {
      $inc: { completedTasks: -1 },
    });
  }

  sendSuccess(res, task, 'Task updated');
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });

  if (!task) throw new AppError('Task not found', 404);

  await Subject.findByIdAndUpdate(task.subjectId, {
    $inc: { tasksCount: -1 },
  });

  sendSuccess(res, null, 'Task deleted');
});
