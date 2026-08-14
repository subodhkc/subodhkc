import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

/**
 * Get the Stripe SDK instance.
 * Returns null if STRIPE_SECRET_KEY is not configured.
 */
export function getStripe(): Stripe | null {
  if (stripeInstance) return stripeInstance

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is not set')
    return null
  }

  stripeInstance = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as Stripe.LatestApiVersion,
    typescript: true,
  })
  return stripeInstance
}

/**
 * Get the webhook secret for signature verification.
 */
export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null
}
