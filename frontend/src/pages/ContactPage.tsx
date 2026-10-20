import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions? We would love to hear from you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">support@smartstudy.com</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Phone</h3>
          <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Location</h3>
          <p className="text-sm text-muted-foreground">San Francisco, CA</p>
        </div>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-xl bg-card border border-border"
        >
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">We will get back to you within 24 hours.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input placeholder="How can we help?" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea placeholder="Tell us more..." rows={5} required />
          </div>
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </form>
      )}
    </div>
  )
}
