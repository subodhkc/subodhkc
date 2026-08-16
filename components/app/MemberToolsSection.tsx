'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Boxes, ExternalLink, Loader2 } from 'lucide-react'

interface MemberTool {
  id: string
  tool_key: string
  name: string
  description: string | null
  category: string | null
  access_level: string
  allowed_plans: string[]
  external_url: string | null
  internal_path: string | null
  production_ready: boolean
  visible_to_client: boolean
  display_order: number
}

interface MemberToolsSectionProps {
  orgSlug: string
  canAccess: boolean
}

const categoryColors: Record<string, string> = {
  assessment: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  governance: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  research: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  planning: 'bg-green-500/10 text-green-600 border-green-500/20',
  monitoring: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  reference: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  utility: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
}

export function MemberToolsSection({ orgSlug, canAccess }: MemberToolsSectionProps) {
  const [tools, setTools] = useState<MemberTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!canAccess) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchTools() {
      try {
        const res = await fetch(`/api/member-tools?orgSlug=${encodeURIComponent(orgSlug)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) {
          setTools(data.tools || [])
        }
      } catch {
        // Silently fail - tools will just not appear
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTools()
    return () => { cancelled = true }
  }, [orgSlug, canAccess])

  if (!canAccess) {
    return (
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Boxes className="h-5 w-5 text-primary" />
          Member Tools
        </h2>
        <div className="border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Member Tools are included with your subscription.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Boxes className="h-5 w-5 text-primary" />
        Member Tools
      </h2>
      {loading ? (
        <div className="border rounded-lg p-6 text-center">
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Loading member tools...</p>
        </div>
      ) : tools.length === 0 ? (
        <div className="border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Member tools will appear here as they become available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tools.map(tool => {
            const href = tool.internal_path || tool.external_url
            const isExternal = !!tool.external_url && !tool.internal_path
            const categoryColor = tool.category
              ? categoryColors[tool.category] || 'bg-muted text-muted-foreground border-border'
              : null

            return (
              <div key={tool.id} className="border rounded-lg p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium">{tool.name}</h3>
                  {tool.category && (
                    <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${categoryColor}`}>
                      {tool.category}
                    </span>
                  )}
                </div>
                {tool.description && (
                  <p className="text-xs text-muted-foreground mt-1 flex-1">{tool.description}</p>
                )}
                {href && (
                  isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                    >
                      Open Tool
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                    >
                      Open Tool
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
