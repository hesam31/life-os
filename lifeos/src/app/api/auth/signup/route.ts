import { z } from 'zod'
import { getSupabaseServerClient } from '@/services/supabase/server'
import { errors } from '@/lib/api/errors'

const schema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1).max(100).optional(),
})

export async function POST(request: Request) {
  const body = await request.json() as unknown
  const result = schema.safeParse(body)
  if (!result.success) return errors.validation(result.error.errors[0]?.message ?? 'Validation failed')

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email:    result.data.email,
    password: result.data.password,
    options:  { data: { full_name: result.data.full_name ?? '' } },
  })

  if (error) return errors.validation(error.message)
  return Response.json({ data: { message: 'Check your email to confirm your account.' } }, { status: 201 })
}
