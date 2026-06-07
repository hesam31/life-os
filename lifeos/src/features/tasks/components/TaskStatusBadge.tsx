import { Badge } from '@/components/ui/Badge'
import type { TaskStatus } from '@/types/models'

const config: Record<TaskStatus, { label: string; variant: 'default'|'warning'|'success' }> = {
  todo:        { label: 'To do',       variant: 'default'  },
  in_progress: { label: 'In progress', variant: 'warning'  },
  done:        { label: 'Done',        variant: 'success'  },
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
