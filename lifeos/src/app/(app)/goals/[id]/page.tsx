import { getSupabaseServerClient } from '@/services/supabase/server'
import { getGoal } from '@/services/goals.service'
import { GoalDetailView } from '@/features/goals'
import { notFound } from 'next/navigation'

export default async function GoalDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const goal = await getGoal(user.id, params.id)
  if (!goal) notFound()
  return <GoalDetailView goal={goal} />
}
