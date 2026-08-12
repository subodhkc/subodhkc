import { Resend } from 'resend'

const FROM = 'SubodhKC <noreply@subodhkc.com>'

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return null
  }
  return new Resend(apiKey)
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'

/**
 * Send an organization invitation email.
 */
export async function sendInvitationEmail(opts: {
  to: string
  orgName: string
  inviterName: string
  role: string
  token: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, orgName, inviterName, role, token } = opts
  const inviteUrl = `${siteUrl}/invite?token=${token}&email=${encodeURIComponent(to)}`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `You're invited to join ${orgName} on SubodhKC`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Organization Invitation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">You're Invited</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Join ${orgName} on SubodhKC</p>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              <strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> as a <strong>${role}</strong>.
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
              This invitation expires in 7 days. If you already have an account, you'll be added automatically. If not, you'll need to sign up first.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Accept Invitation
              </a>
            </div>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0;">
                Or copy this link: <br>
                <span style="color: #2563eb; word-break: break-all;">${inviteUrl}</span>
              </p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>This invitation was sent from subodhkc.com. If you weren't expecting this, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('Resend invitation email error:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Send a notification email when a member's role is changed.
 */
export async function sendRoleChangeEmail(opts: {
  to: string
  orgName: string
  newRole: string
  changedBy: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, orgName, newRole, changedBy } = opts

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Your role in ${orgName} has been updated`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Role Updated</h2>
          <p>Your role in <strong>${orgName}</strong> has been changed to <strong>${newRole}</strong> by ${changedBy}.</p>
          <p><a href="${siteUrl}/app">View your organizations</a></p>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Send a notification email when a member is removed.
 */
export async function sendRemovalEmail(opts: {
  to: string
  orgName: string
  removedBy: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, orgName, removedBy } = opts

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `You have been removed from ${orgName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Membership Removed</h2>
          <p>You have been removed from <strong>${orgName}</strong> by ${removedBy}.</p>
          <p>If you believe this was done in error, please contact the organization administrator.</p>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
