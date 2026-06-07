import { getSupabaseServerClient } from '@/services/supabase/server'
import { errors } from './errors'
import type { ZodSchema } from 'zod'

export async function requireAuth() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { user: null, error: errors.unauthorized() }
  return { user, error: null }
}

export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: Response }> {
  try {
    const body = await request.json() as unknown
    const result = schema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.errors[0]
      return {
        data:  null,
        error: errors.validation(
          firstError?.message ?? 'Validation failed',
          firstError?.path.join('.') ?? undefined
        ),
      }
    }
    return { data: result.data, error: null }
  } catch {
    return { data: null, error: errors.validation('Invalid JSON body') }
  }
}

export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): { data: T; error: null } | { data: null; error: Response } {
  const raw = Object.fromEntries(searchParams.entries())
  const result = schema.safeParse(raw)
  if (!result.success) {
    const firstError = result.error.errors[0]
    return { data: null, error: errors.validation(firstError?.message ?? 'Invalid query params') }
  }
  return { data: result.data, error: null }
}
