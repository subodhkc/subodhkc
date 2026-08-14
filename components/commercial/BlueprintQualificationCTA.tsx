'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'

interface BlueprintQualificationCTAProps {
  title: string
  description: string
}

const qualificationQuestions = [
  { key: 'workflow', label: 'What workflow do you want evaluated?', placeholder: 'e.g., customer onboarding, invoice processing, content review' },
  { key: 'current_tools', label: 'What tools or systems are involved?', placeholder: 'e.g., HubSpot, QuickBooks, Google Sheets, internal app' },
  { key: 'team_size', label: 'How many people touch this workflow?', placeholder: 'e.g., 2-5, 6-10, 10+' },
  { key: 'goal', label: 'What outcome would make this Blueprint valuable?', placeholder: 'e.g., reduce manual hours, eliminate errors, scale without hiring' },
]

export function BlueprintQualificationCTA({ title, description }: BlueprintQualificationCTAProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const filled = Object.entries(responses).filter(([, v]) => v.trim())
    if (filled.length < 3) {
      setError('Please answer at least 3 of the 4 questions.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/commercial/blueprint/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualificationResponses: responses }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to start checkout')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section className="page-padding">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12 lg:p-16">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>

            {!showForm ? (
              <Button size="lg" className="group" onClick={() => setShowForm(true)}>
                Start My Blueprint — $500
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {qualificationQuestions.map(q => (
                  <div key={q.key}>
                    <label className="text-sm font-medium block mb-1.5">{q.label}</label>
                    <input
                      type="text"
                      value={responses[q.key] || ''}
                      onChange={e => setResponses(prev => ({ ...prev, [q.key]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-3">
                  <Button type="submit" size="lg" disabled={loading} className="group">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Checkout — $500
                    {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </Button>
                  <Button type="button" size="lg" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Qualification helps ensure your workflow fits the fixed-scope Blueprint before payment.
                </p>
              </form>
            )}
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
