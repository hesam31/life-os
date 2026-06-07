'use client'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { HabitLogButton } from './HabitLogButton'
import type { HabitWithStats } from '@/types/models'

const freqLabel: Record<string, string> = {
  daily: 'Daily', weekdays: 'Weekdays', weekends: 'Weekends', custom: 'Custom'
}

export function HabitCard({ habit }: { habit: HabitWithStats }) {
  return (
    <Card className="group">
      <CardBody className="flex items-center gap-4">
        <HabitLogButton habitId={habit.id} logged={habit.is_logged_today} />
        <div className="flex-1 min-w-0">
          <Link href={`/app/habits/${habit.id}`}>
            <p className={`text-sm font-medium truncate transition-colors ${habit.is_logged_today ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)] hover:text-[var(--color-accent)]'}`}>
              {habit.name}
            </p>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="muted">{freqLabel[habit.frequency]}</Badge>
            {habit.current_streak > 0 && (
              <span className="text-xs text-[var(--color-warning)]">🔥 {habit.current_streak} day{habit.current_streak !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-semibold text-[var(--color-text-primary)]">{habit.completion_rate}%</p>
          <p className="text-xs text-[var(--color-text-muted)]">30d rate</p>
        </div>
      </CardBody>
    </Card>
  )
}
