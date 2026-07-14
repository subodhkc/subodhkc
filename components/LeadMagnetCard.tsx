'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'

interface LeadMagnetCardProps {
  title?: string
  description?: string
  resourceName?: string
}

export function LeadMagnetCard({
  title = 'Free AI Governance & Compliance Framework Guide',
  description = 'Get a practical guide covering the Cognitive Systems Management (CSM) Framework, 5 patent-pending methodologies, and enterprise implementation strategies for AI governance and compliance.',
  resourceName = 'AI Governance & Compliance Framework Guide',
}: LeadMagnetCardProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, resourceName }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send resource')
      }

      setSubmitted(true)
      setName('')
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium mb-1">Check your inbox!</p>
            <p className="text-sm text-muted-foreground">
              The {resourceName} is on its way to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <Button type="submit" size="sm" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : `Get the ${resourceName}`}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
