import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const INDEXNOW_KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { urls } = body as { urls?: string[] }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'urls array is required' },
        { status: 400 }
      )
    }

    if (urls.length > 10000) {
      return NextResponse.json(
        { error: 'Maximum 10,000 URLs per request' },
        { status: 400 }
      )
    }

    const payload = {
      host: 'subodhkc.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/indexnow-key.txt`,
      urlList: urls,
    }

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok || response.status === 202 || response.status === 200) {
      return NextResponse.json({
        success: true,
        submitted: urls.length,
        status: response.status,
      })
    }

    const errorText = await response.text()
    return NextResponse.json(
      { error: `IndexNow API returned ${response.status}`, detail: errorText },
      { status: response.status }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit to IndexNow', detail: String(error) },
      { status: 500 }
    )
  }
}
