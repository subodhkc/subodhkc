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
    const { name, email, company, role, experience, goals } = body

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
    const safeRole = role ? esc(role) : ''
    const safeExperience = experience ? esc(experience) : ''
    const safeGoals = goals ? esc(goals) : ''

    const { data, error } = await resend.emails.send({
      from: 'KC Course <noreply@subodhkc.com>',
      to: ['subodhkc@subodhkc.com'],
      reply_to: email,
      subject: `Course Enrollment: AI Governance & Compliance — ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Course Enrollment Request</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Course Enrollment Request</h1>
              <p style="color: #E9D5FF; margin: 8px 0 0 0; font-size: 14px;">AI Governance & Compliance Masterclass</p>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #7C3AED; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Participant Information</h2>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Name:</strong>
                  <span style="color: #1f2937;">${safeName}</span>
                </div>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Email:</strong>
                  <a href="mailto:${safeEmail}" style="color: #7C3AED; text-decoration: none;">${safeEmail}</a>
                </div>

                ${safeCompany ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Company:</strong>
                  <span style="color: #1f2937;">${safeCompany}</span>
                </div>
                ` : ''}

                ${safeRole ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Role:</strong>
                  <span style="color: #1f2937;">${safeRole}</span>
                </div>
                ` : ''}

                ${safeExperience ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Experience:</strong>
                  <span style="color: #1f2937; background: #EDE9FE; padding: 4px 12px; border-radius: 4px; display: inline-block;">${safeExperience}</span>
                </div>
                ` : ''}
              </div>

              ${safeGoals ? `
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #7C3AED; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Learning Goals</h2>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8;">${safeGoals}</div>
              </div>
              ` : ''}

              <div style="margin-top: 20px; padding: 15px; background: #F5F3FF; border-left: 4px solid #7C3AED; border-radius: 4px;">
                <p style="margin: 0; color: #5B21B6; font-size: 14px;">
                  <strong>Next Steps:</strong> Reply to this email to confirm enrollment and share course details (schedule, access link, prep materials) with ${safeName}.
                </p>
                <p style="margin: 8px 0 0 0; color: #7C3AED; font-size: 13px;">
                  Course schedule: 1st & 3rd Thursday of every month, 8 PM CST
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This enrollment request was sent from subodhkc.com/course</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' })}</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend API error:', error.message)
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again or email subodhkc@subodhkc.com directly.' },
        { status: 500 }
      )
    }

    console.log('Course enrollment successful:', {
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
    console.error('Course enrollment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
