'use client'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/services/supabase/client'
import { useUIStore } from '@/lib/zustand'
import { ApiClientError } from '@/lib/api/client'

export function useAuth() {
  const router   = useRouter()
  const addToast = useUIStore((s) => s.addToast)
  const supabase = getSupabaseBrowserClient()

  async function signIn(email: string, password: string) {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json() as { error?: { message: string } }
      if (!res.ok || data.error) { addToast(data.error?.message ?? 'Sign in failed', 'error'); return false }
      addToast('Welcome back!', 'success')
      router.push('/dashboard')
      return true
    } catch { addToast('Sign in failed', 'error'); return false }
  }

  async function signUp(email: string, password: string, full_name: string) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name }),
      })
      const data = await res.json() as { error?: { message: string } }
      if (!res.ok || data.error) { addToast(data.error?.message ?? 'Sign up failed', 'error'); return false }
      addToast('Account created! Check your email.', 'success')
      return true
    } catch { addToast('Sign up failed', 'error'); return false }
  }

  async function signOut() {
    await fetch('/api/auth/signout', { method: 'POST' })
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function resetPassword(email: string) {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { error?: { message: string } }
      if (!res.ok || data.error) { addToast(data.error?.message ?? 'Reset failed', 'error'); return false }
      addToast('Reset link sent! Check your email.', 'success')
      return true
    } catch { addToast('Reset failed', 'error'); return false }
  }

  return { signIn, signUp, signOut, resetPassword }
}