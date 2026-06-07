import { requireAuth } from "@/lib/api/middleware"
import { errors } from "@/lib/api/errors"
import { getHabits, createHabit } from "@/services/habits.service"

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const habits = await getHabits(user!.id)
    return Response.json({ data: habits })
  } catch { return errors.internal() }
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json() as Record<string, unknown>
    const habit = await createHabit(user!.id, body as any)
    return Response.json({ data: habit }, { status: 201 })
  } catch { return errors.internal() }
}