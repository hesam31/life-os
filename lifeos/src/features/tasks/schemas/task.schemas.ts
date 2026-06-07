import { z } from 'zod'

export const createTaskSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  priority:    z.enum(['low', 'medium', 'high']).default('medium'),
  due_date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date').optional(),
  goal_id:     z.string().uuid().optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
