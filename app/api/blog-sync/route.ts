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

    // Auto-trigger IndexNow for all blog URLs
    const currentPosts = getAllPosts()
    const blogUrls = [
      'https://subodhkc.com/blog',
      'https://subodhkc.com/feed.xml',
      ...currentPosts.map((p) => `https://subodhkc.com/blog/${p.slug}`),
    ]

    const indexNowKey = process.env.INDEXNOW_KEY || 'subodhkcindexnowkey2026'
    try {
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'subodhkc.com',
          key: indexNowKey,
          keyLocation: `https://subodhkc.com/${indexNowKey}.txt`,
          urlList: blogUrls,
        }),
      })
      console.log(`IndexNow pinged ${blogUrls.length} blog URLs after sync`)
    } catch (indexErr) {
      console.error('IndexNow ping failed (non-blocking):', indexErr)
    }

    return NextResponse.json({
      success: true,
      message: `Found ${allSummaries.length} articles. Run sync-blog.mjs locally to save them. IndexNow pinged ${blogUrls.length} URLs.`,
      articles: allSummaries.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        createdAt: a.created_at,
      })),
      currentPosts: currentPosts.length,
      indexNowPinged: blogUrls.length,
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
