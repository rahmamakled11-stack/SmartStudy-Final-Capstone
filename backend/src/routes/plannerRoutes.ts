import { Router } from 'express';
import { generateSchedule, getCurrentSchedule } from '@/controllers/plannerController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', generateSchedule);
router.get('/current', getCurrentSchedule);

export default router;
