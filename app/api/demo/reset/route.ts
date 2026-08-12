import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getCurrentUser } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const DEMO_ORG_ID = 'd1d1d1d1-0001-0001-0001-000000000001'
const DEMO_SITE_ID = 'd1d1d1d1-0002-0002-0002-000000000001'
const DEMO_USER_ID = 'd1d1d1d1-0003-0003-0003-000000000001'

export async function POST(request: NextRequest) {
  // Verify the caller is the demo user
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  if (user.email !== 'demo-junekc@subodhkc.com') {
    return NextResponse.json({ error: 'Not authorized for demo reset' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // Delete all demo data (scoped to demo org only)
  // Order matters for FK constraints

  // 1. Delete scan events
  await serviceClient.from('pickup_scan_events')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 2. Delete queue items
  await serviceClient.from('pickup_queue_items')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 3. Delete arrivals
  await serviceClient.from('pickup_arrivals')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 4. Delete sessions
  await serviceClient.from('pickup_sessions')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 5. Delete student guardian links
  await serviceClient.from('student_guardian_links')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 6. Delete guardian invitations
  await serviceClient.from('guardian_invitations')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 7. Delete guardians
  await serviceClient.from('school_guardians')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 8. Delete credentials
  await serviceClient.from('pickup_credentials')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 9. Delete pickup group students
  await serviceClient.from('pickup_group_students')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 10. Delete pickup groups
  await serviceClient.from('pickup_groups')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 11. Delete dismissal schedules
  await serviceClient.from('dismissal_schedules')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 12. Delete students
  await serviceClient.from('school_students')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 13. Delete shared checkin codes
  await serviceClient.from('shared_checkin_codes')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 14. Delete org invitations
  await serviceClient.from('organization_invitations')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // 15. Delete staff assignments (keep demo user's assignment)
  await serviceClient.from('school_staff_assignments')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)
    .neq('user_id', DEMO_USER_ID)

  // 16. Delete staff auth users and profiles (not the demo user)
  const staffUserIds = [
    'd1d10010-0003-0003-0003-000000000001',
    'd1d10011-0003-0003-0003-000000000001',
    'd1d10012-0003-0003-0003-000000000001',
    'd1d10013-0003-0003-0003-000000000001',
    'd1d10014-0003-0003-0003-000000000001',
  ]

  for (const staffId of staffUserIds) {
    await serviceClient.from('organization_memberships')
      .delete()
      .eq('organization_id', DEMO_ORG_ID)
      .eq('user_id', staffId)
    await serviceClient.from('profiles')
      .delete()
      .eq('id', staffId)
  }

  // Delete staff auth users via service client
  for (const staffId of staffUserIds) {
    await serviceClient.auth.admin.deleteUser(staffId)
  }

  // 17. Delete classrooms
  await serviceClient.from('school_classrooms')
    .delete()
    .eq('organization_id', DEMO_ORG_ID)

  // Now re-seed by calling the same SQL that the migrations applied
  // We use a SQL function approach: execute the re-seed via raw SQL
  const { error: reseedError } = await serviceClient.rpc('reseed_demo_data')

  if (reseedError) {
    // If the function doesn't exist, we need to recreate data manually
    // For now, return success since data was cleared — the migration will re-seed on next deploy
    return NextResponse.json({
      success: true,
      message: 'Demo data cleared. Re-seed requires migration re-run.',
      reseedError: reseedError.message,
    })
  }

  return NextResponse.json({ success: true, message: 'Demo data reset successfully' })
}
