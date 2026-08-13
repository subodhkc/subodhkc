'use client'

import { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { RefreshCw, Printer, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'

interface CheckInCode {
  id: string
  status: string
  purpose: string
  generated_by: string | null
  created_at: string
  replaced_at: string | null
  replaced_by: string | null
  revoked_at: string | null
  revoked_reason: string | null
  valid_from: string | null
  valid_until: string | null
}

interface CheckInQRClientProps {
  orgSlug: string
  siteSlug: string
  siteName: string
}

const TOKEN_STORAGE_KEY = (orgSlug: string, siteSlug: string) => `checkin_qr_token_${orgSlug}_${siteSlug}`

export function CheckInQRClient({ orgSlug, siteSlug, siteName }: CheckInQRClientProps) {
  const [codes, setCodes] = useState<CheckInCode[]>([])
  const [activeCode, setActiveCode] = useState<CheckInCode | null>(null)
  const [activeToken, setActiveToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rotating, setRotating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [printCopies, setPrintCopies] = useState(1)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/checkin-qr`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setCodes(data.codes || [])
      setActiveCode(data.activeCode || null)

      // Restore token from sessionStorage if we have an active code
      if (data.activeCode) {
        const stored = typeof window !== 'undefined'
          ? sessionStorage.getItem(TOKEN_STORAGE_KEY(orgSlug, siteSlug))
          : null
        if (stored) {
          setActiveToken(stored)
        }
      } else {
        // No active code — clear any stale token
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY(orgSlug, siteSlug))
        }
        setActiveToken(null)
      }
    } catch {
      setError('Failed to load check-in QR codes')
    } finally {
      setLoading(false)
    }
  }, [orgSlug, siteSlug])

  useEffect(() => {
    fetchCodes()
  }, [fetchCodes])

  async function handleGenerate() {
    setRotating(true)
    setError(null)
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/checkin-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate')
      }
      const result = await res.json()
      setActiveToken(result.token)
      if (typeof window !== 'undefined' && result.token) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY(orgSlug, siteSlug), result.token)
      }
      setShowConfirm(false)
      await fetchCodes()
    } catch (e: any) {
      setError(e.message || 'Failed to generate new QR')
    } finally {
      setRotating(false)
    }
  }

  async function handleRevoke(codeId: string) {
    if (!confirm('Revoke this check-in QR? It will immediately stop working.')) return
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/checkin-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke', code_id: codeId }),
      })
      if (!res.ok) throw new Error('Failed to revoke')
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY(orgSlug, siteSlug))
      }
      setActiveToken(null)
      await fetchCodes()
    } catch {
      setError('Failed to revoke code')
    }
  }

  async function handlePrint() {
    if (activeCode && activeToken) {
      await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/checkin-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'log_print', code_id: activeCode.id }),
      })
    }
    setShowPrintPreview(true)
  }

  const qrUrl = activeToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${orgSlug}/${siteSlug}/checkin?t=${activeToken}`
    : null

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Check-In QR Code</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Shared QR for parent self check-in. Active until you generate a replacement.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-md px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Current QR Status */}
      {activeCode ? (
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">ACTIVE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Generated {new Date(activeCode.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* QR Display */}
          {qrUrl && (
            <div className="flex flex-col items-center py-4">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  value={qrUrl}
                  size={256}
                  level="M"
                  marginSize={4}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 max-w-xs text-center">
                Scan to check in for {siteName} pickup
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent text-sm font-medium"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={rotating}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent text-sm font-medium"
            >
              <RefreshCw className={`h-4 w-4 ${rotating ? 'animate-spin' : ''}`} />
              Generate New QR
            </button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-card text-center">
          <p className="text-muted-foreground mb-4">No active check-in QR code.</p>
          <button
            onClick={() => handleGenerate()}
            disabled={rotating}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent text-sm font-medium mx-auto"
          >
            <RefreshCw className={`h-4 w-4 ${rotating ? 'animate-spin' : ''}`} />
            Generate Check-In QR
          </button>
        </div>
      )}

      {/* Confirmation dialog for rotation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Generate New QR Code?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will immediately invalidate the currently printed check-in QR.
                  Old screenshots and printed signs will no longer work.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-md hover:bg-accent text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={rotating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
              >
                {rotating ? 'Generating...' : 'Generate New QR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print preview modal */}
      {showPrintPreview && qrUrl && (
        <PrintPreviewModal
          qrUrl={qrUrl}
          siteName={siteName}
          copies={printCopies}
          setCopies={setPrintCopies}
          onClose={() => setShowPrintPreview(false)}
        />
      )}

      {/* History */}
      {codes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">History</h3>
          <div className="space-y-2">
            {codes.slice(0, 10).map(code => (
              <div key={code.id} className="flex items-center justify-between border rounded-md px-4 py-2 text-sm">
                <div className="flex items-center gap-3">
                  {code.status === 'active' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {code.status === 'replaced' && <RefreshCw className="h-4 w-4 text-blue-600" />}
                  {code.status === 'revoked' && <XCircle className="h-4 w-4 text-red-600" />}
                  {code.status === 'disabled' && <Clock className="h-4 w-4 text-gray-500" />}
                  <div>
                    <span className="font-medium capitalize">{code.status}</span>
                    <span className="text-muted-foreground ml-2">
                      {new Date(code.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {code.status === 'active' && (
                  <button
                    onClick={() => handleRevoke(code.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design note */}
      <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
        <p><strong>QR Design:</strong> No PII in QR payload. Token is 256-bit random hex.</p>
        <p><strong>Security:</strong> QR alone cannot check anyone in. Requires open session + guardian authentication.</p>
        <p><strong>Rotation:</strong> Manual. No scheduled expiry. Active until replaced or revoked.</p>
      </div>
    </div>
  )
}

function PrintPreviewModal({
  qrUrl,
  siteName,
  copies,
  setCopies,
  onClose,
}: {
  qrUrl: string
  siteName: string
  copies: number
  setCopies: (n: number) => void
  onClose: () => void
}) {
  const copyOptions = [1, 2, 4, 6, 9]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Print Check-In QR Sign</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Copies per page</label>
          <div className="flex gap-2">
            {copyOptions.map(n => (
              <button
                key={n}
                onClick={() => setCopies(n)}
                className={`px-3 py-1.5 border rounded-md text-sm ${
                  copies === n ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Print preview */}
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <div className="print-grid" style={{
            display: 'grid',
            gridTemplateColumns: copies <= 1 ? '1fr' : copies <= 2 ? '1fr 1fr' : copies <= 4 ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: '16px',
          }}>
            {Array.from({ length: copies }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 border rounded bg-white">
                <p className="text-sm font-semibold mb-1">School Pickup</p>
                <p className="text-xs text-muted-foreground mb-2">SCAN TO CHECK IN</p>
                <QRCodeSVG value={qrUrl} size={copies <= 1 ? 200 : 120} level="M" marginSize={3} />
                <p className="text-xs text-muted-foreground mt-2">{siteName}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-accent text-sm">Cancel</button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  )
}
