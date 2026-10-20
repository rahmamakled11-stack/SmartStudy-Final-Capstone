import { motion } from 'framer-motion'
import { Brain, Target, Clock, Zap, BookOpen, BarChart3, Calendar, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Study Planner',
    description: 'Generate personalized weekly schedules based on your subjects, weak areas, and available time.',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set academic goals and track your progress with visual indicators and milestone celebrations.',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: Clock,
    title: 'Focus Timer',
    description: 'Pomodoro technique with customizable focus and break intervals. Track your daily focus hours.',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: Zap,
    title: 'AI Study Assistant',
    description: 'Chat with AI to get explanations, practice questions, and study tips anytime.',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: BookOpen,
    title: 'Subject Management',
    description: 'Organize subjects with color coding, progress tracking, and task association.',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics on study hours, task completion, and productivity trends.',
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Study Calendar',
    description: 'Visual calendar with all your tasks, study sessions, and deadlines in one view.',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    icon: MessageSquare,
    title: 'Smart Notifications',
    description: 'Get reminded about upcoming deadlines, study sessions, and achievements.',
    color: 'bg-red-500/10 text-red-500',
  },
]

export function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Powerful Features</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to organize your studies, stay focused, and achieve your academic goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border hover-lift"
          >
            <div className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
