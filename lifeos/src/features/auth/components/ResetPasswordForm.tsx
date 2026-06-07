'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordInput } from '../schemas/auth.schemas'
import { useAuth } from '../hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ResetPasswordForm() {
  const { resetPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true)
    const ok = await resetPassword(data.email)
    if (ok) setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl text-center">
      <p className="text-4xl mb-4">✉️</p>
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Reset link sent</h2>
      <p className="text-sm text-[var(--color-text-muted)]">Check your inbox and follow the instructions.</p>
      <Link href="/auth/login" className="inline-block mt-4 text-sm text-[var(--color-accent)] hover:underline">Back to sign in</Link>
    </div>
  )

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reset password</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">We'll send you a reset link</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
      </form>
      <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
        <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline">Back to sign in</Link>
      </p>
    </div>
  )
}
