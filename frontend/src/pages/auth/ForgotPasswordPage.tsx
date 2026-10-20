import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-muted-foreground mt-2">Enter your email to receive reset instructions</p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <p className="text-sm text-muted-foreground">
            If an account exists with {email}, you will receive password reset instructions.
          </p>
          <Link to="/login" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>

          <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </form>
      )}
    </motion.div>
  )
}
