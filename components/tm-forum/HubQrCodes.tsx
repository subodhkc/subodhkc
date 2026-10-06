'use client'

import { QRCodeSVG } from 'qrcode.react'

export function HubQrCodes() {
  const items = [
    { label: 'This hub', url: 'https://subodhkc.com/tm-forum' },
    { label: 'HAIEC login', url: 'https://www.haiec.com/login' },
  ]
  return (
    <div className="mt-8 flex flex-wrap gap-8">
      {items.map((item) => (
        <div key={item.url} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4">
          <QRCodeSVG value={item.url} size={120} />
          <span className="text-xs font-medium text-neutral-700">{item.label}</span>
          <span className="font-mono text-[10px] text-neutral-500">{item.url}</span>
        </div>
      ))}
    </div>
  )
}
