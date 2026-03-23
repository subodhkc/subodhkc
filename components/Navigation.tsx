'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Printer, Scale, Clock, EyeOff, Activity, Shield, Globe, Phone, Sparkles, FileText, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import ProfileCard from './ProfileCard'

const products = [
  { 
    name: 'llmverify', 
    href: '/products/llmverify',
    description: 'LLM output verification & guardrails',
    icon: Shield,
    badge: 'Open Source'
  },
  { 
    name: 'Print Later', 
    href: '/products/print-later',
    description: 'Save web pages, print when ready',
    icon: Printer,
    badge: 'Free'
  },
  { 
    name: 'PDF Redactor', 
    href: '/products/pdf-redactor',
    description: 'AI-powered sensitive data removal',
    icon: EyeOff,
    badge: 'Free'
  },
  { 
    name: 'Doc Timeline', 
    href: '/products/doc-timeline',
    description: 'Document timeline extraction',
    icon: Clock,
    badge: 'Enterprise'
  },
  { 
    name: 'SKC Log Analyser', 
    href: '/products/skc-log-analyser',
    description: 'AI log analysis & anomaly detection',
    icon: Activity,
    badge: 'Early Access'
  },
  { 
    name: 'CourtCase', 
    href: '/products/courtcase',
    description: 'Legal document organization',
    icon: Scale,
    badge: 'Coming Soon'
  },
]

const solutions = [
  { 
    name: 'HAIEC', 
    href: '/solutions/haiec',
    description: 'AI Compliance & Governance Platform',
    icon: Shield,
    badge: 'Enterprise',
    external: 'https://www.haiec.com'
  },
  { 
    name: 'KestrelVoice', 
    href: '/solutions/kestrelvoice',
    description: 'AI Voice Operations Platform',
    icon: Phone,
    badge: 'Production',
    external: 'https://www.kestrelvoice.com'
  },
  { 
    name: 'FrontOfAI', 
    href: '/solutions/frontofai',
    description: 'Enterprise AI Solutions Platform',
    icon: Sparkles,
    badge: 'Live',
    external: 'https://frontofai.com'
  },
  { 
    name: 'CourtCase', 
    href: '/solutions/courtcase',
    description: 'AI-Assisted Court Evidence Builder',
    icon: Scale,
    badge: 'Beta',
    external: 'https://courtcase.frontofai.com'
  },
  { 
    name: 'AI Briefing', 
    href: '/solutions/ai-briefing',
    description: 'Weekly AI Intelligence for IT Leaders',
    icon: FileText,
    badge: 'Free',
    external: 'https://frontofai.com/briefing'
  },
]

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Solutions', href: '/solutions', hasDropdown: true, dropdownType: 'solutions' },
  { name: 'Products', href: '/products', hasDropdown: true, dropdownType: 'products' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const solutionsDropdownRef = useRef<HTMLDivElement>(null)

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
        setProductsOpen(false)
      }
      if (solutionsDropdownRef.current && !solutionsDropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
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
      <nav className="section-container flex items-center justify-between py-4">
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
              <div key={item.name} className="relative" ref={item.dropdownType === 'solutions' ? solutionsDropdownRef : dropdownRef}>
                <button
                  onClick={() => item.dropdownType === 'solutions' ? setSolutionsOpen(!solutionsOpen) : setProductsOpen(!productsOpen)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {item.name}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", (item.dropdownType === 'solutions' ? solutionsOpen : productsOpen) && "rotate-180")} />
                </button>
                {(item.dropdownType === 'solutions' ? solutionsOpen : productsOpen) && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-xl shadow-xl p-2 z-50">
                    {(item.dropdownType === 'solutions' ? solutions : products).map((product) => {
                      const Icon = product.icon
                      return (
                        <Link
                          key={product.name}
                          href={product.href}
                          onClick={() => item.dropdownType === 'solutions' ? setSolutionsOpen(false) : setProductsOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{product.name}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                product.badge === 'Free' && "bg-green-500/10 text-green-500",
                                product.badge === 'Open Source' && "bg-blue-500/10 text-blue-500",
                                product.badge === 'Enterprise' && "bg-indigo-500/10 text-indigo-500",
                                product.badge === 'Early Access' && "bg-purple-500/10 text-purple-500",
                                product.badge === 'Coming Soon' && "bg-amber-500/10 text-amber-500",
                                product.badge === 'Production' && "bg-emerald-500/10 text-emerald-500",
                                product.badge === 'Live' && "bg-cyan-500/10 text-cyan-500",
                                product.badge === 'Beta' && "bg-orange-500/10 text-orange-500"
                              )}>
                                {product.badge}
                              </span>
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
                        {(item.dropdownType === 'solutions' ? solutions : products).map((product) => {
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
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full ml-auto",
                                product.badge === 'Free' && "bg-green-500/10 text-green-500",
                                product.badge === 'Open Source' && "bg-blue-500/10 text-blue-500",
                                product.badge === 'Enterprise' && "bg-indigo-500/10 text-indigo-500",
                                product.badge === 'Early Access' && "bg-purple-500/10 text-purple-500",
                                product.badge === 'Coming Soon' && "bg-amber-500/10 text-amber-500",
                                product.badge === 'Production' && "bg-emerald-500/10 text-emerald-500",
                                product.badge === 'Live' && "bg-cyan-500/10 text-cyan-500",
                                product.badge === 'Beta' && "bg-orange-500/10 text-orange-500"
                              )}>
                                {product.badge}
                              </span>
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
