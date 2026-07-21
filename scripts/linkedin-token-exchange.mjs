#!/usr/bin/env node

/**
 * Exchange a LinkedIn OAuth authorization code for an access token.
 *
 * After completing the OAuth flow in the browser, LinkedIn redirects to your
 * callback URL with a ?code=XXX parameter. Run this script with that code to
 * get your access token.
 *
 * Usage:
 *   node scripts/linkedin-token-exchange.mjs --code=XXXX
 *
 * Prerequisites:
 *   1. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env.local
 *   2. Visit the auth URL in your browser:
 *      https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_ID&redirect_uri=https%3A%2F%2Fsubodhkc.com%2Fapi%2Flinkedin%2Fcallback&scope=openid%20profile%20w_member_social%20email
 *   3. After authorizing, copy the ?code= value from the redirect URL
 *   4. Run this script with --code=VALUE
 *
 * The access token expires in ~60 days. Store it as:
 *   - .env.local: LINKEDIN_ACCESS_TOKEN=xxx
 *   - GitHub secret: LINKEDIN_ACCESS_TOKEN (for CI auto-posting)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const REDIRECT_URI = 'https://subodhkc.com/api/linkedin/callback'

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

async function exchangeCodeForToken(code) {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.error('ERROR: LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in .env.local')
    process.exit(1)
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`Token exchange failed (${response.status}): ${error}`)
    process.exit(1)
  }

  const data = await response.json()
  return data
}

async function getMemberId(accessToken) {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    console.warn('Could not fetch member profile (non-fatal)')
    return null
  }

  const profile = await response.json()
  return profile.sub || null
}

async function main() {
  const args = process.argv.slice(2)
  const codeArg = args.find((a) => a.startsWith('--code='))?.split('=')[1]

  if (!codeArg) {
    console.error('Usage: node scripts/linkedin-token-exchange.mjs --code=OAUTH_CODE')
    console.error('')
    console.error('Get the code by visiting:')
    console.error(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID || 'YOUR_ID'}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20w_member_social%20email`)
    process.exit(1)
  }

  console.log('Exchanging authorization code for access token...')
  const tokenData = await exchangeCodeForToken(codeArg)

  console.log('\n=== LinkedIn Access Token ===')
  console.log(`Access Token: ${tokenData.access_token}`)
  console.log(`Expires In: ${tokenData.expires_in} seconds (${Math.round(tokenData.expires_in / 86400)} days)`)
  console.log(`Scope: ${tokenData.scope}`)

  // Try to get member ID
  const memberId = await getMemberId(tokenData.access_token)
  if (memberId) {
    console.log(`Member ID: ${memberId}`)
  }

  console.log('\nAdd these to .env.local:')
  console.log(`LINKEDIN_ACCESS_TOKEN=${tokenData.access_token}`)
  if (memberId) {
    console.log(`LINKEDIN_MEMBER_ID=${memberId}`)
  }
  console.log('\nFor CI auto-posting, add as GitHub secrets:')
  console.log('  LINKEDIN_ACCESS_TOKEN')
  if (memberId) {
    console.log('  LINKEDIN_MEMBER_ID')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
