import { cn } from '@/utils/cn.utils'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted'

const variants: Record<Variant, string> = {
  default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
  success: 'bg-[var(--color-success-subtle)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
  danger:  'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
  accent:  'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]',
  muted:   'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)]',
}

export function Badge({ children, variant = 'default', className }: {
  children:  React.ReactNode
  variant?:  Variant
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
