import { Router } from 'express';
import { startSession, endSession, getHistory } from '@/controllers/focusController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/start', startSession);
router.post('/end', endSession);
router.get('/history', getHistory);

export default router;
