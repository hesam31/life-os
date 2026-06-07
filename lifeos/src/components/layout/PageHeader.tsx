import { type ReactNode } from 'react'

export function PageHeader({ title, description, action }: {
  title:        string
  description?: string
  action?:      ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{title}</h2>
        {description && <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
