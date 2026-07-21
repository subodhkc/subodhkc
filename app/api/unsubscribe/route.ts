import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Service not configured' },
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

    // Resend Contacts API: update contact to unsubscribed
    // First, get the contact to find their ID
    const contactsRes = await fetch('https://api.resend.com/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!contactsRes.ok) {
      console.error('Failed to fetch contacts from Resend')
      return NextResponse.json(
        { success: false, error: 'Failed to process unsubscribe' },
        { status: 500 }
      )
    }

    const contactsData = await contactsRes.json()
    const contacts = Array.isArray(contactsData) ? contactsData : (contactsData.data || [])
    const contact = contacts.find((c: { email: string }) => c.email === email)

    if (!contact) {
      // Contact not found — treat as success (already unsubscribed or never subscribed)
      return NextResponse.json({ success: true })
    }

    // Update contact to unsubscribed
    const updateRes = await fetch(`https://api.resend.com/contacts/${contact.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: true,
      }),
    })

    if (!updateRes.ok) {
      const text = await updateRes.text()
      console.error('Resend unsubscribe error:', text)
      return NextResponse.json(
        { success: false, error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    // Notify admin
    await resend.emails.send({
      from: 'Newsletter Notification <noreply@subodhkc.com>',
      to: ['subodhkc@subodhkc.com'],
      subject: `📤 Unsubscribe: ${email}`,
      html: `
        <h2>Newsletter Unsubscribe</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
        <hr>
        <p><small>Automated notification from subodhkc.com</small></p>
      `,
    })

    console.log('Unsubscribe processed:', { email, timestamp: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
