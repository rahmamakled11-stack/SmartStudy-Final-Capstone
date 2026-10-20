import rateLimit from 'express-rate-limit';
import config from '@/config/env';

export const apiLimiter = rateLimit({
  windowMs: parseInt(config.RATE_LIMIT_WINDOW_MS),
  max: parseInt(config.RATE_LIMIT_MAX_REQUESTS),
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});
