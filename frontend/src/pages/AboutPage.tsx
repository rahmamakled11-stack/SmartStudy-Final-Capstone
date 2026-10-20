import { motion } from 'framer-motion'
import { Brain, Target, Heart, Users } from 'lucide-react'

const values = [
  { icon: Brain, title: 'Innovation', description: 'We leverage cutting-edge AI to revolutionize how students learn.' },
  { icon: Target, title: 'Excellence', description: 'Committed to helping every student achieve their full potential.' },
  { icon: Heart, title: 'Passion', description: 'Built by students, for students. We understand your challenges.' },
  { icon: Users, title: 'Community', description: 'Growing community of learners supporting each other.' },
]

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">About SmartStudy</h1>
        <p className="text-lg text-muted-foreground">
          Empowering students worldwide with AI-driven study tools since 2024.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <value.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground mb-4">
          At SmartStudy, we believe every student deserves access to powerful learning tools. 
          Our mission is to democratize education technology by providing an all-in-one platform 
          that combines AI-powered planning, focus tools, and analytics.
        </p>
        <p className="text-muted-foreground">
          Whether you are preparing for exams, managing multiple subjects, or trying to build 
          better study habits, SmartStudy is here to help you succeed.
        </p>
      </div>
    </div>
  )
}
