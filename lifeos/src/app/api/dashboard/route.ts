import { requireAuth } from '@/lib/api/middleware'
import { errors } from '@/lib/api/errors'
import { getDashboardData } from '@/services/dashboard.service'

export async function GET() {
  const { user, error } = await requireAuth()
  if (error) return error
  try {
    const data = await getDashboardData(user!.id)
    return Response.json({ data })
  } catch { return errors.internal() }
}
