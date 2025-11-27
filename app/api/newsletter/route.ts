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
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
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

    // Send welcome email for newsletter subscription
    const { data, error } = await resend.emails.send({
      from: 'Subodh KC <onboarding@resend.dev>',
      to: [email],
      subject: '✅ Welcome to AI Insights & Compliance Updates',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to AI Insights</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome! 👋</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">You're now part of the AI Compliance community</p>
            </div>

            <!-- Main Content -->
            <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Thanks for subscribing to <strong>AI Insights & Compliance Updates</strong>!
              </p>

              <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
                You've joined 1,000+ technical leaders who stay ahead of AI regulations and governance best practices.
              </p>

              <div style="background: #f0fdf4; border-left: 4px solid #10B981; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">What You'll Receive:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #065f46;">
                  <li style="margin-bottom: 10px;"><strong>Weekly AI Insights</strong> - Practical guidance on AI governance and compliance</li>
                  <li style="margin-bottom: 10px;"><strong>Regulatory Updates</strong> - EU AI Act, GDPR, and sector-specific regulations</li>
                  <li style="margin-bottom: 10px;"><strong>Enterprise Case Studies</strong> - Real-world implementation strategies</li>
                  <li style="margin-bottom: 10px;"><strong>Exclusive Frameworks</strong> - Methodologies from Fortune 50 programs</li>
                  <li style="margin-bottom: 10px;"><strong>Technical Deep-Dives</strong> - Program management at scale</li>
                </ul>
              </div>

              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">🎁 Bonus: Free Resources</h3>
                <p style="color: #1e3a8a; font-size: 14px; margin-bottom: 15px;">
                  As a subscriber, you get exclusive access to:
                </p>
                <ul style="color: #1e3a8a; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">AI Compliance Framework Guide (PDF)</li>
                  <li style="margin-bottom: 8px;">CSM Framework Templates</li>
                  <li style="margin-bottom: 8px;">Audit Readiness Checklists</li>
                  <li style="margin-bottom: 8px;">Monthly Office Hours (Q&A)</li>
                </ul>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'}/resources" 
                     style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                    Access Resources →
                  </a>
                </div>
              </div>

              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">About Me</h3>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                  I'm Subodh KC, AI Compliance Architect at a Fortune 50 company and founder of HAIEC (Human AI Ethics Council). 
                  With 12+ years driving enterprise AI programs, I help organizations navigate the intersection of AI innovation, 
                  regulatory compliance, and ethical governance.
                </p>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                  <strong>Key Achievements:</strong>
                </p>
                <ul style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0; padding-left: 20px;">
                  <li style="margin-bottom: 6px;">Led 50+ enterprise AI programs ($50M+ budgets)</li>
                  <li style="margin-bottom: 6px;">5 patent-pending AI compliance frameworks</li>
                  <li style="margin-bottom: 6px;">Managed 100+ stakeholder teams globally</li>
                  <li style="margin-bottom: 6px;">Created CSM Framework & SKC ResetFrame™</li>
                </ul>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'}/about" 
                   style="display: inline-block; color: #10B981; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Learn More About My Work →
                </a>
              </div>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-top: 30px; border-radius: 8px;">
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  <strong>💡 Pro Tip:</strong> Add <strong>Subodh.kc@haiec.com</strong> to your contacts to ensure you never miss an update!
                </p>
              </div>

            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #6b7280;">Subodh KC</strong><br>
                AI Compliance Architect | Enterprise Technical Program Manager | HAIEC Founder
              </p>
              <p style="margin: 10px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'}" style="color: #10B981; text-decoration: none;">Website</a> | 
                <a href="https://linkedin.com/in/subodhkc" style="color: #10B981; text-decoration: none;">LinkedIn</a> | 
                <a href="https://medium.com/@subodhkc" style="color: #10B981; text-decoration: none;">Medium</a> | 
                <a href="https://haiec.com/csm6" style="color: #10B981; text-decoration: none;">HAIEC Platform</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #d1d5db; font-size: 11px;">
                You're receiving this because you subscribed to AI Insights & Compliance Updates at subodhkc.com<br>
                <a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> | 
                <a href="#" style="color: #9ca3af; text-decoration: underline;">Update Preferences</a>
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

    // Notify you about new subscriber
    await resend.emails.send({
      from: 'Newsletter Notification <onboarding@resend.dev>',
      to: ['Subodh.kc@haiec.com'],
      subject: `📧 New Newsletter Subscriber: ${email}`,
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Source:</strong> Newsletter Signup Form</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
        <hr>
        <p><small>Automated notification from subodhkc.com</small></p>
      `,
    })

    console.log('Newsletter subscription:', { email, timestamp: new Date().toISOString() })

    return NextResponse.json(
      { success: true, data: { id: data?.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
