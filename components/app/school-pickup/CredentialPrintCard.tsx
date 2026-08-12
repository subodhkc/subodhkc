'use client'

import { QRCodeSVG } from 'qrcode.react'

interface CredentialPrintCardProps {
  token: string
  groupLabel: string
  students: string[]
  siteName: string
  orgName: string
  layout?: 'card' | 'label'
}

export function CredentialPrintCard({
  token,
  groupLabel,
  students,
  siteName,
  orgName,
  layout = 'card',
}: CredentialPrintCardProps) {
  if (layout === 'label') {
    return (
      <div className="credential-label print-credential-card">
        <div className="credential-label-content">
          <div className="credential-label-qr">
            <QRCodeSVG
              value={token}
              size={120}
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="credential-label-info">
            <div className="credential-label-org">{orgName}</div>
            <div className="credential-label-site">{siteName}</div>
            <div className="credential-label-group">{groupLabel}</div>
            <div className="credential-label-students">
              {students.slice(0, 3).join(', ')}
              {students.length > 3 && ` +${students.length - 3} more`}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="credential-card print-credential-card">
      <div className="credential-card-header">
        <div className="credential-card-org">{orgName}</div>
        <div className="credential-card-site">{siteName}</div>
      </div>
      <div className="credential-card-body">
        <div className="credential-card-qr">
          <QRCodeSVG
            value={token}
            size={200}
            level="M"
            includeMargin={false}
          />
        </div>
        <div className="credential-card-details">
          <div className="credential-card-group-label">Pickup Group</div>
          <div className="credential-card-group">{groupLabel}</div>
          <div className="credential-card-students-label">
            Authorized Students
          </div>
          <div className="credential-card-students">
            {students.map((s, i) => (
              <div key={i} className="credential-card-student">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="credential-card-footer">
        <div className="credential-card-instructions">
          Present this QR code at the pickup scanner for dismissal
        </div>
        <div className="credential-card-token">
          ID: {token.substring(0, 8)}...{token.substring(-8)}
        </div>
      </div>
    </div>
  )
}
