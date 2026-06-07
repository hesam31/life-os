'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { api } from '@/lib/api/client'
import { useUIStore } from '@/lib/zustand'
import type { HabitWithStats, HabitLog } from '@/types/models'

export function useLogHabit() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)

  return useMutation({
    mutationFn:  ({ habitId, value = 1 }: { habitId: string; value?: number }) =>
      api.post<HabitLog>(`/api/habits/${habitId}/logs`, { completed_value: value }).then((r) => r.data),
    onMutate:    async ({ habitId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.habits.list() })
      const prev = qc.getQueryData<HabitWithStats[]>(queryKeys.habits.list())
      qc.setQueryData<HabitWithStats[]>(queryKeys.habits.list(), (old) =>
        old?.map((h) => h.id === habitId ? { ...h, is_logged_today: true } : h) ?? []
      )
      return { prev }
    },
    onError:     (e: Error, _, ctx) => { qc.setQueryData(queryKeys.habits.list(), ctx?.prev); addToast(e.message, 'error') },
    onSettled:   () => { qc.invalidateQueries({ queryKey: queryKeys.habits.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }) },
  })
}

export function useUnlogHabit() {
  const qc       = useQueryClient()
  const addToast = useUIStore((s) => s.addToast)

  return useMutation({
    mutationFn:  (habitId: string) => api.delete(`/api/habits/${habitId}/logs`),
    onMutate:    async (habitId) => {
      await qc.cancelQueries({ queryKey: queryKeys.habits.list() })
      const prev = qc.getQueryData<HabitWithStats[]>(queryKeys.habits.list())
      qc.setQueryData<HabitWithStats[]>(queryKeys.habits.list(), (old) =>
        old?.map((h) => h.id === habitId ? { ...h, is_logged_today: false, today_log: null } : h) ?? []
      )
      return { prev }
    },
    onError:     (e: Error, _, ctx) => { qc.setQueryData(queryKeys.habits.list(), ctx?.prev); addToast(e.message, 'error') },
    onSettled:   () => { qc.invalidateQueries({ queryKey: queryKeys.habits.all() }); qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() }) },
  })
}
