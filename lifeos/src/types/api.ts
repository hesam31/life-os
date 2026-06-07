import type { HabitFrequency, GoalStatus, TaskStatus, TaskPriority } from './models'

// ── Habit requests ────────────────────────────────────────────────
export type CreateHabitRequest = {
  name:          string
  description?:  string
  frequency:     HabitFrequency
  custom_days?:  boolean[]
  target_value?: number
  unit?:         string
  goal_id?:      string
}
export type UpdateHabitRequest = Partial<CreateHabitRequest>
export type LogHabitRequest    = { completed_value: number; note?: string }

// ── Task requests ─────────────────────────────────────────────────
export type CreateTaskRequest = {
  title:        string
  description?: string
  priority?:    TaskPriority
  due_date?:    string
  goal_id?:     string
}
export type UpdateTaskRequest = Partial<CreateTaskRequest> & { status?: TaskStatus }

// ── Goal requests ─────────────────────────────────────────────────
export type CreateGoalRequest = {
  title:        string
  description?: string
  target_date:  string
}
export type UpdateGoalRequest = Partial<CreateGoalRequest> & { status?: GoalStatus }

// ── Task filter params ────────────────────────────────────────────
export type TaskFilters = {
  status?:   TaskStatus
  priority?: TaskPriority
}

// ── API response envelope ─────────────────────────────────────────
export type ApiSuccess<T> = {
  data: T
  meta?: { total?: number; page?: number; per_page?: number }
}

export type ApiError = {
  error: { code: string; message: string; field?: string }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ── API error codes ───────────────────────────────────────────────
export const API_ERROR_CODES = {
  UNAUTHORIZED:     'UNAUTHORIZED',
  FORBIDDEN:        'FORBIDDEN',
  NOT_FOUND:        'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT:         'CONFLICT',
  INTERNAL_ERROR:   'INTERNAL_ERROR',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]
