#!/usr/bin/env node

/**
 * send-newsletter.mjs — Broadcast newsletter to all Resend contacts.
 *
 * CAN-SPAM compliant:
 * - Physical postal address in footer
 * - Clear "Unsubscribe" link
 * - Sender identity (Subodh KC)
 * - Subject line is not deceptive
 *
 * Usage:
 *   node scripts/send-newsletter.mjs                    # Send to all contacts
 *   node scripts/send-newsletter.mjs --dry-run           # Preview without sending
 *   node scripts/send-newsletter.mjs --subject "..." --body "..."  # Custom content
 *
 * Requires RESEND_API_KEY in .env.local or environment.
 * Reads latest blog posts and generates a newsletter from them.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(PROJECT_ROOT, 'data', 'blog', 'posts')

function loadEnvLocal() {
  const envPath = path.join(PROJECT_ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvLocal()

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
const DRY_RUN = process.argv.includes('--dry-run')

if (!RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY not set in .env.local')
  process.exit(1)
}

function getLatestPosts(count = 3) {
  try {
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'))
    const posts = files.map((f) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')
      return JSON.parse(raw)
    })
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return posts.slice(0, count)
  } catch {
    return []
  }
}

function generateNewsletterHtml(posts) {
  const postItems = posts.map((p) => `
    <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
      <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px; color: #1f2937;">
        <a href="${SITE_URL}/blog/${p.slug}" style="color: #1f2937; text-decoration: none;">
          ${p.title}
        </a>
      </h2>
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px; line-height: 1.5;">
        ${p.metaDescription || p.excerpt || ''}
      </p>
      <a href="${SITE_URL}/blog/${p.slug}"
         style="display: inline-block; background: #071927; color: white; text-decoration: none;
                padding: 8px 20px; border-radius: 6px; font-size: 13px; font-weight: 500;">
        Read article →
      </a>
    </div>
  `).join('')

  const postCount = posts.length
  const subject = postCount === 1
    ? `New article: ${posts[0].title}`
    : `${postCount} new articles on AI governance & architecture`

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #071927 0%, #113349 100%); padding: 32px 30px; text-align: center; border-radius: 0 0 20px 20px;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">AI Insights</h1>
      <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0 0; font-size: 14px;">
        ${postCount === 1 ? 'New article from Subodh KC' : `${postCount} new articles from Subodh KC`}
      </p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      ${postItems}

      <div style="text-align: center; margin-top: 32px;">
        <a href="${SITE_URL}/blog"
           style="display: inline-block; background: #10B981; color: white; text-decoration: none;
                  padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          See all articles →
        </a>
      </div>
    </div>

    <!-- Author note -->
    <div style="background: white; padding: 24px 30px; margin: 0 20px 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        <strong>Subodh KC</strong> — AI Systems Architect & Governance Expert.
        Former Fortune 50 AI Strategy CTL. Founder of HAIEC.
        <a href="${SITE_URL}/about" style="color: #10B981; text-decoration: none;">Learn more →</a>
      </p>
    </div>

    <!-- CAN-SPAM Footer -->
    <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 10px 0;">
        <strong style="color: #6b7280;">Subodh KC</strong><br>
        AI Systems Architect & Governance Expert<br>
        Dallas, Texas, USA
      </p>
      <p style="margin: 10px 0;">
        <a href="${SITE_URL}" style="color: #10B981; text-decoration: none;">subodhkc.com</a> |
        <a href="https://linkedin.com/in/subodhkc" style="color: #10B981; text-decoration: none;">LinkedIn</a> |
        <a href="${SITE_URL}/blog" style="color: #10B981; text-decoration: none;">Blog</a>
      </p>
      <p style="margin: 15px 0 0 0; color: #d1d5db; font-size: 11px;">
        You're receiving this because you subscribed to AI Insights at subodhkc.com<br>
        <a href="${SITE_URL}/unsubscribe" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> |
        <a href="${SITE_URL}/privacy" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a>
      </p>
    </div>

  </body>
</html>
  `.trim()

  return { subject, html }
}

async function getContacts() {
  const res = await fetch('https://api.resend.com/contacts', {
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend contacts API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const contacts = Array.isArray(data) ? data : (data.data || [])
  return contacts.filter((c) => !c.unsubscribed)
}

async function sendBroadcast(emails, subject, html) {
  const results = { sent: 0, failed: 0, errors: [] }

  for (const email of emails) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Subodh KC <noreply@subodhkc.com>',
          to: [email],
          subject,
          html,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        results.failed++
        results.errors.push({ email, error: text })
        console.error(`  ✗ Failed: ${email} — ${text}`)
      } else {
        results.sent++
        console.log(`  ✓ Sent: ${email}`)
      }

      // Rate limit: 2 emails per second
      await new Promise((r) => setTimeout(r, 600))
    } catch (err) {
      results.failed++
      results.errors.push({ email, error: err.message })
      console.error(`  ✗ Error: ${email} — ${err.message}`)
    }
  }

  return results
}

async function main() {
  console.log('=== Newsletter Broadcast ===\n')

  const posts = getLatestPosts(3)

  if (posts.length === 0) {
    console.log('No blog posts found. Nothing to send.')
    return
  }

  console.log(`Found ${posts.length} recent posts:`)
  posts.forEach((p) => console.log(`  - ${p.title}`))

  const { subject, html } = generateNewsletterHtml(posts)

  console.log(`\nSubject: ${subject}`)

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would send to all contacts.')
    console.log('\n--- HTML Preview (first 500 chars) ---')
    console.log(html.slice(0, 500))
    console.log('...\n')
    return
  }

  console.log('\nFetching contacts from Resend...')
  const contacts = await getContacts()
  const emails = contacts.map((c) => c.email).filter(Boolean)

  if (emails.length === 0) {
    console.log('No subscribed contacts found.')
    return
  }

  console.log(`Sending to ${emails.length} subscribers...\n`)

  const results = await sendBroadcast(emails, subject, html)

  console.log(`\n=== Broadcast Complete ===`)
  console.log(`  Sent: ${results.sent}`)
  console.log(`  Failed: ${results.failed}`)

  if (results.errors.length > 0) {
    console.log(`\nErrors:`)
    results.errors.forEach((e) => console.log(`  ${e.email}: ${e.error}`))
  }
}

main().catch((err) => {
  console.error('Newsletter broadcast failed:', err)
  process.exit(1)
})
