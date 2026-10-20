import { Router } from 'express';
import { register, login, refresh, getMe, logout } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { registerSchema, loginSchema, refreshTokenSchema } from '@/validators/authValidator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
