import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z.string().optional(),
  icon: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  description: z.string().max(500).optional(),
  weeklyHours: z.number().min(1).max(40).optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
