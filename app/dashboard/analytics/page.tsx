'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Clock, MousePointerClick, Mail, TrendingUp, ExternalLink } from 'lucide-react'

interface AnalyticsData {
  summary: {
    pageviews7d: number
    pageviews30d: number
    uniqueSessions: number
    avgDurationSeconds: number
    conversions: number
    formSubmits: number
    formErrors: number
    clicks: number
  }
  topPages: { path: string; count: number }[]
  topReferrers: { source: string; count: number }[]
  eventBreakdown: Record<string, number>
  recentEvents: {
    id: number
    event_type: string
    path: string
    referrer: string | null
    duration: number
    created_at: string
    session_id: string | null
  }[]
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('analytics_token') || ''
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        setError('Unauthorized — enter your analytics token below')
        setLoading(false)
        return
      }
      if (!res.ok) throw new Error('Failed to fetch analytics')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const stats = data?.summary

  const statCards = [
    { label: 'Pageviews (7d)', value: stats?.pageviews7d ?? 0, icon: Eye, color: 'text-blue-500' },
    { label: 'Pageviews (30d)', value: stats?.pageviews30d ?? 0, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Unique Sessions', value: stats?.uniqueSessions ?? 0, icon: MousePointerClick, color: 'text-purple-500' },
    { label: 'Avg Duration', value: `${stats?.avgDurationSeconds ?? 0}s`, icon: Clock, color: 'text-orange-500' },
    { label: 'Form Submits', value: stats?.formSubmits ?? 0, icon: Mail, color: 'text-cyan-500' },
    { label: 'Conversions', value: stats?.conversions ?? 0, icon: TrendingUp, color: 'text-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Custom analytics — powered by your Supabase instance</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-500/20">
            <CardContent className="p-4">
              <p className="text-red-500 text-sm mb-3">{error}</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter analytics token"
                  className="px-3 py-2 text-sm border rounded-lg bg-background"
                  onChange={(e) => localStorage.setItem('analytics_token', e.target.value)}
                />
                <Button size="sm" onClick={fetchData}>Save & Load</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statCards.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Pages (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.topPages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {data.topPages.map((page) => (
                        <div key={page.path} className="flex items-center justify-between text-sm">
                          <a
                            href={page.path}
                            className="text-blue-500 hover:underline truncate max-w-[300px]"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {page.path}
                          </a>
                          <span className="font-mono text-muted-foreground">{page.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Referrers (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.topReferrers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No referrers yet</p>
                  ) : (
                    <div className="space-y-2">
                      {data.topReferrers.map((ref) => (
                        <div key={ref.source} className="flex items-center justify-between text-sm">
                          <span className="truncate max-w-[300px]">{ref.source}</span>
                          <span className="font-mono text-muted-foreground">{ref.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-2 pr-4">Time</th>
                          <th className="pb-2 pr-4">Type</th>
                          <th className="pb-2 pr-4">Path</th>
                          <th className="pb-2 pr-4">Referrer</th>
                          <th className="pb-2 pr-4">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentEvents.slice(0, 20).map((event) => (
                          <tr key={event.id} className="border-b border-border/50">
                            <td className="py-2 pr-4 text-muted-foreground text-xs">
                              {new Date(event.created_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </td>
                            <td className="py-2 pr-4">
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-primary/10">
                                {event.event_type}
                              </span>
                            </td>
                            <td className="py-2 pr-4 truncate max-w-[200px]">{event.path}</td>
                            <td className="py-2 pr-4 truncate max-w-[150px] text-muted-foreground">
                              {event.referrer || '—'}
                            </td>
                            <td className="py-2 pr-4 font-mono text-xs">
                              {event.duration > 0 ? `${event.duration}s` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!data && !error && loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        )}
      </div>
    </div>
  )
}
