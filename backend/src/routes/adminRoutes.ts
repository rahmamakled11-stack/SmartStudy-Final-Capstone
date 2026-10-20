import { Router } from 'express';
import { getDashboard, getUsers, updateUserRole, deleteUser, getAnalytics } from '@/controllers/adminController';
import { authenticate, authorize } from '@/middleware/auth';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

export default router;
