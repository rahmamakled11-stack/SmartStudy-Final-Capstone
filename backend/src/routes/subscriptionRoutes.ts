import { Router } from 'express';
import { createCheckout, getStatus, webhook } from '@/controllers/subscriptionController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.post('/checkout', authenticate, createCheckout);
router.get('/status', authenticate, getStatus);
router.post('/webhook', webhook); // Stripe webhook - no auth needed

export default router;
