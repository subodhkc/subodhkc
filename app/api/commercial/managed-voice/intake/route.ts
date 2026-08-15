import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'
import { createServiceClient } from '@/lib/supabase'

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
        { success: false, error: 'Email service not configured. Please email admin@subodhkc.com.' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const body = await request.json()
    const {
      name, email, company, website, industry,
      callVolume, deploymentType, currentSystem,
      timeline, message, website_check,
    } = body

    if (website_check) {
      return NextResponse.json({ success: false, error: 'Spam detected' }, { status: 400 })
    }

    if (!name || !email || !company || !industry || !callVolume || !deploymentType || !timeline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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

    const sc = createServiceClient()
    if (sc) {
      await sc
        .from('voice_intake_requests')
        .insert({
          name,
          email,
          company,
          website: website || null,
          industry,
          call_volume: callVolume,
          deployment_type: deploymentType,
          current_system: currentSystem || null,
          timeline,
          message: message || null,
          status: 'submitted',
          metadata: {},
        })

      await sc.rpc('write_audit_event', {
        audit_action: 'managed_voice.intake_submitted',
        audit_entity_type: 'voice_intake_request',
        audit_entity_id: email,
        audit_metadata: { company, industry, deployment_type: deploymentType } as any,
      })
    }

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const safe = (v: string) => esc(v || '')

    const { error } = await resend.emails.send({
      from: 'Managed Voice <noreply@subodhkc.com>',
      to: ['admin@subodhkc.com'],
      reply_to: email,
      subject: `Managed Voice Intake: ${safe(company)} - ${safe(deploymentType)}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Managed Voice Intake Request</h1>
            </div>
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e3a5f; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Contact</h2>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Name:</strong><span style="color: #1f2937;">${safe(name)}</span></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Email:</strong><a href="mailto:${safe(email)}" style="color: #2d5a87; text-decoration: none;">${safe(email)}</a></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Company:</strong><span style="color: #1f2937;">${safe(company)}</span></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Website:</strong><span style="color: #1f2937;">${safe(website) || '\u2014'}</span></div>
              </div>
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e3a5f; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Deployment Details</h2>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Industry:</strong><span style="color: #1f2937;">${safe(industry)}</span></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Call Volume:</strong><span style="color: #1f2937;">${safe(callVolume)}</span></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Deployment Type:</strong><span style="color: #1f2937; background: #dbeafe; padding: 4px 12px; border-radius: 4px;">${safe(deploymentType)}</span></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Current System:</strong><span style="color: #1f2937;">${safe(currentSystem) || '\u2014'}</span></div>
                <div style="margin-bottom: 12px;"><strong style="color: #4b5563; display: inline-block; width: 160px;">Timeline:</strong><span style="color: #1f2937; background: #d1fae5; padding: 4px 12px; border-radius: 4px;">${safe(timeline)}</span></div>
              </div>
              ${message ? `
              <div style="background: white; padding: 25px; border-radius: 8px;">
                <h2 style="color: #1e3a5f; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Message</h2>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8;">${safe(message)}</div>
              </div>
              ` : ''}
              <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #2d5a87; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>Quick Action:</strong> Reply directly to this email to respond to ${safe(name)}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend API error:', error.message)
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please email admin@subodhkc.com directly.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Managed voice intake error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
