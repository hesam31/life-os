import { getSupabaseServerClient } from '@/services/supabase/server'
import { getHabit } from '@/services/habits.service'
import { HabitDetailView } from '@/features/habits'
import { notFound } from 'next/navigation'

export default async function HabitDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const habit = await getHabit(user.id, params.id)
  if (!habit) notFound()
  return <HabitDetailView habit={habit} />
}
