export const dynamic = "force-dynamic"
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/services/supabase/server'

export default async function RootPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  redirect(user ? '/dashboard' : '/login')
}