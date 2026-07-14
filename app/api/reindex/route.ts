import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ALL_SITE_URLS = [
  'https://subodhkc.com',
  'https://subodhkc.com/about',
  'https://subodhkc.com/executive-bio',
  'https://subodhkc.com/haiec',
  'https://subodhkc.com/services',
  'https://subodhkc.com/advisory',
  'https://subodhkc.com/solutions',
  'https://subodhkc.com/solutions/haiec',
  'https://subodhkc.com/solutions/kestrelvoice',
  'https://subodhkc.com/solutions/frontofai',
  'https://subodhkc.com/solutions/courtcase',
  'https://subodhkc.com/solutions/ai-briefing',
  'https://subodhkc.com/products',
  'https://subodhkc.com/products/llmverify',
  'https://subodhkc.com/products/print-later',
  'https://subodhkc.com/products/pdf-redactor',
  'https://subodhkc.com/products/doc-timeline',
  'https://subodhkc.com/products/skc-log-analyser',
  'https://subodhkc.com/products/courtcase',
  'https://subodhkc.com/writing',
  'https://subodhkc.com/research',
  'https://subodhkc.com/speaking',
  'https://subodhkc.com/contact',
  'https://subodhkc.com/course',
  'https://subodhkc.com/webinar/ai-laws-small-business',
  'https://subodhkc.com/faq',
  'https://subodhkc.com/person/subodh-kc',
  'https://subodhkc.com/llms.txt',
  'https://subodhkc.com/llms-full.txt',
  'https://subodhkc.com/ai.txt',
  'https://subodhkc.com/.well-known/ai-plugin.json',
  'https://subodhkc.com/.well-known/wikidata-entity.json',
]

export async function POST(request: NextRequest) {
  try {
    let urls: string[] = []

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        const body = await request.json()
        if (body.urls && Array.isArray(body.urls) && body.urls.length > 0) {
          urls = body.urls
        }
      } catch {
        // body parse failed — fall through to default
      }
    }

    if (urls.length === 0) {
      urls = ALL_SITE_URLS
    }

    const key = process.env.INDEXNOW_KEY || 'subodhkcindexnowkey2026'
    const host = 'subodhkc.com'

    const payload = {
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: urls,
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`IndexNow ping successful for ${urls.length} URLs`)
      return NextResponse.json({
        success: true,
        submitted: urls.length,
        urls,
        message: urls.length === ALL_SITE_URLS.length ? 'All site URLs submitted' : 'Specified URLs submitted',
      })
    }

    console.error('IndexNow ping failed:', response.status, response.statusText)
    return NextResponse.json(
      { success: false, error: `IndexNow returned ${response.status}` },
      { status: 500 }
    )
  } catch (error) {
    console.error('IndexNow error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/reindex',
    method: 'POST',
    description: 'Submit URLs to IndexNow for faster indexing (Bing, Yandex, Seznam)',
    usage: {
      submit_all: 'POST /api/reindex (no body) — submits all 32 site URLs',
      submit_specific: 'POST /api/reindex with JSON body { "urls": ["https://subodhkc.com/page"] }',
    },
    totalUrls: ALL_SITE_URLS.length,
    note: 'IndexNow works with Bing, Yandex, and Seznam. Google does not support IndexNow — use Google Search Console to submit sitemap manually.',
  })
}
