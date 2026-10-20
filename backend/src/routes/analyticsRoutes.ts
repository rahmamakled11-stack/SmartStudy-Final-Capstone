import { Router } from 'express';
import { getDashboard, getWeekly } from '@/controllers/analyticsController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/weekly', getWeekly);

export default router;
