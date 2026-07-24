'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, MailCheck, MailX, Clock, Send, Inbox, ChevronDown, ChevronUp } from 'lucide-react'

interface OutreachEmail {
  id: number
  slug: string
  article_title: string
  target: string
  recipient_email: string | null
  subject: string
  body_preview: string | null
  email_type: string
  status: string
  sent_date: string
  replied_date: string | null
  followed_up_date: string | null
  closed_date: string | null
  notes: string | null
}

interface OutreachData {
  emails: OutreachEmail[]
  stats: {
    total: number
    sent: number
    replied: number
    followed_up: number
    closed: number
  }
  pendingFollowUps: {
    id: number
    target: string
    slug: string
    article_title: string
    sent_date: string
    days_since: number
  }[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Send }> = {
  sent: { label: 'Sent', color: 'text-blue-500 bg-blue-500/10', icon: Send },
  replied: { label: 'Replied', color: 'text-green-500 bg-green-500/10', icon: MailCheck },
  followed_up: { label: 'Followed Up', color: 'text-orange-500 bg-orange-500/10', icon: Clock },
  closed: { label: 'Closed', color: 'text-muted-foreground bg-muted', icon: MailX },
}

export function OutreachTracker() {
  const [data, setData] = useState<OutreachData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/outreach-tracker', { credentials: 'same-origin' })
      if (res.status === 401) {
        setError('Session expired - please reload')
        setLoading(false)
        return
      }
      if (!res.ok) throw new Error('Failed to fetch outreach data')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/outreach-tracker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Outreach Email Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading outreach data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Outreach Email Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.emails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Outreach Email Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No outreach emails tracked yet.</p>
        </CardContent>
      </Card>
    )
  }

  const { stats, pendingFollowUps, emails } = data
  const visibleEmails = expanded ? emails : emails.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Pending Follow-Ups Alert */}
      {pendingFollowUps.length > 0 && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-500">
              <Clock className="h-5 w-5" />
              Pending Follow-Ups ({pendingFollowUps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingFollowUps.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{f.target}</span>
                    <span className="text-muted-foreground ml-2">— {f.article_title}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-orange-500 font-mono text-xs whitespace-nowrap">
                      {f.days_since}d ago
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      disabled={updatingId === f.id}
                      onClick={() => updateStatus(f.id, 'followed_up')}
                    >
                      Mark Followed Up
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Inbox, color: 'text-foreground' },
          { label: 'Sent', value: stats.sent, icon: Send, color: 'text-blue-500' },
          { label: 'Replied', value: stats.replied, icon: MailCheck, color: 'text-green-500' },
          { label: 'Followed Up', value: stats.followed_up, icon: Clock, color: 'text-orange-500' },
          { label: 'Closed', value: stats.closed, icon: MailX, color: 'text-muted-foreground' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Email Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Outreach Email Log ({emails.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Article</th>
                  <th className="pb-2 pr-4">Target</th>
                  <th className="pb-2 pr-4">Subject</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleEmails.map((email) => {
                  const statusCfg = STATUS_CONFIG[email.status] || STATUS_CONFIG.sent
                  const StatusIcon = statusCfg.icon
                  return (
                    <tr key={email.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 pr-4 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(email.sent_date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="py-2 pr-4 max-w-[180px]">
                        <a
                          href={`/blog/${email.slug}`}
                          className="text-blue-500 hover:underline truncate block"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={email.article_title}
                        >
                          {email.article_title}
                        </a>
                      </td>
                      <td className="py-2 pr-4 max-w-[120px] truncate" title={email.target}>
                        {email.target}
                      </td>
                      <td className="py-2 pr-4 max-w-[200px] truncate" title={email.subject}>
                        {email.subject}
                      </td>
                      <td className="py-2 pr-4">
                        <span className="text-xs text-muted-foreground">
                          {email.email_type === 'follow_up' ? 'Follow-up' : 'Initial'}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${statusCfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex gap-1">
                          {email.status === 'sent' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                disabled={updatingId === email.id}
                                onClick={() => updateStatus(email.id, 'replied')}
                              >
                                Replied
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                disabled={updatingId === email.id}
                                onClick={() => updateStatus(email.id, 'followed_up')}
                              >
                                Followed Up
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                disabled={updatingId === email.id}
                                onClick={() => updateStatus(email.id, 'closed')}
                              >
                                Close
                              </Button>
                            </>
                          )}
                          {email.status === 'followed_up' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                disabled={updatingId === email.id}
                                onClick={() => updateStatus(email.id, 'replied')}
                              >
                                Replied
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                disabled={updatingId === email.id}
                                onClick={() => updateStatus(email.id, 'closed')}
                              >
                                Close
                              </Button>
                            </>
                          )}
                          {email.status === 'replied' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              disabled={updatingId === email.id}
                              onClick={() => updateStatus(email.id, 'closed')}
                            >
                              Close
                            </Button>
                          )}
                          {email.status === 'closed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              disabled={updatingId === email.id}
                              onClick={() => updateStatus(email.id, 'sent')}
                            >
                              Reopen
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {emails.length > 10 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Show All ({emails.length}) <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
