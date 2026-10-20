import { Request, Response } from 'express';
import Notification from '@/models/Notification';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AppError } from '@/middleware/errorHandler';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ userId: req.user!.userId })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    userId: req.user!.userId,
    read: false,
  });

  sendSuccess(res, { notifications, unreadCount }, 'Notifications retrieved');
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.userId },
    { read: true },
    { new: true }
  );

  if (!notification) throw new AppError('Notification not found', 404);

  sendSuccess(res, notification, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { userId: req.user!.userId, read: false },
    { read: true }
  );

  sendSuccess(res, null, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.userId,
  });

  sendSuccess(res, null, 'Notification deleted');
});
