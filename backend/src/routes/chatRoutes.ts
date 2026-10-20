import { Router } from 'express';
import { sendMessage, getConversations, getConversation, deleteConversation } from '@/controllers/chatController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);
router.post('/send', sendMessage);

export default router;
