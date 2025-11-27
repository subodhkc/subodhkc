'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // TODO: Integrate with your email service (Resend, ConvertKit, etc.)
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      setMessage('Success! Check your email to confirm your subscription.')
      setEmail('')
      
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={status === 'loading'}
            size="sm"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        {message && (
          <p className={`text-sm mt-2 flex items-center gap-2 ${
            status === 'success' ? 'text-primary' : 'text-destructive'
          }`}>
            {status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-8 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">AI Insights & Compliance Updates</h3>
        <p className="text-muted-foreground mb-6">
          Get weekly insights on AI governance, compliance frameworks, and enterprise implementation strategies. 
          Join 1,000+ technical leaders staying ahead of AI regulations.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={status === 'loading'}
            className="sm:w-auto"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        
        {message && (
          <p className={`text-sm mt-4 flex items-center justify-center gap-2 ${
            status === 'success' ? 'text-primary' : 'text-destructive'
          }`}>
            {status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          No spam. Unsubscribe anytime. Your email is safe with us.
        </p>
      </div>
    </div>
  )
}
