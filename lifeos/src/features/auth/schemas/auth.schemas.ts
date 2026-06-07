import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  email:     z.string().email('Invalid email address'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type LoginInput         = z.infer<typeof loginSchema>
export type SignupInput         = z.infer<typeof signupSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
