import type { Database } from './database.types'

// Raw DB row types
export type ProfileRow   = Database['public']['Tables']['profiles']['Row']
export type HabitRow     = Database['public']['Tables']['habits']['Row']
export type HabitLogRow  = Database['public']['Tables']['habit_logs']['Row']
export type TaskRow      = Database['public']['Tables']['tasks']['Row']
export type GoalRow      = Database['public']['Tables']['goals']['Row']

// Enum types
export type HabitFrequency = Database['public']['Enums']['habit_frequency']
export type GoalStatus     = Database['public']['Enums']['goal_status']
export type TaskStatus     = Database['public']['Enums']['task_status']
export type TaskPriority   = Database['public']['Enums']['task_priority']

// Domain models
export type Profile  = ProfileRow
export type Habit    = HabitRow
export type HabitLog = HabitLogRow
export type Task     = TaskRow
export type Goal     = GoalRow

// Enriched types (assembled in service layer)
export type HabitWithStats = Habit & {
  current_streak:  number
  longest_streak:  number
  completion_rate: number
  is_logged_today: boolean
  today_log:       HabitLog | null
}

export type GoalWithProgress = Goal & {
  progress:           number
  linked_task_count:  number
  linked_habit_count: number
  days_remaining:     number
}

export type TaskWithGoal = Task & {
  goal: Pick<Goal, 'id' | 'title'> | null
}

export type GoalDetail = GoalWithProgress & {
  tasks:  Task[]
  habits: Habit[]
}

export type ActivityItem =
  | { type: 'habit_log'; timestamp: string; habit_name: string; habit_id: string }
  | { type: 'task_done'; timestamp: string; task_title: string; task_id: string }

export type DashboardData = {
  habit_summary:    { total: number; completed: number }
  tasks_today:      Task[]
  tasks_overdue:    Task[]
  active_goals:     GoalWithProgress[]
  recent_activity:  ActivityItem[]
}
