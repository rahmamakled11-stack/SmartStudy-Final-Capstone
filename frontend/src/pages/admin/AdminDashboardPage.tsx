import { motion } from 'framer-motion'
import { Users, BookOpen, Target, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/admin/dashboard').then((res) => {
      setStats(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { title: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'New Users (30d)', value: stats?.stats?.newUsers || 0, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Tasks', value: stats?.stats?.totalTasks || 0, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Pro Users', value: stats?.stats?.proUsers || 0, icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="glass-card-strong">
            <CardContent className="p-6">
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            User Growth (30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.dailyGrowth ? (
            <div className="h-64 flex items-end gap-1">
              {stats.dailyGrowth.map((day: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-colors"
                    style={{ height: `${Math.max((day.users / Math.max(...stats.dailyGrowth.map((d: any) => d.users))) * 200, 4)}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground rotate-45 origin-left translate-y-2">
                    {day.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Loading data...</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
