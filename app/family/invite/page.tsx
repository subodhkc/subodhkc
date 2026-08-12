import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { getCurrentUser, createServiceClient } from '@/lib/supabase'
import { GuardianInviteClient } from '@/components/family/GuardianInviteClient'

export const metadata: Metadata = {
  title: 'Family Pickup Invitation',
  description: 'Accept your family pickup access invitation.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function GuardianInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    redirect('/login?context=family')
  }

  const user = await getCurrentUser()

  // If not authenticated, redirect to login with family context and token
  if (!user) {
    const params = new URLSearchParams()
    params.set('next', `/family/invite?token=${token}`)
    params.set('context', 'family')
    redirect(`/login?${params.toString()}`)
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) {
    return <div className="p-8 text-center text-muted-foreground">Configuration error.</div>
  }

  // Check if this invitation exists and is valid (without claiming)
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const { data: invitation } = await serviceClient
    .from('guardian_invitations')
    .select('id, status, expires_at, email, guardian_id')
    .eq('token_hash', tokenHash)
    .single()

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold">Invitation Not Found</h1>
          <p className="text-sm text-muted-foreground">
            This invitation link is not valid. Please check your email for the correct link.
          </p>
        </div>
      </div>
    )
  }

  if (invitation.status === 'accepted') {
    redirect('/family')
  }

  if (invitation.status === 'revoked') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold">Invitation Revoked</h1>
          <p className="text-sm text-muted-foreground">
            This invitation has been revoked. Please contact your school administrator.
          </p>
        </div>
      </div>
    )
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold">Invitation Expired</h1>
          <p className="text-sm text-muted-foreground">
            This invitation has expired. Please contact your school administrator to request a new invitation.
          </p>
        </div>
      </div>
    )
  }

  // Check if email matches
  const emailMatches = user.email && user.email.toLowerCase().trim() === invitation.email.toLowerCase().trim()

  return (
    <GuardianInviteClient
      token={token}
      invitationEmail={invitation.email}
      authEmail={user.email || ''}
      emailMatches={emailMatches || false}
    />
  )
}
