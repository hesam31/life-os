'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import type { GoalWithProgress } from '@/types/models'

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals.list(),
    queryFn:  () => api.get<GoalWithProgress[]>('/api/goals').then((r) => r.data),
  })
}
