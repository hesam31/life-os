import type { ApiError, ApiSuccess } from '@/types/api'

type FetchOptions = Omit<RequestInit, 'body'> & { body?: unknown }

async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<ApiSuccess<T>> {
  const { body, headers, ...rest } = options

  const response = await fetch(path, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...headers },
    body:    body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json() as ApiSuccess<T> | ApiError

  if (!response.ok || 'error' in data) {
    const err = 'error' in data ? data.error : { code: 'UNKNOWN', message: 'Request failed' }
    throw new ApiClientError(err.code, err.message, response.status, err.field)
  }

  return data
}

export class ApiClientError extends Error {
  constructor(
    public readonly code:    string,
    message:                 string,
    public readonly status:  number,
    public readonly field?:  string
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

export const api = {
  get:    <T>(path: string, init?: RequestInit)     => fetchApi<T>(path, { ...init, method: 'GET' }),
  post:   <T>(path: string, body: unknown)           => fetchApi<T>(path, { method: 'POST', body }),
  patch:  <T>(path: string, body: unknown)           => fetchApi<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string)                          => fetchApi<T>(path, { method: 'DELETE' }),
}
