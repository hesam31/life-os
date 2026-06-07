'use client'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { useUpdateTask } from '@/features/tasks/hooks/useUpdateTask'
import { isOverdue } from '@/utils/date.utils'
import { cn } from '@/utils/cn.utils'
import type { Task } from '@/types/models'

function MiniTaskRow({ task }: { task: Task }) {
  const update = useUpdateTask()
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0">
      <button
        onClick={() => update.mutate({ id: task.id, data: { status: task.status === 'done' ? 'todo' : 'done' } })}
        className={cn(
          'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
          task.status === 'done' ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
        )}
      >
        {task.status === 'done' && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </button>
      <span className={cn('text-sm flex-1 truncate', task.status === 'done' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]')}>
        {task.title}
      </span>
      {task.due_date && isOverdue(task.due_date) && task.status !== 'done' && (
        <span className="text-xs text-[var(--color-danger)] font-medium shrink-0">Overdue</span>
      )}
    </div>
  )
}

export function TodaysTasks({ tasksToday, tasksOverdue }: {
  tasksToday:   Task[]
  tasksOverdue: Task[]
}) {
  if (tasksToday.length === 0 && tasksOverdue.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-2xl mb-2">✓</p>
        <p className="text-sm text-[var(--color-text-muted)]">No tasks due today</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasksOverdue.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-danger)] mb-2">
            Overdue ({tasksOverdue.length})
          </p>
          {tasksOverdue.map((t) => <MiniTaskRow key={t.id} task={t} />)}
        </div>
      )}
      {tasksToday.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Due today ({tasksToday.length})
          </p>
          {tasksToday.map((t) => <MiniTaskRow key={t.id} task={t} />)}
        </div>
      )}
      <Link href="/app/tasks" className="block text-xs text-[var(--color-accent)] hover:underline text-right">
        View all tasks →
      </Link>
    </div>
  )
}
