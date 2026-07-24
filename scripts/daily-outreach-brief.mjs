#!/usr/bin/env node

/**
 * daily-outreach-brief.mjs — Sends a daily summary email of outreach activity.
 *
 * Fetches outreach email data from Supabase, identifies pending follow-ups,
 * and sends a brief to the admin email via Resend.
 *
 * Usage:
 *   node scripts/daily-outreach-brief.mjs
 *
 * Required env vars:
 *   SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 *   ADMIN_EMAIL (optional, defaults to subodhkc@subodhkc.com)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'subodhkc@subodhkc.com'
const DASHBOARD_URL = 'https://subodhkc.com/dashboard/analytics'

async function fetchOutreachData() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase not configured')
    process.exit(1)
  }

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/outreach_emails?order=sent_date.desc&limit=200`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  })

  if (!resp.ok) {
    console.error(`Supabase query failed: ${resp.status} ${resp.statusText}`)
    process.exit(1)
  }

  const emails = await resp.json()
  return emails
}

function buildBriefHtml(emails) {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Stats
  const sentToday = emails.filter(e => e.sent_date?.startsWith(today))
  const sentYesterday = emails.filter(e => e.sent_date?.startsWith(yesterday))
  const recentSent = emails.filter(e => e.status === 'sent')
  const replied = emails.filter(e => e.status === 'replied')
  const followedUp = emails.filter(e => e.status === 'followed_up')
  const closed = emails.filter(e => e.status === 'closed')

  // Pending follow-ups: sent >7 days ago, still in 'sent' status
  const pendingFollowUps = recentSent.filter(e => {
    const sentDate = new Date(e.sent_date)
    return sentDate < sevenDaysAgo
  }).map(e => ({
    ...e,
    days_since: Math.floor((now - new Date(e.sent_date)) / (1000 * 60 * 60 * 24)),
  })).sort((a, b) => b.days_since - a.days_since)

  // Recent replies (last 7 days)
  const recentReplies = replied.filter(e => {
    if (!e.replied_date) return false
    return new Date(e.replied_date) > sevenDaysAgo
  })

  const statusBadge = (status) => {
    const colors = {
      sent: '#3b82f6',
      replied: '#10b981',
      followed_up: '#f97316',
      closed: '#6b7280',
    }
    const color = colors[status] || '#6b7280'
    return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;color:${color};background:${color}15;">${status.replace('_', ' ').toUpperCase()}</span>`
  }

  const formatDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  let html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:700px;margin:0 auto;padding:20px;">
  <div style="background:linear-gradient(135deg,#10B981 0%,#059669 100%);padding:24px;border-radius:12px;margin-bottom:24px;">
    <h1 style="color:white;margin:0;font-size:22px;">📊 Daily Outreach Brief</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0 0;font-size:14px;">${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>`

  // Stats summary
  html += `
  <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;">
    <div style="flex:1;min-width:100px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center;">
      <div style="font-size:24px;font-weight:bold;color:#3b82f6;">${recentSent.length}</div>
      <div style="font-size:11px;color:#64748b;">Awaiting Reply</div>
    </div>
    <div style="flex:1;min-width:100px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center;">
      <div style="font-size:24px;font-weight:bold;color:#10b981;">${replied.length}</div>
      <div style="font-size:11px;color:#64748b;">Replied</div>
    </div>
    <div style="flex:1;min-width:100px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center;">
      <div style="font-size:24px;font-weight:bold;color:#f97316;">${pendingFollowUps.length}</div>
      <div style="font-size:11px;color:#64748b;">Need Follow-Up</div>
    </div>
    <div style="flex:1;min-width:100px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center;">
      <div style="font-size:24px;font-weight:bold;color:#6b7280;">${closed.length}</div>
      <div style="font-size:11px;color:#64748b;">Closed</div>
    </div>
  </div>`

  // Pending follow-ups
  if (pendingFollowUps.length > 0) {
    html += `
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;color:#f97316;">⚠️ Pending Follow-Ups (${pendingFollowUps.length})</h2>
    <p style="margin:0 0 12px 0;font-size:13px;color:#9a3412;">These emails were sent over 7 days ago with no reply. Send the follow-up template from the outreach plan.</p>
    <table style="width:100%;font-size:13px;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid #fed7aa;text-align:left;">
          <th style="padding:6px 8px;">Days</th>
          <th style="padding:6px 8px;">Target</th>
          <th style="padding:6px 8px;">Article</th>
        </tr>
      </thead>
      <tbody>`
    for (const f of pendingFollowUps.slice(0, 10)) {
      html += `
        <tr style="border-bottom:1px solid #ffedd5;">
          <td style="padding:6px 8px;color:#f97316;font-weight:600;">${f.days_since}d</td>
          <td style="padding:6px 8px;">${f.target}</td>
          <td style="padding:6px 8px;color:#64748b;font-size:12px;">${f.article_title?.substring(0, 40)}...</td>
        </tr>`
    }
    html += `
      </tbody>
    </table>
  </div>`
  }

  // Recent replies
  if (recentReplies.length > 0) {
    html += `
  <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:16px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;color:#10b981;">✅ Recent Replies (last 7 days)</h2>
    <table style="width:100%;font-size:13px;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid #a7f3d0;text-align:left;">
          <th style="padding:6px 8px;">Date</th>
          <th style="padding:6px 8px;">Target</th>
          <th style="padding:6px 8px;">Article</th>
        </tr>
      </thead>
      <tbody>`
    for (const r of recentReplies) {
      html += `
        <tr style="border-bottom:1px solid #d1fae5;">
          <td style="padding:6px 8px;color:#64748b;">${formatDate(r.replied_date)}</td>
          <td style="padding:6px 8px;">${r.target}</td>
          <td style="padding:6px 8px;color:#64748b;font-size:12px;">${r.article_title?.substring(0, 40)}...</td>
        </tr>`
    }
    html += `
      </tbody>
    </table>
  </div>`
  }

  // Sent today
  if (sentToday.length > 0) {
    html += `
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;color:#3b82f6;">📤 Sent Today (${sentToday.length})</h2>
    <table style="width:100%;font-size:13px;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid #bfdbfe;text-align:left;">
          <th style="padding:6px 8px;">Target</th>
          <th style="padding:6px 8px;">Subject</th>
          <th style="padding:6px 8px;">Type</th>
        </tr>
      </thead>
      <tbody>`
    for (const e of sentToday) {
      html += `
        <tr style="border-bottom:1px solid #dbeafe;">
          <td style="padding:6px 8px;">${e.target}</td>
          <td style="padding:6px 8px;color:#64748b;font-size:12px;">${e.subject?.substring(0, 50)}...</td>
          <td style="padding:6px 8px;">${e.email_type === 'follow_up' ? 'Follow-up' : 'Initial'}</td>
        </tr>`
    }
    html += `
      </tbody>
    </table>
  </div>`
  }

  // All active emails table
  const activeEmails = emails.filter(e => e.status === 'sent' || e.status === 'followed_up').slice(0, 15)
  if (activeEmails.length > 0) {
    html += `
  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:24px;">
    <h2 style="margin:0 0 12px 0;font-size:16px;">📋 Active Outreach (${activeEmails.length})</h2>
    <table style="width:100%;font-size:12px;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid #e5e7eb;text-align:left;">
          <th style="padding:6px 8px;">Sent</th>
          <th style="padding:6px 8px;">Target</th>
          <th style="padding:6px 8px;">Article</th>
          <th style="padding:6px 8px;">Status</th>
        </tr>
      </thead>
      <tbody>`
    for (const e of activeEmails) {
      html += `
        <tr style="border-bottom:1px solid #f3f4f6;">
          <td style="padding:6px 8px;color:#64748b;">${formatDate(e.sent_date)}</td>
          <td style="padding:6px 8px;">${e.target}</td>
          <td style="padding:6px 8px;color:#64748b;font-size:11px;">${e.article_title?.substring(0, 35)}...</td>
          <td style="padding:6px 8px;">${statusBadge(e.status)}</td>
        </tr>`
    }
    html += `
      </tbody>
    </table>
  </div>`
  }

  // CTA to dashboard
  html += `
  <div style="text-align:center;margin-top:24px;padding:20px;background:#f8fafc;border-radius:8px;">
    <p style="margin:0 0 12px 0;font-size:14px;color:#374151;">Manage all outreach emails, mark replies, and track follow-ups</p>
    <a href="${DASHBOARD_URL}" style="display:inline-block;padding:10px 24px;background:#10B981;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Open Analytics Dashboard →</a>
  </div>

  <div style="text-align:center;margin-top:16px;padding:12px;color:#9ca3af;font-size:11px;">
    <p>Automated daily brief from subodhkc.com — sent via GitHub Actions</p>
  </div>
</div>`

  return html
}

async function sendBrief(html) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set — cannot send brief')
    process.exit(1)
  }

  const { Resend } = await import('resend')
  const resend = new Resend(RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: 'Outreach Brief <noreply@subodhkc.com>',
    to: [ADMIN_EMAIL],
    subject: `📊 Daily Outreach Brief — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    html,
  })

  if (error) {
    console.error(`Email send failed: ${error.message}`)
    process.exit(1)
  }

  console.log(`✓ Daily brief sent to ${ADMIN_EMAIL}`)
}

async function main() {
  console.log('Fetching outreach data from Supabase...')
  const emails = await fetchOutreachData()
  console.log(`  Found ${emails.length} outreach emails`)

  if (emails.length === 0) {
    console.log('No outreach emails to report — skipping brief')
    return
  }

  console.log('Building brief HTML...')
  const html = buildBriefHtml(emails)

  console.log('Sending brief via Resend...')
  await sendBrief(html)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
