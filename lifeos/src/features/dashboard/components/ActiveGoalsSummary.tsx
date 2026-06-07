'use client'
import Link from 'next/link'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/utils/cn.utils'
import type { GoalWithProgress } from '@/types/models'

export function ActiveGoalsSummary({ goals }: { goals: GoalWithProgress[] }) {
  if (goals.length === 0) return (
    <div className="py-6 text-center">
      <p className="text-2xl mb-2">◈</p>
      <p className="text-sm text-[var(--color-text-muted)]">No active goals</p>
      <Link href="/app/goals" className="text-xs text-[var(--color-accent)] hover:underline mt-1 inline-block">Create a goal →</Link>
    </div>
  )

  return (
    <div className="space-y-4">
      {goals.slice(0, 5).map((g) => (
        <Link key={g.id} href={`/app/goals/${g.id}`} className="block group">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate pr-4">
              {g.title}
            </p>
            <span className={cn('text-xs shrink-0', g.days_remaining < 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]')}>
              {g.days_remaining < 0 ? `${Math.abs(g.days_remaining)}d overdue` : `${g.days_remaining}d left`}
            </span>
          </div>
          <ProgressBar value={g.progress} showLabel />
        </Link>
      ))}
      {goals.length > 5 && (
        <Link href="/app/goals" className="block text-xs text-[var(--color-accent)] hover:underline text-right">
          View all {goals.length} goals →
        </Link>
      )}
    </div>
  )
}
