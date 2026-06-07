import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getHabit, updateHabit, deleteHabit } from '@/services/habits.service'
import { z } from 'zod'

const updateSchema = z.object({
  name:         z.string().min(1).max(100).optional(),
  description:  z.string().max(500).optional(),
  frequency:    z.enum(['daily', 'weekdays', 'weekends', 'custom']).optional(),
  custom_days:  z.array(z.boolean()).length(7).optional(),
  target_value: z.number().positive().optional(),
  unit:         z.string().max(30).optional(),
  goal_id:      z.string().uuid().nullable().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  const habit = await getHabit(user!.id, params.id)
  if (!habit) return errors.notFound('Habit')
  return Response.json({ data: habit })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, updateSchema)
  if (valErr) return valErr
  const existing = await getHabit(user!.id, params.id)
  if (!existing) return errors.notFound('Habit')
  try {
    const habit = await updateHabit(user!.id, params.id, data)
    return Response.json({ data: habit })
  } catch { return errors.internal() }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  const existing = await getHabit(user!.id, params.id)
  if (!existing) return errors.notFound('Habit')
  await deleteHabit(user!.id, params.id)
  return new Response(null, { status: 204 })
}
