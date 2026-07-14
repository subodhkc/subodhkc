import Section from '@/components/Section'
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import StarRating from '@/components/StarRating'

const testimonials = [
  {
    quote:
      'Subodh has an exceptional ability to take complex AI compliance requirements and translate them into actionable frameworks. His work on our enterprise AI governance program reduced our audit preparation time from months to weeks.',
    author: 'Senior Engineering Director',
    org: 'Fortune 50 Technology Company',
    rating: 5,
  },
  {
    quote:
      'Working with Subodh on AI implementation strategy was transformative. He doesn\'t just manage programs—he architects systems that actually work at scale. His CSM Framework helped us navigate deploying AI across 50+ business units.',
    author: 'VP of AI Strategy',
    org: 'Enterprise Software Company',
    rating: 5,
  },
  {
    quote:
      'Subodh\'s technical program management skills are unmatched. He led our $40M AI compliance initiative with precision, managing 100+ stakeholders across multiple time zones. His ability to balance innovation velocity with regulatory requirements is exactly what enterprises need.',
    author: 'Chief Technology Officer',
    org: 'Financial Services Firm',
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
