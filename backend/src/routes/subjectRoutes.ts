import { Router } from 'express';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/controllers/subjectController';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { createSubjectSchema, updateSubjectSchema } from '@/validators/subjectValidator';

const router = Router();

router.use(authenticate);

router.get('/', getSubjects);
router.post('/', validate(createSubjectSchema), createSubject);
router.put('/:id', validate(updateSubjectSchema), updateSubject);
router.delete('/:id', deleteSubject);

export default router;
