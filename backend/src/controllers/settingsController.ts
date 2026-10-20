import { Request, Response } from 'express';
import User from '@/models/User';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { AppError } from '@/middleware/errorHandler';

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId).select('settings name avatar language');
  if (!user) throw new AppError('User not found', 404);

  sendSuccess(res, {
    name: user.name,
    avatar: user.avatar,
    language: user.language,
    settings: user.settings,
  }, 'Settings retrieved');
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const { settings, name, language } = req.body;

  const updateData: any = {};
  if (settings) updateData.settings = settings;
  if (name) updateData.name = name;
  if (language) updateData.language = language;

  const user = await User.findByIdAndUpdate(
    req.user!.userId,
    updateData,
    { new: true }
  ).select('-password');

  sendSuccess(res, user, 'Settings updated');
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user!.userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const { comparePassword, hashPassword } = await import('@/utils/password');
  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  user.password = await hashPassword(newPassword);
  await user.save();

  sendSuccess(res, null, 'Password updated successfully');
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;

  const user = await User.findById(req.user!.userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const { comparePassword } = await import('@/utils/password');
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError('Password is incorrect', 400);

  await User.findByIdAndDelete(req.user!.userId);

  sendSuccess(res, null, 'Account deleted successfully');
});
