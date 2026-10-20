import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, Brain, Moon, Clock, Flame, Trophy, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useFocusStore } from '@/store'

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'from-blue-500 to-cyan-500', icon: Brain },
  short_break: { label: 'Short Break', duration: 5 * 60, color: 'from-green-500 to-emerald-500', icon: Coffee },
  long_break: { label: 'Long Break', duration: 15 * 60, color: 'from-purple-500 to-pink-500', icon: Moon },
}

export function FocusPage() {
  const { isRunning, timeRemaining, mode, startSession, pauseSession, endSession, resetTimer, tick, getTotalSessions, getTotalHours } = useFocusStore()
  const [activeMode, setActiveMode] = useState<'focus' | 'short_break' | 'long_break'>('focus')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick])

  const currentMode = MODES[mode]
  const progress = ((currentMode.duration - timeRemaining) / currentMode.duration) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleStart = () => startSession(activeMode)
  const handleModeChange = (newMode: 'focus' | 'short_break' | 'long_break') => {
    setActiveMode(newMode)
    if (!isRunning) resetTimer()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Focus Timer</h1>
        <p className="text-muted-foreground mt-1">Stay focused and productive with Pomodoro</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card-strong">
            <CardContent className="p-8">
              <div className="flex justify-center gap-2 mb-8">
                {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                  <Button
                    key={m}
                    variant={activeMode === m ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange(m)}
                    className={activeMode === m ? `bg-gradient-to-r ${MODES[m].color}` : ''}
                  >
                    {(() => { const Icon = MODES[m].icon; return <Icon className="mr-2 h-4 w-4" />; })()}
                    {MODES[m].label}
                  </Button>
                ))}
              </div>

              <div className="text-center mb-8">
                <motion.div
                  className={`inline-flex items-center justify-center h-64 w-64 rounded-full bg-gradient-to-br ${currentMode.color} p-1`}
                  animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="h-full w-full rounded-full bg-card flex flex-col items-center justify-center">
                    <currentMode.icon className="h-8 w-8 mb-2 text-primary" />
                    <div className="text-6xl font-bold tabular-nums">{formatTime(timeRemaining)}</div>
                    <div className="text-sm text-muted-foreground mt-2">{isRunning ? 'Focusing...' : 'Ready to start'}</div>
                  </div>
                </motion.div>
              </div>

              <Progress value={progress} className="h-2 mb-8" />

              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button size="lg" className={`bg-gradient-to-r ${currentMode.color} text-white px-8`} onClick={handleStart}>
                    <Play className="mr-2 h-5 w-5" />Start
                  </Button>
                ) : (
                  <>
                    <Button size="lg" variant="outline" onClick={pauseSession}>
                      <Pause className="mr-2 h-5 w-5" />Pause
                    </Button>
                    <Button size="lg" variant="outline" onClick={endSession}>
                      <SkipForward className="mr-2 h-5 w-5" />Skip
                    </Button>
                  </>
                )}
                <Button size="lg" variant="ghost" onClick={resetTimer}>
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-card-strong">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Today's Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Sessions</span>
                </div>
                <span className="font-semibold">{getTotalSessions()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Focus Time</span>
                </div>
                <span className="font-semibold">{getTotalHours().toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Productivity</span>
                </div>
                <Badge variant="outline">High</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
