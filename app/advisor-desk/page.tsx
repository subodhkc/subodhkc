import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Calendar,
  AlertTriangle,
  Shield,
  Users,
  Scale,
  Gauge,
  Lock,
  Layers,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'AI Advisor Desk Dashboard | Subodh KC',
  description:
    'Your AI Advisor Desk dashboard. Status cards deep-link to AI tools, vendor checklists, law guides, readiness assessments, controls reviews, and advisor access.',
  alternates: {
    canonical: 'https://subodhkc.com/advisor-desk',
  },
  openGraph: {
    title: 'AI Advisor Desk Dashboard | Subodh KC',
    description: 'Your AI Advisor Desk dashboard with deep links to AI tools, governance, compliance, and advisor access.',
    url: 'https://subodhkc.com/advisor-desk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Advisor Desk Dashboard | Subodh KC',
    description: 'Status cards deep-link to AI tools, vendor checklists, law guides, readiness assessments, and advisor access.',
  },
  keywords: [
    'AI advisor dashboard',
    'AI advisor desk',
    'AI governance dashboard',
    'AI compliance dashboard',
    'AI tools dashboard',
    'AI readiness assessment',
    'AI controls review',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Advisor Desk', item: 'https://subodhkc.com/advisor-desk' },
  ],
}

interface DashboardCard {
  id: string
  icon: typeof Calendar
  title: string
  statusLabel: string
  statusColor: 'green' | 'amber' | 'red' | 'blue' | 'muted'
  description: string
  links: Array<{ label: string; href: string; external?: boolean }>
}

const cards: DashboardCard[] = [
  {
    id: 'this-week',
    icon: Calendar,
    title: 'This Week',
    statusLabel: 'FrontOfAI Brief',
    statusColor: 'blue',
    description: 'Latest AI industry signals and weekly intelligence brief. Filtered for your business context.',
    links: [
      { label: 'FrontOfAI Platform', href: '/solutions/frontofai', external: true },
      { label: 'AI Briefing', href: '/solutions/ai-briefing', external: true },
    ],
  },
  {
    id: 'needs-attention',
    icon: AlertTriangle,
    title: 'Needs Your Attention',
    statusLabel: 'Risk Register',
    statusColor: 'amber',
    description: 'Open AI risks, incident evidence requirements, and pending compliance items that need review.',
    links: [
      { label: 'AI Risk Register', href: '/ai-risk-register' },
      { label: 'Incident Evidence Checklist', href: '/ai-incident-evidence-checklist' },
    ],
  },
  {
    id: 'ai-tools-vendors',
    icon: Shield,
    title: 'AI Tools & Vendors',
    statusLabel: '60-Item Checklist',
    statusColor: 'blue',
    description: 'Evaluate AI vendors before procurement. Data handling, security posture, model transparency, and contractual protections.',
    links: [
      { label: 'Vendor Due-Diligence Checklist', href: '/ai-vendor-due-diligence-checklist' },
      { label: 'AI Security Tools', href: '/ai-security-tools' },
    ],
  },
  {
    id: 'ai-hiring',
    icon: Users,
    title: 'AI Hiring',
    statusLabel: 'Compliance Required',
    statusColor: 'red',
    description: 'AI in hiring decisions triggers NYC LL 144, Illinois AIVIA, California FEHA, and EU AI Act obligations. Bias audits and candidate notifications are mandatory.',
    links: [
      { label: 'NYC Local Law 144 Guide', href: '/guides/nyc-local-law-144' },
      { label: 'EU AI Act Guide', href: '/guides/eu-ai-act' },
    ],
  },
  {
    id: 'ai-laws',
    icon: Scale,
    title: 'AI Laws',
    statusLabel: 'Multi-Jurisdiction',
    statusColor: 'amber',
    description: 'Track AI regulations across jurisdictions. Texas TRAIGA, EU AI Act, NYC LL 144, California SB 189, and emerging federal frameworks.',
    links: [
      { label: 'All Compliance Guides', href: '/guides' },
      { label: 'Texas AI Law Guide', href: '/guides/texas-ai-law' },
      { label: 'Does Texas AI Law Apply?', href: '/does-texas-ai-law-apply-to-my-business' },
    ],
  },
  {
    id: 'ai-readiness',
    icon: Gauge,
    title: 'AI Readiness',
    statusLabel: 'Assess',
    statusColor: 'muted',
    description: 'Evaluate your organization readiness for AI deployment. Architecture decisions, governance maturity, and operational preparedness.',
    links: [
      { label: 'CSM Assessment', href: '/cognitive-systems-management/assessment' },
      { label: 'Architecture Decision Master Sheet', href: '/architecture-decision-master-sheet' },
    ],
  },
  {
    id: 'ai-controls',
    icon: Lock,
    title: 'AI Controls',
    statusLabel: 'CSM Framework',
    statusColor: 'blue',
    description: 'Cognitive Systems Management framework for AI governance. Four domains: Enterprise, Project, Code, and UX. Sixteen governance components.',
    links: [
      { label: 'CSM Framework', href: '/cognitive-systems-management' },
      { label: 'CSM V2 Specification', href: '/cognitive-systems-management/v2' },
      { label: 'Governance Contracts', href: '/cognitive-systems-management/contracts' },
    ],
  },
  {
    id: 'recommended-tools',
    icon: Layers,
    title: 'Recommended Tools',
    statusLabel: '25 Layers',
    statusColor: 'muted',
    description: 'Interactive architecture decision reference covering compute, orchestration, retrieval, safety, and deployment decisions for AI systems.',
    links: [
      { label: 'Architecture Decision Master Sheet', href: '/architecture-decision-master-sheet' },
      { label: 'How to Secure and Govern AI', href: '/how-to-secure-and-govern-ai' },
    ],
  },
  {
    id: 'ask-advisor',
    icon: MessageSquare,
    title: 'Ask an Advisor',
    statusLabel: '$99/month',
    statusColor: 'green',
    description: 'Send a detailed question about your AI deployment, tool selection, compliance obligation, or vendor evaluation. Get a human-reviewed response within 48 hours.',
    links: [
      { label: 'Start AI Advisor Desk', href: '/contact?subject=ai-advisor-desk' },
      { label: 'AI Advisor Details', href: '/ai-advisor' },
    ],
  },
]

const statusColorMap: Record<string, string> = {
  green: 'bg-green-500/10 text-green-600 border-green-500/20',
  amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  red: 'bg-red-500/10 text-red-600 border-red-500/20',
  blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  muted: 'bg-muted text-muted-foreground border-border',
}

export default function AdvisorDeskDashboard() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Hero
        subtitle="AI Advisor Desk"
        title={
          <>
            Your AI Governance Dashboard.
            <br />
            <span className="gradient-text">All Tools. One Place.</span>
          </>
        }
        description="Status cards deep-link into the canonical tools you need. No duplicated data, no stale dashboards. Click through to the real thing."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact?subject=ai-advisor-desk">
            <Button size="lg" className="group animate-glow">
              Subscribe for $99/month
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-advisor">
            <Button size="lg" variant="outline">
              What Is AI Advisor Desk?
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Dashboard Grid */}
      <Section
        subtitle="Dashboard"
        title="Nine Areas. Zero Guesswork."
        description="Each card links directly to the canonical tool or resource. No mirrored databases, no sync issues. The source of truth is always one click away."
        sectionNum="§01"
      >
        <Grid cols={3}>
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <Reveal key={card.id} delay={i * 50} style="up">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColorMap[card.statusColor]}`}>
                        {card.statusLabel}
                      </span>
                    </div>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {card.links.map((link, j) => (
                        <Link
                          key={j}
                          href={link.href}
                          className="flex items-center justify-between text-sm text-primary hover:underline group/link"
                        >
                          <span>{link.label}</span>
                          {link.external ? (
                            <ExternalLink className="h-3 w-3 opacity-50 group-hover/link:opacity-100" />
                          ) : (
                            <ArrowRight className="h-3 w-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      {/* How It Works */}
      <Section
        subtitle="How It Works"
        title="Deep Links, Not Data Mirrors"
        sectionNum="§02"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Each Card Links to the Source of Truth
              </CardTitle>
              <CardDescription className="text-base">
                The dashboard does not copy or mirror data from HAIEC, FrontOfAI, or other platforms.
                Every card deep-links directly to the canonical tool. When a tool updates, you see the
                latest version immediately. No sync delays, no stale caches.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Status at a Glance, Detail on Demand
              </CardTitle>
              <CardDescription className="text-base">
                Each card shows a lightweight status label so you can scan the dashboard quickly.
                When you need the full picture, click through to the actual tool. The dashboard is
                a navigation layer, not a data store.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Subscribe for Human-Reviewed Guidance
              </CardTitle>
              <CardDescription className="text-base">
                The dashboard is free to browse. The AI Advisor Desk subscription ($99/month) adds
                human-reviewed email questions, AI controls review, and FrontOfAI intelligence
                filtered for your business context.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* What You Get with Subscription */}
      <Section
        subtitle="Subscription Benefits"
        title="What the $99/month Subscription Adds"
        sectionNum="§03"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Human-Reviewed Answers</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  One email question per month, reviewed by a specialist. Not a chatbot response. Real
                  guidance grounded in your business context.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">AI Controls Review</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Periodic review of your AI tools and practices using the CSM framework. Identifies
                  gaps before they become incidents.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">FrontOfAI Intelligence</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Weekly AI signals filtered for your business. Know which developments matter and
                  which to ignore.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Up to 3 Team Members</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Your whole leadership team gets access. No per-seat fees, no usage metering.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      <CTA
        title="Get the Full Advisor Desk Experience"
        description="The dashboard is free to browse. Subscribe for $99/month to add human-reviewed guidance, AI controls review, and industry intelligence."
        primaryButton={{ text: 'Subscribe to AI Advisor Desk', href: '/contact?subject=ai-advisor-desk' }}
        secondaryButton={{ text: 'Learn More', href: '/ai-advisor' }}
      />
    </>
  )
}
