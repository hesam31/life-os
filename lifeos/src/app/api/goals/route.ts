import { requireAuth } from "@/lib/api/middleware"
import { errors } from "@/lib/api/errors"
import { getGoals, createGoal } from "@/services/goals.service"

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const goals = await getGoals(user!.id)
    return Response.json({ data: goals })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json() as Record<string, unknown>
    const goal = await createGoal(user!.id, body as any)
    return Response.json({ data: goal }, { status: 201 })
  } catch { return errors.internal() }
}