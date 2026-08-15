/**
 * HAIEC Provisioning Adapter
 *
 * Calls the HAIEC platform's /api/provisioning endpoint to create
 * or link a user account on the HAIEC platform.
 *
 * Configuration (env vars in SubodhKC):
 *   HAIEC_PROVISIONING_URL  - e.g., https://www.haiec.com/api/provisioning
 *   HAIEC_PROVISIONING_TOKEN - shared secret (must match HAIEC's PROVISIONING_API_TOKEN)
 *
 * If not configured, falls back to manual activation.
 */

import type {
  ProductProvisioningAdapter,
  ProvisioningContext,
  ProvisioningResult,
} from './adapter'

const HAIEC_URL = 'https://www.haiec.com'

export class HaiecProvisioningAdapter implements ProductProvisioningAdapter {
  offeringKey = 'haiec'
  productName = 'HAIEC'

  isConfigured(): boolean {
    return !!(
      process.env.HAIEC_PROVISIONING_URL &&
      process.env.HAIEC_PROVISIONING_TOKEN
    )
  }

  async checkExistingAccount(customerEmail: string): Promise<{
    exists: boolean
    externalUserId?: string
    launchUrl?: string
  }> {
    if (!this.isConfigured()) {
      return { exists: false, launchUrl: HAIEC_URL }
    }

    try {
      const url = `${process.env.HAIEC_PROVISIONING_URL}?email=${encodeURIComponent(customerEmail)}`
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.HAIEC_PROVISIONING_TOKEN}`,
        },
      })

      if (!res.ok) return { exists: false, launchUrl: HAIEC_URL }

      const data = await res.json()
      return {
        exists: data.exists,
        externalUserId: data.externalUserId,
        launchUrl: HAIEC_URL,
      }
    } catch {
      return { exists: false, launchUrl: HAIEC_URL }
    }
  }

  async provision(ctx: ProvisioningContext): Promise<ProvisioningResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'HAIEC provisioning not configured. Manual activation required.',
        requiresManualAction: true,
        manualInstructions: `Create an account for ${ctx.customerEmail} at ${HAIEC_URL}/signup, then notify the customer. Or share the HAIEC signup link: ${HAIEC_URL}/signup`,
      }
    }

    try {
      const res = await fetch(process.env.HAIEC_PROVISIONING_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HAIEC_PROVISIONING_TOKEN}`,
        },
        body: JSON.stringify({
          customerEmail: ctx.customerEmail,
          customerName: ctx.customerName,
          organizationName: ctx.organizationName,
          planTier: ctx.planTier || 'scan',
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'HAIEC provisioning failed',
          requiresManualAction: true,
          manualInstructions: `Provisioning API returned an error. Create an account for ${ctx.customerEmail} at ${HAIEC_URL}/signup manually.`,
        }
      }

      return {
        success: true,
        externalUserId: data.externalUserId,
        launchUrl: data.launchUrl || HAIEC_URL,
        message: data.message || 'HAIEC account provisioned successfully.',
        provisioningMethod: 'api',
      }
    } catch (error: any) {
      return {
        success: false,
        error: `Network error: ${error.message}`,
        requiresManualAction: true,
        manualInstructions: `Could not reach HAIEC provisioning API. Create an account for ${ctx.customerEmail} at ${HAIEC_URL}/signup manually.`,
      }
    }
  }
}
