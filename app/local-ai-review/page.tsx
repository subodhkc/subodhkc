'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PhoneMissed,
  Repeat,
  ShieldAlert,
  Phone,
  Code,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  TrendingUp,
} from 'lucide-react'

const BUSINESS_CHECKS = [
  'Customers sometimes reach voicemail during business hours.',
  'After-hours callers must wait until the next day.',
  'Leads, appointments, or follow-ups are handled manually.',
  'Staff spends an hour or more each day on repetitive work.',
  'Important knowledge depends on one or two employees.',
  'AI is used without written rules or a review process.',
]

const BUSINESS_TYPES = [
  'Home Services',
  'Professional Services',
  'Clinic / Healthcare',
  'Property Management',
  'Retail',
  'Restaurant',
  'Consultant',
  'Sales Team',
  'Other',
]

const TEAM_SIZES = ['Just me', '2-5', '6-15', '16-50', '50+']

const PROBLEM_AREAS = [
  'Missed calls / slow response',
  'Repetitive staff work',
  'AI without clear rules',
  'Not sure yet',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const TIME_SLOTS = [
  'Morning (8-11 AM CT)',
  'Midday (11 AM-1 PM CT)',
  'Afternoon (1-4 PM CT)',
  'Late afternoon (4-6 PM CT)',
]

const REVIEW_BENEFITS = [
  'A one-page opportunity snapshot',
  'Cost clarity before committing',
  'Whether Kestrel, custom AI, or HAIEC fits',
  'A head start without overbuilding',
]

export default function LocalAIReviewPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<string>('organic')

  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    businessType: '',
    teamSize: '',
    businessChecks: [] as string[],
    problemArea: '',
    firstProblem: '',
    preferredDays: [] as string[],
    preferredTimeSlot: '',
    additionalInfo: '',
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref === 'qr') setSource('qr-code')
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCheck = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      businessChecks: prev.businessChecks.includes(item)
        ? prev.businessChecks.filter((c) => c !== item)
        : [...prev.businessChecks, item],
    }))
  }

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }))
  }

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.businessName.trim()) return false
      if (!formData.name.trim()) return false
      if (!formData.email.trim()) return false
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return false
      if (!formData.phone.trim()) return false
      if (formData.phone.replace(/\D/g, '').length < 10) return false
      if (!formData.businessType) return false
      if (!formData.teamSize) return false
      return true
    }
    if (currentStep === 2) {
      if (!formData.problemArea) return false
      if (!formData.firstProblem.trim()) return false
      return true
    }
    if (currentStep === 3) {
      if (formData.preferredDays.length === 0) return false
      if (!formData.preferredTimeSlot) return false
      return true
    }
    return false
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setError(null)
      setStep((prev) => Math.min(prev + 1, 3))
    } else {
      setError('Please fill in all required fields before continuing.')
    }
  }

  const handleBack = () => {
    setError(null)
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) {
      setError('Please select at least one preferred day and a time slot.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/local-ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please text 682-224-9904 or email subodhkc@subodhkc.com and mention "Local AI Review."'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkCount = formData.businessChecks.length
  const firstName = formData.name.split(' ')[0] || 'there'
  const stepValid = validateStep(step)

  return (
    <>
      {/* Hero */}
      <section className="page-padding pt-16 md:pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="section-container relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="text-sm font-medium text-primary">HEB Chamber Member</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Practical AI for Local Businesses
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Capture more opportunities. Save staff time. Use AI with better control.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Your business probably doesn&apos;t need a large AI transformation. It may need one costly problem solved,
              one result measured, and one practical first step.
            </p>
            <p className="text-lg font-semibold text-accent">
              Start with one costly problem. Measure one result.
            </p>
            <div className="text-sm text-muted-foreground pt-2">
              Dallas-Fort Worth &middot; Subodh KC &mdash; Local AI Advisor, Founder of Kestrel Voice, Co-founder of HAIEC
            </div>
            <a
              href="#request-review"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors"
            >
              Request your review <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Where is your business losing value? */}
      <Section subtitle="Common Patterns" title="Where is your business losing value?">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: PhoneMissed,
              title: 'Missed calls and slow response',
              items: ['After-hours inquiries', 'Peak-hour overflow', 'Delayed lead follow-up'],
            },
            {
              icon: Repeat,
              title: 'Repetitive work',
              items: ['Manual intake', 'Document searching', 'Routine reporting'],
            },
            {
              icon: ShieldAlert,
              title: 'AI without clear rules',
              items: ['Unclear data access', 'No review process', 'Unknown Texas or industry duties'],
            },
          ].map((card, i) => {
            const Icon = card.icon
            return (
              <Card key={i}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-accent mt-0.5">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Section>

      {/* What could the opportunity be worth? */}
      <Section
        subtitle="Illustrative Examples"
        title="What could the opportunity be worth?"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">$20,000</div>
              <p className="text-sm font-medium text-foreground mb-3">Illustrative annual opportunity</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                5 calls &times; 20% conversion &times; $400 first sale &times; 50 weeks. Use your own numbers.
              </p>
              <p className="text-sm text-muted-foreground mt-3">Five missed calls per week</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">250 hours</div>
              <p className="text-sm font-medium text-foreground mb-3">About $7,500 in staff time at $30/hour</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Before delays, errors, and higher-value work that was postponed.
              </p>
              <p className="text-sm text-muted-foreground mt-3">One repetitive hour per day</p>
            </CardContent>
          </Card>
        </div>
        <div className="max-w-3xl mx-auto mt-6">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            Illustrative financial examples are provided only to help businesses estimate potential opportunity using
            their own assumptions. Actual savings, revenue, conversion, and operational results depend on the business,
            implementation, customer demand, staff adoption, and other factors.
          </p>
        </div>
      </Section>

      {/* The competitive advantage */}
      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">The competitive advantage</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Learn what works before AI becomes expected.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-2">
            The head start is not buying the most AI. It is proving one useful workflow while competitors are still
            experimenting.
          </p>
        </div>
      </Section>

      {/* Built for */}
      <Section className="pt-0">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-base text-muted-foreground">
            <span className="font-semibold text-foreground">Built for local and founder-led businesses:</span>{' '}
            home services, professional services, clinics, property management, retail, restaurants, consultants, and
            sales teams.
          </p>
        </div>
      </Section>

      {/* Three Practical Ways */}
      <Section
        subtitle="Choose the right path"
        title="Three Practical Ways I Help Local Businesses"
        description="The right solution depends on where value is being lost. Start small, define the measure of success, and expand only when the result supports the investment."
        className="bg-secondary/20"
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: Phone,
              title: 'Kestrel Voice',
              subtitle: 'Answer more customers',
              description:
                'Your team handles the calls where personal attention matters. Kestrel helps cover the moments when they cannot answer.',
              bullets: [
                'Answer after-hours and overflow calls',
                'Use approved business information',
                'Capture names, numbers, and call reasons',
                'Support appointments and callbacks',
                'Transfer urgent or valuable calls',
                'Provide call records when enabled',
              ],
              measure:
                'Measure: calls recovered, leads captured, appointments completed, successful transfers, and cost per outcome.',
              disclaimer: null,
            },
            {
              icon: Code,
              title: 'AI Advisory & Custom Development',
              subtitle: 'Save staff time',
              description:
                'Not every problem requires a new platform. The answer may be an existing tool, a focused automation, or a custom AI application.',
              bullets: [
                'Customer intake and lead follow-up',
                'Internal business assistants',
                'Document and policy search',
                'Recurring reports and data processing',
                'Calendar and CRM integrations',
                'Custom AI tools and product review',
              ],
              measure:
                'Measure: staff hours returned, fewer manual steps, faster response, lower error rates, and shorter turnaround time.',
              disclaimer: null,
            },
            {
              icon: ShieldCheck,
              title: 'HAIEC Readiness & Texas AI Check',
              subtitle: 'Use AI with better control',
              description:
                'Understand the use case, data, authority, testing, evidence, and requirements before AI handles sensitive information or important actions.',
              bullets: [
                'AI-use and system inventory',
                'Texas AI applicability review',
                'Data and security assessment',
                'Authority and workflow review',
                'Testing and guardrail planning',
                'Evidence and remediation roadmap',
              ],
              measure:
                'Measure: systems identified, sensitive data mapped, risky actions restricted, tests completed, and evidence gaps reduced.',
              disclaimer:
                'Readiness and applicability support is not legal advice, certification, or a guarantee of compliance.',
            },
          ].map((card, i) => {
            const Icon = card.icon
            return (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-base font-medium text-accent">
                    {card.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.description}</p>
                  <ul className="space-y-2 mb-4 flex-1">
                    {card.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-primary/5 rounded-lg p-3 mt-auto">
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.measure}</p>
                  </div>
                  {card.disclaimer && (
                    <p className="text-xs text-muted-foreground italic mt-3">{card.disclaimer}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Section>

      {/* Value before complexity */}
      <Section subtitle="Principles" title="Value before complexity">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-center">
            A practical AI investment should earn its place. We begin by estimating the cost of the problem and agreeing
            on the result that matters. The objective is for the measurable value protected, created, or returned to
            clearly outweigh the investment. If we cannot define the value before the pilot, we should not build the
            project yet.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                num: '1',
                title: 'Baseline the problem',
                desc: 'Missed opportunities, staff time, response delay, or unmanaged risk.',
              },
              {
                num: '2',
                title: 'Right-size the first step',
                desc: 'Use the smallest pilot capable of proving a business result.',
              },
              {
                num: '3',
                title: 'Expand from evidence',
                desc: 'Invest more only after the first workflow demonstrates value.',
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <span className="text-sm font-bold text-accent">{item.num}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-secondary/20 rounded-lg p-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {[
                { label: 'Identify', desc: 'Find the costly problem' },
                { label: 'Measure', desc: 'Choose the proof of value' },
                { label: 'Recommend', desc: 'Use, integrate, build, or wait' },
                { label: 'Pilot', desc: 'Start narrow with human fallback' },
                { label: 'Review', desc: 'Inspect outcomes and failures' },
                { label: 'Expand', desc: 'Scale only what works' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-xs font-mono text-accent mb-1">{i + 1}</div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 hidden md:block">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* What you'll get from the review */}
      <Section subtitle="The Review" title="What you'll get" className="bg-secondary/20">
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {REVIEW_BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Intake Form */}
      <Section id="request-review" subtitle="Complimentary 20-minute review" title="Find the AI opportunity your business can justify.">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground mb-2 text-center">
            This is not a generic software demonstration. We&apos;ll identify one practical use case, one measure of
            success, one primary risk, and the most useful next step.
          </p>

          {submitted ? (
            <Card className="text-center p-8 mt-6">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2">Thanks, {firstName}. Your request is in.</h3>
              <p className="text-muted-foreground mb-6">
                Here&apos;s what happens next:
              </p>
              <div className="text-left max-w-md mx-auto space-y-3 mb-6">
                {[
                  'I\'ll review your business context and reply within 1 business day to confirm a time.',
                  'You\'ll receive a one-page opportunity snapshot before our conversation.',
                  'Expect an email from subodhkc@subodhkc.com — check your spam folder if you don\'t see it.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Tip: Save <span className="font-medium text-foreground">subodhkc@subodhkc.com</span> to your contacts
                  so our email doesn&apos;t go to spam.
                </p>
              </div>
              <a href="/">
                <Button variant="outline">Back to subodhkc.com</Button>
              </a>
            </Card>
          ) : (
            <Card className="mt-6">
              <CardContent className="p-6">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground">Step {step} of 3</span>
                    <span className="text-xs text-muted-foreground">
                      {step === 1 && 'About your business'}
                      {step === 2 && 'Where is value being lost?'}
                      {step === 3 && 'When works for you?'}
                    </span>
                  </div>
                  <div
                    className="h-1 bg-secondary rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={step}
                    aria-valuemin={1}
                    aria-valuemax={3}
                    aria-label="Form progress"
                  >
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: '33%' }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                    role="alert"
                  >
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: About your business */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                            Business name *
                          </label>
                          <input
                            id="businessName"
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={(e) => handleChange('businessName', e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                            placeholder="Your business name"
                            style={{ minHeight: 44 }}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                              Your name *
                            </label>
                            <input
                              id="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                              placeholder="Your full name"
                              style={{ minHeight: 44 }}
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                              Email *
                            </label>
                            <input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                              placeholder="your@email.com"
                              style={{ minHeight: 44 }}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Phone *
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                            placeholder="(214) 555-0100"
                            style={{ minHeight: 44 }}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="businessType" className="block text-sm font-medium mb-2">
                              Business type *
                            </label>
                            <select
                              id="businessType"
                              required
                              value={formData.businessType}
                              onChange={(e) => handleChange('businessType', e.target.value)}
                              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                              style={{ minHeight: 44 }}
                            >
                              <option value="">Select...</option>
                              {BUSINESS_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="teamSize" className="block text-sm font-medium mb-2">
                              Team size *
                            </label>
                            <select
                              id="teamSize"
                              required
                              value={formData.teamSize}
                              onChange={(e) => handleChange('teamSize', e.target.value)}
                              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                              style={{ minHeight: 44 }}
                            >
                              <option value="">Select...</option>
                              {TEAM_SIZES.map((size) => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Where is value being lost? */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <p className="text-sm font-medium mb-3">Quick business check</p>
                          <p className="text-xs text-muted-foreground mb-4">Mark what applies.</p>
                          <div className="space-y-2">
                            {BUSINESS_CHECKS.map((item, i) => {
                              const checked = formData.businessChecks.includes(item)
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => toggleCheck(item)}
                                  aria-pressed={checked}
                                  className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                                    checked
                                      ? 'border-accent bg-accent/10'
                                      : 'border-border bg-background hover:border-primary/30'
                                  }`}
                                  style={{ minHeight: 44 }}
                                >
                                  <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                      checked ? 'border-accent bg-accent' : 'border-muted-foreground'
                                    }`}
                                  >
                                    {checked && <CheckCircle2 className="h-4 w-4 text-background" />}
                                  </div>
                                  <span className="text-sm text-foreground">{item}</span>
                                </button>
                              )
                            })}
                          </div>
                          {checkCount >= 2 && (
                            <p className="text-sm text-accent mt-3 font-medium">
                              A practical opportunity &mdash; or unmanaged risk &mdash; may be worth reviewing.
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="problemArea" className="block text-sm font-medium mb-2">
                            Which area is costing you the most? *
                          </label>
                          <select
                            id="problemArea"
                            required
                            value={formData.problemArea}
                            onChange={(e) => handleChange('problemArea', e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                            style={{ minHeight: 44 }}
                          >
                            <option value="">Select...</option>
                            {PROBLEM_AREAS.map((area) => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="firstProblem" className="block text-sm font-medium mb-2">
                            What&apos;s the one problem you&apos;d like solved first? *
                          </label>
                          <textarea
                            id="firstProblem"
                            required
                            rows={3}
                            value={formData.firstProblem}
                            onChange={(e) => handleChange('firstProblem', e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base resize-none"
                            placeholder="Describe the one problem that's costing you the most..."
                            style={{ minHeight: 44 }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: When works for you? */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <p className="text-sm font-medium mb-3">Preferred days *</p>
                          <p className="text-xs text-muted-foreground mb-3">Select all that work for you.</p>
                          <div className="flex flex-wrap gap-2">
                            {DAYS.map((day) => {
                              const selected = formData.preferredDays.includes(day)
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => toggleDay(day)}
                                  aria-pressed={selected}
                                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                                    selected
                                      ? 'border-accent bg-accent text-background'
                                      : 'border-border bg-background text-foreground hover:border-primary/30'
                                  }`}
                                  style={{ minHeight: 44, minWidth: 60 }}
                                >
                                  {day}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="preferredTimeSlot" className="block text-sm font-medium mb-2">
                            Preferred time slot *
                          </label>
                          <select
                            id="preferredTimeSlot"
                            required
                            value={formData.preferredTimeSlot}
                            onChange={(e) => handleChange('preferredTimeSlot', e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
                            style={{ minHeight: 44 }}
                          >
                            <option value="">Select...</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
                            Anything else we should know? <span className="text-muted-foreground">(optional)</span>
                          </label>
                          <textarea
                            id="additionalInfo"
                            rows={3}
                            value={formData.additionalInfo}
                            onChange={(e) => handleChange('additionalInfo', e.target.value)}
                            className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base resize-none"
                            placeholder="Anything else that would help me prepare for our conversation..."
                            style={{ minHeight: 44 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex gap-3 mt-6">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!stepValid}
                        className="flex items-center gap-2 ml-auto"
                      >
                        Next <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !stepValid}
                        className="ml-auto"
                      >
                        {isSubmitting ? 'Sending...' : 'Request My Review'}
                      </Button>
                    )}
                  </div>
                </form>

                {/* Trust signals */}
                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Your information is not shared or sold. We&apos;ll only use it to prepare for your review.
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    We&apos;ll contact you within 1 business day to confirm the date and time.
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    You&apos;ll receive a confirmation email with the confirmed time once we verify availability.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>

      {/* Micro-footer */}
      <Section className="pt-0">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-accent mb-2">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">Subodh KC &middot; Local AI Advisor</p>
          <p className="text-sm text-muted-foreground">Founder, Kestrel Voice &middot; Co-founder, HAIEC</p>
          <p className="text-sm text-muted-foreground mt-1">Dallas-Fort Worth &middot; HEB Chamber Member</p>
          <p className="text-sm text-primary mt-2">subodhkc.com</p>
        </div>
      </Section>
    </>
  )
}
