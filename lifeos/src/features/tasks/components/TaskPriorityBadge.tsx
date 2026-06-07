import { Badge } from '@/components/ui/Badge'
import type { TaskPriority } from '@/types/models'

const config: Record<TaskPriority, { label: string; variant: 'muted'|'warning'|'danger' }> = {
  low:    { label: 'Low',    variant: 'muted'   },
  medium: { label: 'Medium', variant: 'warning' },
  high:   { label: 'High',   variant: 'danger'  },
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, variant } = config[priority]
  return <Badge variant={variant}>{label}</Badge>
}
