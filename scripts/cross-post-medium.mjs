#!/usr/bin/env node

/**
 * cross-post-medium.mjs — Generate Medium import reminders for blog articles.
 *
 * Medium shut down API token generation for new accounts. The only reliable
 * automated path is Medium's "Import a story" feature, which pulls content
 * from a URL and preserves the canonical link.
 *
 * This script:
 * 1. Finds articles not yet cross-posted to Medium
 * 2. Sends an email reminder with a one-click import link
 * 3. Tracks which articles have been reminded/published
 *
 * Usage:
 *   node scripts/cross-post-medium.mjs --slug=<slug>   # Remind for specific article
 *   node scripts/cross-post-medium.mjs --missing        # Remind for all untracked articles
 *   node scripts/cross-post-medium.mjs --mark=<slug>    # Mark as published (after manual import)
 *
 * Requires RESEND_API_KEY in .env.local or environment.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(PROJECT_ROOT, 'data', 'blog', 'posts')
const TRACKER_PATH = path.join(PROJECT_ROOT, 'data', 'blog', 'medium-posted.json')
const SITE_URL = 'https://subodhkc.com'

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
    if (!process.env[key]) process.env[key] = value
  }
}

function loadTracker() {
  if (!fs.existsSync(TRACKER_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function saveTracker(tracker) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2))
}

function getAllSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
}

function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

async function sendImportReminder(post, slug) {
  const articleUrl = `${SITE_URL}/blog/${slug}`
  const importUrl = `https://medium.com/p/import?url=${encodeURIComponent(articleUrl)}`

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: 'Cross-Post Reminder <noreply@subodhkc.com>',
    to: ['subodhkc@subodhkc.com'],
    subject: `📝 Medium cross-post reminder: ${post.title}`,
    html: `
      <h2>Medium Cross-Post Reminder</h2>
      <p>The following article is ready to cross-post to Medium:</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${post.title}</h3>
        <p style="color: #6b7280; font-size: 14px;">${post.excerpt || post.metaDescription}</p>
        <p><strong>Original URL:</strong> <a href="${articleUrl}">${articleUrl}</a></p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${importUrl}" style="display: inline-block; background: #000; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Import to Medium →
        </a>
      </div>
      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⚠️ Important:</strong> After importing, verify the canonical URL is set to
          <code>${articleUrl}</code> in Story Settings → Advanced Settings → Canonical URL.
        </p>
      </div>
      <p style="color: #6b7280; font-size: 12px;">
        After publishing on Medium, run:<br>
        <code>node scripts/cross-post-medium.mjs --mark=${slug}</code>
      </p>
    `,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }

  return data
}

async function main() {
  loadEnvLocal()

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const markArg = args.find((a) => a.startsWith('--mark='))?.split('=')[1]
  const missingMode = args.includes('--missing')

  const tracker = loadTracker()

  if (markArg) {
    const post = getPostBySlug(markArg)
    if (!post) {
      console.error(`Post not found: ${markArg}`)
      process.exit(1)
    }
    tracker[markArg] = {
      published: true,
      date: new Date().toISOString(),
      mediumUrl: `https://medium.com/@subodhkc/${markArg}`,
    }
    saveTracker(tracker)
    console.log(`  ✓ Marked ${markArg} as published on Medium`)
    return
  }

  let slugsToProcess = []

  if (slugArg) {
    slugsToProcess = [slugArg]
  } else if (missingMode) {
    const allSlugs = getAllSlugs()
    slugsToProcess = allSlugs.filter((s) => !tracker[s])
  } else {
    console.error('Usage: node scripts/cross-post-medium.mjs --slug=<slug> | --missing | --mark=<slug>')
    process.exit(1)
  }

  if (slugsToProcess.length === 0) {
    console.log('No articles to remind about.')
    return
  }

  console.log(`Sending Medium import reminders for ${slugsToProcess.length} article(s)...`)

  // Daily cap: max 3 reminders per run to avoid email flooding
  const MAX_REMINDERS = 3
  let sent = 0

  for (const slug of slugsToProcess) {
    if (sent >= MAX_REMINDERS) {
      console.log(`\n  ⏸  Daily cap reached (${MAX_REMINDERS}). Remaining ${slugsToProcess.length - sent} will be reminded next run.`)
      break
    }

    const post = getPostBySlug(slug)
    if (!post) {
      console.error(`  ✗ ${slug}: post not found`)
      continue
    }

    if (tracker[slug]?.published) {
      console.log(`  ⊘ ${slug}: already published on Medium`)
      continue
    }

    try {
      await sendImportReminder(post, slug)
      tracker[slug] = { reminded: true, date: new Date().toISOString() }
      saveTracker(tracker)
      console.log(`  ✓ ${slug}: import reminder sent`)
      sent++
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`)
    }
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
