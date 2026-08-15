/**
 * KestrelVoice Provisioning Adapter
 *
 * Calls the KestrelVoice platform's /api/provisioning endpoint to create
 * or link a user account and tenant on the KestrelVoice platform.
 *
 * Configuration (env vars in SubodhKC):
 *   KESTREL_PROVISIONING_URL  - e.g., https://www.kestrelvoice.com/api/provisioning
 *   KESTREL_PROVISIONING_TOKEN - shared secret (must match KestrelVoice's PROVISIONING_API_TOKEN)
 *
 * If not configured, falls back to manual activation.
 */

import type {
  ProductProvisioningAdapter,
  ProvisioningContext,
  ProvisioningResult,
} from './adapter'

const KESTREL_URL = 'https://www.kestrelvoice.com'

export class KestrelProvisioningAdapter implements ProductProvisioningAdapter {
  offeringKey = 'kestrel'
  productName = 'KestrelVoice'

  isConfigured(): boolean {
    return !!(
      process.env.KESTREL_PROVISIONING_URL &&
      process.env.KESTREL_PROVISIONING_TOKEN
    )
  }

  async checkExistingAccount(customerEmail: string): Promise<{
    exists: boolean
    externalUserId?: string
    launchUrl?: string
  }> {
    if (!this.isConfigured()) {
      return { exists: false, launchUrl: KESTREL_URL }
    }

    try {
      const url = `${process.env.KESTREL_PROVISIONING_URL}?email=${encodeURIComponent(customerEmail)}`
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.KESTREL_PROVISIONING_TOKEN}`,
        },
      })

      if (!res.ok) return { exists: false, launchUrl: KESTREL_URL }

      const data = await res.json()
      return {
        exists: data.exists,
        externalUserId: data.externalUserId,
        launchUrl: KESTREL_URL,
      }
    } catch {
      return { exists: false, launchUrl: KESTREL_URL }
    }
  }

  async provision(ctx: ProvisioningContext): Promise<ProvisioningResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'KestrelVoice provisioning not configured. Manual activation required.',
        requiresManualAction: true,
        manualInstructions: `Create an account for ${ctx.customerEmail} at ${KESTREL_URL}/signup, then notify the customer. Or share the KestrelVoice signup link: ${KESTREL_URL}/signup`,
      }
    }

    try {
      const res = await fetch(process.env.KESTREL_PROVISIONING_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.KESTREL_PROVISIONING_TOKEN}`,
        },
        body: JSON.stringify({
          customerEmail: ctx.customerEmail,
          customerName: ctx.customerName,
          organizationName: ctx.organizationName,
          planTier: 'personal',
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'KestrelVoice provisioning failed',
          requiresManualAction: true,
          manualInstructions: `Provisioning API returned an error. Create an account for ${ctx.customerEmail} at ${KESTREL_URL}/signup manually.`,
        }
      }

      return {
        success: true,
        externalUserId: data.externalUserId,
        externalTenantId: data.externalTenantId,
        launchUrl: data.launchUrl || KESTREL_URL,
        message: data.message || 'KestrelVoice account provisioned successfully.',
        provisioningMethod: 'api',
      }
    } catch (error: any) {
      return {
        success: false,
        error: `Network error: ${error.message}`,
        requiresManualAction: true,
        manualInstructions: `Could not reach KestrelVoice provisioning API. Create an account for ${ctx.customerEmail} at ${KESTREL_URL}/signup manually.`,
      }
    }
  }
}
