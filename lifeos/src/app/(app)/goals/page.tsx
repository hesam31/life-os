export const dynamic = "force-dynamic"
import { getSupabaseServerClient } from '@/services/supabase/server'
import { getGoals } from '@/services/goals.service'
import { GoalsView } from '@/features/goals'

export default async function GoalsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const goals = await getGoals(user.id)
  return <GoalsView initialGoals={goals} />
}
