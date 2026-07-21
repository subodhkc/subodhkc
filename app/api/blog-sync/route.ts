import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const syncSecret = process.env.BABYLOVE_SYNC_SECRET

  if (!syncSecret) {
    return NextResponse.json({ error: 'Sync secret not configured' }, { status: 500 })
  }

  if (authHeader !== `Bearer ${syncSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.BABYLOVE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'BabyLoveGrowth API key not configured' }, { status: 500 })
  }

  try {
    const API_BASE = 'https://api.babylovegrowth.ai/api/integrations'
    const allSummaries: any[] = []
    let offset = 0
    const limit = 50

    while (true) {
      const res = await fetch(`${API_BASE}/v1/articles?limit=${limit}&offset=${offset}`, {
        headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        return NextResponse.json({ error: `BLG API error: ${res.status}` }, { status: 502 })
      }
      const batch = await res.json()
      if (!Array.isArray(batch) || batch.length === 0) break
      allSummaries.push(...batch)
      if (batch.length < limit) break
      offset += limit
    }

    return NextResponse.json({
      success: true,
      message: `Found ${allSummaries.length} articles. Run sync-blog.mjs locally to save them.`,
      articles: allSummaries.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        createdAt: a.created_at,
      })),
      currentPosts: getAllPosts().length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const posts = getAllPosts()
  return NextResponse.json({
    count: posts.length,
    posts: posts.map((p) => ({ slug: p.slug, title: p.title, createdAt: p.createdAt })),
  })
}
