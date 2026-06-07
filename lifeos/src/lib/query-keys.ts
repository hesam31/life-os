import type { TaskFilters } from '@/types/api'

export const queryKeys = {
  habits: {
    all:    ()           => ['habits']                         as const,
    list:   ()           => ['habits', 'list']                 as const,
    detail: (id: string) => ['habits', 'detail', id]           as const,
    logs:   (id: string) => ['habits', 'logs', id]             as const,
  },
  tasks: {
    all:    ()                      => ['tasks']                            as const,
    list:   (filters: TaskFilters)  => ['tasks', 'list', filters]           as const,
    detail: (id: string)            => ['tasks', 'detail', id]              as const,
  },
  goals: {
    all:    ()           => ['goals']                          as const,
    list:   ()           => ['goals', 'list']                  as const,
    detail: (id: string) => ['goals', 'detail', id]            as const,
  },
  dashboard: {
    all: () => ['dashboard'] as const,
  },
} as const
