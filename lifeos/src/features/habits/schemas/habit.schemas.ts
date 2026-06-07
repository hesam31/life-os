import { z } from 'zod'

export const createHabitSchema = z.object({
  name:         z.string().min(1, 'Name is required').max(100),
  description:  z.string().max(500).optional(),
  frequency:    z.enum(['daily', 'weekdays', 'weekends', 'custom']),
  custom_days:  z.array(z.boolean()).length(7).optional(),
  target_value: z.number().positive().default(1),
  unit:         z.string().max(30).default('times'),
  goal_id:      z.string().uuid().optional(),
})

export const updateHabitSchema = z.object({
  name:         z.string().min(1).max(100).optional(),
  description:  z.string().max(500).optional(),
  frequency:    z.enum(['daily', 'weekdays', 'weekends', 'custom']).optional(),
  custom_days:  z.array(z.boolean()).length(7).optional(),
  target_value: z.number().positive().optional(),
  unit:         z.string().max(30).optional(),
  goal_id:      z.string().uuid().optional(),
})

export const logHabitSchema = z.object({
  completed_value: z.number().min(0).default(1),
  note:            z.string().max(500).optional(),
})

export type CreateHabitInput = z.infer<typeof createHabitSchema>
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>
export type LogHabitInput    = z.infer<typeof logHabitSchema>