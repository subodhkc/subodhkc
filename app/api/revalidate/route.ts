// app/api/revalidate/route.ts - on-demand ISR revalidation endpoint
// Triggered daily at 09:00 CST by the .github/workflows/revalidate-frontofai.yml
// cron (and manually via workflow_dispatch). Refreshes the FrontOfAI news banner
// feed cache and the homepage so the news ticker stays aligned with FrontOfAI's
// update window without hourly polling.
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NEWS_TAG } from '@/components/home/FrontOfAIBanner'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    console.error('[revalidate] REVALIDATE_SECRET is not set')
    return NextResponse.json({ error: 'Revalidate secret not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // { expire: 0 } → immediate expiration (next visitor gets a fresh fetch).
    // Recommended form for webhook/cron-triggered revalidation per Next.js 16 docs.
    revalidateTag(NEWS_TAG, { expire: 0 })
    revalidatePath('/', 'layout')
    return NextResponse.json({ revalidated: true, tag: NEWS_TAG, path: '/' })
  } catch (err) {
    console.error('[revalidate] failed:', err)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
