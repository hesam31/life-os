import { getSupabaseServerClient } from '@/services/supabase/server'

export async function POST() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  return Response.json({ data: { message: 'Signed out' } })
}
