import { requireAuth, validateBody } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getTasks, createTask } from '@/services/tasks.service'
import { z } from 'zod'

const createSchema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority:    z.enum(['low', 'medium', 'high']).optional(),
  due_date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  goal_id:     z.string().uuid().optional(),
})

const filterSchema = z.object({
  status:   z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
})

export async function GET(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  const { searchParams } = new URL(request.url)
  const filters = filterSchema.parse(Object.fromEntries(searchParams))
  try {
    const tasks = await getTasks(user!.id, filters)
    return Response.json({ data: tasks })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error: authErr } = await requireAuth()
  if (authErr) return authErr
  const { data, error: valErr } = await validateBody(request, createSchema)
  if (valErr) return valErr
  try {
    const task = await createTask(user!.id, data)
    return Response.json({ data: task }, { status: 201 })
  } catch { return errors.internal() }
}
