'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { CreateGoalRequest } from '@/types/api'
import type { Goal } from '@/types/models'

export function useCreateGoal() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn: (data: CreateGoalRequest) => api.post<Goal>('/api/goals', data).then((r) => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: queryKeys.goals.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }); addToast('Goal created!', 'success') },
    onError:    (e: Error) => addToast(e.message, 'error'),
  })
}
