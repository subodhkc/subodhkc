import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_SOURCE_BYTES = 512 * 1024 // 512 KB cap on fetched source content

/** Block private, loopback, link-local, and reserved IP ranges to prevent SSRF. */
function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase()
  // Block common internal hostnames
  if (h === 'localhost' || h.endsWith('.localhost')) return true
  // IPv4 checks
  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const [a, b] = [parseInt(ipv4[1]), parseInt(ipv4[2])]
    if (a === 10) return true                              // 10.0.0.0/8
    if (a === 127) return true                             // 127.0.0.0/8 (loopback)
    if (a === 0) return true                               // 0.0.0.0/8
    if (a === 169 && b === 254) return true                // 169.254.0.0/16 (link-local / cloud metadata)
    if (a === 172 && b >= 16 && b <= 31) return true       // 172.16.0.0/12
    if (a === 192 && b === 168) return true                // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true      // 100.64.0.0/10 (CGNAT)
    if (a >= 224) return true                              // multicast / reserved
  }
  // IPv6 checks — loopback, link-local, unique-local
  if (h === '::1') return true
  if (h.startsWith('fe80')) return true
  if (h.startsWith('fc') || h.startsWith('fd')) return true
  return false
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const contentType = request.headers.get('content-type') || ''
    let source = ''
    let target = ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      source = body.source || ''
      target = body.target || ''
    } else {
      const formData = await request.formData()
      source = (formData.get('source') as string) || ''
      target = (formData.get('target') as string) || ''
    }

    if (!source || !target) {
      return NextResponse.json(
        { error: 'source and target are required' },
        { status: 400 }
      )
    }

    if (!target.startsWith('https://subodhkc.com/')) {
      return NextResponse.json(
        { error: 'target must be a subodhkc.com URL' },
        { status: 400 }
      )
    }

    // Require HTTPS source — prevents cleartext + internal HTTP probing
    if (!source.startsWith('https://')) {
      return NextResponse.json(
        { error: 'source must be an HTTPS URL' },
        { status: 400 }
      )
    }

    // SSRF guard: block private/loopback/link-local hostnames
    let sourceUrl: URL
    try {
      sourceUrl = new URL(source)
    } catch {
      return NextResponse.json(
        { error: 'source is not a valid URL' },
        { status: 400 }
      )
    }
    if (isBlockedHostname(sourceUrl.hostname)) {
      return NextResponse.json(
        { error: 'source hostname is not allowed' },
        { status: 400 }
      )
    }

    // Follow redirects manually so each hop is validated against the SSRF guard.
    // fetch's default redirect: 'follow' would bypass isBlockedHostname for
    // redirect destinations (e.g. HTTPS source → HTTP 169.254.169.254 metadata).
    const MAX_REDIRECTS = 5
    let currentUrl = source
    let response = await fetch(currentUrl, {
      headers: { 'Accept': 'text/html, application/json' },
      redirect: 'manual',
      signal: AbortSignal.timeout(10000),
    })

    for (let i = 0; i < MAX_REDIRECTS; i++) {
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (!location) break

        const redirectUrl = new URL(location, currentUrl)

        // Enforce HTTPS on every redirect destination
        if (redirectUrl.protocol !== 'https:') {
          return NextResponse.json(
            { error: 'redirect target must be HTTPS' },
            { status: 400 }
          )
        }

        // Re-check SSRF guard on the redirect hostname
        if (isBlockedHostname(redirectUrl.hostname)) {
          return NextResponse.json(
            { error: 'redirect target hostname is not allowed' },
            { status: 400 }
          )
        }

        currentUrl = redirectUrl.href
        response = await fetch(currentUrl, {
          headers: { 'Accept': 'text/html, application/json' },
          redirect: 'manual',
          signal: AbortSignal.timeout(10000),
        })
      } else {
        break
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `source URL returned ${response.status}` },
        { status: 400 }
      )
    }

    // Cap the amount of content we read to prevent memory exhaustion
    const reader = response.body?.getReader()
    let html = ''
    if (reader) {
      let received = 0
      while (received < MAX_SOURCE_BYTES) {
        const { done, value } = await reader.read()
        if (done) break
        received += value.byteLength
        html += new TextDecoder().decode(value, { stream: true })
      }
      await reader.cancel()
    } else {
      html = await response.text()
    }

    const hasLink = html.includes('subodhkc.com') || html.includes(target)

    if (!hasLink) {
      return NextResponse.json(
        { error: 'source does not link to target' },
        { status: 400 }
      )
    }

    console.log(`Webmention received: ${source} -> ${target}`)

    return NextResponse.json({
      status: 'received',
      source,
      target,
      message: 'Webmention accepted. It will be processed asynchronously.',
    })
  } catch (error) {
    console.error('Webmention error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/webmention',
    method: 'POST',
    description: 'Webmention endpoint for subodhkc.com. Accepts source/target pairs per the W3C Webmention protocol.',
    spec: 'https://www.w3.org/TR/webmention/',
  })
}
