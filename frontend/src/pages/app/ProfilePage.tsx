import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Crown, BookOpen, Target, Clock, Award, Edit3, Camera } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore, useSubjectStore, useTaskStore } from '@/store'
import { formatDate } from '@/lib/utils'

export function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { subjects } = useSubjectStore()
  const { tasks } = useTaskStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')

  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const totalStudyHours = subjects.reduce((acc, s) => acc + s.totalHours, 0)

  const achievements = [
    { icon: Award, title: 'First Steps', description: 'Completed your first task', unlocked: completedTasks >= 1 },
    { icon: Target, title: 'Goal Crusher', description: 'Completed 10 tasks', unlocked: completedTasks >= 10 },
    { icon: Clock, title: 'Time Master', description: 'Studied for 50 hours', unlocked: totalStudyHours >= 50 },
    { icon: BookOpen, title: 'Subject Expert', description: 'Mastered 3 subjects', unlocked: subjects.filter((s) => s.progress >= 90).length >= 3 },
    { icon: Crown, title: 'Top Performer', description: '90%+ average', unlocked: subjects.length > 0 && subjects.reduce((a, s) => a + s.progress, 0) / subjects.length >= 90 },
  ]

  const handleSave = async () => {
    await updateUser({ name: editName })
    setIsEditing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card-strong lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-2xl bg-primary/10">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-center"
                />
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSave}>Save</Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{user?.email}</p>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </>
            )}

            <div className="mt-6 pt-6 border-t border-border space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Crown className="h-4 w-4 text-yellow-500" />
                <Badge variant="outline" className="capitalize">{user?.subscription || 'free'} Plan</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Subjects', value: subjects.length, icon: BookOpen },
              { label: 'Tasks Done', value: completedTasks, icon: Target },
              { label: 'Study Hours', value: Math.round(totalStudyHours), icon: Clock },
              { label: 'Streak', value: user?.streak || 0, icon: Award },
            ].map((stat) => (
              <Card key={stat.label} className="glass-card-strong">
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="text-base">Subject Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
              {subjects.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No subjects yet. Add some to track progress!</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="text-base">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.title}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      ach.unlocked
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-muted/30 opacity-60'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      ach.unlocked ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <ach.icon className={`h-5 w-5 ${ach.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{ach.title}</div>
                      <div className="text-xs text-muted-foreground">{ach.description}</div>
                    </div>
                    {ach.unlocked && <Badge className="ml-auto text-[10px]">Unlocked</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
