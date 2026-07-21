#!/usr/bin/env node

/**
 * Post a blog article to LinkedIn using the Posts API.
 *
 * Reads the LinkedIn section from data/social/<slug>.md,
 * strips raw URLs from the post body (LinkedIn best practice —
 * the URL is attached as the article link, not in the text),
 * and posts via the LinkedIn Posts API.
 *
 * Usage:
 *   node scripts/post-linkedin.mjs --slug=my-article
 *   node scripts/post-linkedin.mjs --latest
 *   node scripts/post-linkedin.mjs --slug=my-article --dry-run
 *
 * Requires:
 *   LINKEDIN_ACCESS_TOKEN — OAuth 2.0 access token with w_member_social scope
 *   LINKEDIN_MEMBER_ID — your LinkedIn member ID (numeric)
 *
 * To get an access token:
 *   1. Go to https://www.linkedin.com/developers/apps → your app
 *   2. Add product: "Share on LinkedIn" and "Sign In with LinkedIn using OpenID Connect"
 *   3. Set redirect URL to https://subodhkc.com/api/linkedin/callback
 *   4. Visit in browser:
 *      https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_ID&redirect_uri=https://subodhkc.com/api/linkedin/callback&scope=openid%20profile%20w_member_social
 *   5. After auth, exchange the code for a token (see scripts/linkedin-token-exchange.mjs)
 *   6. Store the token in .env.local as LINKEDIN_ACCESS_TOKEN
 *   7. For CI: store as GitHub secret LINKEDIN_ACCESS_TOKEN
 *
 * Token expires in ~60 days. Refresh by repeating the OAuth flow.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const SITE_URL = 'https://subodhkc.com'
const LINKEDIN_API = 'https://api.linkedin.com'

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

/**
 * Extract the LinkedIn section from a social content markdown file.
 * Returns the raw text between "## LinkedIn Post" and the next "## " header.
 */
function extractLinkedInSection(markdown) {
  const match = markdown.match(/## LinkedIn Post\s*\n([\s\S]*?)(?=\n## |\n---\n|$)/)
  if (!match) return null
  return match[1].trim()
}

/**
 * Clean the LinkedIn post text for the API:
 * - Remove raw URLs from the body (LinkedIn best practice: link is attached separately)
 * - Remove markdown formatting that LinkedIn doesn't support
 * - Remove the AI Review section if it was included
 * - Remove "Read the full article at [URL]" lines — the URL is in the link card
 * - Remove empty lines at start/end
 * - Ensure hashtags are on their own lines at the end
 */
function cleanLinkedInPost(text, articleUrl) {
  let cleaned = text

  // Remove any AI review content that may have been included
  cleaned = cleaned.replace(/## AI Review[\s\S]*$/i, '')

  // Remove "Read the full article at ..." lines — URL is in the link card
  cleaned = cleaned.replace(/Read the full article at.*$/gim, '')
  cleaned = cleaned.replace(/Read more at.*$/gim, '')
  cleaned = cleaned.replace(/Check out the full article.*$/gim, '')
  cleaned = cleaned.replace(/Link in (the )?comments?.*$/gim, '')

  // Remove raw URLs from the body — LinkedIn attaches the link separately
  // This is a best practice: raw URLs in the body hurt reach due to LinkedIn's algorithm
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '')

  // Remove markdown bold/italic markers (LinkedIn doesn't render them)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1')
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1')

  // Remove markdown bullet markers but keep the text
  cleaned = cleaned.replace(/^[-•]\s/gm, '')

  // Remove horizontal rules
  cleaned = cleaned.replace(/^---+$/gm, '')

  // Clean up multiple consecutive empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  // Trim
  cleaned = cleaned.trim()

  return cleaned
}

/**
 * Validate the post text meets LinkedIn requirements and best practices:
 * - Max 3000 characters for text posts
 * - Not empty
 * - Has at least 1 hashtag (LinkedIn best practice for discoverability)
 * - No more than 5 hashtags (LinkedIn algorithm penalizes hashtag stuffing)
 * - No raw URLs remaining (should have been stripped by cleanLinkedInPost)
 * - No excessive capitalization (LinkedIn flags as spammy)
 * - No prohibited content patterns
 */
function validatePost(text) {
  if (!text || text.length === 0) {
    throw new Error('LinkedIn post text is empty after cleaning')
  }

  // Check for leftover raw URLs (should have been stripped)
  const urlMatches = text.match(/https?:\/\//g)
  if (urlMatches) {
    console.warn('Warning: Raw URL found in post body — stripping (LinkedIn penalizes raw URLs)')
    text = text.replace(/https?:\/\/\S+/g, '').trim()
  }

  // Check hashtags
  const hashtags = text.match(/#\w+/g) || []
  if (hashtags.length === 0) {
    console.warn('Warning: No hashtags found — adding relevant ones from article keywords')
    // Will be handled by caller — return text as-is and let caller append hashtags
  } else if (hashtags.length > 5) {
    console.warn(`Warning: ${hashtags.length} hashtags found — LinkedIn penalizes >5. Keeping first 5.`)
    // Keep only first 5 hashtags
    let count = 0
    text = text.replace(/#\w+/g, (match) => {
      count++
      return count <= 5 ? match : ''
    }).replace(/\n{3,}/g, '\n\n').trim()
  }

  // Check for excessive capitalization (LinkedIn spam flag)
  const upperChars = text.replace(/[^A-Z]/g, '').length
  const alphaChars = text.replace(/[^A-Za-z]/g, '').length
  if (alphaChars > 0 && upperChars / alphaChars > 0.3) {
    console.warn('Warning: Excessive capitalization detected — LinkedIn may flag as spam')
  }

  // Check for prohibited content patterns
  const prohibited = [
    /\b(buy now|click here|limited time|act now|free money|guaranteed)\b/i,
  ]
  for (const pattern of prohibited) {
    if (pattern.test(text)) {
      console.warn(`Warning: Potentially prohibited phrase detected: ${pattern.source}`)
    }
  }

  if (text.length > 3000) {
    console.warn(`Warning: Post is ${text.length} chars (LinkedIn max is 3000 for text). Truncating...`)
    const truncated = text.substring(0, 2950)
    const lastSentence = truncated.lastIndexOf('.')
    if (lastSentence > 2500) {
      return truncated.substring(0, lastSentence + 1)
    }
    return truncated + '...'
  }
  return text
}

/**
 * Ensure hashtags are present and at the end of the post.
 * If no hashtags found, append relevant ones from post keywords.
 */
function ensureHashtags(text, keywords) {
  const existing = text.match(/#\w+/g) || []
  if (existing.length >= 3) return text

  // Build hashtags from keywords if we need more
  const keywordTags = (keywords || [])
    .filter((k) => !k.includes(' '))
    .slice(0, 5 - existing.length)
    .map((k) => `#${k.replace(/[^\w]/g, '')}`)

  if (keywordTags.length > 0) {
    // Remove existing hashtags, append all at end
    let withoutTags = text.replace(/\s*#\w+\s*/g, '\n').trim()
    const allTags = [...existing, ...keywordTags].slice(0, 5)
    return `${withoutTags}\n\n${allTags.join(' ')}`
  }

  return text
}

/**
 * Post to LinkedIn using the Posts API.
 * Uses article URL as the share link (appears as a link card, not raw URL in text).
 */
async function postToLinkedIn(accessToken, memberId, text, articleUrl, articleTitle, articleDescription) {
  const body = {
    author: `urn:li:person:${memberId}`,
    lifecycleState: 'PUBLISHED',
    visibility: {
      scope: 'PUBLIC',
    },
    commentary: text,
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionTypes: [],
    },
    content: {
      article: {
        source: articleUrl,
        title: articleTitle,
        description: articleDescription,
      },
    },
    isReshareDisabledByAuthor: false,
  }

  const response = await fetch(`${LINKEDIN_API}/v2/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202406',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const latestOnly = args.includes('--latest')
  const dryRun = args.includes('--dry-run')

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN
  const memberId = process.env.LINKEDIN_MEMBER_ID

  if (!dryRun && (!accessToken || !memberId)) {
    console.error('ERROR: LINKEDIN_ACCESS_TOKEN and LINKEDIN_MEMBER_ID must be set')
    console.error('Get them via the OAuth flow — see scripts/linkedin-token-exchange.mjs')
    process.exit(1)
  }

  // Determine which post to publish
  let slug = slugArg
  if (!slug && latestOnly) {
    const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'))
    if (files.length === 0) {
      console.error('No blog posts found')
      process.exit(1)
    }
    // Sort by createdAt descending
    const sorted = files
      .map((f) => {
        const post = JSON.parse(fs.readFileSync(path.join(postsDir, f), 'utf-8'))
        return { slug: post.slug, createdAt: post.createdAt, file: f }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    slug = sorted[0].slug
  }

  if (!slug) {
    console.error('Usage: node scripts/post-linkedin.mjs --slug=<slug> [--dry-run]')
    console.error('       node scripts/post-linkedin.mjs --latest [--dry-run]')
    process.exit(1)
  }

  // Load social content
  const socialPath = path.join(ROOT, 'data', 'social', `${slug}.md`)
  if (!fs.existsSync(socialPath)) {
    console.error(`No social content found at data/social/${slug}.md`)
    console.error('Run: node scripts/generate-social.mjs --slug=' + slug + ' --force')
    process.exit(1)
  }

  const socialContent = fs.readFileSync(socialPath, 'utf-8')
  const linkedInSection = extractLinkedInSection(socialContent)
  if (!linkedInSection) {
    console.error(`No LinkedIn section found in data/social/${slug}.md`)
    process.exit(1)
  }

  // Load blog post for metadata
  const postPath = path.join(ROOT, 'data', 'blog', 'posts', `${slug}.json`)
  if (!fs.existsSync(postPath)) {
    console.error(`Blog post not found: data/blog/posts/${slug}.json`)
    process.exit(1)
  }
  const post = JSON.parse(fs.readFileSync(postPath, 'utf-8'))
  const articleUrl = `${SITE_URL}/blog/${slug}`

  // Clean and validate the post text
  const cleanedText = cleanLinkedInPost(linkedInSection, articleUrl)
  let finalText = validatePost(cleanedText)
  finalText = ensureHashtags(finalText, post.keywords || [])

  console.log(`\nPosting to LinkedIn:`)
  console.log(`  Article: ${post.title}`)
  console.log(`  URL: ${articleUrl}`)
  console.log(`  Post length: ${finalText.length} chars`)
  console.log(`\n--- Post Preview ---`)
  console.log(finalText)
  console.log(`--- End Preview ---\n`)

  if (dryRun) {
    console.log('[DRY RUN] Would post to LinkedIn. Skipping API call.')
    return
  }

  try {
    const result = await postToLinkedIn(
      accessToken,
      memberId,
      finalText,
      articleUrl,
      post.title,
      post.metaDescription || post.excerpt || '',
    )
    console.log('Successfully posted to LinkedIn!')
    console.log(`  Post URN: ${result.id || result.activity || 'unknown'}`)
  } catch (err) {
    console.error(`Failed to post: ${err.message}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
