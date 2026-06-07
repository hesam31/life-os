import { z } from 'zod'

export const createGoalSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(150),
  description: z.string().max(1000).optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
})

export const updateGoalSchema = createGoalSchema.partial().extend({
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
