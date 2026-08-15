'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Printer, Scale, Clock, EyeOff, Activity, Shield, Globe, Phone, Sparkles, FileText, Briefcase, Layers, Grid, MessageSquare, Workflow, ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import ProfileCard from './ProfileCard'

const solutions = [
  {
    name: 'AI Automation Blueprint',
    href: '/ai-automation',
    description: 'Find the workflow worth improving',
    icon: Workflow,
    badge: '$500 fixed'
  },
  {
    name: 'AI Voice Agent',
    href: '/ai-voice-agent',
    description: 'Turn more calls into completed customer actions',
    icon: Phone,
    badge: 'from $499/mo'
  },
  {
    name: 'AI Security & Compliance',
    href: '/ai-security-compliance',
    description: 'Understand and strengthen AI controls',
    icon: Shield,
    badge: 'Custom'
  },
  {
    name: 'SaaS & AI Security Review',
    href: '/saas-security-review',
    description: 'Build buyer confidence with evidence',
    icon: Shield,
    badge: 'from $950'
  },
  {
    name: 'Direct AI Advisory',
    href: '/advisory',
    description: 'An AI advisor in the room',
    icon: Briefcase,
    badge: 'Custom'
  },
]

const insights = [
  {
    name: 'AI Intelligence',
    href: '/solutions/ai-briefing',
    description: 'Weekly AI intelligence for IT leaders',
    icon: Sparkles,
    badge: 'Free'
  },
  {
    name: 'Articles',
    href: '/writing',
    description: 'AI governance, architecture and practical insights',
    icon: FileText,
    badge: ''
  },
  {
    name: 'Research',
    href: '/research',
    description: 'Frameworks, methodologies and publications',
    icon: Lightbulb,
    badge: ''
  },
  {
    name: 'CSM Framework',
    href: '/cognitive-systems-management',
    description: 'Four-domain AI governance methodology',
    icon: Layers,
    badge: 'Published 2025'
  },
  {
    name: 'Architecture Decisions',
    href: '/architecture-decision-master-sheet',
    description: '25-layer architecture decision reference',
    icon: Grid,
    badge: 'Interactive'
  },
  {
    name: 'Guides',
    href: '/guides',
    description: 'Practical AI governance and compliance guides',
    icon: BookOpen,
    badge: ''
  },
]

const navigation = [
  { name: 'AI Advisor', href: '/ai-advisor' },
  { name: 'Solutions', href: '/solutions', hasDropdown: true, dropdownType: 'solutions' },
  { name: 'Insights', href: '/research', hasDropdown: true, dropdownType: 'insights' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [insightsOpen, setInsightsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const insightsDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
      }
      if (insightsDropdownRef.current && !insightsDropdownRef.current.contains(event.target as Node)) {
        setInsightsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="section-container flex items-center justify-between py-3 lg:py-4">
        <div className="flex lg:flex-1">
          <div className="-m-1.5 p-1.5">
            <ProfileCard />
          </div>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {navigation.map((item) => (
            item.hasDropdown ? (
              <div key={item.name} className="relative" ref={item.dropdownType === 'solutions' ? dropdownRef : insightsDropdownRef}>
                <button
                  onClick={() => item.dropdownType === 'solutions' ? setSolutionsOpen(!solutionsOpen) : setInsightsOpen(!insightsOpen)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {item.name}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", (item.dropdownType === 'solutions' ? solutionsOpen : insightsOpen) && "rotate-180")} />
                </button>
                {(item.dropdownType === 'solutions' ? solutionsOpen : insightsOpen) && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-xl shadow-xl p-2 z-50">
                    {(item.dropdownType === 'solutions' ? solutions : insights).map((product) => {
                      const Icon = product.icon
                      return (
                        <Link
                          key={product.name}
                          href={product.href}
                          onClick={() => item.dropdownType === 'solutions' ? setSolutionsOpen(false) : setInsightsOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{product.name}</span>
                              {product.badge && (
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  product.badge === 'Free' && "bg-green-500/10 text-green-500",
                                  product.badge === 'Published 2025' && "bg-purple-500/10 text-purple-500",
                                  product.badge === 'Interactive' && "bg-blue-500/10 text-blue-500",
                                  product.badge === '$500 fixed' && "bg-blue-500/10 text-blue-500",
                                  product.badge === 'from $499/mo' && "bg-blue-500/10 text-blue-500",
                                  product.badge === 'from $950' && "bg-blue-500/10 text-blue-500",
                                  product.badge === 'Custom' && "bg-indigo-500/10 text-indigo-500"
                                )}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            )
          ))}
          <Link
            href="/ai-advisor"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start AI Advisor
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <div className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <ProfileCard />
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  item.hasDropdown ? (
                    <div key={item.name} className="space-y-1">
                      <div className="-mx-3 px-3 py-2 text-base font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-1">
                        {(item.dropdownType === 'solutions' ? solutions : insights).map((product) => {
                          const Icon = product.icon
                          return (
                            <Link
                              key={product.name}
                              href={product.href}
                              className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{product.name}</span>
                              {product.badge && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full ml-auto",
                                product.badge === 'Free' && "bg-green-500/10 text-green-500",
                                product.badge === 'Published 2025' && "bg-purple-500/10 text-purple-500",
                                product.badge === 'Interactive' && "bg-blue-500/10 text-blue-500",
                                product.badge === '$500 fixed' && "bg-blue-500/10 text-blue-500",
                                product.badge === 'from $499/mo' && "bg-blue-500/10 text-blue-500",
                                product.badge === 'from $950' && "bg-blue-500/10 text-blue-500",
                                product.badge === 'Custom' && "bg-indigo-500/10 text-indigo-500"
                              )}>
                                {product.badge}
                              </span>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
