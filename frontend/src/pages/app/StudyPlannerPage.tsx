import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, BookOpen, Clock, Target, Calendar, ChevronRight,
  CheckCircle2, Brain, ArrowRight, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useSubjectStore } from '@/store'
import apiClient from '@/lib/api'

export function StudyPlannerPage() {
  const { subjects, fetchSubjects } = useSubjectStore()
  const [step, setStep] = useState(1)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [weakSubjects, setWeakSubjects] = useState<string[]>([])
  const [availableHours, setAvailableHours] = useState(20)
  const [generated, setGenerated] = useState(false)
  const [schedule, setSchedule] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleWeak = (id: string) => {
    setWeakSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.post('/planner/generate', {
        selectedSubjects,
        weakSubjects,
        availableHours,
      })
      setSchedule(response.data)
      setGenerated(true)
    } catch (error) {
      console.error('Failed to generate schedule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setStep(1)
    setSelectedSubjects([])
    setWeakSubjects([])
    setAvailableHours(20)
    setGenerated(false)
    setSchedule(null)
  }

  if (generated && schedule) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Study Plan</h1>
            <p className="text-muted-foreground mt-1">AI-generated personalized schedule</p>
          </div>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Generate New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedule.schedule?.map((day: any, index: number) => (
                  <div key={index} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold mb-2">{day.day}</h4>
                    <div className="space-y-2">
                      {day.sessions?.map((session: any, sIndex: number) => (
                        <div
                          key={sIndex}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            session.type === 'break' ? 'bg-accent/30' : 'bg-accent/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={session.type === 'break' ? 'secondary' : 'default'}>
                              {session.type}
                            </Badge>
                            <span className="font-medium">{session.subjectName}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{session.startTime} - {session.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass-card-strong border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="text-base">Study Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {subjects.filter(s => selectedSubjects.includes(s.id)).map((subject) => (
                  <div key={subject.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {weakSubjects.includes(subject.id) ? '8h/week' : '5h/week'}
                      </span>
                    </div>
                    <Progress
                      value={weakSubjects.includes(subject.id) ? 80 : 50}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          AI Study Planner
        </div>
        <h1 className="text-3xl font-bold mb-2">Generate Your Study Plan</h1>
        <p className="text-muted-foreground">Follow the steps to create a personalized schedule</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Select Your Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedSubjects.includes(subject.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: subject.color + '20' }}
                  >
                    <BookOpen className="h-4 w-4" style={{ color: subject.color }} />
                  </div>
                  <span className="font-medium">{subject.name}</span>
                  {selectedSubjects.includes(subject.id) && (
                    <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
            <Button
              className="w-full mt-6 bg-gradient-to-r from-primary to-purple-600"
              disabled={selectedSubjects.length === 0}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Identify Weak Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Select subjects you find challenging. We will allocate more study time to these.
            </p>
            <div className="space-y-3">
              {subjects
                .filter((s) => selectedSubjects.includes(s.id))
                .map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => toggleWeak(subject.id)}
                    className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all ${
                      weakSubjects.includes(subject.id)
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-border hover:border-red-500/30'
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: subject.color + '20' }}
                    >
                      <BookOpen className="h-4 w-4" style={{ color: subject.color }} />
                    </div>
                    <span className="font-medium">{subject.name}</span>
                    {weakSubjects.includes(subject.id) && (
                      <Badge variant="destructive" className="ml-auto">Weak Area</Badge>
                    )}
                  </button>
                ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Available Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              How many hours per week can you dedicate to studying?
            </p>
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-primary">{availableHours}</span>
              <span className="text-xl text-muted-foreground"> hours/week</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              value={availableHours}
              onChange={(e) => setAvailableHours(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>5h</span>
              <span>40h</span>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
