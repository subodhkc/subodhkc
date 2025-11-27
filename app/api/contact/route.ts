import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Mark this route as dynamic to prevent build-time execution
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables')
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('RESEND')))
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please contact administrator.' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await request.json()
    const { name, email, company, interest, message } = body

    // Validate required fields
    if (!name || !email || !interest || !message) {
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

    // Send email using Resend
    // Note: Use onboarding@resend.dev for testing, or verify your domain in Resend
    const { data, error } = await resend.emails.send({
      from: 'Subodh KC Contact <onboarding@resend.dev>',
      to: ['Subodh.kc@haiec.com'],
      reply_to: email,
      subject: `New Contact Form Submission: ${interest}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2563EB; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Contact Information</h2>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Name:</strong>
                  <span style="color: #1f2937;">${name}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Email:</strong>
                  <a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a>
                </div>
                
                ${company ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Company:</strong>
                  <span style="color: #1f2937;">${company}</span>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4b5563; display: inline-block; width: 120px;">Interest:</strong>
                  <span style="color: #1f2937; background: #dbeafe; padding: 4px 12px; border-radius: 4px; display: inline-block;">${interest}</span>
                </div>
              </div>
              
              <div style="background: white; padding: 25px; border-radius: 8px;">
                <h2 style="color: #2563EB; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Message</h2>
                <div style="color: #1f2937; white-space: pre-wrap; line-height: 1.8;">${message}</div>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #2563EB; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>Quick Action:</strong> Reply directly to this email to respond to ${name}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This email was sent from your website contact form at subodhkc.com</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' })}</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Log successful submission (optional - remove in production if not needed)
    console.log('Contact form submission:', { name, email, interest, timestamp: new Date().toISOString() })

    return NextResponse.json(
      { success: true, data: { id: data?.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
