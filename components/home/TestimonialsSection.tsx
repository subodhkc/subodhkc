import Section from '@/components/Section'
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import StarRating from '@/components/StarRating'

const testimonials = [
  {
    quote:
      'We were drowning in AI compliance requirements and honestly did not know where to start. Subodh sat with us, broke everything down into plain language, and helped us build a governance framework that our team could actually follow day to day. What used to be a scramble before audits is now just part of our normal workflow.',
    author: 'Director of Engineering',
    org: 'Healthcare technology company',
    rating: 5,
  },
  {
    quote:
      'Subodh is not the kind of consultant who hands you a slide deck and leaves. He stayed engaged through the messy parts of rolling out AI across our business units and helped us think through edge cases we would have missed on our own. The framework he built with us is still in use and still adapting.',
    author: 'VP of AI Strategy',
    org: 'Enterprise SaaS company',
    rating: 5,
  },
  {
    quote:
      'What stood out to me was how Subodh balanced moving fast with staying compliant. He understood the regulatory pressure we were under but never let it slow things down to a halt. He has a way of making compliance feel less like a roadblock and more like a design constraint you can work with.',
    author: 'CTO',
    org: 'Financial services firm',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <Section subtitle="Testimonials" title="What Clients Say" className="bg-secondary/20">
      <div className="max-w-4xl mx-auto space-y-6">
        {testimonials.map((t, i) => (
          <Card key={i} className="border-l-4 border-l-primary">
            <CardHeader>
              <StarRating rating={t.rating} />
              <CardDescription className="text-base italic text-foreground mb-4 mt-3">
                &ldquo;{t.quote}&rdquo;
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">{t.author}</span>
                <br />
                <span className="text-muted-foreground">{t.org}</span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  )
}
