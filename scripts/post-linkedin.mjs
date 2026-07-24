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
 *      https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_ID&redirect_uri=https://subodhkc.com/api/linkedin/callback&scope=openid%20profile%20w_member_social%20r_member_social
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
const POSTED_TRACKER_PATH = path.join(ROOT, 'data', 'social', 'posted.json')

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

  // Remove "Read the full article at ..." lines — no link card anymore
  cleaned = cleaned.replace(/Read the full article at.*$/gim, '')
  cleaned = cleaned.replace(/Read more at.*$/gim, '')
  cleaned = cleaned.replace(/Check out the full article.*$/gim, '')
  cleaned = cleaned.replace(/Link in (the )?comments?.*$/gim, '')
  cleaned = cleaned.replace(/Full article linked below.*$/gim, '')
  cleaned = cleaned.replace(/Article linked below.*$/gim, '')
  cleaned = cleaned.replace(/Link(ed)? below.*$/gim, '')

  // Remove link placeholders like [link here], [link], [url], [insert link]
  cleaned = cleaned.replace(/\[(link here|link|url|insert link|insert url)\]/gi, '')
  cleaned = cleaned.replace(/\[link[^\]]*\]/gi, '')

  // Remove blog/website CTA phrases
  cleaned = cleaned.replace(/Visit my blog at.*$/gim, '')
  cleaned = cleaned.replace(/Follow me for more.*$/gim, '')
  cleaned = cleaned.replace(/Check out (my|the) (blog|article|post).*$/gim, '')
  cleaned = cleaned.replace(/Read more (at|on|about).*$/gim, '')
  cleaned = cleaned.replace(/Find more (at|on|about).*$/gim, '')
  cleaned = cleaned.replace(/More (on this|details) (at|on) (my )?(blog|website|subodhkc).*$/gim, '')

  // Remove AI writing tell phrases (sentence-level and mid-sentence)
  const aiTells = [
    /Here'?s what I'?ve learned[^.]*\.?/gi,
    /After working across[^.]*\.?/gi,
    /In my experience[^.]*\.?/gi,
    /I'?ve seen firsthand[^.]*\.?/gi,
    /Let me share[^.]*\.?/gi,
    /Here'?s the thing[^.]*\.?/gi,
    /It'?s worth noting that/gi,
    /Needless to say,?/gi,
    /At the end of the day,?/gi,
    /The reality is[^.]*\.?/gi,
    /What I'?ve come to realize[^.]*\.?/gi,
    /From my (experience|work) (in|with|across)[^.]*\.?/gi,
    /In a recent (engagement|project|client)[^.]*\.?/gi,
    /A company I worked with[^.]*\.?/gi,
    /We (recently )?(signed|deployed|launched|shipped|rolled out)[^.]*\.?/gi,
    /I (recently )?(signed|deployed|launched|shipped|rolled out)[^.]*\.?/gi,
    /Let'?s dive in[^.]*\.?/gi,
    /Let'?s explore[^.]*\.?/gi,
    /Let'?s break (this|it) down[^.]*\.?/gi,
    /Here'?s a breakdown[^.]*\.?/gi,
    /Here'?s why[^.]*\.?/gi,
    /Here'?s how[^.]*\.?/gi,
    /The bottom line is[^.]*\.?/gi,
    /It comes down to[^.]*\.?/gi,
    /That'?s where[^.]*\.?/gi,
    /This is where[^.]*\.?/gi,
    /This isn'?t just about[^.]*\.?/gi,
    /Let'?s be clear[^.]*\.?/gi,
    /One thing is clear[^.]*\.?/gi,
    /A key takeaway is[^.]*\.?/gi,
    /Let me be clear[^.]*\.?/gi,
    /Picture this[^.]*\.?/gi,
    /Imagine[^.]*\.?/gi,
    /Fast forward[^.]*\.?/gi,
    /Spoiler alert[^.]*\.?/gi,
    /Plot twist[^.]*\.?/gi,
    /Here'?s the deal[^.]*\.?/gi,
    /But here'?s the catch[^.]*\.?/gi,
    /And that'?s exactly[^.]*\.?/gi,
    /Which brings us to[^.]*\.?/gi,
  ]
  for (const tell of aiTells) {
    cleaned = cleaned.replace(tell, '')
  }

  // Remove additional CTA / engagement phrases
  cleaned = cleaned.replace(/Subscribe to (my|our) newsletter.*$/gim, '')
  cleaned = cleaned.replace(/DM me.*$/gim, '')
  cleaned = cleaned.replace(/Reach out.*$/gim, '')
  cleaned = cleaned.replace(/Let'?s connect.*$/gim, '')
  cleaned = cleaned.replace(/Drop a comment.*$/gim, '')
  cleaned = cleaned.replace(/Share your thoughts.*$/gim, '')
  cleaned = cleaned.replace(/What do you think.*$/gim, '')
  cleaned = cleaned.replace(/Thoughts\?*$/gim, '')

  // Strip markdown headers (##, ###, #) — LinkedIn doesn't render them
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')

  // Strip orphaned brackets from incomplete markdown link removal
  cleaned = cleaned.replace(/\[\s*\]/g, '')
  cleaned = cleaned.replace(/\(\s*\)/g, '')

  // Strip orphaned colons at end of lines (leftover from AI tell removal)
  cleaned = cleaned.replace(/:\s*$/gm, '')

  // Strip orphaned dashes at start of lines (leftover from em-dash replacement)
  cleaned = cleaned.replace(/^\s*[-]\s*$/gm, '')

  // Normalize whitespace: collapse multiple spaces, trim trailing spaces per line
  cleaned = cleaned.replace(/  +/g, ' ')
  cleaned = cleaned.replace(/^[ \t]+/gm, '')
  cleaned = cleaned.replace(/[ \t]+$/gm, '')

  // Replace em-dashes with regular hyphens
  cleaned = cleaned.replace(/—/g, '-')
  cleaned = cleaned.replace(/–/g, '-')

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

  // Guardrail: check for em-dashes (should have been replaced)
  if (/—|–/.test(text)) {
    console.warn('Warning: Em-dash found in post — replacing with hyphen')
    text = text.replace(/—/g, '-').replace(/–/g, '-')
  }

  // Guardrail: check for link placeholders (should have been stripped)
  if (/\[(link here|link|url|insert link|insert url)\]/i.test(text) || /\[link[^\]]*\]/i.test(text)) {
    console.warn('Warning: Link placeholder found in post — stripping')
    text = text.replace(/\[(link here|link|url|insert link|insert url)\]/gi, '').replace(/\[link[^\]]*\]/gi, '')
  }

  // Guardrail: check for AI writing tells (should have been stripped)
  const aiTellPatterns = [
    /Here'?s what I'?ve learned/i,
    /After working across/i,
    /In my experience/i,
    /I'?ve seen firsthand/i,
    /Let me share/i,
    /Here'?s the thing/i,
    /It'?s worth noting/i,
    /Needless to say/i,
    /At the end of the day/i,
    /The reality is/i,
    /What I'?ve come to realize/i,
    /From my (experience|work) (in|with|across)/i,
    /In a recent (engagement|project|client)/i,
    /A company I worked with/i,
    /We (recently )?(signed|deployed|launched|shipped|rolled out)/i,
    /I (recently )?(signed|deployed|launched|shipped|rolled out)/i,
    /Let'?s dive in/i,
    /Let'?s explore/i,
    /Let'?s break (this|it) down/i,
    /Here'?s a breakdown/i,
    /Here'?s why/i,
    /Here'?s how/i,
    /The bottom line is/i,
    /It comes down to/i,
    /That'?s where/i,
    /This is where/i,
    /This isn'?t just about/i,
    /Let'?s be clear/i,
    /One thing is clear/i,
    /A key takeaway is/i,
    /Let me be clear/i,
    /Picture this/i,
    /Imagine/i,
    /Fast forward/i,
    /Spoiler alert/i,
    /Plot twist/i,
    /Here'?s the deal/i,
    /But here'?s the catch/i,
    /And that'?s exactly/i,
    /Which brings us to/i,
  ]
  for (const pattern of aiTellPatterns) {
    if (pattern.test(text)) {
      console.warn(`Warning: AI writing tell detected - stripping: ${pattern.source}`)
      text = text.replace(new RegExp(pattern.source, 'gi'), '')
    }
  }

  // Guardrail: check for blog/website CTA phrases (should have been stripped)
  const ctaPatterns = [
    /Visit my blog at/i,
    /Follow me for more/i,
    /Check out (my|the) (blog|article|post)/i,
    /Read more (at|on|about)/i,
    /Find more (at|on|about)/i,
    /More (on this|details) (at|on) (my )?(blog|website|subodhkc)/i,
    /Subscribe to (my|our) newsletter/i,
    /DM me/i,
    /Reach out/i,
    /Let'?s connect/i,
    /Drop a comment/i,
    /Share your thoughts/i,
    /What do you think/i,
  ]
  for (const pattern of ctaPatterns) {
    if (pattern.test(text)) {
      console.warn(`Warning: CTA phrase detected - stripping: ${pattern.source}`)
      text = text.replace(new RegExp(pattern.source, 'gim'), '')
    }
  }

  // Guardrail: check for markdown headers (should have been stripped)
  if (/^#{1,6}\s+/m.test(text)) {
    console.warn('Warning: Markdown header found in post - stripping')
    text = text.replace(/^#{1,6}\s+/gm, '')
  }

  // Guardrail: check for orphaned brackets (should have been stripped)
  if (/\[\s*\]/.test(text)) {
    console.warn('Warning: Orphaned brackets found in post - stripping')
    text = text.replace(/\[\s*\]/g, '').replace(/\(\s*\)/g, '')
  }

  // Clean up any leftover empty lines from strippings
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  // Guardrail: minimum content check (not just hashtags)
  const contentWithoutTags = text.replace(/#\w+/g, '').replace(/\s+/g, '').trim()
  if (contentWithoutTags.length < 100) {
    console.warn(`Warning: Post content is very thin (${contentWithoutTags.length} chars without hashtags) - may not perform well`)
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
 * Multi-word keywords are camelCased (e.g., "AI governance" -> #AIGovernance).
 */
function ensureHashtags(text, keywords) {
  const existing = text.match(/#\w+/g) || []
  if (existing.length >= 3) return text

  // Build hashtags from keywords if we need more
  // camelCase multi-word keywords, strip non-alphanumeric
  const keywordTags = (keywords || [])
    .map((k) => {
      // If multi-word, camelCase it
      const words = k.trim().split(/\s+/)
      if (words.length > 1) {
        return '#' + words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('').replace(/[^\w]/g, '')
      }
      return '#' + k.replace(/[^\w]/g, '')
    })
    .filter((tag) => tag.length > 1) // filter out empty #
    .filter((tag) => !existing.some((e) => e.toLowerCase() === tag.toLowerCase())) // no dupes
    .slice(0, 5 - existing.length)

  if (keywordTags.length > 0) {
    // Remove existing hashtags, append all at end
    let withoutTags = text.replace(/\s*#\w+\s*/g, '\n').trim()
    const allTags = [...existing, ...keywordTags].slice(0, 5)
    return `${withoutTags}\n\n${allTags.join(' ')}`
  }

  return text
}

/**
 * Upload an image to LinkedIn's media upload API.
 * Returns the digitalmediaAsset URN needed for image posts.
 */
async function uploadImage(accessToken, memberId, imageUrl) {
  // Step 1: Register the image upload
  const registerBody = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: `urn:li:person:${memberId}`,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        },
      ],
    },
  }

  const registerRes = await fetch(`${LINKEDIN_API}/v2/assets?action=registerUpload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerBody),
  })

  if (!registerRes.ok) {
    const err = await registerRes.text()
    console.warn(`Image registration failed (${registerRes.status}): ${err}`)
    return null
  }

  const registerData = await registerRes.json()
  const uploadUrl = registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
  const asset = registerData.value?.asset

  if (!uploadUrl || !asset) {
    console.warn('Image upload URL or asset not found in response')
    return null
  }

  // Step 2: Download the image from the URL
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) {
    console.warn(`Failed to download image from ${imageUrl} (${imgRes.status})`)
    return null
  }

  const imageBuffer = Buffer.from(await imgRes.arrayBuffer())

  // Step 3: Upload the image binary to the upload URL
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': imgRes.headers.get('content-type') || 'application/octet-stream',
    },
    body: imageBuffer,
  })

  if (!uploadRes.ok) {
    const err = await uploadRes.text()
    console.warn(`Image upload failed (${uploadRes.status}): ${err}`)
    return null
  }

  console.log(`  Image uploaded: ${asset}`)
  return asset
}

/**
 * Post to LinkedIn using the UGC Posts API.
 * No URL or link card - text-only or image-only posts get highest reach.
 * If an image asset URN is provided, attaches the image (still no link card).
 * Retries on rate limit (429) and server errors (500/502/503) with exponential backoff.
 */
async function postToLinkedIn(accessToken, memberId, text, imageAssetUrn) {
  let media
  let shareMediaCategory

  if (imageAssetUrn) {
    // Image post - highest engagement, no URL
    shareMediaCategory = 'IMAGE'
    media = [
      {
        status: 'READY',
        media: imageAssetUrn,
      },
    ]
  } else {
    // Text-only post - no link card, no URL, maximum reach
    shareMediaCategory = 'NONE'
    media = []
  }

  const body = {
    author: `urn:li:person:${memberId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: text,
        },
        shareMediaCategory: shareMediaCategory,
        media: media,
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(`${LINKEDIN_API}/v2/ugcPosts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }

    const errorText = await response.text()

    // Retry on rate limit or server errors
    if ([429, 500, 502, 503].includes(response.status) && attempt < maxRetries) {
      const delay = attempt * 5000 // 5s, 10s, 15s
      console.warn(`LinkedIn API ${response.status} on attempt ${attempt}/${maxRetries} - retrying in ${delay / 1000}s...`)
      await new Promise((r) => setTimeout(r, delay))
      continue
    }

    throw new Error(`LinkedIn API error (${response.status}): ${errorText}`)
  }
}

/**
 * Load the posted tracker — prevents duplicate posts.
 * Returns a map of slug -> { urn, postedAt }
 */
function loadPostedTracker() {
  if (!fs.existsSync(POSTED_TRACKER_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(POSTED_TRACKER_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

/**
 * Save the posted tracker with a new entry.
 */
function savePostedTracker(tracker, slug, urn) {
  tracker[slug] = {
    urn: urn,
    postedAt: new Date().toISOString(),
  }
  const dir = path.dirname(POSTED_TRACKER_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(POSTED_TRACKER_PATH, JSON.stringify(tracker, null, 2))
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const latestOnly = args.includes('--latest')
  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')

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

  // Duplicate post prevention
  const tracker = loadPostedTracker()
  if (tracker[slug] && !dryRun && !force) {
    console.error(`Already posted this article to LinkedIn on ${tracker[slug].postedAt}`)
    console.error(`  URN: ${tracker[slug].urn}`)
    console.error('Use --force to override.')
    process.exit(0)
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
    // Upload hero image if available (2x engagement boost)
    let imageAssetUrn = null
    if (post.heroImageUrl) {
      console.log('  Uploading hero image to LinkedIn...')
      imageAssetUrn = await uploadImage(accessToken, memberId, post.heroImageUrl)
    }

    const result = await postToLinkedIn(
      accessToken,
      memberId,
      finalText,
      imageAssetUrn,
    )
    const urn = result.id || result.activity || 'unknown'
    console.log('Successfully posted to LinkedIn!')
    console.log(`  Post URN: ${urn}`)

    // Save to tracker to prevent duplicate posts
    savePostedTracker(tracker, slug, urn)
    console.log(`  Saved to posted tracker`)
  } catch (err) {
    console.error(`Failed to post: ${err.message}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
