'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useQueryParams<T extends Record<string, string | undefined>>() {
  const router     = useRouter()
  const pathname   = usePathname()
  const searchParams = useSearchParams()

  const params = Object.fromEntries(searchParams.entries()) as T

  const setParams = useCallback((updates: Partial<T>) => {
    const next = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === '') next.delete(k)
      else next.set(k, v)
    })
    router.push(`${pathname}?${next.toString()}`)
  }, [router, pathname, searchParams])

  return { params, setParams }
}
