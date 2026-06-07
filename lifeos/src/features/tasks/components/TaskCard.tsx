'use client'
import { Card, CardBody } from '@/components/ui/Card'
import { TaskStatusBadge } from './TaskStatusBadge'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { useUIStore } from '@/lib/zustand'
import { formatRelativeDate, isOverdue } from '@/utils/date.utils'
import { cn } from '@/utils/cn.utils'
import type { Task } from '@/types/models'

export function TaskCard({ task }: { task: Task }) {
  const update      = useUpdateTask()
  const del         = useDeleteTask()
  const openConfirm = useUIStore((s) => s.openConfirm)
  const done        = task.status === 'done'

  const cycleStatus = () => {
    const next = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo'
    update.mutate({ id: task.id, data: { status: next } })
  }

  const handleDelete = () => openConfirm({
    title: 'Delete task', message: `Delete "${task.title}"? This cannot be undone.`,
    onConfirm: () => del.mutate(task.id),
  })

  return (
    <Card className="group">
      <CardBody className="flex items-start gap-3 py-3">
        <button
          onClick={cycleStatus}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
            done ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
          )}
        >
          {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', done ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]')}>
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
            {task.due_date && (
              <span className={cn('text-xs', isOverdue(task.due_date) && !done ? 'text-[var(--color-danger)] font-medium' : 'text-[var(--color-text-muted)]')}>
                {isOverdue(task.due_date) && !done ? '⚠ ' : ''}{formatRelativeDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
        <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2"/></svg>
        </button>
      </CardBody>
    </Card>
  )
}
