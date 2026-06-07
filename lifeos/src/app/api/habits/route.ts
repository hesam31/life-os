import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getHabits, createHabit } from '@/services/habits.service'
import { z } from 'zod'

const createSchema = z.object({
  name:          z.string().min(1).max(100),
  description:   z.string().max(500).optional(),
  frequency:     z.enum(['daily', 'weekdays', 'weekends', 'custom']),
  custom_days:   z.array(z.boolean()).length(7).optional(),
  target_value:  z.number().positive().optional(),
  unit:          z.string().max(30).optional(),
  goal_id:       z.string().uuid().optional(),
})

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const habits = await getHabits(user!.id)
    return Response.json({ data: habits })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, createSchema)
  if (valErr) return valErr
  try {
    const habit = await createHabit(user!.id, data)
    return Response.json({ data: habit }, { status: 201 })
  } catch { return errors.internal() }
}
