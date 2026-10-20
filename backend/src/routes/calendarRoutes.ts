import { Router } from 'express';
import { getEvents } from '@/controllers/calendarController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/events', getEvents);

export default router;
