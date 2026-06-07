'use client'
import type { DashboardData } from '@/types/models'

export function HabitRing({ summary }: { summary: DashboardData['habit_summary'] }) {
  const { total, completed } = summary
  const pct    = total === 0 ? 0 : Math.round((completed / total) * 100)
  const r      = 36
  const circ   = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="8" />
          <circle
            cx="44" cy="44" r={r} fill="none"
            stroke="var(--color-accent)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[var(--color-text-primary)]">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {completed} of {total} habits done
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          {total === 0 ? 'No habits scheduled today' : completed === total && total > 0 ? '🎉 All done for today!' : `${total - completed} remaining`}
        </p>
      </div>
    </div>
  )
}
