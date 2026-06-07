'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '../schemas/auth.schemas'
import { useAuth } from '../hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function SignupForm() {
  const { signUp } = useAuth()
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data: SignupInput) => {
    setLoading(true)
    const ok = await signUp(data.email, data.password, data.full_name)
    if (ok) setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl text-center">
        <p className="text-4xl mb-4">ًں“¬</p>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Check your email</h2>
        <p className="text-sm text-[var(--color-text-muted)]">We sent you a confirmation link. Click it to activate your account.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Life<span className="text-[var(--color-accent)]">OS</span></h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Create your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name" placeholder="Alex Johnson" error={errors.full_name?.message} {...register('full_name')} />
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
        <Button type="submit" className="w-full" loading={loading}>Create account</Button>
      </form>
      <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
        Have an account?{' '}
        <Link href="/login" className="text-[var(--color-accent)] hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
