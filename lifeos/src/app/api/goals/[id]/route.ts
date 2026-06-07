import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getGoal, updateGoal, deleteGoal } from '@/services/goals.service'
import { z } from 'zod'

const updateSchema = z.object({
  title:       z.string().min(1).max(150).optional(),
  description: z.string().max(1000).optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status:      z.enum(['active', 'completed', 'abandoned']).optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  const goal = await getGoal(user!.id, params.id)
  if (!goal) return errors.notFound('Goal')
  return Response.json({ data: goal })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, updateSchema)
  if (valErr) return valErr
  const existing = await getGoal(user!.id, params.id)
  if (!existing) return errors.notFound('Goal')
  try {
    const goal = await updateGoal(user!.id, params.id, data)
    return Response.json({ data: goal })
  } catch { return errors.internal() }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  const existing = await getGoal(user!.id, params.id)
  if (!existing) return errors.notFound('Goal')
  await deleteGoal(user!.id, params.id)
  return new Response(null, { status: 204 })
}
