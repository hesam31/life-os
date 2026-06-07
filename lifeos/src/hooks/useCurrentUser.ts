'use client'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/services/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useCurrentUser() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase              = getSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
