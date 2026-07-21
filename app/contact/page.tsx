'use client'

import { useState, useEffect, useRef } from 'react'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PhoneNumber from '@/components/PhoneNumber'
import VirtualBusinessCard from '@/components/VirtualBusinessCard'
import { Mail, Linkedin, Calendar, MessageSquare, Download } from 'lucide-react'

function CalendlyEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
    if (existing) {
      existing.remove()
    }
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      const widget = document.createElement('div')
      widget.className = 'calendly-inline-widget'
      widget.setAttribute('data-url', url)
      widget.style.minWidth = '320px'
      widget.style.height = '630px'
      containerRef.current.appendChild(widget)
    }

    return () => {
      const s = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
      if (s) s.remove()
    }
  }, [url])

  return <div ref={containerRef} />
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interest: '',
    message: '',
    website: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.website) {
      return
    }
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        interest: '',
        message: '',
        website: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'Text Message (Fastest)',
      description: 'For urgent inquiries and quick responses',
      value: 'protected',
      link: null,
      cta: 'Reveal number',
      type: 'phone',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'For general inquiries and opportunities',
      value: 'subodhkc@subodhkc.com',
      link: 'mailto:subodhkc@subodhkc.com',
      cta: 'Send email',
      type: 'email',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Connect for professional networking',
      value: 'linkedin.com/in/subodhkc',
      link: 'https://www.linkedin.com/in/subodhkc',
      cta: 'Connect on LinkedIn',
      type: 'linkedin',
    },
    {
      icon: Download,
      title: 'Virtual Business Card',
      description: 'Save my contact info to your device',
      value: 'Download or share my digital card',
      link: null,
      cta: 'Get Business Card',
      type: 'vcard',
    },
    {
      icon: Calendar,
      title: 'Book a Call',
      description: 'Schedule a 30-min consultation directly',
      value: 'Pick a time that works for you',
      link: 'https://calendly.com/subodhkc/30min',
      cta: 'Open Calendar',
      type: 'calendly',
    },
  ]

  const interestAreas = [
    'Advisory & Consulting',
    'AI Governance & Compliance Course',
    'AI Laws Webinar (Small Business)',
    'AI Compliance Assessment',
    'HAIEC Platform',
    'Speaking Engagement',
    'Executive Coaching',
    'Research Collaboration',
    'Media & Press',
    'Mentorship',
    'Other',
  ]

  return (
    <>
      <Hero
        subtitle="Contact"
        title={
          <>
            Let's Build Something
            <br />
            <span className="gradient-text">Exceptional Together</span>
          </>
        }
        description="Whether you need strategic counsel, want to discuss a speaking engagement, or explore collaboration opportunities, I'm here to help."
      />

      <Section subtitle="Get in Touch" title="Choose Your Preferred Method">
        <Grid cols={4}>
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {method.type === 'phone' ? (
                    <PhoneNumber />
                  ) : method.type === 'vcard' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{method.value}</p>
                      <VirtualBusinessCard />
                    </div>
                  ) : method.type === 'calendly' ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">{method.value}</p>
                      {method.link && (
                        <a href={method.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full">
                            {method.cta}
                          </Button>
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">{method.value}</p>
                      {method.link && (
                        <a href={method.link} target={method.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full">
                            {method.cta}
                          </Button>
                        </a>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section
        id="form"
        subtitle="Send a Message"
        title="Direct Contact Form"
        description="Fill out the form below and I'll get back to you within 24-48 hours."
        className="bg-secondary/20"
      >
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <Card className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for reaching out. I'll review your message and get back to you within 24-48 hours.
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-accent mb-2">Need a faster response?</p>
                <p className="text-sm text-muted-foreground mb-3">Text me for immediate assistance:</p>
                <a href="sms:6822249904" className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-accent transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  682-224-9904
                </a>
              </div>
              <Button onClick={() => setSubmitted(false)}>Send another message</Button>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div style={{ position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="website">Website (leave blank)</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                      I'm interested in *
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select an option</option>
                      {interestAreas.map((area, index) => (
                        <option key={index} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Tell me about your needs, project, or inquiry..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to be contacted regarding your inquiry.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </Section>

      <Section subtitle="Schedule" title="Book a 30-Minute Call">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground mb-6">
            Prefer to skip the back-and-forth? Pick a time directly on my calendar.
          </p>
          <CalendlyEmbed url="https://calendly.com/subodhkc/30min?hide_landing_page_details=1&hide_gdpr_banner=1" />
        </div>
      </Section>

      <Section subtitle="FAQ" title="Common Questions">
        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's your typical response time?</CardTitle>
              <CardDescription>
                I aim to respond to all inquiries within 24-48 hours. For urgent matters, please indicate that in your message.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do you take on freelance projects?</CardTitle>
              <CardDescription>
                I work primarily through advisory retainers, project engagements, and fractional leadership roles. Reach out to discuss your specific needs.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I book you for a podcast or interview?</CardTitle>
              <CardDescription>
                Yes! I'm selective about media appearances but open to opportunities that align with my expertise in AI governance, compliance, and technical leadership.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Are you available for mentorship?</CardTitle>
              <CardDescription>
                I dedicate time to mentoring emerging leaders, particularly those from Nepal or underrepresented communities in tech. Reach out to discuss mentorship opportunities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: "What's your typical response time?",
                acceptedAnswer: { '@type': 'Answer', text: 'I aim to respond to all inquiries within 24-48 hours. For urgent matters, please indicate that in your message.' },
              },
              {
                '@type': 'Question',
                name: 'Do you take on freelance projects?',
                acceptedAnswer: { '@type': 'Answer', text: 'I work primarily through advisory retainers, project engagements, and fractional leadership roles. Reach out to discuss your specific needs.' },
              },
              {
                '@type': 'Question',
                name: 'Can I book you for a podcast or interview?',
                acceptedAnswer: { '@type': 'Answer', text: "Yes! I'm selective about media appearances but open to opportunities that align with my expertise in AI governance, compliance, and technical leadership." },
              },
              {
                '@type': 'Question',
                name: 'Are you available for mentorship?',
                acceptedAnswer: { '@type': 'Answer', text: 'I dedicate time to mentoring emerging leaders, particularly those from Nepal or underrepresented communities in tech. Reach out to discuss mentorship opportunities.' },
              },
            ],
          }),
        }}
      />
    </>
  )
}
