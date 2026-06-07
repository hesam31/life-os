'use client'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/services/supabase/client'
import { useUIStore } from '@/lib/zustand'
import { api } from '@/lib/api/client'

export function useAuth() {
  const router  = useRouter()
  const addToast = useUIStore((s) => s.addToast)
  const supabase = getSupabaseBrowserClient()

  async function signIn(email: string, password: string) {
    const res = await api.post('/api/auth/signin', { email, password })
    if ('error' in res) { addToast(res.error.message, 'error'); return false }
    addToast('Welcome back!', 'success')
    router.push('/dashboard')
    return true
  }

  async function signUp(email: string, password: string, full_name: string) {
    const res = await api.post('/api/auth/signup', { email, password, full_name })
    if ('error' in res) { addToast(res.error.message, 'error'); return false }
    addToast('Account created! Check your email.', 'success')
    return true
  }

  async function signOut() {
    await api.post('/api/auth/signout', {})
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  async function resetPassword(email: string) {
    const res = await api.post('/api/auth/reset-password', { email })
    if ('error' in res) { addToast(res.error.message, 'error'); return false }
    addToast('Reset link sent! Check your email.', 'success')
    return true
  }

  return { signIn, signUp, signOut, resetPassword }
}
