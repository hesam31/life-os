import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getTask, updateTask, deleteTask } from '@/services/tasks.service'
import { z } from 'zod'

const updateSchema = z.object({
  title:       z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status:      z.enum(['todo', 'in_progress', 'done']).optional(),
  priority:    z.enum(['low', 'medium', 'high']).optional(),
  due_date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  goal_id:     z.string().uuid().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  const task = await getTask(user!.id, params.id)
  if (!task) return errors.notFound('Task')
  return Response.json({ data: task })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, updateSchema)
  if (valErr) return valErr
  const existing = await getTask(user!.id, params.id)
  if (!existing) return errors.notFound('Task')
  try {
    const task = await updateTask(user!.id, params.id, data)
    return Response.json({ data: task })
  } catch { return errors.internal() }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth()
  if (error) return error
  const existing = await getTask(user!.id, params.id)
  if (!existing) return errors.notFound('Task')
  await deleteTask(user!.id, params.id)
  return new Response(null, { status: 204 })
}