import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  ArrowRight,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTaskStore, useSubjectStore } from '@/store'
import { cn, getPriorityColor, formatDate } from '@/lib/utils'
import type { Task, Priority, TaskStatus } from '@/types'

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent']
const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'completed', 'cancelled']

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask } = useTaskStore()
  const { subjects } = useSubjectStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [formData, setFormData] = useState<{
    title: string
    description: string
    subjectId: string
    priority: Priority
    status: TaskStatus
    deadline: string
    estimatedTime: number
    tags: string
  }>({
    title: '',
    description: '',
    subjectId: '',
    priority: 'medium',
    status: 'todo',
    deadline: '',
    estimatedTime: 60,
    tags: '',
  })

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: subjects[0]?.id || '',
      priority: 'medium',
      status: 'todo',
      deadline: new Date().toISOString().split('T')[0],
      estimatedTime: 60,
      tags: '',
    })
    setEditingTask(null)
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.subjectId) return
    const data = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }
    if (editingTask) {
      await updateTask(editingTask.id, data)
    } else {
      await createTask(data)
    }
    setIsAddOpen(false)
    resetForm()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      subjectId: task.subjectId,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline.split('T')[0],
      estimatedTime: task.estimatedTime,
      tags: task.tags.join(', '),
    })
    setIsAddOpen(true)
  }

  const toggleStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed'
    await updateTask(task.id, { status: newStatus })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your study tasks</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-purple-600" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => setFormData({ ...formData, priority: v as Priority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as TaskStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Time (minutes)</label>
                <Input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  placeholder="exam, review, chapter-1"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600" onClick={handleSubmit}>
                {editingTask ? 'Save Changes' : 'Add Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className={cn(
                'glass-card-strong transition-all',
                task.status === 'completed' && 'opacity-60'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStatus(task)}
                      className="mt-1 shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          'font-medium truncate',
                          task.status === 'completed' && 'line-through text-muted-foreground'
                        )}>
                          {task.title}
                        </h4>
                        <Badge variant="outline" className={cn('text-xs shrink-0', getPriorityColor(task.priority))}>
                          {PRIORITY_LABELS[task.priority]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(task.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedTime}m
                        </span>
                        {task.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {task.tags.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
