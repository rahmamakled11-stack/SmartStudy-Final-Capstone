import { Request, Response } from 'express';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/apiResponse';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateTokenPair } from '@/utils/jwt';
import { AppError } from '@/middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  await Subscription.create({
    userId: user._id,
    plan: 'free',
    status: 'active',
  });

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: 'free',
      settings: user.settings,
    },
    tokens,
  }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscriptionPlan,
      avatar: user.avatar,
      settings: user.settings,
      streak: user.streak,
      longestStreak: user.longestStreak,
      totalStudyHours: user.totalStudyHours,
    },
    tokens,
  }, 'Login successful');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const { verifyRefreshToken, generateTokenPair } = await import('@/utils/jwt');
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(res, { tokens }, 'Token refreshed');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  sendSuccess(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    language: user.language,
    subscription: user.subscriptionPlan,
    subscriptionStatus: user.subscriptionStatus,
    settings: user.settings,
    streak: user.streak,
    longestStreak: user.longestStreak,
    totalStudyHours: user.totalStudyHours,
    createdAt: user.createdAt,
  }, 'User retrieved');
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, null, 'Logged out successfully');
});
