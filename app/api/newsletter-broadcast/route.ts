import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = getAllPosts()
  const recent = posts.slice(0, 5).map((p) => ({
    slug: p.slug,
    title: p.title,
    createdAt: p.createdAt,
  }))

  return NextResponse.json({
    subscriberCount: null,
    recentPosts: recent,
    lastBroadcast: null,
  })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.BABYLOVE_SYNC_SECRET || process.env.NEWSLETTER_BROADCAST_SECRET

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Broadcast secret not configured' },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { subject, html, postCount = 3 } = body

    // If no custom content, generate from latest blog posts
    const posts = getAllPosts()
    const recentPosts = posts.slice(0, postCount)

    if (recentPosts.length === 0) {
      return NextResponse.json(
        { error: 'No blog posts available to send' },
        { status: 400 }
      )
    }

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'

    // Generate newsletter content if not provided
    const finalSubject = subject || (recentPosts.length === 1
      ? `New article: ${recentPosts[0].title}`
      : `${recentPosts.length} new articles on AI governance & architecture`)

    const finalHtml = html || generateNewsletterHtml(recentPosts, SITE_URL)

    // Fetch contacts from Resend
    const contactsRes = await fetch('https://api.resend.com/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!contactsRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch contacts from Resend' },
        { status: 500 }
      )
    }

    const contactsData = await contactsRes.json()
    const contacts: Array<{ email: string; unsubscribed: boolean }> = Array.isArray(contactsData) ? contactsData : (contactsData.data || [])
    const emails = contacts.filter((c: { email: string; unsubscribed: boolean }) => !c.unsubscribed).map((c: { email: string }) => c.email).filter(Boolean)

    if (emails.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to send to',
        sent: 0,
      })
    }

    // Send to each subscriber (rate limited: 600ms between sends)
    let sent = 0
    let failed = 0
    const errors = []

    for (const email of emails) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Subodh KC <noreply@subodhkc.com>',
            to: [email],
            subject: finalSubject,
            html: finalHtml,
          }),
        })

        if (!res.ok) {
          failed++
          errors.push({ email, error: await res.text() })
        } else {
          sent++
        }

        await new Promise((r) => setTimeout(r, 600))
      } catch (err) {
        failed++
        errors.push({ email, error: String(err) })
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      totalSubscribers: emails.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Newsletter broadcast error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateNewsletterHtml(posts: any[], siteUrl: string): string {
  const postItems = posts.map((p) => `
    <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
      <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px; color: #1f2937;">
        <a href="${siteUrl}/blog/${p.slug}" style="color: #1f2937; text-decoration: none;">${p.title}</a>
      </h2>
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px; line-height: 1.5;">${p.metaDescription || p.excerpt || ''}</p>
      <a href="${siteUrl}/blog/${p.slug}" style="display: inline-block; background: #071927; color: white; text-decoration: none; padding: 8px 20px; border-radius: 6px; font-size: 13px; font-weight: 500;">Read article →</a>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #071927 0%, #113349 100%); padding: 32px 30px; text-align: center; border-radius: 0 0 20px 20px;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">AI Insights</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">${posts.length} new ${posts.length === 1 ? 'article' : 'articles'} from Subodh KC</p>
    </div>
    <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      ${postItems}
      <div style="text-align: center; margin-top: 32px;">
        <a href="${siteUrl}/blog" style="display: inline-block; background: #10B981; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">See all articles →</a>
      </div>
    </div>
    <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 10px;"><strong style="color: #6b7280;">Subodh KC</strong><br>AI Systems Architect & Governance Expert<br>Dallas, Texas, USA</p>
      <p style="margin: 10px 0;"><a href="${siteUrl}" style="color: #10B981; text-decoration: none;">subodhkc.com</a> | <a href="https://linkedin.com/in/subodhkc" style="color: #10B981; text-decoration: none;">LinkedIn</a></p>
      <p style="margin: 15px 0 0; color: #d1d5db; font-size: 11px;">You're receiving this because you subscribed to AI Insights at subodhkc.com<br><a href="${siteUrl}/unsubscribe" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> | <a href="${siteUrl}/privacy" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a></p>
    </div>
  </body>
</html>`
}
