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

  const isSchool = orgName.toLowerCase().includes('school') || orgName.toLowerCase().includes('elementary')
  const subject = isSchool
    ? `${orgName} School Pickup access`
    : `You're invited to join ${orgName} on SubodhKC`
  const headerText = isSchool ? 'School Pickup Access' : "You're Invited"
  const subHeaderText = isSchool
    ? `You've been invited to access ${orgName} School Pickup`
    : `Join ${orgName} on SubodhKC`
  const bodyText = isSchool
    ? `<strong>${inviterName}</strong> has invited you to access <strong>${orgName}</strong> School Pickup. Sign in with the Google account associated with this email to continue.`
    : `<strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> as a <strong>${role}</strong>.`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${headerText}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${subHeaderText}</p>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              ${bodyText}
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
              This invitation expires in 7 days.
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
            <p>If you weren't expecting this invitation, no action is required.</p>
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
 * Send a guardian invitation email for school pickup family access.
 */
export async function sendGuardianInvitationEmail(opts: {
  to: string
  orgName: string
  siteName: string
  inviterName: string
  token: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, orgName, siteName, inviterName, token } = opts
  const inviteUrl = `${siteUrl}/family/invite?token=${token}`

  const subject = `${siteName} family pickup access`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Family Pickup Access</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${siteName}</p>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              You've been invited to access pickup information for your child through <strong>${siteName}</strong> School Pickup.
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
              Sign in using this email address to continue. You can use Google or request a secure sign-in link.
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
              Invited by <strong>${inviterName}</strong>. This invitation expires in 7 days.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Access Family Pickup
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
            <p>If you weren't expecting this invitation, no action is required.</p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('Resend guardian invitation email error:', error.message)
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

/**
 * Send a welcome email after AI Advisor Desk subscription activation.
 */
export async function sendAdvisorWelcomeEmail(opts: {
  to: string
  customerName?: string
  orgSlug: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, orgSlug } = opts
  const workspaceUrl = `${siteUrl}/app/${orgSlug}/advisor-desk`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Welcome to AI Advisor Desk',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to AI Advisor Desk</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your subscription is active</p>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Your AI Advisor Desk subscription is now active. You can send focused AI questions as decisions come up, review AI risk areas, and invite up to 3 team members.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${workspaceUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Go to Your Advisor Desk
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              Human advisory access is included under reasonable use. Your team has up to 3 seats. Billing is managed through Stripe.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>SubodhKC — AI intelligence, opportunity discovery, and human advisory access</p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Notify advisor (Subodh) when a new question is submitted.
 */
export async function sendAdvisorQuestionNotification(opts: {
  to: string
  customerOrg: string
  customerName?: string
  subject: string
  question: string
  questionId: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerOrg, customerName, subject, question, questionId } = opts

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `New Advisor Question: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>New Advisor Question</h2>
          <p><strong>From:</strong> ${customerName || customerOrg}</p>
          <p><strong>Organization:</strong> ${customerOrg}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${question}</p>
          </div>
          <p style="font-size: 14px; color: #6b7280;">Question ID: ${questionId}</p>
          <p>Review and respond in the Advisor Console.</p>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Notify customer when advisor responds to their question.
 */
export async function sendAdvisorResponseEmail(opts: {
  to: string
  customerName?: string
  subject: string
  response: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, subject, response } = opts

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Advisor Response: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Your Advisor Has Responded</h1>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 10px;">
              <strong>Question:</strong> ${subject}
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 15px;">${response}</p>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              You can view the full response in your AI Advisor Desk workspace.
            </p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Send Blueprint purchased notification.
 */
export async function sendBlueprintPurchasedEmail(opts: {
  to: string
  customerName?: string
  orgSlug: string
  businessObjective: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, orgSlug, businessObjective } = opts
  const workspaceUrl = `${siteUrl}/app/${orgSlug}/blueprint`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Your AI Automation Blueprint is Starting',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Blueprint Intake Started</h1>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Your AI Automation Blueprint is underway. We are analyzing your workflow and will deliver your recommendation shortly.
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
              <strong>Objective:</strong> ${businessObjective}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${workspaceUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                View Your Blueprint
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Send security review activated notification.
 */
export async function sendSecurityReviewActivatedEmail(opts: {
  to: string
  customerName?: string
  orgSlug: string
  scopeSummary: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, orgSlug, scopeSummary } = opts
  const workspaceUrl = `${siteUrl}/app/${orgSlug}/security-review`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Your Security Review is Active',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Security Review Activated</h1>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Your security review is now active. Please complete the access checklist so we can begin the review.
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
              <strong>Scope:</strong> ${scopeSummary}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${workspaceUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Go to Security Review
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Send deliverable published notification.
 */
export async function sendDeliverablePublishedEmail(opts: {
  to: string
  customerName?: string
  orgSlug: string
  workspacePath: string
  deliverableTitle: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, orgSlug, workspacePath, deliverableTitle } = opts
  const workspaceUrl = `${siteUrl}/app/${orgSlug}/${workspacePath}`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Deliverable Published: ${deliverableTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Deliverable Published</h1>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              <strong>${deliverableTitle}</strong> is now available in your workspace.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${workspaceUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                View Deliverable
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Send retest completed notification.
 */
export async function sendRetestCompletedEmail(opts: {
  to: string
  customerName?: string
  orgSlug: string
  findingTitle: string
  result: 'verified' | 'additional_work_recommended'
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, orgSlug, findingTitle, result } = opts
  const workspaceUrl = `${siteUrl}/app/${orgSlug}/security-review`
  const resultText = result === 'verified' ? 'Retest Verified' : 'Additional Work Recommended'

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Retest Result: ${findingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, ${result === 'verified' ? '#16a34a' : '#d97706'} 0%, ${result === 'verified' ? '#15803d' : '#b45309'} 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${resultText}</h1>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              The retest for <strong>${findingTitle}</strong> is complete. Result: <strong>${resultText}</strong>.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${workspaceUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                View in Security Review
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Send subscription issue notification (payment failed, etc).
 */
export async function sendSubscriptionIssueEmail(opts: {
  to: string
  customerName?: string
  orgSlug: string
  issue: string
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email service not configured' }

  const { to, customerName, orgSlug, issue } = opts
  const portalUrl = `${siteUrl}/app/${orgSlug}/advisor-desk`

  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Subscription Action Needed',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 20px 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Action Needed</h1>
          </div>
          <div style="background: white; padding: 40px 30px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hi ${customerName || 'there'},
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              There is an issue with your AI Advisor Desk subscription: ${issue}
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
              Please update your payment method to avoid service interruption.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${portalUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Manage Billing
              </a>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
