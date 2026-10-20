import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '@/controllers/taskController';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { createTaskSchema, updateTaskSchema } from '@/validators/taskValidator';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
