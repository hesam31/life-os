'use client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { HabitRing } from './HabitRing'
import { TodaysTasks } from './TodaysTasks'
import { ActiveGoalsSummary } from './ActiveGoalsSummary'
import { ActivityFeed } from './ActivityFeed'
import type { DashboardData, Profile } from '@/types/models'

export function DashboardView({ data, profile }: { data: DashboardData; profile: Profile | null }) {
  const hour    = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name     = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{greeting}, {name} 👋</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Here's your day at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Habits */}
        <Card>
          <CardHeader>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Today's habits</span>
          </CardHeader>
          <CardBody>
            <HabitRing summary={data.habit_summary} />
          </CardBody>
        </Card>

        {/* Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Tasks</span>
          </CardHeader>
          <CardBody>
            <TodaysTasks tasksToday={data.tasks_today} tasksOverdue={data.tasks_overdue} />
          </CardBody>
        </Card>

        {/* Goals */}
        <Card className="md:col-span-2">
          <CardHeader>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Active goals</span>
          </CardHeader>
          <CardBody>
            <ActiveGoalsSummary goals={data.active_goals} />
          </CardBody>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Recent activity</span>
          </CardHeader>
          <CardBody>
            <ActivityFeed items={data.recent_activity} />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
