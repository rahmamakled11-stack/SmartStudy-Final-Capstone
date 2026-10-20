import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api'

export function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    apiClient.get('/admin/analytics').then((res) => setData(res.data))
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Detailed platform metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tasks Activity (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.tasksByDay ? (
              <div className="space-y-3">
                {data.tasksByDay.map((day: any) => (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-sm w-20">{day.date.slice(5)}</span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary/60" style={{ width: `${(day.completed / Math.max(day.created, 1)) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {day.completed}/{day.created}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5 text-primary" />
              Subscription Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.subscriptionBreakdown ? (
              <div className="space-y-3">
                {data.subscriptionBreakdown.map((sub: any) => (
                  <div key={sub.plan} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                    <span className="font-medium capitalize">{sub.plan}</span>
                    <Badge variant="outline">{sub.count} users</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card-strong lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" />
              Focus Sessions (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.focusByDay ? (
              <div className="flex items-end gap-2 h-48">
                {data.focusByDay.map((day: any) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-muted-foreground mb-1">{day.hours}h</div>
                    <div
                      className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-colors"
                      style={{ height: `${Math.min(day.hours * 20, 160)}px` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{day.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
