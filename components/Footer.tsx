import Link from 'next/link'
import { Linkedin, Github, Twitter, Mail, BookOpen, FileText, Rss } from 'lucide-react'

const footerLinks = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'HAIEC Platform', href: 'https://haiec.com/csm6' },
    { name: 'Writing', href: '/writing' },
    { name: 'Research', href: '/research' },
    { name: 'Speaking', href: '/speaking' },
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
      name: 'Twitter',
      href: 'https://twitter.com/subodhkc',
      icon: Twitter,
    },
    {
      name: 'Email',
      href: 'mailto:Subodh.kc@haiec.com',
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
      name: 'HAIEC Blog',
      href: 'https://haiec.com/blog',
      icon: Rss,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">Subodh KC</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Strategic Systems. Sharp Execution. AI Compliance at Enterprise Scale.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.main.map((item) => (
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

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Publications
            </h4>
            <ul className="space-y-2">
              {footerLinks.external.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Subodh KC. All rights reserved.
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
