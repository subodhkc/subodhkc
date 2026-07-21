import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    const response = await fetch(source, {
      headers: { 'Accept': 'text/html, application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `source URL returned ${response.status}` },
        { status: 400 }
      )
    }

    const html = await response.text()
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
