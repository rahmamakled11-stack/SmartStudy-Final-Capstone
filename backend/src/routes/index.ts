import { Router } from 'express';
import authRoutes from './authRoutes';
import subjectRoutes from './subjectRoutes';
import taskRoutes from './taskRoutes';
import focusRoutes from './focusRoutes';
import plannerRoutes from './plannerRoutes';
import chatRoutes from './chatRoutes';
import analyticsRoutes from './analyticsRoutes';
import calendarRoutes from './calendarRoutes';
import notificationRoutes from './notificationRoutes';
import settingsRoutes from './settingsRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/tasks', taskRoutes);
router.use('/focus', focusRoutes);
router.use('/planner', plannerRoutes);
router.use('/chat', chatRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/calendar', calendarRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/admin', adminRoutes);

export default router;
