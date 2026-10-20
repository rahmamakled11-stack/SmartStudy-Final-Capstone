import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import apiClient from '@/lib/api'
import { useTaskStore } from '@/store'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const { tasks } = useTaskStore()

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get(`/calendar/events?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`)
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter((e: any) => e.date === dateStr)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const calendarDays = []

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 md:h-32" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayEvents = getEventsForDate(dateStr)
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

      calendarDays.push(
        <div
          key={day}
          className={`h-24 md:h-32 border border-border p-2 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
            isToday ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => {
            setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
            setIsAddDialogOpen(true)
          }}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event: any) => (
              <div
                key={event.id}
                className="text-xs px-1.5 py-0.5 rounded truncate text-white"
                style={{ backgroundColor: event.color }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    return calendarDays
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your study schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[180px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button className="bg-gradient-to-r from-primary to-purple-600" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Event title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" defaultValue={selectedDate?.toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input type="time" />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card-strong">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 5).map((event: any) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/50">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: event.color + '20' }}
                >
                  <BookOpen className="h-5 w-5" style={{ color: event.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.date} at {event.time}</div>
                </div>
                <Badge variant="outline" style={{ borderColor: event.color, color: event.color }}>
                  {event.type}
                </Badge>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events this month</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
