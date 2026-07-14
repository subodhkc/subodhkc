'use client'

import { useState } from 'react'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [error, setSubscribeError] = useState<string | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscribeError(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSubscribed(true)
      setEmail('')
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <Section subtitle="Newsletter" title="Stay Ahead on AI Governance" className="bg-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        {subscribed ? (
          <>
            <h3 className="text-2xl font-semibold mb-4">You&apos;re In!</h3>
            <p className="text-muted-foreground">
              Join 500+ practitioners navigating AI compliance at scale. Watch your inbox for insights on AI governance, compliance, and enterprise AI implementation.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg text-muted-foreground mb-6">
              Irregular updates on AI governance, compliance frameworks, and what&apos;s actually working in enterprise AI implementation. No spam. No fluff.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" disabled={isSubscribing}>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Join 500+ practitioners navigating AI compliance at scale
            </p>
          </>
        )}
      </div>
    </Section>
  )
}
