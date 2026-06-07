import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { logHabit, unlogHabit } from '@/services/habits.service'
import { z } from 'zod'

const logSchema = z.object({
  completed_value: z.number().min(0).default(1),
  note:            z.string().max(500).optional(),
})

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, logSchema)
  if (valErr) return valErr
  try {
    const log = await logHabit(user!.id, params.id, {
      completed_value: data.completed_value ?? 1,
      note: data.note,
    })
    return Response.json({ data: log }, { status: 201 })
  } catch { return errors.internal() }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  await unlogHabit(user!.id, params.id)
  return new Response(null, { status: 204 })
}