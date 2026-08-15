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
      name, email, company, website, stack, stage,
      routeCount, tenantModel, stagingAvailable,
      primaryConcern, desiredEngagement, message,
      website_check,
    } = body

    // Honeypot
    if (website_check) {
      return NextResponse.json(
        { success: false, error: 'Spam detected' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || !email || !company || !stack || !stage || !tenantModel || !stagingAvailable || !desiredEngagement) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Persist to database
    const sc = createServiceClient()
    if (sc) {
      await sc
        .from('security_scope_requests')
        .insert({
          name,
          email,
          company,
          website: website || null,
          product_name: company,
          application_type: stage,
          tech_stack: stack,
          multi_tenant: tenantModel === 'multi-tenant',
          role_count: routeCount ? parseInt(routeCount) || null : null,
          ai_rag_agent: primaryConcern?.toLowerCase().includes('ai') || false,
          main_reason: primaryConcern || null,
          target_timing: desiredEngagement,
          source_code_access: null,
          staging_available: stagingAvailable === 'yes' || stagingAvailable === 'true',
          status: 'submitted',
          metadata: { message, route_count: routeCount, tenant_model: tenantModel },
        })
    }

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const safe = (v: string) => esc(v || '')

    const { data, error } = await resend.emails.send({
      from: 'Tenant Audit <noreply@subodhkc.com>',
      to: ['admin@subodhkc.com'],
      reply_to: email,
      subject: `Tenant Audit Request: ${safe(company)} \u2014 ${safe(desiredEngagement)}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tenant Isolation Audit Request</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 640px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Tenant Isolation Audit Request</h1>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e3a5f; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Contact Information</h2>

                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Name:</strong>
                  <span style="color: #1f2937;">${safe(name)}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Email:</strong>
                  <a href="mailto:${safe(email)}" style="color: #2d5a87; text-decoration: none;">${safe(email)}</a>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Company / Product:</strong>
                  <span style="color: #1f2937;">${safe(company)}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Website / Repo:</strong>
                  <span style="color: #1f2937;">${safe(website) || '\u2014'}</span>
                </div>
              </div>

              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e3a5f; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Application Details</h2>

                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Stack:</strong>
                  <span style="color: #1f2937;">${safe(stack)}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Stage:</strong>
                  <span style="color: #1f2937; background: #dbeafe; padding: 4px 12px; border-radius: 4px;">${safe(stage)}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">API Route Count:</strong>
                  <span style="color: #1f2937;">${safe(routeCount) || '\u2014'}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Tenant Model:</strong>
                  <span style="color: #1f2937;">${safe(tenantModel)}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Staging Available:</strong>
                  <span style="color: #1f2937;">${safe(stagingAvailable)}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Primary Concern:</strong>
                  <span style="color: #1f2937;">${safe(primaryConcern) || '\u2014'}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #4b5563; display: inline-block; width: 160px;">Desired Engagement:</strong>
                  <span style="color: #1f2937; background: #d1fae5; padding: 4px 12px; border-radius: 4px;">${safe(desiredEngagement)}</span>
                </div>
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

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This email was sent from the Tenant Isolation Audit form at subodhkc.com</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' })}</p>
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

    console.log('Tenant audit form submission successful:', {
      name, email, company, desiredEngagement,
      emailId: data?.id,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: true, data: { id: data?.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Tenant audit form error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
