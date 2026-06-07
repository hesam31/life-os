import { getSupabaseServerClient } from './supabase/server'
import type { Profile } from '@/types/models'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; timezone?: string }
): Promise<Profile> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
