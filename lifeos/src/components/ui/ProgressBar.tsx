import { cn } from '@/utils/cn.utils'

export function ProgressBar({ value, max = 100, className, showLabel = false }: {
  value:       number
  max?:        number
  className?:  string
  showLabel?:  boolean
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-[var(--color-text-muted)] w-8 text-right">{pct}%</span>}
    </div>
  )
}
