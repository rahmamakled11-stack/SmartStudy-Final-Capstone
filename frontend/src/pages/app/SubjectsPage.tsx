import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit3,
  TrendingUp,
  Clock,
  Target,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
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
import { useSubjectStore } from '@/store'
import { cn, getDifficultyColor } from '@/lib/utils'
import type { Subject, Difficulty } from '@/types'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export function SubjectsPage() {
  const { subjects, createSubject, updateSubject, deleteSubject } = useSubjectStore()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  const [formData, setFormData] = useState<{
    name: string
    color: string
    difficulty: Difficulty
    description: string
    weeklyHours: number
  }>({
    name: '',
    color: '#3b82f6',
    difficulty: 'medium',
    description: '',
    weeklyHours: 5,
  })

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3b82f6',
      difficulty: 'medium',
      description: '',
      weeklyHours: 5,
    })
    setEditingSubject(null)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return
    if (editingSubject) {
      await updateSubject(editingSubject.id, formData)
    } else {
      await createSubject(formData)
    }
    setIsAddOpen(false)
    resetForm()
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      color: subject.color,
      difficulty: subject.difficulty,
      description: subject.description || '',
      weeklyHours: subject.weeklyHours,
    })
    setIsAddOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage your study subjects</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-purple-600" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="Subject name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        formData.color === c ? 'border-white scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setFormData({ ...formData, difficulty: d })}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                        formData.difficulty === d
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekly Hours Goal</label>
                <Input
                  type="number"
                  min={1}
                  max={40}
                  value={formData.weeklyHours}
                  onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Brief description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600" onClick={handleSubmit}>
                {editingSubject ? 'Save Changes' : 'Add Subject'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredSubjects.map((subject) => (
            <motion.div
              key={subject.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="glass-card-strong hover-lift group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: subject.color + '20' }}
                      >
                        <BookOpen className="h-5 w-5" style={{ color: subject.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{subject.name}</CardTitle>
                        <Badge variant="outline" className={cn('text-xs', getDifficultyColor(subject.difficulty))}>
                          {DIFFICULTY_LABELS[subject.difficulty]}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(subject)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteSubject(subject.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-accent/50">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">{subject.totalHours}h</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/50">
                      <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">{subject.tasksCount}</div>
                      <div className="text-xs text-muted-foreground">Tasks</div>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/50">
                      <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">{subject.completedTasks}</div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
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
