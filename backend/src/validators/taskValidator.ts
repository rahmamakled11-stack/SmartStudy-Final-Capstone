import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  subjectId: z.string().min(1, 'Subject ID is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']).optional(),
  deadline: z.string().or(z.date()),
  estimatedTime: z.number().min(5).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
