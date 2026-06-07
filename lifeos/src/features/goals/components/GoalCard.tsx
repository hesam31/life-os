'use client'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { GoalProgressBar } from './GoalProgressBar'
import { GoalStatusBadge } from './GoalStatusBadge'
import { formatDate } from '@/utils/date.utils'
import { pluralize } from '@/utils/string.utils'
import type { GoalWithProgress } from '@/types/models'
import { cn } from '@/utils/cn.utils'

export function GoalCard({ goal }: { goal: GoalWithProgress }) {
  const overdue = goal.days_remaining < 0 && goal.status === 'active'
  return (
    <Link href={`/app/goals/${goal.id}`}>
      <Card hover>
        <CardBody className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{goal.title}</p>
              {goal.description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">{goal.description}</p>}
            </div>
            <GoalStatusBadge status={goal.status} />
          </div>
          <GoalProgressBar progress={goal.progress} />
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>{pluralize(goal.linked_task_count, 'task')} · {pluralize(goal.linked_habit_count, 'habit')}</span>
            <span className={cn(overdue && 'text-[var(--color-danger)] font-medium')}>
              {overdue ? `Overdue by ${Math.abs(goal.days_remaining)}d` : goal.status === 'active' ? `${goal.days_remaining}d left` : formatDate(goal.target_date)}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  )
}
