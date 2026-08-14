import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Mail,
  Clock,
  Zap,
  FileText,
} from 'lucide-react'
import { AdvisorCheckoutCTA } from '@/components/commercial/AdvisorCheckoutCTA'

export const metadata = {
  title: 'AI Advisor for Small Business | AI Risk, Compliance & Automation',
  description:
    'Stay informed about AI developments relevant to your company, review important AI tools and decisions, and know what deserves action. $99/month, up to 3 team members.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-advisor',
  },
  openGraph: {
    title: 'AI Advisor for Small Business | AI Risk, Compliance & Automation',
    description:
      'Stay informed about AI developments relevant to your company. $99/month with human-reviewed answers, AI controls review, and regulatory monitoring. Up to 3 team members.',
    url: 'https://subodhkc.com/ai-advisor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Advisor for Small Business | AI Risk, Compliance & Automation',
    description: '$99/month AI Advisor Desk with human-reviewed answers, AI controls review, and regulatory monitoring.',
  },
  keywords: [
    'AI advisor for small business',
    'AI compliance for small business',
    'AI risk management',
    'AI tools for business',
    'AI vendor assessment',
    'AI hiring bias',
    'AI law monitoring',
    'AI automation guidance',
    'AI advisor desk',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Advisor Desk', item: 'https://subodhkc.com/ai-advisor' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Advisor Desk',
  description: 'Monthly AI advisory subscription for small businesses. Human-reviewed email questions, AI controls review, regulatory monitoring, and recommended next actions.',
  url: 'https://subodhkc.com/ai-advisor',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Advisory',
  areaServed: 'Global',
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'USD',
    billingDuration: 'P1M',
  },
}

const buyerQuestions = [
  {
    category: 'Your team uses AI tools',
    questions: [
      'Which tools deserve review?',
      'What data questions should we ask?',
      'Do we have appropriate ownership and controls?',
    ],
  },
  {
    category: 'You are evaluating an AI vendor',
    questions: [
      'What should we review before relying on it?',
      'What security and data questions should we ask?',
      'What red flags should we watch for?',
    ],
  },
  {
    category: 'You use AI in hiring',
    questions: [
      'Do the job description, resume-screening process or AI-assisted workflow raise bias/control questions?',
      'What documentation should we maintain?',
    ],
  },
  {
    category: 'AI rules are changing',
    questions: [
      'Which developments deserve attention?',
      'Which regulations apply to us?',
      'What should we do now vs later?',
    ],
  },
  {
    category: 'Your team wants to automate a process',
    questions: [
      'Is this a good candidate for AI?',
      'Does it need a Blueprint?',
    ],
  },
  {
    category: 'Management asks what to do next',
    questions: [
      'What deserves action now?',
      'What can wait?',
      'What should we stop doing?',
    ],
  },
]

const whatYouGet = [
  {
    icon: TrendingUp,
    title: 'Relevant Weekly AI Intelligence',
    description: 'AI developments filtered for your business context. Know which changes matter and which you can safely ignore. Delivered weekly with executive, manager, and technical briefing views.',
  },
  {
    icon: Shield,
    title: 'AI Controls Review',
    description: 'A periodic review of your AI tools, vendor agreements, and internal practices. Identifies gaps before they become incidents.',
  },
  {
    icon: FileText,
    title: 'AI-Related Regulatory Monitoring',
    description: 'Track AI regulations and frameworks relevant to your industry and business size. Know which rules apply and which developments deserve attention.',
  },
  {
    icon: Zap,
    title: 'AI Tools and Vendor Guidance',
    description: 'Ask which AI tools fit your workflow, what to check before signing a vendor contract, and how to evaluate security claims.',
  },
  {
    icon: Clock,
    title: 'AI Hiring and Policy Support',
    description: 'Selected checks on AI-related job descriptions, resume-screening processes, and AI-assisted workflows. Get help writing AI usage policies and setting boundaries.',
  },
  {
    icon: Mail,
    title: 'One Advisor-Reviewed Email Question per Month',
    description: 'Send a detailed question about your AI deployment, tool selection, compliance obligation, or vendor evaluation. Get a written, human-reviewed response with recommended next actions.',
  },
]

const boundaries = [
  'This is not a full consulting engagement. It is email-based guidance for specific questions.',
  'This is not continuous monitoring or managed services. For that, see our advisory engagements.',
  'This is not legal advice. For regulatory compliance obligations, consult a licensed attorney.',
  'One pooled question per month means your team shares the allocation. Additional questions available as add-ons.',
]

const faqs = [
  {
    q: 'How is this different from asking ChatGPT?',
    a: 'ChatGPT gives you generic answers. The AI Advisor Desk gives you specific, contextual guidance reviewed by a human specialist who has deployed AI systems in production and built compliance frameworks used by enterprises. Every answer is grounded in your actual business context, not a generic prompt.',
  },
  {
    q: 'What happens if my question is complex?',
    a: 'Complex questions may require a follow-up engagement. We will tell you upfront if your question exceeds the scope of the Advisor Desk and recommend the right next step, whether that is an AI Automation Blueprint ($500) or a full advisory engagement.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. The subscription is month-to-month. Cancel before your next billing date and you will not be charged again. The annual plan ($990) saves you two months.',
  },
  {
    q: 'What if I need more than one question per month?',
    a: 'Additional questions are available as add-ons at $49 per question. Or upgrade to a full advisory engagement for continuous access.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function AIAdvisorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="AI Advisor Desk"
        title={
          <>
            AI changes every week.
            <br />
            <span className="gradient-text">Your business shouldn&rsquo;t have to chase it.</span>
          </>
        }
        description="$99/month. Stay informed about AI developments relevant to your company, review important AI tools and decisions, and know what deserves action. Up to 3 team members. Cancel anytime."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact?subject=ai-advisor-desk">
            <Button size="lg" className="group animate-glow">
              Start AI Advisor Desk
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-automation">
            <Button size="lg" variant="outline">
              Need a one-time assessment? ($500)
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Questions We Help Answer */}
      <Section
        subtitle="Questions We Help Answer"
        title="Your team has AI questions. You should not need a full-time AI specialist to answer them."
        sectionNum="§01"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {buyerQuestions.map((group, i) => (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      {group.category}
                    </CardTitle>
                    <ul className="mt-3 space-y-2">
                      {group.questions.map((q, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">&rarr;</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Business Situations */}
      <Section
        subtitle="Business Situations"
        title="When the AI Advisor Desk pays for itself"
        description="Common scenarios where a $99/month subscription saves you from a costly mistake or a month of indecision."
        sectionNum="§02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Your team wants to adopt a new AI tool',
                desc: 'You need someone to review the vendor, check data handling, and tell you whether the tool is safe to use before you sign.',
              },
              {
                title: 'A customer or partner asks about your AI policy',
                desc: 'You need a defensible answer about how your team uses AI, what controls you have, and what you have reviewed.',
              },
              {
                title: 'A new AI regulation applies to your industry',
                desc: 'You need to know which rules apply to your business size, what documentation to maintain, and what to do now vs later.',
              },
              {
                title: 'You are evaluating AI for hiring or HR',
                desc: 'AI-assisted hiring raises bias and documentation questions. You need to know what to check and what records to keep.',
              },
              {
                title: 'Management asks what to do about AI',
                desc: 'You need a prioritized view of what deserves action, what can wait, and what to stop doing.',
              },
              {
                title: 'You want to automate a workflow but are not sure how',
                desc: 'Before spending on development, get a read on whether AI is the right approach and what the Blueprint would cover.',
              },
            ].map((situation, i) => (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      {situation.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">{situation.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* What You Get */}
      <Section
        subtitle="What You Receive"
        title="Everything included for $99/month"
        description="One subscription. No hidden fees, no per-seat charges, no usage metering."
        sectionNum="§03"
        className="bg-secondary/20"
      >
        <Grid cols={3}>
          {whatYouGet.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      {/* Evidence */}
      <Section
        subtitle="Why Trust This"
        title="Built on real AI governance work"
        sectionNum="§04"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Published Governance Methodology</CardTitle>
              <CardDescription className="text-base">
                The AI Controls Review is grounded in a published AI governance methodology covering
                Enterprise, Project, Code, and UX domains. Applied in production AI deployments.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Daily AI Industry Monitoring</CardTitle>
              <CardDescription className="text-base">
                Your subscription includes filtered AI industry signals so you know which developments
                matter and which to ignore. No need to track 40+ sources yourself.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Production AI Experience</CardTitle>
              <CardDescription className="text-base">
                Not a researcher. Not a blogger. I have architected and deployed production AI systems
                including voice agents, compliance platforms, and enterprise governance tools. Every answer
                is grounded in real implementation experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Pricing */}
      <Section
        subtitle="Pricing"
        title="Simple, Transparent, Cancelable"
        sectionNum="§05"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-primary">Monthly</span>
                </div>
                <CardTitle className="text-2xl">$99<span className="text-base font-normal text-muted-foreground">/month</span></CardTitle>
                <CardDescription>Flexibility to cancel anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['1 human-reviewed email question/month', 'AI Controls Review', 'FrontOfAI industry intelligence', 'Up to 3 team members', 'AI tools and vendor guidance', 'AI hiring and policy support'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact?subject=ai-advisor-desk-monthly" className="block mt-4">
                  <Button className="w-full">Start Monthly</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-primary">Best Value</span>
                </div>
                <CardTitle className="text-2xl">$990<span className="text-base font-normal text-muted-foreground">/year</span></CardTitle>
                <CardDescription>Save 2 months. Annual billing.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Everything in Monthly', '2 months free', 'Priority response queue', 'Annual AI Controls Review report', 'FrontOfAI quarterly trend briefing', 'Up to 3 team members'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact?subject=ai-advisor-desk-annual" className="block mt-4">
                  <Button className="w-full">Start Annual</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Boundary */}
      <Section
        subtitle="Boundaries"
        title="What This Is Not"
        sectionNum="§06"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {boundaries.map((b, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/advisory">
              <Button variant="outline" size="sm">Full Advisory Engagements <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-automation">
              <Button variant="outline" size="sm">AI Automation Blueprint ($500) <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-security-compliance">
              <Button variant="outline" size="sm">AI Security & Compliance Review <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section
        subtitle="FAQ"
        title="Common Questions"
        sectionNum="§07"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 40} style="up">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                  <CardDescription className="text-sm mt-2">{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <AdvisorCheckoutCTA
        title="Stop guessing about AI"
        description="Get a specialist in your corner for $99/month. One question answered, one controls review, one less thing to worry about."
      />
    </>
  )
}
