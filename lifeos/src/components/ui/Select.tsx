import { cn } from '@/utils/cn.utils'
import { type SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string
  error?:   string
  options:  { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-lg border px-3 text-sm transition-colors appearance-none',
            'bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
            error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]',
            className
          )}
          {...props}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
