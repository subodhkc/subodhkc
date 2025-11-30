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
    const { email, source, product, waitlist } = body

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'

    // Different emails based on product/source
    if (source === 'print-later') {
      // Send Print Later download email
      await resend.emails.send({
        from: 'Subodh KC <onboarding@resend.dev>',
        to: [email],
        subject: '🖨️ Your Print Later Download is Ready!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
              
              <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🖨️ Print Later</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Your download is ready!</p>
              </div>

              <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  Thanks for downloading <strong>Print Later</strong>! Here are your download options:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://github.com/subodhkc/Print-Later/releases/download/v1.0.0/Print.Later.Setup.1.0.0.exe" 
                     style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 15px;">
                    Download for Windows (93 MB)
                  </a>
                  <br><br>
                  <a href="https://github.com/subodhkc/Print-Later" 
                     style="display: inline-block; background: #1f2937; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    View on GitHub
                  </a>
                </div>

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px;">
                  <p style="color: #92400e; font-size: 14px; margin: 0;">
                    <strong>Note:</strong> Windows SmartScreen may show a warning because the app is not code-signed. 
                    Click "More info" → "Run anyway" to install.
                  </p>
                </div>

                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-top: 30px;">
                  <h3 style="color: #065f46; margin-top: 0;">Quick Start:</h3>
                  <ol style="color: #065f46; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Run the installer</li>
                    <li style="margin-bottom: 8px;">Install the browser extension (instructions in app)</li>
                    <li style="margin-bottom: 8px;">Click the extension icon on any web page to save it</li>
                    <li style="margin-bottom: 8px;">Print when you're ready!</li>
                  </ol>
                </div>

                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <h3 style="color: #1f2937; margin-top: 0;">Your Privacy Matters</h3>
                  <p style="color: #6b7280; font-size: 14px;">
                    Print Later stores everything locally on your computer. No cloud uploads, no tracking, no accounts required. 
                    Your documents are 100% yours.
                  </p>
                </div>

              </div>

              <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #6b7280;">Subodh KC</strong><br>
                  Creator of Print Later
                </p>
                <p style="margin: 10px 0;">
                  <a href="${siteUrl}" style="color: #2563eb; text-decoration: none;">subodhkc.com</a> | 
                  <a href="https://github.com/subodhkc" style="color: #2563eb; text-decoration: none;">GitHub</a>
                </p>
              </div>

            </body>
          </html>
        `,
      })
    } else if (source === 'pdf-redactor') {
      // Send PDF Redactor download email
      await resend.emails.send({
        from: 'Subodh KC <onboarding@resend.dev>',
        to: [email],
        subject: '🔒 Your PDF Redactor Download is Ready!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
              
              <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🔒 PDF Redactor</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Your download is ready!</p>
              </div>

              <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  Thanks for downloading <strong>PDF Redactor</strong>! Protect your sensitive documents with AI-powered redaction.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                    Download link will be available soon. We'll notify you when the app is ready!
                  </p>
                </div>

                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-top: 30px;">
                  <h3 style="color: #065f46; margin-top: 0;">What PDF Redactor Does:</h3>
                  <ul style="color: #065f46; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">AI-powered detection of 50+ PII types</li>
                    <li style="margin-bottom: 8px;">Permanent, unrecoverable redaction</li>
                    <li style="margin-bottom: 8px;">100% local processing - no cloud uploads</li>
                    <li style="margin-bottom: 8px;">Batch processing for multiple documents</li>
                  </ul>
                </div>

                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <h3 style="color: #1f2937; margin-top: 0;">Your Privacy Matters</h3>
                  <p style="color: #6b7280; font-size: 14px;">
                    PDF Redactor processes everything locally. Your documents never leave your computer.
                  </p>
                </div>

              </div>

              <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #6b7280;">Subodh KC</strong><br>
                  Creator of PDF Redactor
                </p>
                <p style="margin: 10px 0;">
                  <a href="${siteUrl}" style="color: #dc2626; text-decoration: none;">subodhkc.com</a> | 
                  <a href="https://github.com/subodhkc" style="color: #dc2626; text-decoration: none;">GitHub</a>
                </p>
              </div>

            </body>
          </html>
        `,
      })
    } else if (source === 'doc-timeline-pricing') {
      // Send Doc Timeline pricing request confirmation
      const { name, company, useCase, volume } = body
      await resend.emails.send({
        from: 'Subodh KC <onboarding@resend.dev>',
        to: [email],
        subject: '📊 Doc Timeline Generator - Pricing Request Received',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
              
              <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">📊 Doc Timeline Generator</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Pricing Request Received</p>
              </div>

              <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  Hi ${name || 'there'},
                </p>
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  Thank you for your interest in <strong>Doc Timeline Generator</strong>! We've received your pricing request and our team will prepare a custom quote for ${company || 'your organization'}.
                </p>

                <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">What Happens Next:</h3>
                  <ol style="color: #1e3a8a; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Our team reviews your requirements</li>
                    <li style="margin-bottom: 8px;">We prepare a custom quote based on your volume</li>
                    <li style="margin-bottom: 8px;">You'll receive pricing within 24 hours</li>
                    <li style="margin-bottom: 8px;">Optional: Schedule a demo call</li>
                  </ol>
                </div>

                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <h3 style="color: #1f2937; margin-top: 0;">Enterprise Features Include:</h3>
                  <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Unlimited document processing</li>
                    <li style="margin-bottom: 8px;">On-premise deployment option</li>
                    <li style="margin-bottom: 8px;">Custom integrations & API access</li>
                    <li style="margin-bottom: 8px;">Dedicated support & training</li>
                    <li style="margin-bottom: 8px;">SOC 2 compliance documentation</li>
                  </ul>
                </div>

              </div>

              <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #6b7280;">Subodh KC</strong><br>
                  Doc Timeline Generator
                </p>
                <p style="margin: 10px 0;">
                  <a href="${siteUrl}" style="color: #2563eb; text-decoration: none;">subodhkc.com</a>
                </p>
              </div>

            </body>
          </html>
        `,
      })
      
      // Send detailed notification to admin for pricing requests
      await resend.emails.send({
        from: 'Product Notification <onboarding@resend.dev>',
        to: ['Subodh.kc@haiec.com'],
        subject: `💰 PRICING REQUEST: Doc Timeline Generator - ${company || 'Unknown Company'}`,
        html: `
          <h2>New Enterprise Pricing Request</h2>
          <p><strong>Product:</strong> Doc Timeline Generator</p>
          <hr>
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Use Case:</strong> ${useCase || 'Not specified'}</p>
          <p><strong>Monthly Volume:</strong> ${volume || 'Not specified'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
          <hr>
          <p><strong>Action Required:</strong> Prepare custom quote within 24 hours</p>
        `,
      })
      
      console.log('Pricing request:', { email, name, company, useCase, volume, timestamp: new Date().toISOString() })
      return NextResponse.json({ success: true }, { status: 200 })
    } else if (source === 'skc-log-analyser') {
      // Send SKC Log Analyser early access confirmation
      await resend.emails.send({
        from: 'Subodh KC <onboarding@resend.dev>',
        to: [email],
        subject: '📊 SKC Log Analyser - Early Access Granted!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
              
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">📊 SKC Log Analyser</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Early Access Granted!</p>
              </div>

              <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  Welcome to the <strong>SKC Log Analyser</strong> early access program! You're among the first to experience AI-powered log analysis.
                </p>

                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #065f46; margin-top: 0;">What You Get:</h3>
                  <ul style="color: #065f46; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Priority access to new features</li>
                    <li style="margin-bottom: 8px;">Direct line to the development team</li>
                    <li style="margin-bottom: 8px;">Influence on the product roadmap</li>
                    <li style="margin-bottom: 8px;">Early access pricing when we launch</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                    We'll notify you as soon as the download is available. In the meantime, check out our other tools!
                  </p>
                  <a href="${siteUrl}/products" 
                     style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                    Explore Products →
                  </a>
                </div>

              </div>

              <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #6b7280;">Subodh KC</strong><br>
                  Creator of SKC Log Analyser
                </p>
                <p style="margin: 10px 0;">
                  <a href="${siteUrl}" style="color: #10b981; text-decoration: none;">subodhkc.com</a>
                </p>
              </div>

            </body>
          </html>
        `,
      })
    } else if (source === 'courtcase-waitlist') {
      // Send CourtCase waitlist confirmation
      await resend.emails.send({
        from: 'Subodh KC <onboarding@resend.dev>',
        to: [email],
        subject: '⚖️ You\'re on the CourtCase Waitlist!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
              
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">⚖️ CourtCase</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">You're on the priority list!</p>
              </div>

              <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                  Thanks for joining the <strong>CourtCase</strong> waitlist! You'll be among the first to know when we launch.
                </p>

                <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #92400e; margin-top: 0;">What to Expect:</h3>
                  <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Priority access when CourtCase launches</li>
                    <li style="margin-bottom: 8px;">Early bird pricing (if applicable)</li>
                    <li style="margin-bottom: 8px;">Direct input on features we build</li>
                    <li style="margin-bottom: 8px;">Launch notification at <strong>courtcase.frontofai.com</strong></li>
                  </ul>
                </div>

                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-top: 30px;">
                  <h3 style="color: #065f46; margin-top: 0;">While You Wait...</h3>
                  <p style="color: #065f46; font-size: 14px; margin-bottom: 15px;">
                    Check out <strong>Print Later</strong> — our free tool for saving web pages and printing them when you're ready. 
                    Same privacy-first approach, available now!
                  </p>
                  <a href="${siteUrl}/products/print-later" 
                     style="display: inline-block; background: #10B981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                    Get Print Later Free →
                  </a>
                </div>

                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <h3 style="color: #1f2937; margin-top: 0;">Privacy Promise</h3>
                  <p style="color: #6b7280; font-size: 14px;">
                    Like Print Later, CourtCase will store everything locally on your computer. 
                    Your legal documents are sensitive — we'll never have access to them.
                  </p>
                </div>

              </div>

              <div style="text-align: center; padding: 30px 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #6b7280;">Subodh KC</strong><br>
                  Creator of CourtCase & Print Later
                </p>
                <p style="margin: 10px 0;">
                  <a href="${siteUrl}" style="color: #f59e0b; text-decoration: none;">subodhkc.com</a> | 
                  <a href="https://github.com/subodhkc" style="color: #f59e0b; text-decoration: none;">GitHub</a>
                </p>
              </div>

            </body>
          </html>
        `,
      })
    }

    // Notify admin about new subscriber
    await resend.emails.send({
      from: 'Product Notification <onboarding@resend.dev>',
      to: ['Subodh.kc@haiec.com'],
      subject: `📦 New ${product || 'Product'} ${waitlist ? 'Waitlist' : 'Download'}: ${email}`,
      html: `
        <h2>New ${waitlist ? 'Waitlist Signup' : 'Product Download'}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Product:</strong> ${product || 'Unknown'}</p>
        <p><strong>Source:</strong> ${source || 'Unknown'}</p>
        <p><strong>Type:</strong> ${waitlist ? 'Waitlist' : 'Download'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
        <hr>
        <p><small>Automated notification from subodhkc.com</small></p>
      `,
    })

    console.log('Product subscription:', { email, source, product, waitlist, timestamp: new Date().toISOString() })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Product subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
