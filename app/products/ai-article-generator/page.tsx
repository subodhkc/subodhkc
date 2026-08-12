import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Github,
  ArrowRight,
  ExternalLink,
  Newspaper,
  Brain,
  FileText,
  GitBranch,
  Rss,
  Calendar,
  TrendingUp,
  Scale,
  CheckCircle2,
  Code2,
  Zap,
  Settings,
  Mail,
  Server,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Article Generator | Open-Source Content Engine',
  description:
    'Automated AI content engine that fetches news from authoritative sources, categorizes with OpenAI GPT-4o, and publishes MDX articles to your site. Open source, GitHub Actions ready, fully configurable.',
  keywords: [
    'ai article generator',
    'automated blog content',
    'ai content automation',
    'mdx article generator',
    'open source ai content engine',
    'ai news aggregator',
    'openai content generation',
    'rss to mdx',
    'github actions content automation',
    'ai compliance news',
    'content automation engine',
    'automated blog writing',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/products/ai-article-generator',
  },
  openGraph: {
    title: 'AI Article Generator | Open-Source Content Engine',
    description:
      'Automated AI content engine that fetches news, categorizes with OpenAI GPT-4o, and publishes MDX articles to your site. Open source, fully configurable.',
    url: 'https://subodhkc.com/products/ai-article-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Article Generator | Open-Source Content Engine',
    description:
      'Automated AI content engine that fetches news, categorizes with OpenAI GPT-4o, and publishes MDX articles to your site.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
}

const features = [
  {
    icon: Rss,
    title: 'Fetch & Aggregate',
    description:
      'Pulls AI compliance news from the FrontOfAI Briefing API and 14+ RSS feeds - FTC, EEOC, Google News alerts for EU AI Act, LL144, AI hiring bias, prompt injection, and more.',
  },
  {
    icon: Brain,
    title: 'AI Categorize & Score',
    description:
      'OpenAI GPT-4o classifies each story as news vs. enforcement, assigns impact scores (1-10), tags, and structured metadata - entity, violation, framework, penalty, region.',
  },
  {
    icon: FileText,
    title: 'Generate MDX Articles',
    description:
      'Produces 800-1200 word news articles, enforcement action summaries, weekly roundups, and monthly trend analyses - all with frontmatter, source attribution, and internal links.',
  },
  {
    icon: GitBranch,
    title: 'Auto-Publish to Your Repo',
    description:
      'Clones your target repo, copies MDX files, commits, and pushes. Works with any GitHub-hosted Next.js, Astro, or MDX-based site. Never overwrites existing articles.',
  },
]

const contentTypes = [
  {
    icon: Newspaper,
    title: 'News Articles',
    description: '800-1200 words. Generated from FrontOfAI API and RSS feeds. Categorized with impact score, tags, and source attribution.',
    frequency: 'Every 4 hours',
  },
  {
    icon: Scale,
    title: 'Enforcement Actions',
    description: 'Structured frontmatter: entity, violation, framework, penalty amount, region, status. Generated when stories are classified as enforcement.',
    frequency: 'Every 4 hours',
  },
  {
    icon: Calendar,
    title: 'Weekly Roundups',
    description: '1000-1500 words. Summarizes top 15 stories from the past week, grouped by theme - regulatory, enforcement, industry.',
    frequency: 'Every Monday',
  },
  {
    icon: TrendingUp,
    title: 'Monthly Trends',
    description: '1500-2500 words. Analyzes patterns across 30+ stories from the past month. Identifies 3-5 key trends with evidence.',
    frequency: '1st of each month',
  },
]

const workflowSchedule = [
  { name: 'news-tracker.yml', schedule: 'Every 4 hours', description: 'Fetch + categorize + generate news/enforcement articles' },
  { name: 'weekly-content.yml', schedule: 'Every Monday 9:00 UTC', description: 'Generate weekly roundup blog post' },
  { name: 'monthly-trends.yml', schedule: '1st of month 10:00 UTC', description: 'Generate monthly trend analysis' },
  { name: 'test-dry-run.yml', schedule: 'Manual only', description: 'Dry run - generates 2 articles without pushing' },
]

const faqs = [
  {
    question: 'What do I need to set this up?',
    answer:
      'You need an OpenAI API key, a GitHub personal access token with repo scope, and a target repository that accepts MDX files (Next.js, Astro, or any MDX-based site). Edit config/sites.json to point to your repo, set two GitHub secrets, and the GitHub Actions workflows handle the rest.',
  },
  {
    question: 'Does it work with my existing site?',
    answer:
      'If your site is hosted on GitHub and uses MDX content files, it works. The contentPath in sites.json tells the engine where to put files in your repo. Common setups include Next.js with src/content, Astro with src/content, or any static site generator that reads MDX.',
  },
  {
    question: 'Can I customize the generated content?',
    answer:
      'Yes. Everything is config-driven. Set your site name, author, logo, internal links, sponsor link, and category mapping in sites.json. Prompts use placeholder tokens that get replaced with your values. You can also create a custom prompts directory for full control over tone and focus.',
  },
  {
    question: 'How much does it cost to run?',
    answer:
      'The repo is free and open source (MIT). Your only costs are OpenAI API usage (typically $0.01-0.05 per article with GPT-4o) and GitHub Actions minutes (free for public repos, 2000 min/month free for private repos). No subscription, no platform fee.',
  },
  {
    question: 'Does it fabricate content?',
    answer:
      'No. The engine uses ONLY source material from FrontOfAI API and RSS feeds. All articles are labeled with autoGenerated: true in frontmatter. The prompts explicitly prohibit fabricating facts, quotes, statistics, or case studies. If source material is thin, it writes a shorter article rather than padding with speculation.',
  },
  {
    question: 'Can I get help with custom setup or integration?',
    answer:
      'Yes. The tool is designed to be self-service, but if you need custom integration with your CMS, custom prompts tuned for your industry, additional RSS sources, or multi-site deployment at scale, contact Subodh KC at subodhkc.com for consulting and custom setup services.',
  },
]

export default function AIArticleGeneratorPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code2 className="h-4 w-4" />
            <span>Open Source Content Engine</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Article Generator
            <span className="gradient-text block">Content Automation Engine</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Automated AI content engine that fetches news from authoritative sources, categorizes
            with OpenAI GPT-4o, and publishes MDX articles to your site.
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Open source. GitHub Actions ready. Fully configurable. Set it up once and your blog
            publishes itself.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>MIT Licensed</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-green-500" />
            <span>GPT-4o Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span>GitHub Actions Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-green-500" />
            <span>Config-Driven</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <a
            href="https://github.com/subodhkc/AI-Article-Generator-"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="gap-2">
              <Github className="h-5 w-5" />
              View on GitHub
            </Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="gap-2">
              <Mail className="h-5 w-5" />
              Custom Setup & Integration
            </Button>
          </Link>
        </div>

        {/* The Problem */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">The Problem</h2>
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              You run an AI compliance or governance blog. You need fresh, accurate, well-written
              content - but the standard options are:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">&bull;</span>
                <span>
                  <strong>Manual writing</strong> - slow, expensive, and inconsistent in quality
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">&bull;</span>
                <span>
                  <strong>Hiring freelance writers</strong> - $200-500 per article, doesn&apos;t
                  scale for daily publishing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">&bull;</span>
                <span>
                  <strong>Generic AI tools</strong> - produce content without real sources, risk
                  hallucination, and lack domain-specific categorization
                </span>
              </li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most AI compliance blogs either publish infrequently or publish low-quality content.
              Neither builds authority.
            </p>
          </div>
        </section>

        {/* What it does */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">What It Does</h2>
          <p className="text-lg text-muted-foreground mb-8">
            A complete content pipeline: fetch, categorize, generate, publish. Set it up once and
            your blog publishes itself on a schedule.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Configure sites.json',
                description: 'Point to your GitHub repo, set your site name, author, logo, internal links, and content path.',
                icon: Settings,
              },
              {
                step: 2,
                title: 'Fetch from authoritative sources',
                description: 'FrontOfAI Briefing API (39+ AI news sources) + 14 RSS feeds (FTC, EEOC, Google News alerts).',
                icon: Rss,
              },
              {
                step: 3,
                title: 'OpenAI generates articles',
                description: 'GPT-4o categorizes, scores, and expands each story into a full MDX article with frontmatter.',
                icon: Brain,
              },
              {
                step: 4,
                title: 'Push to your repo',
                description: 'Engine clones your repo, copies MDX files, commits, and pushes. Vercel/Netlify auto-deploys.',
                icon: GitBranch,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.step}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Step {item.step}: {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Content types */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Content Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <Card key={type.title}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                        {type.frequency}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Configuration example */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Configuration</h2>
          <p className="text-muted-foreground mb-6">
            Everything is driven by <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">config/sites.json</code>.
            No code changes needed to add your site.
          </p>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                <Code2 className="h-4 w-4" />
                <span>config/sites.json</span>
              </div>
              <pre className="text-zinc-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
{`{
  "sites": [
    {
      "name": "my-blog",
      "repo": "your-username/your-blog-repo",
      "branch": "main",
      "contentPath": "src/content",
      "baseUrl": "https://yoursite.com",
      "siteName": "Your Site Name",
      "author": "Your Name",
      "authorRole": "AI Analyst",
      "logoPath": "/images/logo.png",
      "internalLinks": ["/blog", "/guides", "/tools"],
      "categories": ["news", "enforcement", "blog", "trends"],
      "minImpactScore": 6,
      "enabled": true
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* GitHub Actions schedule */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Automated Schedule</h2>
          <p className="text-muted-foreground mb-6">
            Four GitHub Actions workflows run on a schedule. All can also be triggered manually.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Workflow</th>
                  <th className="text-left py-3 px-4 font-semibold">Schedule</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {workflowSchedule.map((wf) => (
                  <tr key={wf.name} className="border-b last:border-0">
                    <td className="py-3 px-4 font-mono text-xs">{wf.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{wf.schedule}</td>
                    <td className="py-3 px-4 text-muted-foreground">{wf.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Content rules */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Content Integrity Rules</h2>
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    What It Does
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>&bull; Uses ONLY source material from FrontOfAI API and RSS feeds</li>
                    <li>&bull; Labels all content with autoGenerated: true in frontmatter</li>
                    <li>&bull; Cites primary sources with links</li>
                    <li>&bull; Includes configurable internal links</li>
                    <li>&bull; Never overwrites existing articles</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Server className="h-5 w-5 text-red-500" />
                    What It Never Does
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>&bull; Fabricate facts, quotes, or statistics</li>
                    <li>&bull; Invent case studies or hypothetical examples as real</li>
                    <li>&bull; Make claims about what companies plan to do</li>
                    <li>&bull; Use promotional or marketing language</li>
                    <li>&bull; Publish without source attribution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Limitations - honest section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Limitations</h2>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">
                  This is a content pipeline, not a magic button.
                </strong>{' '}
                It automates the fetch-categorize-generate-publish workflow, but quality depends on
                your configuration and source material.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">OpenAI</span>
                  <span>
                    Requires an OpenAI API key. Cost is ~$0.01-0.05 per article with GPT-4o. Not
                    free to run at scale.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">Topics</span>
                  <span>
                    Out of the box, it fetches AI compliance and governance news. Adding other
                    topics requires configuring new RSS feeds in sources.json.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">Review</span>
                  <span>
                    All articles are labeled autoGenerated: true. You should review before
                    publishing - especially for enforcement actions with legal implications.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs">GitHub</span>
                  <span>
                    Your target site must be hosted on GitHub and accept MDX files. Not compatible
                    with WordPress, Medium, or hosted CMS platforms.
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This is a developer tool for people who want to automate content publishing on
                their own MDX-based site. If you need WordPress, Ghost, or a managed solution,
                contact us for custom integration.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How it compares */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">How It Compares</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">vs. Manual Writing / Freelance Writers</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>This engine wins:</strong> Runs 24/7, $0.01-0.05 per article vs $200-500
                  per freelance article. Consistent format and frontmatter. Never misses a deadline.
                  <br />
                  <strong>Manual wins:</strong> Human writers produce original analysis, interviews,
                  and opinion pieces. This engine only expands existing source material - it
                  doesn&apos;t create original reporting.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">vs. Jasper / Copy.ai / ChatGPT</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>This engine wins:</strong> Fetches real sources automatically, categorizes
                  with structured metadata, generates with source attribution, and auto-publishes to
                  your repo. No manual prompting.
                  <br />
                  <strong>Generic AI wins:</strong> More flexible for any topic, no setup required,
                  can generate social posts, emails, and ad copy. This engine is purpose-built for
                  AI compliance news on MDX sites.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">vs. WordPress Autoblog Plugins</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>This engine wins:</strong> Open source, no subscription, full control over
                  prompts and categorization, generates original articles (not RSS republishing),
                  structured frontmatter for SEO.
                  <br />
                  <strong>Plugins win:</strong> One-click install, works with WordPress, no code or
                  GitHub required. This engine requires a GitHub-hosted MDX site.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }}
        />

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              MIT licensed. Self-service setup in 15 minutes. Or get custom integration done for
              you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/subodhkc/AI-Article-Generator-"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2">
                  <Github className="h-5 w-5" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Contact for Custom Setup
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>

      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'AI Article Generator',
            description:
              'Open-source automated AI content engine that fetches news from authoritative sources, categorizes with OpenAI GPT-4o, and publishes MDX articles to your site repository.',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Node.js 20+',
            license: 'https://opensource.org/licenses/MIT',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Person',
              name: 'Subodh KC',
              url: 'https://subodhkc.com',
            },
            url: 'https://subodhkc.com/products/ai-article-generator',
            downloadUrl: 'https://github.com/subodhkc/AI-Article-Generator-',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://subodhkc.com/products' },
              { '@type': 'ListItem', position: 3, name: 'AI Article Generator', item: 'https://subodhkc.com/products/ai-article-generator' },
            ],
          }),
        }}
      />
    </div>
  )
}
