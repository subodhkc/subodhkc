import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * LinkedIn OAuth callback endpoint.
 * After the user authorizes the app on LinkedIn, they're redirected here
 * with a ?code= parameter. This route displays the code so the user can
 * run scripts/linkedin-token-exchange.mjs to get their access token.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const state = url.searchParams.get('state')

  if (error) {
    return NextResponse.json(
      { error: `LinkedIn OAuth error: ${error}` },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received from LinkedIn' },
      { status: 400 }
    )
  }

  const html = `<!DOCTYPE html>
<html>
<head><title>LinkedIn Authorization</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px;">
<h1>LinkedIn Authorization Successful</h1>
<p>Copy the code below and run the token exchange script:</p>
<pre style="background: #f4f4f4; padding: 16px; border-radius: 8px; word-break: break-all; font-size: 14px;">${code}</pre>
<p>Run this in your terminal:</p>
<pre style="background: #1a1a1a; color: #0f0; padding: 16px; border-radius: 8px; font-size: 14px;">node scripts/linkedin-token-exchange.mjs --code=${code}</pre>
<p style="color: #666; font-size: 13px;">You can close this tab after copying the code.</p>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
