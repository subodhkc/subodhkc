import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please contact administrator.' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const body = await request.json()
    const { name, email, company, system, stack } = body

    if (!name || !email || !system) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, and system description are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const safeName = esc(name)
    const safeEmail = esc(email)
    const safeCompany = company ? esc(company) : ''
    const safeSystem = esc(system)
    const safeStack = stack ? esc(stack) : ''

    const { data, error } = await resend.emails.send({
      from: 'KC Hero CTA <noreply@subodhkc.com>',
      to: ['Subodh.kc@haiec.com'],
      reply_to: email,
      subject: `AI System Discussion: ${company || name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI System Discussion Request</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">AI System Discussion Request</h1>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2563EB; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Contact Information</h2>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Name:</strong>
                  <span style="color: #1f2937;">${safeName}</span>
                </div>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Email:</strong>
                  <a href="mailto:${safeEmail}" style="color: #2563EB; text-decoration: none;">${safeEmail}</a>
                </div>

                ${safeCompany ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Company:</strong>
                  <span style="color: #1f2937;">${safeCompany}</span>
                </div>
                ` : ''}
              </div>

              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2563EB; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">AI System Description</h2>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8;">${safeSystem}</div>
              </div>

              ${safeStack ? `
              <div style="background: white; padding: 25px; border-radius: 8px;">
                <h2 style="color: #2563EB; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Current Stack</h2>
                <div style="color: #1f2937;">${safeStack}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #2563EB; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>Quick Action:</strong> Reply directly to this email to respond to ${safeName}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This email was sent from the homepage CTA on subodhkc.com</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' })}</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend API error:', error.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email. Please text 682-224-9904 for immediate assistance.'
        },
        { status: 500 }
      )
    }

    console.log('Discuss form submission successful:', {
      name,
      email,
      company,
      emailId: data?.id,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { success: true, data: { id: data?.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Discuss form error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
