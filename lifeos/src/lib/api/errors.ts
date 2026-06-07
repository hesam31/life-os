import { type NextResponse } from 'next/server'
import { API_ERROR_CODES, type ApiError } from '@/types/api'

export function apiError(
  code: string,
  message: string,
  status: number,
  field?: string
): Response {
  const body: ApiError = { error: { code, message, ...(field ? { field } : {}) } }
  return Response.json(body, { status })
}

export const errors = {
  unauthorized:    ()                     => apiError(API_ERROR_CODES.UNAUTHORIZED,     'Authentication required',              401),
  forbidden:       ()                     => apiError(API_ERROR_CODES.FORBIDDEN,        'Access denied',                        403),
  notFound:        (resource = 'Resource')=> apiError(API_ERROR_CODES.NOT_FOUND,        `${resource} not found`,                404),
  conflict:        (msg: string)          => apiError(API_ERROR_CODES.CONFLICT,         msg,                                    409),
  validation:      (msg: string, field?: string) => apiError(API_ERROR_CODES.VALIDATION_ERROR, msg, 422, field),
  internal:        ()                     => apiError(API_ERROR_CODES.INTERNAL_ERROR,   'An unexpected error occurred',         500),
}

export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ApiError).error === 'object'
  )
}
