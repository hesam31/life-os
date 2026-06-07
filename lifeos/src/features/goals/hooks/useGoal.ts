'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import type { GoalDetail } from '@/types/models'

export function useGoal(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn:  () => api.get<GoalDetail>(`/api/goals/${id}`).then((r) => r.data),
    enabled:  !!id,
  })
}
