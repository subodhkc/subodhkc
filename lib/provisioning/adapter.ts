/**
 * External Product Provisioning Adapter Interface
 *
 * Each external product (HAIEC, KestrelVoice) implements this interface.
 * The SubodhKC admin dashboard calls these adapters when activating a
 * product access request. The adapter provisions (or attempts to provision)
 * the user's account on the external platform and returns the result.
 *
 * IMPORTANT: These adapters call EXTERNAL databases/APIs. They must:
 * - Never store passwords in the SubodhKC database
 * - Use server-side API keys from environment variables
 * - Return only non-sensitive identifiers (external user ID, tenant ID, launch URL)
 * - Fail gracefully with clear error messages for manual fallback
 * - Be idempotent (calling twice should not create duplicate accounts)
 */

export type ProvisioningResult =
  | {
      success: true
      externalUserId?: string
      externalTenantId?: string
      launchUrl: string
      message: string
      provisioningMethod: 'api' | 'manual' | 'invitation'
    }
  | {
      success: false
      error: string
      requiresManualAction: boolean
      manualInstructions?: string
    }

export interface ProvisioningContext {
  /** Customer's verified email from SubodhKC auth */
  customerEmail: string
  /** Customer's display name from SubodhKC profile */
  customerName: string | null
  /** SubodhKC organization name */
  organizationName: string
  /** SubodhKC organization slug */
  organizationSlug: string
  /** Admin note (optional instructions from Subodh) */
  adminNote?: string
  /** Source advisory offer key (e.g., 'ai_advisor_desk', 'fractional_ai_advisor') */
  sourceOfferKey?: string
  /** Plan tier to provision on the external system (from includedProducts spec) */
  planTier?: string
}

/**
 * Every external product adapter implements this interface.
 */
export interface ProductProvisioningAdapter {
  /** The offering key this adapter handles (e.g., 'haiec', 'kestrel') */
  offeringKey: string

  /** Human-readable product name */
  productName: string

  /**
   * Check if this adapter is configured (API keys present in env).
   * If false, the admin dashboard will use manual activation.
   */
  isConfigured(): boolean

  /**
   * Provision the user on the external platform.
   * Must be idempotent — if the user already exists, return success
   * with the existing account info rather than creating a duplicate.
   */
  provision(ctx: ProvisioningContext): Promise<ProvisioningResult>

  /**
   * Check if a user already has an account on the external platform.
   * Used to decide whether to provision or just link.
   */
  checkExistingAccount(customerEmail: string): Promise<{
    exists: boolean
    externalUserId?: string
    launchUrl?: string
  }>
}

/**
 * Registry of all available provisioning adapters.
 * Adapters are lazily loaded to avoid importing external SDKs
 * unless the adapter is actually used.
 */
export async function getProvisioningAdapter(
  offeringKey: string
): Promise<ProductProvisioningAdapter | null> {
  switch (offeringKey) {
    case 'haiec': {
      const { HaiecProvisioningAdapter } = await import('./haiec-adapter')
      return new HaiecProvisioningAdapter()
    }
    case 'kestrel': {
      const { KestrelProvisioningAdapter } = await import('./kestrel-adapter')
      return new KestrelProvisioningAdapter()
    }
    default:
      return null
  }
}

/**
 * Get the default launch URL for an offering (used when adapter is not configured).
 */
export function getDefaultLaunchUrl(offeringKey: string): string {
  switch (offeringKey) {
    case 'haiec':
      return 'https://www.haiec.com'
    case 'kestrel':
      return 'https://www.kestrelvoice.com'
    default:
      return ''
  }
}
