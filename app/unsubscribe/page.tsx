'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <>
      <Hero
        title="Unsubscribe"
        subtitle="We respect your inbox. Unsubscribe from our newsletter at any time."
      />

      <Section>
        <div className="max-w-md mx-auto">
          {status === 'success' ? (
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">You&apos;ve been unsubscribed</h2>
                <p className="text-muted-foreground text-sm">
                  {email} will no longer receive newsletters from subodhkc.com.
                  You can re-subscribe anytime from the website.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Unsubscribe from Newsletter</CardTitle>
                <CardDescription>
                  Enter your email address below to stop receiving AI Insights & Compliance Updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUnsubscribe} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    This will permanently remove you from our mailing list.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>
    </>
  )
}
