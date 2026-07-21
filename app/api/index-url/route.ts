import { JWT } from 'google-auth-library'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { url, type } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const serviceAccountEmail = process.env.INDEXING_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.INDEXING_PRIVATE_KEY

    if (!serviceAccountEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Google Indexing API credentials not configured' },
        { status: 500 }
      )
    }

    const client = new JWT({
      email: serviceAccountEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/indexing'],
    })

    const tokenResponse = await client.getAccessToken()
    const accessToken = tokenResponse.token

    const googleResponse = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          url: url,
          type: type || 'URL_UPDATED',
        }),
      }
    )

    const data = await googleResponse.json()

    if (!googleResponse.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Google API error' },
        { status: googleResponse.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
