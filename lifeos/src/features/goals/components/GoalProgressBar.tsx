import { ProgressBar } from '@/components/ui/ProgressBar'

export function GoalProgressBar({ progress, className }: { progress: number; className?: string }) {
  return <ProgressBar value={progress} showLabel className={className} />
}
