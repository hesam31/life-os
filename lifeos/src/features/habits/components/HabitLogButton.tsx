'use client'
import { cn } from '@/utils/cn.utils'
import { useLogHabit, useUnlogHabit } from '../hooks/useLogHabit'

export function HabitLogButton({ habitId, logged, size = 'md' }: {
  habitId: string; logged: boolean; size?: 'sm' | 'md'
}) {
  const log   = useLogHabit()
  const unlog = useUnlogHabit()
  const busy  = log.isPending || unlog.isPending

  return (
    <button
      onClick={() => logged ? unlog.mutate(habitId) : log.mutate({ habitId })}
      disabled={busy}
      className={cn(
        'rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0',
        size === 'sm' ? 'w-6 h-6' : 'w-8 h-8',
        logged
          ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
          : 'bg-transparent border-[var(--color-border)] text-transparent hover:border-[var(--color-accent)]',
        busy && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={logged ? 'Unlog habit' : 'Log habit'}
    >
      <svg width={size === 'sm' ? 10 : 14} height={size === 'sm' ? 10 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </button>
  )
}
