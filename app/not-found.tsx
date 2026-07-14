import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import { Compass, Mail, BookOpen, Shield, Wrench, Users } from 'lucide-react'

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Explore Subodh KC\'s AI architecture, governance, and advisory services.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  const quickLinks = [
    {
      icon: Compass,
      title: 'Home',
      description: 'Start here — overview of AI systems, products, and capabilities.',
      href: '/',
    },
    {
      icon: Wrench,
      title: 'Services',
      description: 'AI architecture, deployment, and governance services.',
      href: '/services',
    },
    {
      icon: Shield,
      title: 'AI Governance Course',
      description: 'Live masterclass on AI compliance and governance frameworks.',
      href: '/course',
    },
    {
      icon: Users,
      title: 'Advisory',
      description: 'Strategic advisory, fractional leadership, and consulting.',
      href: '/advisory',
    },
    {
      icon: BookOpen,
      title: 'FAQ',
      description: 'Common questions about AI governance, compliance, and architecture.',
      href: '/faq',
    },
    {
      icon: Mail,
      title: 'Contact',
      description: 'Get in touch about your AI challenge or opportunity.',
      href: '/contact',
    },
  ]

  return (
    <>
      <Hero
        subtitle="404"
        title={
          <>
            Page Not
            <br />
            <span className="gradient-text">Found</span>
          </>
        }
        description="The page you're looking for may have been moved, renamed, or never existed. Let's get you back on track."
      />

      <Section subtitle="Quick Links" title="Where You Can Go From Here">
        <Grid cols={3}>
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <Link key={index} href={link.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription className="mt-2">{link.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </Grid>
      </Section>

      <Section subtitle="Still Lost?" title="Search or Reach Out" className="bg-secondary/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-6">
            If you were looking for something specific and can't find it, send me a message.
            I respond within 24-48 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Subodh KC
          </Link>
        </div>
      </Section>
    </>
  )
}
