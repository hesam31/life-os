import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getGoals, createGoal } from '@/services/goals.service'
import { z } from 'zod'

const createSchema = z.object({
  title:       z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const goals = await getGoals(user!.id)
    return Response.json({ data: goals })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, createSchema)
  if (valErr) return valErr
  try {
    const goal = await createGoal(user!.id, data)
    return Response.json({ data: goal }, { status: 201 })
  } catch { return errors.internal() }
}
