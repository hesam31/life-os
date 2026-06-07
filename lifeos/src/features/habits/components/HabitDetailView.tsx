'use client'
import { useDeleteHabit } from '../hooks/useDeleteHabit'
import { useUIStore } from '@/lib/zustand'
import { useRouter } from 'next/navigation'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { HabitLogButton } from './HabitLogButton'
import type { HabitWithStats } from '@/types/models'

export function HabitDetailView({ habit }: { habit: HabitWithStats }) {
  const router      = useRouter()
  const del         = useDeleteHabit()
  const openConfirm = useUIStore((s) => s.openConfirm)

  const handleDelete = () => openConfirm({
    title:     'Delete habit',
    message:   `Delete "${habit.name}"? Your log history will be preserved.`,
    onConfirm: async () => { await del.mutateAsync(habit.id); router.push('/app/habits') },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{habit.name}</h2>
          {habit.description && <p className="text-sm text-[var(--color-text-muted)] mt-1">{habit.description}</p>}
        </div>
        <div className="flex gap-2">
          <HabitLogButton habitId={habit.id} logged={habit.is_logged_today} />
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Current streak', value: `${habit.current_streak}d`, icon: '🔥' },
          { label: 'Longest streak', value: `${habit.longest_streak}d`, icon: '🏆' },
          { label: '30-day rate',    value: `${habit.completion_rate}%`, icon: '📊' },
        ].map(({ label, value, icon }) => (
          <Card key={label}>
            <CardBody className="text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{value}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
