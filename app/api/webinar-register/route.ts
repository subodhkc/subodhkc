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
    const { name, email, company, businessType, attendees, questions } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
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
    const safeBusinessType = businessType ? esc(businessType) : ''
    const safeAttendees = attendees ? esc(attendees) : ''
    const safeQuestions = questions ? esc(questions) : ''

    const { data, error } = await resend.emails.send({
      from: 'KC Webinar <noreply@subodhkc.com>',
      to: ['Subodh.kc@haiec.com'],
      reply_to: email,
      subject: `Webinar Registration: AI Laws for Small Business — ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Webinar Registration</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891B2 0%, #06B6D4 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Webinar Registration</h1>
              <p style="color: #CFFAFE; margin: 8px 0 0 0; font-size: 14px;">AI Laws and Policies for Small Business</p>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #0891B2; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Registrant Information</h2>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Name:</strong>
                  <span style="color: #1f2937;">${safeName}</span>
                </div>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Email:</strong>
                  <a href="mailto:${safeEmail}" style="color: #0891B2; text-decoration: none;">${safeEmail}</a>
                </div>

                ${safeCompany ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Company:</strong>
                  <span style="color: #1f2937;">${safeCompany}</span>
                </div>
                ` : ''}

                ${safeBusinessType ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Business Type:</strong>
                  <span style="color: #1f2937; background: #CFFAFE; padding: 4px 12px; border-radius: 4px; display: inline-block;">${safeBusinessType}</span>
                </div>
                ` : ''}

                ${safeAttendees ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Attendees:</strong>
                  <span style="color: #1f2937;">${safeAttendees}</span>
                </div>
                ` : ''}
              </div>

              ${safeQuestions ? `
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #0891B2; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Questions / Topics of Interest</h2>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8;">${safeQuestions}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; padding: 15px; background: #ECFEFF; border-left: 4px solid #0891B2; border-radius: 4px;">
                <p style="margin: 0; color: #0E7490; font-size: 14px;">
                  <strong>Next Steps:</strong> Reply to this email with the webinar link and any prep materials for ${safeName}.
                </p>
                <p style="margin: 8px 0 0 0; color: #0891B2; font-size: 13px;">
                  Webinar schedule: 2nd Monday of every month
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This registration was sent from subodhkc.com/webinar/ai-laws-small-business</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' })}</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend API error:', error.message)
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again or email subodh.kc@haiec.com directly.' },
        { status: 500 }
      )
    }

    console.log('Webinar registration successful:', {
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
    console.error('Webinar registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
