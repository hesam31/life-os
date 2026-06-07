import { Button } from './Button'

export function EmptyState({ icon, title, description, action }: {
  icon:         string
  title:        string
  description:  string
  action?:      { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <span className="text-4xl">{icon}</span>
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] max-w-xs">{description}</p>
      {action && <Button variant="secondary" size="sm" onClick={action.onClick} className="mt-2">{action.label}</Button>}
    </div>
  )
}
