#!/usr/bin/env node

/**
 * Check LinkedIn posts for new comments and send email notifications.
 *
 * Reads data/social/posted.json to find all LinkedIn post URNs,
 * fetches comments via the LinkedIn API, compares against a seen-comments
 * tracker, and sends an email via Resend for any new comments.
 *
 * Usage:
 *   node scripts/linkedin-comment-monitor.mjs           # Check and notify
 *   node scripts/linkedin-comment-monitor.mjs --dry-run  # Preview without sending email
 *
 * Requires:
 *   LINKEDIN_ACCESS_TOKEN — OAuth token with r_member_social scope
 *   RESEND_API_KEY — for sending email notifications
 *
 * Note: To read comments, your LinkedIn app needs the "r_member_social" scope.
 * Add it by enabling the "Share on LinkedIn" product (which you already have)
 * and requesting the scope in your OAuth authorization URL.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const LINKEDIN_API = 'https://api.linkedin.com'
const POSTED_TRACKER_PATH = path.join(ROOT, 'data', 'social', 'posted.json')
const SEEN_COMMENTS_PATH = path.join(ROOT, 'data', 'social', 'seen-comments.json')

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

loadEnvLocal()

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return fallback
  }
}

function saveJson(filePath, data) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

/**
 * Fetch comments for a LinkedIn post URN.
 * Uses the socialActions API.
 */
async function fetchComments(accessToken, postUrn) {
  const url = `${LINKEDIN_API}/v2/socialActions/${encodeURIComponent(postUrn)}/comments`
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.warn(`Could not fetch comments for ${postUrn} (${response.status}): ${error}`)
    return []
  }

  const data = await response.json()
  return data.elements || []
}

/**
 * Send email notification via Resend.
 */
async function sendNotificationEmail(commentsByPost) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not set — cannot send email notification')
    return false
  }

  const totalComments = Object.values(commentsByPost).reduce((sum, c) => sum + c.length, 0)
  if (totalComments === 0) return true

  // Build email HTML
  let html = `
    <h2>LinkedIn Comment Notifications</h2>
    <p>You have ${totalComments} new comment${totalComments > 1 ? 's' : ''} on your LinkedIn posts.</p>
  `

  for (const [slug, info] of Object.entries(commentsByPost)) {
    html += `<h3>Article: ${slug}</h3>`
    html += `<p><a href="https://www.linkedin.com/feed/update/${info.urn}">View post on LinkedIn</a></p>`
    for (const comment of info.comments) {
      html += `
        <div style="border-left: 3px solid #0a66c2; padding: 12px; margin: 8px 0; background: #f3f2f0;">
          <p><strong>${comment.authorName || 'LinkedIn member'}</strong> commented:</p>
          <p>${comment.text}</p>
          <p style="color: #666; font-size: 12px;">${comment.createdAt || ''}</p>
        </div>
      `
    }
  }

  html += `
    <hr>
    <p style="color: #666; font-size: 12px;">
      Sent from subodhkc.com LinkedIn monitor. Reply on LinkedIn to respond to comments.
    </p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'LinkedIn Monitor <notifications@subodhkc.com>',
      to: ['subodh@subodhkc.com'],
      subject: `LinkedIn: ${totalComments} new comment${totalComments > 1 ? 's' : ''} on your posts`,
      html: html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`Failed to send email (${response.status}): ${error}`)
    return false
  }

  console.log(`Notification email sent for ${totalComments} new comment(s)`)
  return true
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
  if (!accessToken) {
    console.error('ERROR: LINKEDIN_ACCESS_TOKEN must be set')
    process.exit(1)
  }

  const postedTracker = loadJson(POSTED_TRACKER_PATH, {})
  const seenComments = loadJson(SEEN_COMMENTS_PATH, {})

  const postedSlugs = Object.keys(postedTracker).filter(
    (s) => postedTracker[s].urn && postedTracker[s].urn !== 'unknown'
  )

  if (postedSlugs.length === 0) {
    console.log('No LinkedIn posts found in tracker. Nothing to monitor.')
    return
  }

  console.log(`Checking ${postedSlugs.length} LinkedIn post(s) for new comments...`)

  const newCommentsByPost = {}

  for (const slug of postedSlugs) {
    const urn = postedTracker[slug].urn
    console.log(`  Checking ${slug} (${urn})...`)

    const comments = await fetchComments(accessToken, urn)
    if (comments.length === 0) {
      console.log(`    No comments found`)
      continue
    }

    const seenKey = slug
    const seen = seenComments[seenKey] || []
    const newOnes = comments.filter((c) => {
      const commentId = c.$id || c.id || c.objectUrn || JSON.stringify(c)
      return !seen.includes(commentId)
    })

    if (newOnes.length > 0) {
      console.log(`    ${newOnes.length} new comment(s) found!`)
      newCommentsByPost[slug] = {
        urn: urn,
        comments: newOnes.map((c) => ({
          id: c.$id || c.id || '',
          text: c.message?.text || c.comment || '',
          authorName: c.actor?.name?.text || c.author?.name || 'LinkedIn member',
          createdAt: c.createdTime || c.createdAt || '',
        })),
      }

      // Mark as seen
      seenComments[seenKey] = [
        ...seen,
        ...newOnes.map((c) => c.$id || c.id || c.objectUrn || JSON.stringify(c)),
      ]
    } else {
      console.log(`    No new comments (all already seen)`)
    }
  }

  // Save seen comments tracker
  saveJson(SEEN_COMMENTS_PATH, seenComments)

  const totalNew = Object.values(newCommentsByPost).reduce((s, p) => s + p.comments.length, 0)

  if (totalNew === 0) {
    console.log('\nNo new comments across all posts.')
    return
  }

  if (dryRun) {
    console.log(`\n[DRY RUN] Found ${totalNew} new comment(s). Would send email notification.`)
    console.log(JSON.stringify(newCommentsByPost, null, 2))
    return
  }

  await sendNotificationEmail(newCommentsByPost)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
