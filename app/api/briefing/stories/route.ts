/**
 * GET /api/briefing/stories
 *
 * Fetches AI intelligence stories from the FrontOfAI platform.
 * Returns stories with category, impact score, source, and persona-specific
 * summaries for the SubodhKC dashboard.
 *
 * Query params:
 *   ?persona=exec|cto|pm|dev|all  (default: all)
 *   ?limit=20                     (default: 20, max: 50)
 *   ?timeframe=24h|7d|30d|all     (default: 7d)
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const FRONTOFAI_URL = process.env.FRONTOFAI_API_URL || 'https://www.frontofai.com'

interface FrontOfAIStory {
  id: string
  slug: string
  title: string
  summary_short: string
  summary_extended: string | null
  summary_manager: string | null
  source_name: string
  source_url: string
  published_at: string | null
  scraped_at: string | null
  it_impact_score: number
  relevant_roles: string[]
  category_details: { slug: string; name: string }[]
  why_this_matters?: string | null
  action_item?: string | null
  action_owner?: string | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const persona = searchParams.get('persona') || 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const timeframe = searchParams.get('timeframe') || '7d'

    // Fetch from FrontOfAI's public briefing API
    const apiUrl = `${FRONTOFAI_URL}/api/briefing/ongoing-week`
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch stories from FrontOfAI', stories: [] },
        { status: 502 }
      )
    }

    const data = await res.json()
    let stories: FrontOfAIStory[] = data.stories || []

    // Apply persona filter
    if (persona !== 'all') {
      const personaRoleMap: Record<string, string[]> = {
        exec: ['exec', 'cto'],
        cto: ['cto', 'exec'],
        pm: ['pm', 'tpm', 'product'],
        dev: ['devops', 'sre', 'it_ops', 'security', 'data'],
      }
      const allowedRoles = personaRoleMap[persona] ?? []
      stories = stories.filter((s) => {
        const roles = Array.isArray(s.relevant_roles) ? s.relevant_roles : []
        // Show story if it targets this persona OR has no role restrictions
        return roles.length === 0 || roles.some((r) => allowedRoles.includes(r))
      })
    }

    // Apply timeframe filter
    if (timeframe !== 'all') {
      const hoursMap: Record<string, number> = { '24h': 24, '7d': 168, '30d': 720 }
      const hours = hoursMap[timeframe]
      if (hours) {
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
        stories = stories.filter((s) => {
          const date = new Date(s.scraped_at || s.published_at || 0)
          return date >= cutoff
        })
      }
    }

    // Sort by impact score (descending), then by date
    stories.sort((a, b) => {
      if (b.it_impact_score !== a.it_impact_score) {
        return b.it_impact_score - a.it_impact_score
      }
      return new Date(b.scraped_at || b.published_at || 0).getTime() -
             new Date(a.scraped_at || a.published_at || 0).getTime()
    })

    // Limit results
    stories = stories.slice(0, limit)

    // Map to SubodhKC format
    const mappedStories = stories.map((s) => {
      const categorySlug = s.category_details?.[0]?.slug || 'enterprise'
      const categoryMap: Record<string, { label: string; icon: string }> = {
        'breakthroughs': { label: 'Breakthroughs', icon: '🚀' },
        'tools-repos': { label: 'Tools & Repos', icon: '🔧' },
        'security-riskwatch': { label: 'Security', icon: '🛡️' },
        'cloud-enterprise': { label: 'Enterprise', icon: '☁️' },
        'model-releases': { label: 'Model Releases', icon: '🤖' },
        'governance-regulation': { label: 'Governance', icon: '⚖️' },
        'opinion-insight': { label: 'Insight', icon: '💡' },
      }
      const cat = categoryMap[categorySlug] || { label: 'AI News', icon: '📰' }

      const impactLevel = s.it_impact_score >= 8 ? 'critical' :
                          s.it_impact_score >= 6 ? 'high' :
                          s.it_impact_score >= 4 ? 'medium' : 'low'

      return {
        id: s.id,
        title: s.title,
        summaryShort: s.summary_short,
        summaryExtended: s.summary_extended,
        summaryManager: s.summary_manager,
        sourceName: s.source_name,
        sourceUrl: s.source_url,
        publishedAt: s.published_at,
        scrapedAt: s.scraped_at,
        impactScore: s.it_impact_score,
        impactLevel,
        category: { slug: categorySlug, label: cat.label, icon: cat.icon },
        relevantRoles: s.relevant_roles || [],
        whyItMatters: s.why_this_matters || null,
        actionItem: s.action_item || null,
        actionOwner: s.action_owner || null,
      }
    })

    return NextResponse.json({
      success: true,
      stories: mappedStories,
      meta: {
        count: mappedStories.length,
        persona,
        timeframe,
        source: 'frontofai',
        isFallback: data.meta?.isFallback ?? false,
      },
    })
  } catch (error: any) {
    console.error('[SubodhKC Briefing] Error fetching stories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load AI intelligence stories',
        stories: [],
      },
      { status: 500 }
    )
  }
}
