export const dynamic = "force-dynamic"
import { getSupabaseServerClient } from '@/services/supabase/server'
import { getHabits } from '@/services/habits.service'
import { HabitsView } from '@/features/habits'

export default async function HabitsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const habits = await getHabits(user.id)
  return <HabitsView initialHabits={habits} />
}
