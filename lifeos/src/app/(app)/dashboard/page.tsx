export const dynamic = "force-dynamic"
import { getSupabaseServerClient } from '@/services/supabase/server'
import { getDashboardData } from '@/services/dashboard.service'
import { getProfile } from '@/services/profiles.service'
import { DashboardView } from '@/features/dashboard'

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profile, dashboard] = await Promise.all([
    getProfile(user.id),
    getDashboardData(user.id, 'UTC'),
  ])

  return <DashboardView data={dashboard} profile={profile} />
}
