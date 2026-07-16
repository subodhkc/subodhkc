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
        { success: false, error: 'Email service not configured. Please text 682-224-9904 or email Subodh.kc@haiec.com.' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const body = await request.json()
    const {
      businessName,
      name,
      email,
      phone,
      businessType,
      teamSize,
      businessChecks,
      problemArea,
      firstProblem,
      preferredDays,
      preferredTimeSlot,
      additionalInfo,
      source,
    } = body

    // Validate required fields
    if (!businessName || !name || !email || !phone || !businessType || !teamSize) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields from Step 1.' },
        { status: 400 }
      )
    }

    if (!problemArea || !firstProblem) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields from Step 2.' },
        { status: 400 }
      )
    }

    if (!preferredDays || preferredDays.length === 0 || !preferredTimeSlot) {
      return NextResponse.json(
        { success: false, error: 'Missing preferred days or time slot.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format.' },
        { status: 400 }
      )
    }

    // Validate phone (at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number. Please include area code.' },
        { status: 400 }
      )
    }

    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

    const safeBusinessName = esc(businessName)
    const safeName = esc(name)
    const safeEmail = esc(email)
    const safePhone = esc(phone)
    const safeBusinessType = esc(businessType)
    const safeTeamSize = esc(teamSize)
    const safeProblemArea = esc(problemArea)
    const safeFirstProblem = esc(firstProblem)
    const safeAdditionalInfo = additionalInfo ? esc(additionalInfo) : ''
    const safePreferredTimeSlot = esc(preferredTimeSlot)
    const safeSource = source ? esc(source) : 'organic'

    const safeChecks = Array.isArray(businessChecks)
      ? businessChecks.map((c: string) => esc(c))
      : []
    const safeDays = Array.isArray(preferredDays)
      ? preferredDays.map((d: string) => esc(d))
      : []

    const firstName = name.split(' ')[0] || 'there'
    const safeFirstName = esc(firstName)

    const daysStr = safeDays.join(', ')
    const checksStr = safeChecks.length > 0 ? safeChecks.map((c: string) => `- ${c}`).join('\n') : 'None selected'

    // Email 1: Confirmation to user
    const userHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Local AI Review Request</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">

          <div style="background: #1a1d22; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
            <h1 style="color: #f5f0e8; margin: 0; font-size: 22px; font-weight: 600;">Your Local AI Review Request</h1>
            <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">Here is what happens next</p>
          </div>

          <div style="background: white; padding: 30px; margin: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${safeFirstName},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Thank you for requesting a complimentary Local AI Review. I have received your details and will
              personally review your business context before we talk.
            </p>

            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #065f46; font-size: 15px;">Here is what happens next:</p>
              <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                <li>Within 1 business day, I will email you to confirm a date and time based on your preferred slots (${daysStr}, ${safePreferredTimeSlot}).</li>
                <li>Before our conversation, you will receive a one-page opportunity snapshot based on what you shared.</li>
                <li>During our 20-minute call, we will cover one practical use case, one measure of success, one primary risk, and the most useful next step.</li>
              </ol>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #1f2937; font-size: 15px;">What you shared with me:</p>
              <table style="width: 100%; font-size: 14px; color: #374151; border-collapse: collapse;">
                <tr><td style="padding: 4px 0; width: 140px; color: #6b7280; vertical-align: top;">Business:</td><td style="padding: 4px 0;">${safeBusinessName}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Business type:</td><td style="padding: 4px 0;">${safeBusinessType}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Team size:</td><td style="padding: 4px 0;">${safeTeamSize}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Primary concern:</td><td style="padding: 4px 0;">${safeProblemArea}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280; vertical-align: top;">First problem:</td><td style="padding: 4px 0;">${safeFirstProblem}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Preferred days:</td><td style="padding: 4px 0;">${daysStr}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280; vertical-align: top;">Time slot:</td><td style="padding: 4px 0;">${safePreferredTimeSlot}</td></tr>
              </table>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>Need to reach me sooner?</strong><br>
                Email: <a href="mailto:Subodh.kc@haiec.com" style="color: #2563eb; text-decoration: none;">Subodh.kc@haiec.com</a><br>
                Text: 682-224-9904
              </p>
            </div>

            <p style="font-size: 13px; color: #6b7280; margin-bottom: 0;">
              Tip: Save <strong>Subodh.kc@haiec.com</strong> to your contacts so this email and the follow-up do not
              go to spam.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0 0 5px 0;">
              <strong style="color: #6b7280;">Subodh KC</strong> &middot; Local AI Advisor<br>
              Founder, Kestrel Voice &middot; Co-founder, HAIEC<br>
              Dallas-Fort Worth &middot; HEB Chamber Member
            </p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://subodhkc.com" style="color: #6b7280; text-decoration: none;">subodhkc.com</a>
            </p>
            <p style="margin: 10px 0 0 0; color: #d1d5db; font-size: 11px;">
              You are receiving this because you requested a Local AI Review at subodhkc.com/local-ai-review<br>
              Reply to this email if you did not make this request.
            </p>
          </div>
        </body>
      </html>
    `

    const userText = `Your Local AI Review Request

Hi ${firstName},

Thank you for requesting a complimentary Local AI Review. I have received your details and will personally review your business context before we talk.

Here is what happens next:
1. Within 1 business day, I will email you to confirm a date and time based on your preferred slots (${daysStr}, ${preferredTimeSlot}).
2. Before our conversation, you will receive a one-page opportunity snapshot based on what you shared.
3. During our 20-minute call, we will cover one practical use case, one measure of success, one primary risk, and the most useful next step.

What you shared with me:
- Business: ${businessName}
- Business type: ${businessType}
- Team size: ${teamSize}
- Primary concern: ${problemArea}
- First problem: ${firstProblem}
- Preferred days: ${daysStr}
- Time slot: ${preferredTimeSlot}

Need to reach me sooner?
- Email: Subodh.kc@haiec.com
- Text: 682-224-9904

Tip: Save Subodh.kc@haiec.com to your contacts so this email does not go to spam.

--
Subodh KC - Local AI Advisor
Founder, Kestrel Voice - Co-founder, HAIEC
Dallas-Fort Worth - HEB Chamber Member
subodhkc.com

You are receiving this because you requested a Local AI Review at subodhkc.com/local-ai-review
Reply to this email if you did not make this request.`

    const { data: userData, error: userError } = await resend.emails.send({
      from: 'Subodh KC <noreply@subodhkc.com>',
      to: [email],
      reply_to: 'Subodh.kc@haiec.com',
      subject: 'Your Local AI Review Request - Next Steps',
      html: userHtml,
      text: userText,
    })

    if (userError) {
      console.error('Resend user email error:', userError.message)
      return NextResponse.json(
        { success: false, error: 'Failed to send confirmation email. Please text 682-224-9904 or email Subodh.kc@haiec.com.' },
        { status: 500 }
      )
    }

    // Email 2: Internal notification to Subodh
    const internalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Local AI Review Request</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Local AI Review Request</h1>
            <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">${safeBusinessName}</p>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Business Information</h2>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; width: 140px; color: #6b7280; vertical-align: top;">Business:</td><td style="padding: 6px 0; color: #1f2937;">${safeBusinessName}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Contact:</td><td style="padding: 6px 0; color: #1f2937;">${safeName}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #10b981; text-decoration: none;">${safeEmail}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Phone:</td><td style="padding: 6px 0; color: #1f2937;">${safePhone}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Business type:</td><td style="padding: 6px 0;"><span style="background: #d1fae5; padding: 3px 10px; border-radius: 4px; color: #065f46;">${safeBusinessType}</span></td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Team size:</td><td style="padding: 6px 0; color: #1f2937;">${safeTeamSize}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Source:</td><td style="padding: 6px 0; color: #1f2937;">${safeSource}</td></tr>
              </table>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Business Check Results</h2>
              <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8; font-size: 14px;">${checksStr}</div>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #6b7280;">${safeChecks.length} of 6 checked</p>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Problem & Scheduling</h2>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; width: 140px; color: #6b7280; vertical-align: top;">Primary concern:</td><td style="padding: 6px 0;"><span style="background: #fef3c7; padding: 3px 10px; border-radius: 4px; color: #92400e;">${safeProblemArea}</span></td></tr>
              </table>
              <div style="margin-top: 12px;">
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">First problem to solve:</p>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8; font-size: 14px;">${safeFirstProblem}</div>
              </div>
              ${safeAdditionalInfo ? `
              <div style="margin-top: 12px;">
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Additional info:</p>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8; font-size: 14px;">${safeAdditionalInfo}</div>
              </div>
              ` : ''}
              <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-top: 12px;">
                <tr><td style="padding: 6px 0; width: 140px; color: #6b7280; vertical-align: top;">Preferred days:</td><td style="padding: 6px 0; color: #1f2937;">${daysStr}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Time slot:</td><td style="padding: 6px 0; color: #1f2937;">${safePreferredTimeSlot}</td></tr>
              </table>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>Next Step:</strong> Reply directly to this email or contact ${safeName} at
                <a href="mailto:${safeEmail}" style="color: #10b981; text-decoration: none;">${safeEmail}</a>
                to confirm the review date and time.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">This request was sent from subodhkc.com/local-ai-review</p>
            <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' })}</p>
          </div>
        </body>
      </html>
    `

    const { data: internalData, error: internalError } = await resend.emails.send({
      from: 'Local AI Review <noreply@subodhkc.com>',
      to: ['Subodh.kc@haiec.com'],
      reply_to: email,
      subject: `Local AI Review Request: ${businessName}`,
      html: internalHtml,
    })

    if (internalError) {
      console.error('Resend internal email error:', internalError.message)
      // User email already sent, so still return success
    }

    console.log('Local AI Review submission successful:', {
      businessName,
      name,
      email,
      source: safeSource,
      userEmailId: userData?.id,
      internalEmailId: internalData?.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: true, data: { id: userData?.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Local AI Review form error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please text 682-224-9904 or email Subodh.kc@haiec.com.' },
      { status: 500 }
    )
  }
}
