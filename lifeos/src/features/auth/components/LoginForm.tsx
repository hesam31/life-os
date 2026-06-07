'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas/auth.schemas'
import { useAuth } from '../hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    await signIn(data.email, data.password)
    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Life<span className="text-[var(--color-accent)]">OS</span>
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" error={errors.password?.message} {...register('password')} />
        <div className="flex justify-end">
          <Link href="/reset-password" className="text-xs text-[var(--color-accent)] hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
      </form>
      <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
        No account?{' '}
        <Link href="/signup" className="text-[var(--color-accent)] hover:underline font-medium">Sign up</Link>
      </p>
    </div>
  )
}
