'use client'
import { useDeleteGoal } from '../hooks/useDeleteGoal'
import { useUpdateGoal } from '../hooks/useUpdateGoal'
import { useUIStore } from '@/lib/zustand'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GoalProgressBar } from './GoalProgressBar'
import { GoalStatusBadge } from './GoalStatusBadge'
import { TaskCard } from '@/features/tasks/components/TaskCard'
import { HabitCard } from '@/features/habits/components/HabitCard'
import { formatDate } from '@/utils/date.utils'
import type { GoalDetail } from '@/types/models'

export function GoalDetailView({ goal }: { goal: GoalDetail }) {
  const router      = useRouter()
  const del         = useDeleteGoal()
  const update      = useUpdateGoal()
  const openConfirm = useUIStore((s) => s.openConfirm)

  const handleDelete = () => openConfirm({
    title: 'Delete goal', message: `Delete "${goal.title}"? Linked tasks and habits will not be deleted.`,
    onConfirm: async () => { await del.mutateAsync(goal.id); router.push('/app/goals') },
  })

  const todoTasks = goal.tasks.filter((t) => t.status !== 'done')
  const doneTasks = goal.tasks.filter((t) => t.status === 'done')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{goal.title}</h2>
            <GoalStatusBadge status={goal.status} />
          </div>
          {goal.description && <p className="text-sm text-[var(--color-text-muted)]">{goal.description}</p>}
          <GoalProgressBar progress={goal.progress} className="max-w-xs" />
          <p className="text-xs text-[var(--color-text-muted)]">Target: {formatDate(goal.target_date)}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {goal.status === 'active' && (
            <Button variant="secondary" size="sm" onClick={() => update.mutate({ id: goal.id, data: { status: 'completed' } })}>
              Mark complete
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {goal.habits.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Linked habits</p>
          <div className="space-y-2">
            {goal.habits.map((h) => (
              <HabitCard key={h.id} habit={{ ...h, current_streak: 0, longest_streak: 0, completion_rate: 0, is_logged_today: false, today_log: null }} />
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Tasks ({doneTasks.length}/{goal.tasks.length} done)
        </p>
        {goal.tasks.length === 0
          ? <p className="text-sm text-[var(--color-text-muted)]">No tasks linked to this goal yet.</p>
          : <div className="space-y-2">{[...todoTasks, ...doneTasks].map((t) => <TaskCard key={t.id} task={t} />)}</div>
        }
      </section>
    </div>
  )
}
