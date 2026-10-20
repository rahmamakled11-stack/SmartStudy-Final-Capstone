import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Target, Flame, BookOpen, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useTaskStore, useSubjectStore, useFocusStore } from '@/store'

export function AnalyticsPage() {
  const { tasks, fetchTasks } = useTaskStore()
  const { subjects, fetchSubjects } = useSubjectStore()
  const { totalSessions, totalHours } = useFocusStore()

  useEffect(() => {
    fetchTasks()
    fetchSubjects()
  }, [fetchTasks, fetchSubjects])

  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const stats = [
    { title: 'Productivity Score', value: `${completionRate}`, change: '+5%', trend: 'up', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Study Hours', value: `${totalHours.toFixed(1)}`, change: '+12%', trend: 'up', icon: Clock, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Focus Sessions', value: `${totalSessions}`, change: '+8%', trend: 'up', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Tasks Completed', value: `${completedTasks}`, change: `${tasks.length > 0 ? Math.round((completedTasks/tasks.length)*100) : 0}%`, trend: 'up', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your study performance and progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card-strong hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge variant="success" className="text-xs">{stat.change}</Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={subject.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subject.progress}% • {subject.totalHours}h studied
                    </div>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
              {subjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No subjects yet. Add subjects to see performance analytics.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-5 w-5 text-orange-500" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">5</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">23</div>
                <div className="text-sm text-muted-foreground">Longest Streak</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500">142</div>
                <div className="text-sm text-muted-foreground">Total Days</div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }, (_, i) => {
                const isActive = i < 23
                return (
                  <div
                    key={i}
                    className={`h-8 rounded-md ${
                      isActive ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-muted'
                    }`}
                    title={isActive ? 'Study day' : 'No study'}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Completion */}
      <Card className="glass-card-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Task Completion Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">{tasks.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">{tasks.filter(t => t.status === 'todo').length}</div>
              <div className="text-sm text-muted-foreground">To Do</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
