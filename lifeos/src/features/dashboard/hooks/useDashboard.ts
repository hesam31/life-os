'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import type { DashboardData } from '@/types/models'

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.all(),
    queryFn:  () => api.get<DashboardData>('/api/dashboard').then((r) => r.data),
    refetchInterval: 60_000,
  })
}
