import { Router } from 'express';
import { getSettings, updateSettings, updatePassword, deleteAccount } from '@/controllers/settingsController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSettings);
router.put('/', updateSettings);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

export default router;
