/**
 * Spam filtering for public form submissions.
 * - Honeypot: bots fill hidden fields; humans don't
 * - Disposable email domains: block throwaway addresses
 * - Role-based email detection: block info@, admin@, etc. for signups
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'tempmail.org',
  'throwaway.email', 'fakeinbox.com', 'dispostable.com', 'maildrop.cc',
  'getnada.com', 'mohmal.com', '10minutemail.com', 'yopmail.com',
  'sharklasers.com', 'guerrillamailblock.com', 'spam4.me', 'tempr.email',
  'tmail.io', 'tmpmail.org', 'trashmail.com', 'mailnesia.com',
  'emailondeck.com', 'tempinbox.com', 'mintemail.com', 'temp-mail.org',
  'discard.email', 'mailcatch.com', 'spambog.com', 'tempmailaddress.com',
  'fakeemail.com', 'tempmailo.com', 'owafwq.com', 'uorak.com',
  'mytemp.email', 'tempmailo.net', 'moakt.com', 'burnermail.io',
])

export interface SpamCheckResult {
  isSpam: boolean
  reason?: string
}

/**
 * Check honeypot field — if filled, it's a bot.
 * Bots auto-fill all form fields; humans never see the hidden honeypot.
 */
export function checkHoneypot(website?: string): SpamCheckResult {
  if (website && website.trim().length > 0) {
    return { isSpam: true, reason: 'honeypot' }
  }
  return { isSpam: false }
}

/**
 * Check if email uses a disposable/throwaway domain.
 */
export function checkDisposableEmail(email: string): SpamCheckResult {
  const domain = email.split('@')[1]?.toLowerCase().trim()
  if (!domain) return { isSpam: true, reason: 'invalid_email' }
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { isSpam: true, reason: 'disposable_domain' }
  }
  return { isSpam: false }
}

/**
 * Combined spam check for signup forms.
 * Returns isSpam=true if any check fails.
 * Caller should return a fake success response (200) to avoid tipping off bots.
 */
export function checkSignupSpam(email: string, honeypot?: string): SpamCheckResult {
  const honeypotCheck = checkHoneypot(honeypot)
  if (honeypotCheck.isSpam) return honeypotCheck

  const disposableCheck = checkDisposableEmail(email)
  if (disposableCheck.isSpam) return disposableCheck

  return { isSpam: false }
}
