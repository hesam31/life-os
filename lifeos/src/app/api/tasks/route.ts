import { requireAuth } from "@/lib/api/middleware"
import { errors } from "@/lib/api/errors"
import { getTasks, createTask } from "@/services/tasks.service"

export async function GET(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") as any
  const priority = searchParams.get("priority") as any
  try {
    const tasks = await getTasks(user!.id, { status, priority })
    return Response.json({ data: tasks })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json() as Record<string, unknown>
    const task = await createTask(user!.id, body as any)
    return Response.json({ data: task }, { status: 201 })
  } catch { return errors.internal() }
}