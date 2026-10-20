import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Target, Clock, Zap, BookOpen, BarChart3, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Brain, title: 'AI Study Planner', description: 'Generate personalized study schedules based on your subjects and goals.' },
  { icon: Target, title: 'Smart Goal Tracking', description: 'Set and track academic goals with intelligent progress monitoring.' },
  { icon: Clock, title: 'Focus Timer', description: 'Pomodoro-style timer with break reminders to maximize productivity.' },
  { icon: Zap, title: 'AI Assistant', description: 'Get instant help with study questions and concept explanations.' },
  { icon: BookOpen, title: 'Subject Management', description: 'Organize all your subjects with progress tracking and analytics.' },
  { icon: BarChart3, title: 'Performance Analytics', description: 'Detailed insights into your study habits and academic performance.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Medical Student', text: 'SmartStudy helped me organize my medical school preparation. The AI planner is incredible!' },
  { name: 'James K.', role: 'Engineering Student', text: 'The focus timer and analytics helped me improve my GPA by 15% this semester.' },
  { name: 'Emily R.', role: 'High School Senior', text: 'Best study tool I have ever used. The AI chat feature is like having a tutor 24/7.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                AI-Powered Study Management
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Study Smarter,{' '}
                <span className="gradient-text">Not Harder</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                The all-in-one study platform that uses AI to create personalized schedules, 
                track your progress, and help you achieve academic excellence.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you organize, focus, and succeed in your academic journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border hover-lift"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Students</h2>
            <p className="text-muted-foreground">See what our users say about SmartStudy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Studies?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of students who are already studying smarter with AI.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
              Start Your Free Journey
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
