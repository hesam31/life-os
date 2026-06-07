'use client'
import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useUIStore } from '@/lib/zustand'
import type { TaskFilters as TF } from '@/types/api'

export function TaskList() {
  const [filters, setFilters] = useState<TF>({})
  const openModal             = useUIStore((s) => s.openModal)
  const { data: tasks = [], isLoading } = useTasks(filters)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  return (
    <div className="space-y-4">
      <TaskFilters filters={filters} onChange={setFilters} />
      {tasks.length === 0 ? (
        <EmptyState
          icon="✓"
          title="No tasks found"
          description={Object.keys(filters).length ? 'Try adjusting your filters.' : 'Break down your goals into actionable steps.'}
          action={!Object.keys(filters).length ? { label: 'Create your first task', onClick: () => openModal('createTask') } : undefined}
        />
      ) : (
        <div className="space-y-2">{tasks.map((t) => <TaskCard key={t.id} task={t} />)}</div>
      )}
    </div>
  )
}
