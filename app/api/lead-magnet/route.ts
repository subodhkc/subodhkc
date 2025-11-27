import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
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

    // Send welcome email with download link
    const { data, error } = await resend.emails.send({
      from: 'Subodh KC <onboarding@resend.dev>',
      to: [email],
      subject: '🎉 Your AI Compliance Framework Guide is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your AI Compliance Framework Guide</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome, ${name}! 🎉</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Your AI Compliance Framework Guide is ready</p>
            </div>

            <!-- Main Content -->
            <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Thank you for downloading the <strong>AI Compliance Framework: Enterprise Implementation Guide</strong>!
              </p>

              <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
                This comprehensive guide includes:
              </p>

              <div style="background: #f0fdf4; border-left: 4px solid #10B981; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                <ul style="margin: 0; padding-left: 20px; color: #065f46;">
                  <li style="margin-bottom: 10px;"><strong>Cognitive Systems Management (CSM) Framework</strong> - Proven methodology for AI program delivery</li>
                  <li style="margin-bottom: 10px;"><strong>5 Patent-Pending Methodologies</strong> - Adversarial Project Twin, AI Compliance Twin, Modular Audit Engine, Precision Drift Detector, Compliance Fingerprint Layer</li>
                  <li style="margin-bottom: 10px;"><strong>SKC Meeting ResetFrame™</strong> - Enterprise accountability framework</li>
                  <li style="margin-bottom: 10px;"><strong>Enterprise Implementation Strategies</strong> - Real-world deployment guidance</li>
                </ul>
              </div>

              <!-- Download Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'}/Doc/Beyond%20Tpm%20Csm.pdf" 
                   style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                  📥 Download Your Guide
                </a>
              </div>

              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="color: #10B981; margin-top: 0; font-size: 18px;">What's Next?</h3>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                  You're now subscribed to receive weekly AI insights and compliance updates. Here's what you can expect:
                </p>
                <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Weekly AI governance and compliance insights</li>
                  <li style="margin-bottom: 8px;">Enterprise implementation case studies</li>
                  <li style="margin-bottom: 8px;">Regulatory updates (EU AI Act, GDPR, sector-specific)</li>
                  <li style="margin-bottom: 8px;">Exclusive frameworks and methodologies</li>
                </ul>
              </div>

              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">Need Help Implementing?</h3>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                  I work with Fortune 500 enterprises and Series B+ startups on AI compliance, governance, and technical program leadership.
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'}/contact" 
                   style="display: inline-block; color: #10B981; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Schedule a Consultation →
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #6b7280;">Subodh KC</strong><br>
                AI Compliance Architect | Enterprise Technical Program Manager | HAIEC Founder
              </p>
              <p style="margin: 10px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'}" style="color: #10B981; text-decoration: none;">subodhkc.com</a> | 
                <a href="https://linkedin.com/in/subodhkc" style="color: #10B981; text-decoration: none;">LinkedIn</a> | 
                <a href="https://haiec.com/csm6" style="color: #10B981; text-decoration: none;">HAIEC Platform</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #d1d5db; font-size: 11px;">
                You're receiving this because you downloaded the AI Compliance Framework guide from subodhkc.com<br>
                <a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
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

    // Also notify you about the new lead
    await resend.emails.send({
      from: 'Lead Notification <onboarding@resend.dev>',
      to: ['Subodh.kc@haiec.com'],
      subject: `🎯 New Lead: ${name} downloaded AI Compliance Guide`,
      html: `
        <h2>New Lead Magnet Download</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Downloaded:</strong> AI Compliance Framework Guide</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
        <hr>
        <p><small>Automated notification from subodhkc.com</small></p>
      `,
    })

    console.log('Lead magnet sent:', { name, email, timestamp: new Date().toISOString() })

    return NextResponse.json(
      { success: true, data: { id: data?.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Lead magnet error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
