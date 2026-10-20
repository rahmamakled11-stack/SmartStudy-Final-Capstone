import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Trash2, Info, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotificationStore } from '@/store'
import { Link } from 'react-router-dom'

const iconMap = {
  info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle,
}

const colorMap = {
  info: 'text-blue-500 bg-blue-500/10', success: 'text-green-500 bg-green-500/10',
  warning: 'text-yellow-500 bg-yellow-500/10', error: 'text-red-500 bg-red-500/10',
}

export function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()

  useEffect(() => { fetchNotifications() }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="mr-2 h-4 w-4" />Clear all
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="glass-card-strong">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type]
              return (
                <motion.div key={notification.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className={`glass-card-strong transition-colors ${!notification.read ? 'border-primary/30 bg-primary/5' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[notification.type]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {!notification.read && <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-primary-foreground" /></Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              {notification.actionUrl && (
                                <Link to={notification.actionUrl}>
                                  <Button variant="ghost" size="sm" className="h-7 text-primary">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                                </Link>
                              )}
                              {!notification.read && <Button variant="ghost" size="sm" className="h-7" onClick={() => markAsRead(notification.id)}><Check className="h-3 w-3 mr-1" />Mark read</Button>}
                              <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => deleteNotification(notification.id)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
