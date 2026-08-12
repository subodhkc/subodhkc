'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, CameraOff, ScanLine, CheckCircle2, XCircle, AlertTriangle, Clock, Users, X, RefreshCw, Loader2, WifiOff, Wifi, CloudOff } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface ScannerClientProps {
  ctx: SchoolContext
}

interface QueueItem {
  queue_item_id: string
  student_id: string
  student_name: string
  sequence_number: number
  status: string
}

interface CheckinResult {
  outcome: 'success' | 'duplicate' | 'revoked' | 'unknown' | 'wrong_site' | 'closed_session' | 'inactive_group'
  message: string
  arrival_id?: string
  queue_items?: QueueItem[]
}

type ScanState = 'idle' | 'scanning' | 'processing' | 'result' | 'error'

interface PendingScan {
  token: string
  timestamp: number
  retries: number
}

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 2000, 4000]
const SCAN_COOLDOWN_MS = 2000

export function ScannerClient({ ctx }: ScannerClientProps) {
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`

  const [scanState, setScanState] = useState<ScanState>('idle')
  const [lastResult, setLastResult] = useState<CheckinResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [recentScans, setRecentScans] = useState<Array<{ time: string; result: CheckinResult }>>([])
  const [activeSession, setActiveSession] = useState<{ id: string; service_date: string } | null>(null)
  const [queueCount, setQueueCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [pendingScans, setPendingScans] = useState<PendingScan[]>([])
  const [retrying, setRetrying] = useState(false)
  const scannerRef = useRef<any>(null)
  const html5QrCodeRef = useRef<any>(null)
  const lastScanTimeRef = useRef(0)
  const lastTokenRef = useRef<string | null>(null)
  const processingRef = useRef(false)

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      playFeedback('reconnect')
    }
    const handleOffline = () => {
      setIsOnline(false)
      playFeedback('error')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Audio feedback for scan outcomes
  const audioCtxRef = useRef<AudioContext | null>(null)
  function playFeedback(type: 'success' | 'duplicate' | 'error' | 'reconnect') {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.setValueAtTime(1320, now + 0.1)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
      } else if (type === 'duplicate') {
        osc.frequency.setValueAtTime(660, now)
        osc.frequency.setValueAtTime(660, now + 0.15)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.setValueAtTime(180, now + 0.1)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.4)
      } else if (type === 'reconnect') {
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.setValueAtTime(660, now + 0.1)
        osc.frequency.setValueAtTime(880, now + 0.2)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.4)
      }
    } catch {}

    if (navigator.vibrate) {
      if (type === 'success') navigator.vibrate(100)
      else if (type === 'duplicate') navigator.vibrate([50, 50, 50])
      else if (type === 'error') navigator.vibrate([100, 50, 100])
    }
  }

  // Fetch active session
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`${apiBase}/sessions`)
        if (!res.ok) return
        const data = await res.json()
        const open = data.sessions?.find((s: any) => s.status === 'open')
        if (open) {
          setActiveSession({ id: open.id, service_date: open.service_date })
        }
      } catch {}
    }
    fetchSession()
    const interval = setInterval(fetchSession, 10000)
    return () => clearInterval(interval)
  }, [apiBase])

  // Fetch queue count
  useEffect(() => {
    async function fetchQueue() {
      if (!activeSession) {
        setQueueCount(0)
        return
      }
      try {
        const res = await fetch(`${apiBase}/checkin?session_id=${activeSession.id}`)
        if (!res.ok) return
        const data = await res.json()
        setQueueCount(data.queue?.length || 0)
      } catch {}
    }
    fetchQueue()
    const interval = setInterval(fetchQueue, 5000)
    return () => clearInterval(interval)
  }, [apiBase, activeSession])

  const submitCheckin = useCallback(async (token: string, retryCount = 0): Promise<CheckinResult | null> => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(`${apiBase}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, source: 'qr' }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const errResult: CheckinResult = {
          outcome: 'unknown',
          message: data.error || 'Check-in failed',
        }
        return errResult
      }

      return await res.json() as CheckinResult
    } catch (err: any) {
      if (err.name === 'AbortError' && retryCount < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAYS[retryCount]))
        return submitCheckin(token, retryCount + 1)
      }
      if (retryCount < MAX_RETRIES && navigator.onLine) {
        await new Promise(r => setTimeout(r, RETRY_DELAYS[retryCount]))
        return submitCheckin(token, retryCount + 1)
      }
      return null
    }
  }, [apiBase])

  const handleScanResult = useCallback(async (token: string) => {
    if (processingRef.current) return
    const now = Date.now()
    if (now - lastScanTimeRef.current < SCAN_COOLDOWN_MS) return
    if (lastTokenRef.current === token && now - lastScanTimeRef.current < 5000) return

    lastScanTimeRef.current = now
    lastTokenRef.current = token
    processingRef.current = true

    // If offline, queue the scan
    if (!navigator.onLine) {
      setPendingScans(prev => [...prev, { token, timestamp: now, retries: 0 }])
      setError('Offline - scan queued for retry')
      setScanState('error')
      playFeedback('error')
      setTimeout(() => setScanState('scanning'), 2000)
      processingRef.current = false
      return
    }

    setScanState('processing')
    setError(null)

    const data = await submitCheckin(token)

    if (!data) {
      // Network failed after retries - queue for later
      setPendingScans(prev => [...prev, { token, timestamp: now, retries: 0 }])
      setError('Network failed - scan queued for retry')
      setScanState('error')
      playFeedback('error')
      setTimeout(() => setScanState('scanning'), 2000)
      processingRef.current = false
      return
    }

    setLastResult(data)
    setScanState('result')
    setRecentScans(prev => [{ time: new Date().toLocaleTimeString(), result: data }, ...prev].slice(0, 10))
    playFeedback(data.outcome === 'success' ? 'success' : data.outcome === 'duplicate' ? 'duplicate' : 'error')

    setTimeout(() => {
      if (cameraActive) {
        setScanState('scanning')
      } else {
        setScanState('idle')
      }
    }, 3000)
    processingRef.current = false
  }, [apiBase, cameraActive, submitCheckin])

  // Retry pending scans when back online
  useEffect(() => {
    if (!isOnline || pendingScans.length === 0) return

    async function flushPending() {
      setRetrying(true)
      const scans = [...pendingScans]
      setPendingScans([])

      for (const scan of scans) {
        const result = await submitCheckin(scan.token)
        if (result) {
          setRecentScans(prev => [{ time: new Date().toLocaleTimeString(), result }, ...prev].slice(0, 10))
          playFeedback(result.outcome === 'success' ? 'success' : 'duplicate')
        } else {
          setPendingScans(prev => [...prev, { ...scan, retries: scan.retries + 1 }])
        }
        await new Promise(r => setTimeout(r, 500))
      }
      setRetrying(false)
    }

    flushPending()
  }, [isOnline, pendingScans, submitCheckin])

  // Start camera
  async function startCamera() {
    setScanState('scanning')
    setError(null)
    setCameraError(null)

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          handleScanResult(decodedText)
        },
        () => {}
      )
      setCameraActive(true)
    } catch (err: any) {
      const msg = err?.message || ''
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings.')
      } else if (msg.includes('NotFound') || msg.includes('NotFound')) {
        setCameraError('No camera found. Connect a camera and try again.')
      } else if (msg.includes('Insecure')) {
        setCameraError('Camera requires HTTPS. Use a secure connection.')
      } else {
        setCameraError('Camera failed to start. Try refreshing the page.')
      }
      setScanState('idle')
    }
  }

  // Stop camera
  async function stopCamera() {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
      } catch {}
      html5QrCodeRef.current = null
    }
    setCameraActive(false)
    setScanState('idle')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop()
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close()
        } catch {}
      }
    }
  }, [])

  const resultConfig = {
    success: { icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent' },
    duplicate: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' },
    revoked: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    unknown: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    wrong_site: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    closed_session: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    inactive_group: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  }

  return (
    <div className="space-y-4">
      {/* Network status indicator */}
      {!isOnline && (
        <div className="border border-orange-300 bg-orange-50 rounded-lg p-3 text-sm text-orange-800 flex items-center gap-2">
          <WifiOff className="h-4 w-4 shrink-0" />
          You are offline. Scans will be queued and submitted when connection returns.
        </div>
      )}
      {retrying && (
        <div className="border border-blue-300 bg-blue-50 rounded-lg p-3 text-sm text-blue-800 flex items-center gap-2">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          Retrying queued scans...
        </div>
      )}

      {/* Session status bar */}
      <div className="flex items-center justify-between border rounded-lg p-3">
        <div className="flex items-center gap-2">
          {activeSession ? (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium">Session Active</span>
              <span className="text-xs text-muted-foreground">
                {new Date(activeSession.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </>
          ) : (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
              <span className="text-sm text-muted-foreground">No active session</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{queueCount} in queue</span>
        </div>
      </div>

      {/* Scanner area */}
      <div className="relative">
        {cameraError && !cameraActive && (
          <div className="border-2 border-destructive/30 rounded-xl p-6 text-center space-y-4 bg-destructive/5">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold text-destructive">Camera Error</h3>
              <p className="text-sm text-muted-foreground mt-1">{cameraError}</p>
            </div>
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent/50"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {!cameraActive && scanState === 'idle' && !cameraError && (
          <div className="border-2 border-dashed rounded-xl p-8 sm:p-12 text-center space-y-4">
            <ScanLine className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold">QR Code Scanner</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tap to start the camera and scan pickup credentials.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
            >
              <Camera className="h-5 w-5" />
              Start Scanning
            </button>
          </div>
        )}

        {cameraActive && (
          <div className="relative rounded-xl overflow-hidden border-2 border-accent">
            <div id="qr-reader" className="w-full" ref={scannerRef} />
            {/* Overlay frame */}
            {scanState === 'scanning' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[250px] h-[250px] border-4 border-accent/70 rounded-2xl shadow-2xl" />
              </div>
            )}
            {/* Processing overlay */}
            {scanState === 'processing' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 text-white animate-spin mx-auto" />
                  <p className="text-white text-sm">Processing...</p>
                </div>
              </div>
            )}
            {/* Result overlay */}
            {scanState === 'result' && lastResult && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
                <ResultCard result={lastResult} />
              </div>
            )}
            {/* Error overlay */}
            {scanState === 'error' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
                <div className="text-center space-y-2">
                  <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
                  <p className="text-white text-sm">{error}</p>
                </div>
              </div>
            )}
            {/* Stop button */}
            <button
              onClick={stopCamera}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-lg hover:bg-black/80 z-10"
              title="Stop camera"
            >
              <CameraOff className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Pending offline scans */}
      {pendingScans.length > 0 && (
        <div className="border border-orange-300 bg-orange-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-800">
            <CloudOff className="h-4 w-4" />
            {pendingScans.length} scan{pendingScans.length !== 1 ? 's' : ''} queued for retry
          </div>
          <div className="text-xs text-orange-700">
            Will be submitted automatically when connection is restored.
          </div>
        </div>
      )}

      {/* Recent scans */}
      {recentScans.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/50">
            <h3 className="text-sm font-semibold">Recent Scans</h3>
          </div>
          <div className="divide-y max-h-64 overflow-auto">
            {recentScans.map((scan, i) => {
              const cfg = resultConfig[scan.result.outcome] || resultConfig.unknown
              const Icon = cfg.icon
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <Icon className={`h-4 w-4 ${cfg.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {scan.result.queue_items?.[0]?.student_name || scan.result.message}
                    </div>
                    {scan.result.queue_items && scan.result.queue_items.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        #{scan.result.queue_items[0].sequence_number}
                        {scan.result.queue_items.length > 1 && ` +${scan.result.queue_items.length - 1} more`}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{scan.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No session warning */}
      {!activeSession && (
        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          No active dismissal session. Open a session from the Dismissal tab before scanning.
        </div>
      )}
    </div>
  )
}

function ResultCard({ result }: { result: CheckinResult }) {
  const cfg = {
    success: { icon: CheckCircle2, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent' },
    duplicate: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' },
    revoked: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    unknown: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    wrong_site: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    closed_session: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
    inactive_group: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  }[result.outcome] || { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' }

  const Icon = cfg.icon

  return (
    <div className={`border-2 ${cfg.border} ${cfg.bg} rounded-xl p-6 max-w-sm w-full text-center space-y-3`}>
      <Icon className={`h-12 w-12 ${cfg.color} mx-auto`} />
      <div>
        <div className="font-semibold text-lg">{result.message}</div>
        {result.queue_items && result.queue_items.length > 0 && (
          <div className="mt-3 space-y-1">
            {result.queue_items.map((item, i) => (
              <div key={i} className="text-sm">
                <span className="font-mono text-xs text-muted-foreground">#{item.sequence_number}</span>
                {' '}
                <span className="font-medium">{item.student_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
