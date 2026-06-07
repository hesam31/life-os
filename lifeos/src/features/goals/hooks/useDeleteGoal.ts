'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'

export function useDeleteGoal() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/goals/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: queryKeys.goals.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }); addToast('Goal deleted', 'info') },
    onError:    (e: Error) => addToast(e.message, 'error'),
  })
}
