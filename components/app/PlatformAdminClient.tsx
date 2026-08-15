'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building2, Plus, Shield, ArrowLeft, Menu, X, LogOut,
  Boxes, CheckCircle2, XCircle, Clock, FileText, Activity,
  ChevronRight, Loader2, Mail, Send,
} from 'lucide-react'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface ProductRequest {
  id: string
  offeringKey: string
  status: string
  requestNote: string | null
  adminNote: string | null
  createdAt: string
  reviewedAt: string | null
  orgName: string
  orgSlug: string
  userEmail: string
  userName: string | null
}

interface Entitlement {
  id: string
  offeringKey: string
  status: string
  source: string
  grantedAt: string
  validUntil: string | null
  orgName: string
  orgSlug: string
}

interface AuditEvent {
  id: string
  action: string
  entityType: string
  createdAt: string
  orgName: string
  orgSlug: string
  metadata: Record<string, unknown> | null
}

interface PlatformAdminClientProps {
  user: AuthenticatedUser
  organizations: Array<{
    id: string
    name: string
    slug: string
    organization_kind: string
    status: string
    created_at: string
  }>
  offerings: Array<{
    id: string
    offering_key: string
    name: string
    offering_kind: string
    status: string
  }>
  productRequests: ProductRequest[]
  entitlements: Entitlement[]
  auditEvents: AuditEvent[]
}

const PRODUCT_NAMES: Record<string, string> = {
  haiec: 'HAIEC',
  kestrel: 'KestrelVoice',
  fractional_ai_advisor: 'Fractional AI Advisor',
  ai_advisor_desk: 'AI Advisor for Business',
  ai_automation_blueprint: 'AI Opportunity & Workflow Assessment',
  saas_security_review: 'SaaS Security Review',
  ai_security_compliance: 'AI Security & Compliance',
}

const AUDIT_LABELS: Record<string, string> = {
  'commercial.purchase_completed': 'Purchase',
  'fractional.onboarding_completed': 'Onboarding Complete',
  'fractional.decision_added': 'Decision Added',
  'product.access_requested': 'Product Request',
}

export function PlatformAdminClient({
  user,
  organizations,
  offerings,
  productRequests,
  entitlements,
  auditEvents,
}: PlatformAdminClientProps) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [orgKind, setOrgKind] = useState('business')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'requests' | 'customers' | 'activity' | 'newsletter' | 'orgs'>('requests')
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null)
  const [newsletterData, setNewsletterData] = useState<{ recentPosts: any[]; subscriberCount: number | null } | null>(null)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [broadcastSending, setBroadcastSending] = useState(false)
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null)

  const pendingRequests = productRequests.filter(r => r.status === 'requested')
  const otherRequests = productRequests.filter(r => r.status !== 'requested')

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          slug: orgSlug || orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          organization_kind: orgKind,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create organization')
      } else {
        setShowCreate(false)
        setOrgName('')
        setOrgSlug('')
        router.refresh()
      }
    } catch {
      setError('Network error')
    }
    setCreating(false)
  }

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  async function handleProductRequest(requestId: string, status: 'approved' | 'activated' | 'declined', createEntitlement: boolean) {
    setProcessingRequestId(requestId)
    try {
      const res = await fetch('/api/admin/product-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status, createEntitlement }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to update request:', err)
    }
    setProcessingRequestId(null)
  }

  async function fetchNewsletterData() {
    setNewsletterLoading(true)
    try {
      const res = await fetch('/api/newsletter-broadcast')
      if (res.ok) {
        const data = await res.json()
        setNewsletterData({
          recentPosts: data.recentPosts || [],
          subscriberCount: data.subscriberCount,
        })
      }
    } catch (err) {
      console.error('Failed to fetch newsletter data:', err)
    }
    setNewsletterLoading(false)
  }

  async function sendBroadcast() {
    setBroadcastSending(true)
    setBroadcastResult(null)
    try {
      const token = process.env.NEXT_PUBLIC_BABYLOVE_SYNC_SECRET || ''
      const res = await fetch('/api/newsletter-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postCount: 3 }),
      })
      const data = await res.json()
      if (res.ok) {
        setBroadcastResult(`Sent: ${data.sent || 0}/${data.totalSubscribers || 0} subscribers${data.failed ? ` (${data.failed} failed)` : ''}`)
      } else {
        setBroadcastResult(`Error: ${data.error || 'Failed to send'}`)
      }
    } catch (err) {
      setBroadcastResult('Network error')
    }
    setBroadcastSending(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href="/app" className="p-1.5 hover:bg-accent rounded-md" title="Back to Dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h1 className="text-sm font-bold tracking-tight">Platform Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-accent rounded-md"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold">Platform Administration</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {organizations.length} organizations · {offerings.length} offerings · {pendingRequests.length} pending requests
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
            New Organization
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {showCreate && (
          <form onSubmit={handleCreateOrg} className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Create Organization</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border text-sm mt-1 bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Slug (optional)</label>
                <input
                  type="text"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  placeholder="auto-generated from name"
                  className="w-full px-3 py-2 rounded-md border text-sm mt-1 bg-background"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kind</label>
              <select
                value={orgKind}
                onChange={(e) => setOrgKind(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-sm mt-1 bg-background"
              >
                <option value="business">Business</option>
                <option value="school">School</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="internal">Internal</option>
                <option value="individual">Individual</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon={Boxes} label={`Requests${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}`} />
          <TabButton active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={CheckCircle2} label="Customers" />
          <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={Activity} label="Activity" />
          <TabButton active={activeTab === 'newsletter'} onClick={() => { setActiveTab('newsletter'); if (!newsletterData) fetchNewsletterData() }} icon={Mail} label="Newsletter" />
          <TabButton active={activeTab === 'orgs'} onClick={() => setActiveTab('orgs')} icon={Building2} label="Organizations" />
        </div>

        {/* Product Access Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Pending Requests ({pendingRequests.length})
                </h3>
                <div className="space-y-2">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">{PRODUCT_NAMES[req.offeringKey] || req.offeringKey}</h4>
                            <span className="text-xs bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded">{req.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {req.userName || req.userEmail} · {req.orgName}
                          </p>
                          {req.requestNote && (
                            <p className="text-xs text-muted-foreground mt-1 italic">"{req.requestNote}"</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {processingRequestId === req.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleProductRequest(req.id, 'activated', true)}
                                className="inline-flex items-center gap-1 text-xs rounded-md bg-green-600 text-white px-3 py-1.5 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Activate
                              </button>
                              <button
                                onClick={() => handleProductRequest(req.id, 'approved', false)}
                                className="inline-flex items-center gap-1 text-xs rounded-md border px-3 py-1.5 hover:bg-accent"
                              >
                                Approve Only
                              </button>
                              <button
                                onClick={() => handleProductRequest(req.id, 'declined', false)}
                                className="inline-flex items-center gap-1 text-xs rounded-md border border-destructive/30 text-destructive px-3 py-1.5 hover:bg-destructive/5"
                              >
                                <XCircle className="h-3 w-3" />
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Reviewed Requests</h3>
                <div className="space-y-2">
                  {otherRequests.map(req => (
                    <div key={req.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{PRODUCT_NAMES[req.offeringKey] || req.offeringKey}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{req.orgName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          req.status === 'activated' ? 'bg-green-500/10 text-green-700' :
                          req.status === 'approved' ? 'bg-blue-500/10 text-blue-700' :
                          req.status === 'declined' ? 'bg-red-500/10 text-red-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {req.status}
                        </span>
                        {req.reviewedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(req.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {productRequests.length === 0 && (
              <div className="border rounded-lg p-8 text-center">
                <Boxes className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No product access requests yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Customers (active entitlements) */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Active Customer Entitlements</h3>
            <div className="space-y-2">
              {entitlements.length > 0 ? (
                entitlements.map(ent => (
                  <div key={ent.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sm font-medium">{PRODUCT_NAMES[ent.offeringKey] || ent.offeringKey}</span>
                        <Link
                          href={`/app/${ent.orgSlug}`}
                          className="ml-2 text-xs text-primary hover:underline"
                        >
                          {ent.orgName}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{ent.source}</span>
                      <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded">{ent.status}</span>
                      {ent.grantedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(ent.grantedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active entitlements yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity feed */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="space-y-2">
              {auditEvents.length > 0 ? (
                auditEvents.map(evt => (
                  <div key={evt.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">{AUDIT_LABELS[evt.action] || evt.action}</span>
                        {evt.orgSlug && (
                          <Link
                            href={`/app/${evt.orgSlug}`}
                            className="ml-2 text-xs text-primary hover:underline"
                          >
                            {evt.orgName}
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(evt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Newsletter */}
        {activeTab === 'newsletter' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Newsletter Broadcast</h3>
              <button
                onClick={fetchNewsletterData}
                disabled={newsletterLoading}
                className="text-sm text-primary hover:underline"
              >
                {newsletterLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {newsletterData && (
              <>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                  <p className="text-2xl font-bold mt-1">
                    {newsletterData.subscriberCount !== null ? newsletterData.subscriberCount : 'Managed in Resend'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Recent Posts (will be included in broadcast)</h4>
                  <div className="space-y-2">
                    {newsletterData.recentPosts.length > 0 ? (
                      newsletterData.recentPosts.map((post: any) => (
                        <div key={post.slug} className="border rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="text-sm font-medium hover:underline"
                            >
                              {post.title}
                            </a>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-xs text-primary hover:underline"
                          >
                            Preview
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No posts available.</p>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium">Send Broadcast</h4>
                  <p className="text-xs text-muted-foreground">
                    This will send an email to all subscribed contacts via Resend with the 3 most recent posts.
                    Each subscriber receives an individual email. Allow time for all sends to complete.
                  </p>
                  <button
                    onClick={sendBroadcast}
                    disabled={broadcastSending}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {broadcastSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {broadcastSending ? 'Sending...' : 'Send Newsletter'}
                  </button>
                  {broadcastResult && (
                    <p className="text-sm text-muted-foreground">{broadcastResult}</p>
                  )}
                </div>
              </>
            )}
            {!newsletterData && !newsletterLoading && (
              <div className="border rounded-lg p-8 text-center">
                <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click Refresh to load newsletter data.</p>
              </div>
            )}
          </div>
        )}

        {/* Organizations */}
        {activeTab === 'orgs' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Organizations ({organizations.length})</h3>
            <div className="space-y-2">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={`/app/${org.slug}`}
                  className="border rounded-lg p-3 flex items-center justify-between hover:bg-accent/5"
                >
                  <div>
                    <span className="text-sm font-medium">{org.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{org.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{org.organization_kind}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      org.status === 'active' ? 'bg-green-500/10 text-green-700' :
                      org.status === 'suspended' ? 'bg-red-500/10 text-red-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {org.status}
                    </span>
                  </div>
                </Link>
              ))}
              {organizations.length === 0 && (
                <div className="border rounded-lg p-4 text-sm text-muted-foreground">No organizations yet.</div>
              )}
            </div>

            {/* Offerings catalog */}
            <div className="pt-4">
              <h3 className="font-semibold mb-3">Offerings Catalog ({offerings.length})</h3>
              <div className="space-y-2">
                {offerings.map((o) => (
                  <div key={o.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{o.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{o.offering_key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{o.offering_kind}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        o.status === 'active' ? 'bg-green-500/10 text-green-700' : 'bg-muted text-muted-foreground'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
