import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: ['3 Subjects', 'Basic Task Management', 'Focus Timer', 'Weekly Analytics', 'Community Support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For serious students',
    features: ['Unlimited Subjects', 'AI Study Planner', 'Advanced Analytics', 'AI Chat Assistant', 'Priority Support', 'Export Reports'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Student',
    price: '$5',
    period: '/month',
    description: 'Discounted for students',
    features: ['Unlimited Subjects', 'AI Study Planner', 'Basic Analytics', 'AI Chat Assistant', 'Email Support'],
    cta: 'Student Plan',
    popular: false,
  },
]

export function PricingPage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your study needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative p-6 rounded-xl border ${
              plan.popular
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link to={isAuthenticated ? '/settings' : '/register'} className="block">
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
