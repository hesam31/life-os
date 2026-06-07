'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { UpdateGoalRequest } from '@/types/api'
import type { Goal } from '@/types/models'

export function useUpdateGoal() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalRequest }) =>
      api.patch<Goal>(`/api/goals/${id}`, data).then((r) => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: queryKeys.goals.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }); addToast('Goal updated!', 'success') },
    onError:    (e: Error) => addToast(e.message, 'error'),
  })
}
