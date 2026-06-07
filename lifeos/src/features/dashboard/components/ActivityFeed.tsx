'use client'
import { formatRelativeDate } from '@/utils/date.utils'
import type { ActivityItem } from '@/types/models'

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return (
    <div className="py-6 text-center">
      <p className="text-sm text-[var(--color-text-muted)]">No recent activity yet</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm bg-[var(--color-bg-tertiary)]">
            {item.type === 'habit_log' ? '◎' : '✓'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-text-primary)] truncate">
              {item.type === 'habit_log'
                ? <><span className="font-medium">{item.habit_name}</span> logged</>
                : <><span className="font-medium">{item.task_title}</span> completed</>
              }
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{formatRelativeDate(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
