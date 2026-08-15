import { redirect } from 'next/navigation'
import { requirePlatformAdmin, type AuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { PlatformAdminClient } from '@/components/app/PlatformAdminClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function PlatformAdminPage() {
  let user: AuthenticatedUser
  try {
    user = await requirePlatformAdmin()
  } catch {
    redirect('/app')
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) redirect('/login?error=config')

  // Organizations
  const { data: organizations } = await serviceClient
    .from('organizations')
    .select('id, name, slug, organization_kind, status, created_at')
    .order('created_at', { ascending: false })

  // Offerings
  const { data: offerings } = await serviceClient
    .from('offerings')
    .select('id, offering_key, name, offering_kind, status')
    .order('name')

  // Product access requests
  const { data: productRequests } = await serviceClient
    .from('product_access_requests')
    .select(`
      id,
      organization_id,
      user_id,
      offering_key,
      status,
      request_note,
      admin_note,
      created_at,
      reviewed_at
    `)
    .order('created_at', { ascending: false })

  // Resolve org names and user emails for product requests
  const productRequestOrgIds = (productRequests || []).map(r => r.organization_id)
  const productRequestUserIds = (productRequests || []).map(r => r.user_id).filter(Boolean)

  let orgMap: Record<string, { name: string; slug: string }> = {}
  if (productRequestOrgIds.length > 0) {
    const { data: orgs } = await serviceClient
      .from('organizations')
      .select('id, name, slug')
      .in('id', productRequestOrgIds)
    for (const o of orgs || []) {
      orgMap[o.id] = { name: o.name, slug: o.slug }
    }
  }

  let userMap: Record<string, { email: string; display_name: string | null }> = {}
  if (productRequestUserIds.length > 0) {
    const { data: profiles } = await serviceClient
      .from('profiles')
      .select('id, email, display_name')
      .in('id', productRequestUserIds)
    for (const p of profiles || []) {
      userMap[p.id] = { email: p.email, display_name: p.display_name }
    }
  }

  // Recent entitlements (active subscriptions/purchases)
  const { data: entitlements } = await serviceClient
    .from('organization_entitlements')
    .select(`
      id,
      organization_id,
      offering_key,
      effective_status,
      source,
      granted_at,
      valid_until,
      organizations!inner(name, slug)
    `)
    .eq('effective_status', 'active')
    .order('granted_at', { ascending: false })
    .limit(20)

  // Recent audit events (purchases and key actions)
  const { data: auditEvents } = await serviceClient
    .from('audit_events')
    .select('id, action, entity_type, organization_id, created_at, metadata')
    .in('action', [
      'commercial.purchase_completed',
      'fractional.onboarding_completed',
      'fractional.decision_added',
      'product.access_requested',
    ])
    .order('created_at', { ascending: false })
    .limit(30)

  // Resolve org names for audit events
  const auditOrgIds = (auditEvents || []).map(e => e.organization_id).filter(Boolean)
  let auditOrgMap: Record<string, { name: string; slug: string }> = {}
  if (auditOrgIds.length > 0) {
    const { data: auditOrgs } = await serviceClient
      .from('organizations')
      .select('id, name, slug')
      .in('id', auditOrgIds)
    for (const o of auditOrgs || []) {
      auditOrgMap[o.id] = { name: o.name, slug: o.slug }
    }
  }

  return (
    <PlatformAdminClient
      user={user}
      organizations={organizations || []}
      offerings={offerings || []}
      productRequests={(productRequests || []).map(r => ({
        id: r.id,
        offeringKey: r.offering_key,
        status: r.status,
        requestNote: r.request_note,
        adminNote: r.admin_note,
        createdAt: r.created_at,
        reviewedAt: r.reviewed_at,
        orgName: orgMap[r.organization_id]?.name || 'Unknown',
        orgSlug: orgMap[r.organization_id]?.slug || '',
        userEmail: userMap[r.user_id]?.email || '',
        userName: userMap[r.user_id]?.display_name || null,
      }))}
      entitlements={(entitlements || []).map(e => ({
        id: e.id,
        offeringKey: e.offering_key,
        status: e.effective_status,
        source: e.source,
        grantedAt: e.granted_at,
        validUntil: e.valid_until,
        orgName: (e.organizations as any)?.name || 'Unknown',
        orgSlug: (e.organizations as any)?.slug || '',
      }))}
      auditEvents={(auditEvents || []).map(e => ({
        id: e.id,
        action: e.action,
        entityType: e.entity_type,
        createdAt: e.created_at,
        orgName: e.organization_id ? auditOrgMap[e.organization_id]?.name || 'Unknown' : 'System',
        orgSlug: e.organization_id ? auditOrgMap[e.organization_id]?.slug || '' : '',
        metadata: e.metadata,
      }))}
    />
  )
}
