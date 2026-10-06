'use client'

import * as React from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  text: string
  label?: string
  className?: string
}

export function CopyPromptButton({ text, label = 'Copy prompt', className = '' }: Props) {
  const [copied, setCopied] = React.useState(false)

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted ${className}`}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : label}
    </button>
  )
}
