import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckSquare, Clock, BookOpen, Target, Flame, TrendingUp,
  ArrowRight, AlertTriangle, Sparkles, Brain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore, useSubjectStore, useTaskStore, useFocusStore } from '@/store'
import { getPriorityColor, getStatusColor, formatDate } from '@/lib/utils'

export function DashboardPage() {
  const { user } = useAuthStore()
  const { subjects, fetchSubjects } = useSubjectStore()
  const { tasks, fetchTasks } = useTaskStore()
  const { totalSessions, totalHours } = useFocusStore()

  useEffect(() => {
    fetchSubjects()
    fetchTasks()
  }, [fetchSubjects, fetchTasks])

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed' && new Date(t.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  const weakSubjects = subjects.filter((s) => s.progress < 70)
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const stats = [
    { title: 'Tasks Done', value: `${completionRate}%`, icon: CheckSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Focus Hours', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Subjects', value: subjects.length.toString(), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Streak', value: `${user?.streak || 0} days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name || 'Student'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card-strong hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card-strong">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
              <Link to="/tasks">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming tasks. You are all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-accent/50">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: task.subjectColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.subjectName} • Due {formatDate(task.deadline)}</p>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weak Subjects */}
        <div className="space-y-4">
          <Card className="glass-card-strong border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Weak Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weakSubjects.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All subjects on track!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weakSubjects.slice(0, 4).map((subject) => (
                    <div key={subject.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
              <Link to="/planner">
                <Button className="w-full mt-4 bg-gradient-to-r from-primary to-purple-600">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Study Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">Focus on your weakest subjects first for maximum improvement.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">Study in 25-minute focused sessions with 5-minute breaks.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Flame className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">Maintain your daily streak to build consistent study habits.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
