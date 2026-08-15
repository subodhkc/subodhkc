import Link from 'next/link'
import { Linkedin, Github, Mail, BookOpen, FileText, Rss } from 'lucide-react'

const footerLinks = {
  workWithMe: [
    { name: 'AI Advisor Desk', href: '/ai-advisor' },
    { name: 'AI Automation Blueprint', href: '/ai-automation' },
    { name: 'AI Voice Agent', href: '/ai-voice-agent' },
    { name: 'AI Security & Compliance', href: '/ai-security-compliance' },
    { name: 'SaaS Security Review', href: '/saas-security-review' },
    { name: 'Direct AI Advisory', href: '/advisory' },
    { name: 'Local AI Review', href: '/local-ai-review' },
  ],
  builtBySubodh: [
    { name: 'HAIEC', href: 'https://www.haiec.com' },
    { name: 'KestrelVoice', href: 'https://www.kestrelvoice.com' },
    { name: 'FrontOfAI', href: 'https://frontofai.com' },
    { name: 'All Products', href: '/products' },
    { name: 'Services', href: '/services' },
  ],
  insights: [
    { name: 'Articles', href: '/writing' },
    { name: 'Research', href: '/research' },
    { name: 'CSM Framework', href: '/cognitive-systems-management' },
    { name: 'Architecture Decisions', href: '/architecture-decision-master-sheet' },
    { name: 'Speaking', href: '/speaking' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/subodhkc',
      icon: Linkedin,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/subodhkc',
      icon: Github,
    },
    {
      name: 'Email',
      href: 'mailto:admin@subodhkc.com',
      icon: Mail,
    },
  ],
  external: [
    {
      name: 'Medium',
      href: 'https://medium.com/@subodhkc',
      icon: BookOpen,
    },
    {
      name: 'RSS Feed',
      href: '/feed.xml',
      icon: Rss,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">KC</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI intelligence, systems architecture, and human advisory for organizations deploying AI with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              How I Help
            </h4>
            <ul className="space-y-2">
              {footerLinks.workWithMe.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Built by Subodh
            </h4>
            <ul className="space-y-2">
              {footerLinks.builtBySubodh.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Insights
            </h4>
            <ul className="space-y-2">
              {footerLinks.insights.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-4">
              {footerLinks.social.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KC (Subodh KC). All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
